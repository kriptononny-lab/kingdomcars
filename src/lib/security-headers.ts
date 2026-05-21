/**
 * Security headers per §13 of the architecture spec.
 *
 * Split into two parts:
 *   • `staticSecurityHeaders` — non-CSP headers that don't depend on the
 *     request. Wired into `next.config.ts` via the `headers()` hook.
 *   • `buildContentSecurityPolicy(nonce)` — CSP with a per-request nonce.
 *     Used from `src/proxy.ts`, which generates the nonce, sets CSP on the
 *     response, and forwards the nonce via the `x-nonce` request header so
 *     Server Components can apply it to inline `<Script>` tags.
 *
 * Why nonce + `'strict-dynamic'` instead of static `'unsafe-inline'`:
 * `'strict-dynamic'` makes browsers trust scripts loaded by an explicitly
 * nonced parent. Next.js' own framework scripts pick up the nonce
 * automatically when middleware/proxy sets one, so we no longer need
 * `'unsafe-inline'` to whitelist them (§13).
 *
 * NOTE: this module deliberately does NOT import from `@/lib/env`. It is
 * imported by `next.config.ts` whose mini-transpiler doesn't resolve `@/*`
 * the way the runtime bundler does — going through `env.ts` would break
 * config loading. `process.env.NODE_ENV` is set by Next.js itself before
 * the config loads, so it's safe to read directly here.
 *
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */

type Directive = readonly string[];

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const BASE_DIRECTIVES: Readonly<Record<string, Directive>> = {
  'default-src': ["'self'"],
  // Tailwind 4 + next/font inject runtime <style> tags. Noncing them would
  // require deep build-time changes. The CSP-XSS surface on style-src is
  // small (no JS exec) and `frame-ancestors 'none'` blocks clickjacking.
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  // Google Maps embeds (ContactInfoBlock). Only the Maps embed subdomain is
  // whitelisted — not all of google.com — to keep the allowlist tight.
  'frame-src': ["'self'", 'https://www.google.com'],
  'upgrade-insecure-requests': [],
};

function scriptSrc(nonce: string): Directive {
  const base = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  // Dev needs eval() for React Refresh + source-map loading.
  return IS_PRODUCTION ? base : [...base, "'unsafe-eval'"];
}

/**
 * Build a per-request Content-Security-Policy header value with a nonce.
 *
 * @param nonce - Cryptographically random base64 string generated per request.
 * @returns Full CSP header value string.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  const directives = { ...BASE_DIRECTIVES, 'script-src': scriptSrc(nonce) };
  return Object.entries(directives)
    .map(([key, values]) => (values.length > 0 ? `${key} ${values.join(' ')}` : key))
    .join('; ');
}

/** Non-CSP security headers applied globally via `next.config.ts` `headers()` hook. */
export const staticSecurityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
] as const;
