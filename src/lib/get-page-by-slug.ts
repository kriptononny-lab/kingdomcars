import 'server-only';

import { unstable_cache } from 'next/cache';

import { REVALIDATE, type Locale } from '@/lib/constants';
import { getPayloadInstance } from '@/lib/payload';
import type { PageDoc } from '@/types/page';

/**
 * Narrow a `Pages` document returned from Payload's `find()` into the
 * frontend-facing `PageDoc` shape. We pick the fields we actually consume
 * and trust Payload to deliver matching runtime values — schema is the
 * canonical contract.
 */
function asPageDoc(raw: unknown): PageDoc | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' && typeof r.id !== 'number') return null;
  return {
    id: r.id,
    title: typeof r.title === 'string' ? r.title : null,
    slug: typeof r.slug === 'string' ? r.slug : null,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
    seo: (r.seo as PageDoc['seo']) ?? null,
    layout: Array.isArray(r.layout) ? (r.layout as PageDoc['layout']) : null,
  };
}

/**
 * Fetch one published Page by slug for the given locale. Result is cached
 * with three tags so we can target invalidation precisely:
 *   - `pages`           — global flush (any page changed)
 *   - `pages:{locale}`  — locale-wide flush
 *   - `pages:{slug}`    — single-page flush (used by /api/revalidate webhook)
 *
 * Returns `null` instead of throwing on database errors. Bots and probes
 * occasionally hit the catch-all route with non-locale path segments (e.g.
 * `/.well-known/...`, `/logo.png`) which then get passed to Payload as a
 * locale, and Postgres rejects them with `invalid input value for enum
 * _locales`. Treating those as "page not found" is correct behaviour and
 * silences the dev-log noise; the caller already handles null via
 * `notFound()`.
 */
export async function getPageBySlug(slug: string, locale: Locale): Promise<PageDoc | null> {
  return unstable_cache(
    async (): Promise<PageDoc | null> => {
      try {
        const payload = await getPayloadInstance();
        const result = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug } },
          locale,
          depth: 2,
          limit: 1,
          overrideAccess: true,
        });
        return asPageDoc(result.docs[0]);
      } catch {
        return null;
      }
    },
    ['page', slug, locale],
    {
      tags: [
        REVALIDATE.TAG_PAGES,
        `${REVALIDATE.TAG_PAGES}:${locale}`,
        `${REVALIDATE.TAG_PAGES}:${slug}`,
      ],
      revalidate: REVALIDATE.PAGES_SEC,
    },
  )();
}
