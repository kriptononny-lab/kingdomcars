/**
 * Shared consent cookie configuration. Imported by both the client
 * provider (reads `document.cookie`) and the server action (writes via
 * `cookies().set()`), so this module must NOT have `'server-only'`.
 *
 * `__Host-` prefix per §13 (security): requires Secure, no Domain attr,
 * Path=/. Cannot be used on plain HTTP localhost — browsers reject it.
 * In dev we fall back to the unprefixed name so the flow works locally.
 */

export const CONSENT_COOKIE_PROD = '__Host-consent';
export const CONSENT_COOKIE_DEV = 'consent';

export const CONSENT_COOKIE =
  process.env.NODE_ENV === 'production' ? CONSENT_COOKIE_PROD : CONSENT_COOKIE_DEV;

/**
 * Pre-compiled regex matching the consent cookie inside `document.cookie`.
 * Two static literals (rather than `new RegExp(\`…${CONSENT_COOKIE}…\`)`):
 *   1. Avoids re-allocating the regex on every hydration read.
 *   2. `eslint-plugin-security/detect-non-literal-regexp` can't statically
 *      prove a templated cookie name is safe — the rule passes only with
 *      hard-coded literals here.
 *
 * Capture group 1 is the URL-encoded JSON consent payload.
 */
export const CONSENT_COOKIE_REGEX =
  process.env.NODE_ENV === 'production'
    ? /(?:^|;\s*)__Host-consent=([^;]+)/
    : /(?:^|;\s*)consent=([^;]+)/;

/** 12 months in seconds — matches §14 "renewable" requirement. */
export const CONSENT_TTL_SEC = 60 * 60 * 24 * 365;
