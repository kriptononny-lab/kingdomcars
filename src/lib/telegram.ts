import 'server-only';

import { TELEGRAM } from '@/lib/constants';
import { serverEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { escapeHtml } from '@/lib/utils';

/**
 * Data passed to `sendTelegramMessage`. All fields come directly from
 * the validated contact form submission stored in `form-submissions`.
 */
export interface TelegramPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  service?: string;
  people?: string;
  locale: string;
}

function formatMessage(p: TelegramPayload): string {
  const lines = [
    `<b>🚚 New contact-form submission</b>`,
    ``,
    `<b>Name:</b> ${escapeHtml(p.name)}`,
    `<b>Phone:</b> ${escapeHtml(p.phone)}`,
    p.email ? `<b>Email:</b> ${escapeHtml(p.email)}` : null,
    p.service ? `<b>Service:</b> ${escapeHtml(p.service)}` : null,
    p.people ? `<b>People:</b> ${escapeHtml(p.people)}` : null,
    p.message ? `<b>Message:</b> ${escapeHtml(p.message)}` : null,
    ``,
    `<i>Locale: ${escapeHtml(p.locale)}</i>`,
  ].filter((line): line is string => line !== null);
  return lines.join('\n');
}

/**
 * Send a formatted message to the configured Telegram chat. Returns `true` on
 * success, `false` on any failure — caller decides whether to surface to user
 * (we don't, because the submission is already persisted to Payload).
 *
 * `TELEGRAM_API_BASE` env (optional) overrides the default endpoint — used by
 * e2e tests to point at a local mock server (§15).
 */
/**
 * Send a formatted HTML notification to the configured Telegram chat.
 * Runs fire-and-forget after the form submission is already persisted —
 * a Telegram failure must NOT block the user response.
 *
 * @param payload - Contact submission data to include in the message.
 * @returns `true` if the Telegram API accepted the message, `false` otherwise.
 *
 * @example
 * const ok = await sendTelegramMessage({ name: 'Jan', phone: '+48 123 456 789', locale: 'pl' });
 */
export async function sendTelegramMessage(payload: TelegramPayload): Promise<boolean> {
  const apiBase = serverEnv.TELEGRAM_API_BASE ?? TELEGRAM.API_BASE;
  const url = `${apiBase}/bot${serverEnv.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM.TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: serverEnv.TELEGRAM_CHAT_ID,
        text: formatMessage(payload),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      logger.error({ status: res.status }, 'telegram send failed');
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ err: error }, 'telegram send error');
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
