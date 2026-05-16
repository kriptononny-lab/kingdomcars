import { NextResponse } from 'next/server';
import { z } from 'zod';

import { HEADERS } from '@/lib/constants';
import { getRequestId, loggerFromHeaders } from '@/lib/logger';
import { getPayloadInstance } from '@/lib/payload';
import { verifyTotp } from '@/lib/totp';

/**
 * POST /api/admin/mfa/verify  { token: '123456' }
 *
 * Final step of the MFA setup flow. The user enters the 6-digit code their
 * authenticator app is showing; we look up the secret stashed by /setup
 * and verify. On success, `mfaEnabled` flips to `true` and subsequent
 * logins for that user will be challenged.
 *
 * If a previous /setup left a `mfaSecret` but the user never finished,
 * sending a valid code completes the bind. To rotate, run /setup again
 * (overwrites the secret) then /verify.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const bodySchema = z.object({ token: z.string().regex(/^\d{6}$/) });

interface AuthedUser {
  id: string | number;
  collection?: string;
  mfaSecret?: string;
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

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid-body' }, { status: 400, headers });
  }

  const fresh = (await payload.findByID({
    collection: 'users',
    id: authed.id,
    overrideAccess: true,
  })) as AuthedUser;

  if (!fresh.mfaSecret || !verifyTotp(fresh.mfaSecret, parsed.data.token)) {
    log.warn({ userId: authed.id }, 'mfa verify failed');
    return NextResponse.json({ ok: false, error: 'invalid-token' }, { status: 401, headers });
  }

  await payload.update({
    collection: 'users',
    id: authed.id,
    data: { mfaEnabled: true },
    overrideAccess: true,
  });
  return NextResponse.json({ ok: true }, { headers });
}
