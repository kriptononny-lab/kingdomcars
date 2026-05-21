import 'server-only';

import { unstable_cache } from 'next/cache';

import { REVALIDATE, type Locale } from '@/lib/constants';
import { getPayloadInstance } from '@/lib/payload';

type GlobalSlug = 'header' | 'footer' | 'site-settings';

function fetchGlobal(slug: GlobalSlug, tag: string) {
  return (locale: Locale) =>
    unstable_cache(
      async () => {
        const payload = await getPayloadInstance();
        return payload.findGlobal({ slug, locale, depth: 1 });
      },
      [slug, locale],
      { tags: [tag, `${tag}:${locale}`], revalidate: REVALIDATE.PAGES_SEC },
    )();
}

/** Fetch the Header global for a given locale (cached, revalidated by tag). */
export const getHeader = fetchGlobal('header', REVALIDATE.TAG_HEADER);
/** Fetch the Footer global for a given locale (cached, revalidated by tag). */
export const getFooter = fetchGlobal('footer', REVALIDATE.TAG_FOOTER);
/** Fetch the SiteSettings global for a given locale (cached, revalidated by tag). */
export const getSiteSettings = fetchGlobal('site-settings', REVALIDATE.TAG_SETTINGS);
