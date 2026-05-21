import type { Locale } from '@/lib/constants';
import type { PageBlock } from '@/types/blocks/page-block';

/**
 * Domain shape of a published Page as it flows from Payload through
 * `getPageBySlug` into rendering and metadata builders.
 *
 * Generated Payload types live in `src/payload-types.ts` (output of
 * `payload generate:types`). That file is regenerated on every collection
 * change and contains the union of every block — too noisy to import
 * across the frontend. This narrower view lists only what consumers
 * actually read; widening is safe and additive.
 */
export interface PageDoc {
  id: string | number;
  title: string | null;
  slug: string | null;
  updatedAt?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    noindex?: boolean | null;
  } | null;
  layout?: PageBlock[] | null;
  /**
   * When known (sitemap path, language-switcher), an explicit map of
   * locale-specific slugs lets metadata builders emit precise hreflang
   * `alternates.languages` entries.
   */
  slugByLocale?: Partial<Record<Locale, string>>;
}
