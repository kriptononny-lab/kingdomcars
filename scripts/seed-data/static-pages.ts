import type { Locale } from '@/lib/constants';

import { lexicalDoc } from './lexical';
import { SLUG_PER_LOCALE, STATIC_PAGE_COPY, type StaticSlug } from './static-pages-copy';

// Re-export so seed.ts can import StaticSlug from this file (unicorn/prefer-export-from satisfied)
export type { StaticSlug } from './static-pages-copy';

export const STATIC_SLUGS: StaticSlug[] = ['about', 'privacy', 'cookies'];

export function staticPageData(slug: StaticSlug, locale: Locale) {
  const copy = STATIC_PAGE_COPY[slug][locale];
  return {
    title: copy.title,
    slug: SLUG_PER_LOCALE[slug][locale],
    _status: 'published',
    layout: [{ blockType: 'richText', content: lexicalDoc(copy.blocks) }],
  };
}
