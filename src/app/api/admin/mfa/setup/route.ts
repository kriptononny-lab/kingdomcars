import { NextResponse } from 'next/server';
import { toDataURL } from 'qrcode';

import { HEADERS } from '@/lib/constants';
import { getRequestId, loggerFromHeaders } from '@/lib/logger';
import { getPayloadInstance } from '@/lib/payload';
import { buildOtpAuthUrl, generateTotpSecret } from '@/lib/totp';

/**
 * POST /api/admin/mfa/setup
 *
 * Generates a fresh TOTP secret for the *currently logged-in* admin user
 * and stores it on the User document. Does NOT yet flip `mfaEnabled` — the
 * client must round-trip through `/api/admin/mfa/verify` to confirm the
 * device first. This guards against locking yourself out via a typo'd
 * scan / wrong clock on the phone.
 *
 * Returns `{ secret, otpauthUrl, qrDataUrl }`. `secret` is for manual entry
 * (the QR may scan poorly on some terminals); `qrDataUrl` is a base64 PNG.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface AuthedUser {
  id: string | number;
  email?: string;
  collection?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  const requestId = getRequestId(req.headers);
  const log = loggerFromHeaders(req.headers);
  const headers = { [HEADERS.REQUEST_ID]: requestId };

  const payload = await getPayloadInstance();
  const { user } = await payload.auth({ headers: req.headers });
  const authed = user as AuthedUser | null;
  if (!authed || authed.collection !== 'users') {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401, headers });
  }

  const secret = generateTotpSecret();
  try {
    await payload.update({
      collection: 'users',
      id: authed.id,
      data: { mfaSecret: secret, mfaEnabled: false },
      overrideAccess: true,
    });
  } catch (error) {
    log.error({ err: error, userId: authed.id }, 'failed to persist mfa secret');
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500, headers });
  }

  const label = authed.email ?? `user-${authed.id}`;
  const otpauthUrl = buildOtpAuthUrl(label, secret);
  const qrDataUrl = await toDataURL(otpauthUrl, { margin: 1, width: 240 });
  return NextResponse.json({ ok: true, secret, otpauthUrl, qrDataUrl }, { headers });
}
