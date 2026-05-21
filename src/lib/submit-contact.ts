'use server';

import { headers } from 'next/headers';

import { contactSchema, type ContactInput } from '@/lib/contact-schema';
import { loggerFromHeaders } from '@/lib/logger';
import { getPayloadInstance } from '@/lib/payload';
import { checkContactRateLimit } from '@/lib/rate-limit';
import { sendTelegramMessage } from '@/lib/telegram';

/**
 * Result returned by `submitContactAction`.
 * On success: `{ ok: true }`.
 * On failure: `{ ok: false, error }` where `error` is one of:
 *   - `'validation'` — Zod schema rejected the input (includes `details` map)
 *   - `'rate-limit'`  — caller exceeded the contact form rate limit
 *   - `'server'`      — unexpected error (DB write or Telegram failure)
 */
export type ContactActionResult =
  | { ok: true }
  | { ok: false; error: 'validation' | 'rate-limit' | 'server'; details?: Record<string, string> };

function clientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  const xff = headerStore.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return headerStore.get('x-real-ip') ?? '0.0.0.0';
}

/**
 * Next.js Server Action — validates, rate-limits, persists and notifies.
 *
 * Pipeline (§12):
 *   1. Zod validation (defence-in-depth — client validates too)
 *   2. Honeypot check — silent OK so bots don't retry
 *   3. IP rate-limit via Upstash Redis
 *   4. Persist to `form-submissions` collection (IP is hashed by beforeChange hook)
 *   5. Fire-and-forget Telegram notification
 *
 * @param input - Raw form data; validated again server-side regardless of client state.
 * @returns `ContactActionResult` — `ok: true` on success or `ok: false` with reason.
 */
export async function submitContactAction(input: ContactInput): Promise<ContactActionResult> {
  const headerStore = await headers();
  const log = loggerFromHeaders(headerStore);

  // 1. Validate (defence in depth — client also runs RHF + Zod).
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const details: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.');
      details[path] = issue.message;
    }
    return { ok: false, error: 'validation', details };
  }
  const data = parsed.data;

  // 2. Bot honeypot — return ok silently so they don't retry.
  if (data.honeypot && data.honeypot.length > 0) {
    log.warn({ ip: 'honeypot' }, 'honeypot triggered');
    return { ok: true };
  }

  // 3. Rate-limit by IP.
  const ip = clientIp(headerStore);
  const rl = await checkContactRateLimit(ip);
  if (!rl.success) return { ok: false, error: 'rate-limit' };

  // 4. Persist to Payload — hashed IP via the collection's beforeChange hook.
  const userAgent = headerStore.get('user-agent') ?? 'unknown';
  try {
    const payload = await getPayloadInstance();
    // `ip` is supplied raw here; the collection's beforeChange hook
    // (hash-ip.ts) hashes it before writing — see hooks chain.
    await payload.create({
      collection: 'form-submissions',
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        message: data.message || undefined,
        service: data.service,
        people: data.people,
        locale: data.locale,
        ip,
        userAgent,
      },
      overrideAccess: true,
    });
  } catch (error) {
    log.error({ err: error }, 'failed to persist submission');
    return { ok: false, error: 'server' };
  }

  // 5. Fire-and-forget Telegram. We already persisted, so don't fail user.
  await sendTelegramMessage({
    name: data.name,
    phone: data.phone,
    email: data.email || undefined,
    message: data.message || undefined,
    service: data.service,
    people: data.people,
    locale: data.locale,
  });
  return { ok: true };
}
