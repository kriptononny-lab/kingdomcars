import type { CollectionBeforeLoginHook } from 'payload';

import { loggerFromHeaders } from '@/lib/logger';
import { checkLoginRateLimit } from '@/lib/rate-limit';
import { verifyTotp } from '@/lib/totp';

/**
 * Login pipeline guards (§13):
 *   1. IP-based rate-limit (5 / 15min) — defence against credential stuffing.
 *      Layered on top of Payload's account-level `maxLoginAttempts` (5/h).
 *   2. If the user has MFA enabled, require a valid 6-digit TOTP in the
 *      request body field `mfaCode`. Throwing here aborts the login.
 *
 * The Payload admin UI does NOT send `mfaCode` natively — that needs either
 * a custom login form override (out of scope here) or external clients
 * (curl, scripts) passing it explicitly. Until the UI override lands,
 * MFA-enabled accounts are admin-tool-only; that's the intended fail-safe
 * for the bootstrap period.
 */

interface LoginRequestData {
  mfaCode?: unknown;
}

interface MfaUser {
  email?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

function readClientIp(headers: Headers | undefined): string {
  if (!headers) return '0.0.0.0';
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? '0.0.0.0';
  return headers.get('x-real-ip') ?? '0.0.0.0';
}

export const beforeLoginCheck: CollectionBeforeLoginHook = async ({ req, user }) => {
  const log = loggerFromHeaders(req.headers);
  const ip = readClientIp(req.headers);

  const rl = await checkLoginRateLimit(ip);
  if (!rl.success) {
    log.warn({ ip }, 'login rate-limit hit');
    throw new Error('Too many login attempts. Please wait and try again.');
  }

  const subject = user as MfaUser | undefined;
  if (!subject?.mfaEnabled) return user;

  const code = (req.data as LoginRequestData | undefined)?.mfaCode;
  if (typeof code !== 'string' || !subject.mfaSecret || !verifyTotp(subject.mfaSecret, code)) {
    log.warn({ email: subject.email }, 'mfa challenge failed');
    throw new Error('Invalid MFA code.');
  }
  return user;
};
