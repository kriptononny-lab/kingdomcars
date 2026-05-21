import 'server-only';

import { LOCALES, type Locale } from '@/lib/constants';
import { getPayloadInstance } from '@/lib/payload';

/** Minimal page data needed to build a sitemap entry. */
export interface SitemapPage {
  id: string | number;
  updatedAt: string;
  slugByLocale: Partial<Record<Locale, string>>;
}

/**
 * Fetch every Page across every locale, keyed by document id, with the
 * locale-specific slug map needed for sitemap hreflang `alternates`.
 * One round-trip per locale (3 total) → cheap given <100 pages expected.
 */
export async function getAllPagesForSitemap(): Promise<SitemapPage[]> {
  const payload = await getPayloadInstance();
  const byId = new Map<string | number, SitemapPage>();

  for (const locale of LOCALES) {
    const result = await payload.find({
      collection: 'pages',
      locale,
      depth: 0,
      limit: 1000,
      pagination: false,
    });
    for (const doc of result.docs) {
      const d = doc as { id: string | number; slug?: unknown; updatedAt?: unknown };
      const slug = typeof d.slug === 'string' ? d.slug : undefined;
      if (!slug) continue;
      const entry = byId.get(d.id) ?? {
        id: d.id,
        updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
        slugByLocale: {},
      };
      entry.slugByLocale[locale] = slug;
      byId.set(d.id, entry);
    }
  }

  return [...byId.values()];
}
