import type { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';
import { HEADERS } from '@/lib/constants';
import { buildContentSecurityPolicy } from '@/lib/security-headers';

/**
 * Next 16 renames `middleware.ts` в†’ `proxy.ts`. Same runtime, clearer name.
 *
 * Responsibilities (chained):
 *   1. Generate a per-request CSP nonce (cryptographically random, base64).
 *   2. Generate (or pass through) an `x-request-id` for log correlation (В§16).
 *   3. Forward nonce + request-id on the incoming request so downstream
 *      Server Components / actions / route handlers can read them via
 *      `headers()`.
 *   4. Delegate locale routing to `next-intl`.
 *   5. Stamp the response with `Content-Security-Policy` containing the
 *      same nonce + `'strict-dynamic'`, and echo the request-id so the
 *      browser DevTools / Sentry can correlate.
 *
 * Matcher excludes /admin/*, /api/*, /sentry-tunnel/*, /_next/*, fonts,
 * files with extensions. The Sentry tunnel route bypasses i18n entirely.
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

export default function proxy(req: NextRequest): NextResponse {
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
