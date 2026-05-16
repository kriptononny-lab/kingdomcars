import type { MetadataRoute } from 'next';

import { LOCALES, type Locale } from '@/lib/constants';
import { clientEnv } from '@/lib/env';
import { getAllPagesForSitemap, type SitemapPage } from '@/lib/get-pages-for-sitemap';

/**
 * Dynamic sitemap.xml per §7. Emits one entry per Page × Locale (so the
 * default-locale URL doesn't compete with /en, /ru variants), and attaches
 * `alternates.languages` so search engines understand they're translations.
 *
 * `priority`: 1.0 for the home, 0.7 for top-level pages, 0.5 for deeper.
 * `lastModified`: comes from Payload (`updatedAt`).
 * `changeFrequency`: `monthly` is conservative — Google ignores this field
 * anyway, but it helps other crawlers (Bing, Yandex).
 *
 * Forced dynamic: pages may be created/edited at any time; rebuilding the
 * sitemap on each request is cheap (one Payload `find` per locale).
 */

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function buildPath(slug: string, locale: Locale): string {
  const tail = slug === 'home' ? '' : `/${slug}`;
  return locale === 'pl' ? tail || '/' : `/${locale}${tail}`;
}

function priorityFor(slug: string): number {
  if (slug === 'home') return 1;
  if (slug.includes('/')) return 0.5;
  return 0.7;
}

function entryFor(page: SitemapPage, base: string): MetadataRoute.Sitemap[number] | null {
  const plSlug = page.slugByLocale.pl ?? page.slugByLocale.en ?? page.slugByLocale.ru;
  if (!plSlug) return null;
  const languages = Object.fromEntries(
    LOCALES.flatMap((loc) => {
      const slug = page.slugByLocale[loc];
      return slug ? [[loc, `${base}${buildPath(slug, loc)}`]] : [];
    }),
  );
  return {
    url: `${base}${buildPath(plSlug, 'pl')}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly',
    priority: priorityFor(plSlug),
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const pages = await getAllPagesForSitemap();
  return pages
    .map((p) => entryFor(p, base))
    .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);
}
