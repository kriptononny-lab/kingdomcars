import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PageRenderer } from '@/components/layout/PageRenderer';
import { LOCALES, type Locale } from '@/lib/constants';
import { getPageBySlug } from '@/lib/get-page-by-slug';
import { getAllPageSlugs } from '@/lib/get-page-slugs';
import { buildPageMetadata } from '@/lib/page-metadata';

interface Props {
  params: Promise<{ locale: Locale; slug: string[] }>;
}

/** Slugs handled by their own explicit routes — must NOT be SSG'd here. */
const RESERVED = new Set([
  'home',
  'about',
  'privacy',
  'cookies',
  'uslugi',
  'services',
  'cennik',
  'pricing',
]);

/**
 * Build SSG params for every published Page in every locale, minus the
 * reserved slugs (those have their own routes — double-rendering them here
 * would create conflicts).
 */
export async function generateStaticParams() {
  const all = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await getAllPageSlugs(locale);
      return slugs.filter((s) => !RESERVED.has(s)).map((slug) => ({ locale, slug: [slug] }));
    }),
  );
  return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const joined = slug.join('/');
  const page = await getPageBySlug(joined, locale);
  return page ? buildPageMetadata(page, locale) : {};
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const joined = slug.join('/');
  // Defensive: somebody crafted a URL matching a reserved slug — bail out.
  if (RESERVED.has(joined)) notFound();
  return <PageRenderer slug={joined} locale={locale} />;
}
