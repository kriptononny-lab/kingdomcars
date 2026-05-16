import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { HEADERS, REVALIDATE } from '@/lib/constants';
import { serverEnv } from '@/lib/env';
import { getRequestId, loggerFromHeaders } from '@/lib/logger';

/**
 * On-demand revalidation webhook (§17). Payload hooks already invalidate
 * via `revalidateTag()` directly for in-process changes; this endpoint is
 * the escape hatch for *external* triggers — e.g. a content team running a
 * "publish" workflow from another service, or a cron job after data import.
 *
 * Auth: `Authorization: Bearer ${REVALIDATE_SECRET}`.
 * Body: `{ "tag": "pages" | "header" | "footer" | "site-settings" }`.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TAGS = [
  REVALIDATE.TAG_PAGES,
  REVALIDATE.TAG_HEADER,
  REVALIDATE.TAG_FOOTER,
  REVALIDATE.TAG_SETTINGS,
] as const;

type AllowedTag = (typeof ALLOWED_TAGS)[number];

function isAllowedTag(value: unknown): value is AllowedTag {
  return typeof value === 'string' && (ALLOWED_TAGS as readonly string[]).includes(value);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = getRequestId(req.headers);
  const log = loggerFromHeaders(req.headers);
  const headers = { [HEADERS.REQUEST_ID]: requestId };

  const expected = `Bearer ${serverEnv.REVALIDATE_SECRET}`;
  if (req.headers.get('authorization') !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401, headers });
  }

  const body = (await req.json().catch(() => null)) as { tag?: unknown } | null;
  if (!isAllowedTag(body?.tag)) {
    return NextResponse.json({ ok: false, error: 'invalid-tag' }, { status: 400, headers });
  }

  revalidateTag(body.tag, 'max');
  log.info({ tag: body.tag }, 'cache invalidated via webhook');
  return NextResponse.json({ ok: true, tag: body.tag }, { headers });
}
