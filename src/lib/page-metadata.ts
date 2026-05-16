import 'server-only';

import type { Metadata } from 'next';

import { type Locale, LOCALES, SITE } from '@/lib/constants';
import { clientEnv } from '@/lib/env';
import type { PageDoc } from '@/types/page';

/**
 * Build the URL path for a (slug, locale) pair, honouring next-intl's
 * `localePrefix: 'as-needed'`. PL is the default → no `/pl` prefix.
 */
function buildLocalisedPath(slug: string, locale: Locale): string {
  const path = slug === 'home' ? '' : `/${slug}`;
  return locale === 'pl' ? path || '/' : `/${locale}${path}`;
}

/**
 * Construct hreflang `alternates.languages` map (§7). When the caller knows
 * the locale-specific slugs (different per-locale URLs), pass `slugByLocale`;
 * otherwise we assume the same slug applies and Google de-dupes by canonical.
 */
function hreflangAlternates(
  slug: string,
  slugByLocale: PageDoc['slugByLocale'],
): Record<string, string> {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const entries = LOCALES.map((loc) => {
    const localeSlug = slugByLocale?.[loc] ?? slug;
    return [loc, `${base}${buildLocalisedPath(localeSlug, loc)}`] as const;
  });
  return {
    ...Object.fromEntries(entries),
    'x-default': `${base}${buildLocalisedPath(slugByLocale?.pl ?? slug, 'pl')}`,
  };
}

export function buildPageMetadata(page: PageDoc, locale: Locale): Metadata {
  const fallbackTitle = page.title ?? SITE.NAME;
  const title = page.seo?.title ?? fallbackTitle;
  const description = page.seo?.description ?? SITE.TAGLINE[locale];
  const slug = page.slug ?? 'home';
  const base = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const canonical = `${base}${buildLocalisedPath(slug, locale)}`;

  return {
    title,
    description,
    robots: page.seo?.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: hreflangAlternates(slug, page.slugByLocale),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.NAME,
      locale: locale === 'pl' ? 'pl_PL' : locale === 'en' ? 'en_GB' : 'ru_RU',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
