import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';
import { HEADERS } from '@/lib/constants';
import { findRedirect } from '@/lib/get-redirects';
import { buildContentSecurityPolicy } from '@/lib/security-headers';

/**
 * Next 16 renames `middleware.ts` → `proxy.ts` and pins the runtime to
 * Node.js (Edge is no longer supported here per the v16 upgrade docs).
 * That's what lets us reach Payload directly via `findRedirect()`.
 *
 * Responsibilities (chained):
 *   1. Editor-managed redirects (§6 `Redirects` collection). Looked up via
 *      a tagged `unstable_cache`; the `Redirects.afterChange` hook flips
 *      the tag so changes take effect immediately.
 *   2. Per-request CSP nonce (cryptographically random, base64) (§13).
 *   3. `x-request-id` for log correlation (§16) — generated, or trusted
 *      from an upstream proxy after a strict allow-list check.
 *   4. Locale routing — delegated to `next-intl`.
 *   5. CSP + request-id stamped on the response.
 *
 * Matcher excludes /admin, /api, /sentry-tunnel, /_next, fonts, anything
 * with an extension. The Sentry tunnel bypasses i18n entirely.
 */

const handleI18n = createMiddleware(routing);

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64');
}

function resolveRequestId(req: NextRequest): string {
  const incoming = req.headers.get(HEADERS.REQUEST_ID);
  if (incoming && incoming.length <= 128 && /^[\w.:-]+$/.test(incoming)) return incoming;
  return crypto.randomUUID();
}

async function tryRedirect(req: NextRequest): Promise<NextResponse | null> {
  const rule = await findRedirect(req.nextUrl.pathname);
  if (!rule) return null;
  const target = rule.to.startsWith('http') ? rule.to : new URL(rule.to, req.url).toString();
  return NextResponse.redirect(target, rule.statusCode);
}

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  const redirect = await tryRedirect(req);
  if (redirect) return redirect;

  const nonce = generateNonce();
  const requestId = resolveRequestId(req);
  req.headers.set(HEADERS.NONCE, nonce);
  req.headers.set(HEADERS.REQUEST_ID, requestId);

  const response = handleI18n(req);
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));
  response.headers.set(HEADERS.REQUEST_ID, requestId);
  return response;
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw -- Next 16 webpack parser requires a plain string literal for config.matcher, not a tagged template (TaggedTemplateExpression unsupported).
  matcher: ['/((?!admin|api|sentry-tunnel|_next|_vercel|favicon|fonts|\\.well-known|.*\\..*).*)'],
};
