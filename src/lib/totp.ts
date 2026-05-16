import 'server-only';

import { authenticator } from 'otplib';

import { SITE } from '@/lib/constants';

/**
 * TOTP (RFC 6238) helpers for admin 2FA (§13). Wraps `otplib`'s
 * `authenticator` to keep its global mutable state out of feature code.
 *
 * - `window: 1`  → accept the token immediately before/after the current
 *                  30s step. Mitigates clock skew between phone and server.
 * - Secrets stored on the user as base32 strings; never logged, never sent
 *   to the browser after initial setup.
 */

authenticator.options = { window: 1, step: 30 };

const ISSUER = SITE.NAME;

/** Generate a fresh base32 secret to hand to the user during setup. */
export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Build the `otpauth://` URI an authenticator app needs to render its
 * QR code. `label` should uniquely identify the account (email is fine).
 */
export function buildOtpAuthUrl(label: string, secret: string): string {
  return authenticator.keyuri(label, ISSUER, secret);
}

/** Constant-time verify a 6-digit token against the user's stored secret. */
export function verifyTotp(secret: string, token: string): boolean {
  // otplib's check is constant-time internally; guard against malformed
  // inputs first so we don't leak shape via thrown errors.
  if (typeof token !== 'string' || !/^\d{6}$/.test(token)) return false;
  if (typeof secret !== 'string' || secret.length < 16) return false;
  try {
    return authenticator.check(token, secret);
  } catch {
    return false;
  }
}
