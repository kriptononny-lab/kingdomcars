import { NextResponse } from 'next/server';

import { HEADERS } from '@/lib/constants';
import { getRequestId, loggerFromHeaders } from '@/lib/logger';
import { getPayloadInstance } from '@/lib/payload';

/**
 * Public liveness + readiness endpoint (§16). Hit anonymously by load
 * balancers / Caddy / uptime monitors. NEVER protected.
 *
 * Behaviour:
 *   200 `{ status: 'ok', db: 'up', payload: 'up' }`  — everything healthy
 *   503 `{ status: 'down', db: 'down' | 'up', payload: 'down' | 'up' }`
 *       — at least one subsystem failed; LB will mark unhealthy
 *
 * The proxy matcher skips `/api/*` so we generate / propagate the request-id
 * here (single entry for this route).
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

interface Subsystems {
  payload: 'up' | 'down';
  db: 'up' | 'down';
}

async function probe(log: ReturnType<typeof loggerFromHeaders>): Promise<Subsystems> {
  let payloadOk = false;
  let dbOk = false;
  try {
    const payload = await getPayloadInstance();
    payloadOk = true;
    const drizzle = (payload.db as { drizzle?: { execute?: (q: string) => Promise<unknown> } })
      .drizzle;
    if (drizzle?.execute) {
      await drizzle.execute('SELECT 1');
      dbOk = true;
    } else {
      await payload.count({ collection: 'users' });
      dbOk = true;
    }
  } catch (error) {
    log.warn({ err: error }, 'health probe failed');
  }
  return { payload: payloadOk ? 'up' : 'down', db: dbOk ? 'up' : 'down' };
}

export async function GET(req: Request): Promise<NextResponse> {
  const requestId = getRequestId(req.headers);
  const log = loggerFromHeaders(req.headers);
  const subsystems = await probe(log);
  const healthy = subsystems.payload === 'up' && subsystems.db === 'up';
  return NextResponse.json(
    { status: healthy ? 'ok' : 'down', ...subsystems },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store', [HEADERS.REQUEST_ID]: requestId },
    },
  );
}
