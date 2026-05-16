import { NextResponse } from 'next/server';

import { submitContactAction } from '@/actions/submit-contact';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/constants';
import { contactSchema } from '@/lib/contact-schema';

export const dynamic = 'force-dynamic';

/**
 * No-JS form fallback (§12). When the browser sends
 * `application/x-www-form-urlencoded`, we coerce it back into the same
 * Zod-shaped object the Server Action consumes, then either 303-redirect
 * (success) or return JSON with the structured error.
 *
 * Locale comes from the form's hidden field — this route is mounted at the
 * locale-less `/api/contact` path (locale-scoped routes live under
 * `(frontend)/[locale]/`). An earlier version read `params.locale` here,
 * which was always undefined; STEP_12_KNOWN_ISSUES #1.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const rawLocale = String(form.get('locale') ?? '');
  const locale: Locale = LOCALES.includes(rawLocale as Locale) ? (rawLocale as Locale) : DEFAULT_LOCALE;

  // Build the object first, then let Zod parse it — same path the action
  // would take server-side, so types stay aligned without `as never`.
  const candidate = {
    name: String(form.get('name') ?? ''),
    phone: String(form.get('phone') ?? ''),
    email: String(form.get('email') ?? ''),
    message: String(form.get('message') ?? ''),
    service: String(form.get('service') ?? '') || undefined,
    people: String(form.get('people') ?? '') || undefined,
    consent: form.get('consent') === 'on' || form.get('consent') === 'true',
    honeypot: String(form.get('honeypot') ?? ''),
    locale,
  };
  const parsed = contactSchema.safeParse(candidate);
  if (!parsed.success) {
    const details: Record<string, string> = {};
    for (const issue of parsed.error.issues) details[issue.path.join('.')] = issue.message;
    return NextResponse.json({ ok: false, error: 'validation', details }, { status: 400 });
  }

  const result = await submitContactAction(parsed.data);
  if (result.ok) {
    const successUrl = new URL(req.url);
    successUrl.searchParams.set('contact', 'sent');
    return NextResponse.redirect(successUrl, 303);
  }
  return NextResponse.json(result, { status: result.error === 'rate-limit' ? 429 : 400 });
}
