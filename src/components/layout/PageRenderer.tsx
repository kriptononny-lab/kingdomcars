import { notFound } from 'next/navigation';

import { BlockList } from '@/components/blocks/BlockRenderer';
import type { Locale } from '@/lib/constants';
import { getPageBySlug } from '@/lib/get-page-by-slug';

interface Props {
  slug: string;
  locale: Locale;
}

/**
 * Single rendering entry-point used by every page.tsx route. Triggers
 * Next's `notFound()` if the document does not exist for this locale.
 */
export async function PageRenderer({ slug, locale }: Props) {
  const page = await getPageBySlug(slug, locale);
  if (!page) notFound();
  return <BlockList blocks={page.layout ?? []} />;
}
