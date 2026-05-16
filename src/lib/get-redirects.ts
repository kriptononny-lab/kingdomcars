import 'server-only';

import { unstable_cache } from 'next/cache';

import { REVALIDATE } from '@/lib/constants';
import { getPayloadInstance } from '@/lib/payload';

export interface Redirect {
  from: string;
  to: string;
  statusCode: 301 | 302 | 308;
}

/**
 * Load every redirect rule from Payload into a Map keyed by `from`. The
 * whole set fits comfortably in memory (an admin who manages 10 000 hand-
 * written redirects has a content-strategy problem, not a perf problem) so
 * one fetch + map is cheaper than per-request DB lookups.
 *
 * Cache is tagged `redirects` and invalidated by `revalidateRedirects` hook
 * on the Redirects collection. `revalidate: 3600` is the long-poll fallback
 * if the hook misses (e.g. direct DB edits).
 */
export const getRedirectsMap = unstable_cache(
  async (): Promise<Map<string, Redirect>> => {
    try {
      const payload = await getPayloadInstance();
      const result = await payload.find({
        collection: 'redirects',
        limit: 1000,
        depth: 0,
      });
      const map = new Map<string, Redirect>();
      for (const doc of result.docs) {
        const from = typeof doc.from === 'string' ? doc.from : null;
        const to = typeof doc.to === 'string' ? doc.to : null;
        const sc = typeof doc.statusCode === 'string' ? Number(doc.statusCode) : 301;
        if (!from || !to) continue;
        if (sc !== 301 && sc !== 302 && sc !== 308) continue;
        map.set(normalisePath(from), { from, to, statusCode: sc });
      }
      return map;
    } catch {
      return new Map();
    }
  },
  ['redirects-map'],
  { tags: [REVALIDATE.TAG_REDIRECTS], revalidate: REVALIDATE.PAGES_SEC },
);

/** Strip trailing slash (except root) so `/old/` matches `/old`. */
function normalisePath(p: string): string {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

/** O(1) lookup for the proxy. Returns `null` when no rule matches. */
export async function findRedirect(pathname: string): Promise<Redirect | null> {
  const map = await getRedirectsMap();
  return map.get(normalisePath(pathname)) ?? null;
}
