import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageRenderer } from '@/components/layout/PageRenderer';
import type { Locale } from '@/lib/constants';
import { getPageBySlug } from '@/lib/get-page-by-slug';
import { buildPageMetadata } from '@/lib/page-metadata';

interface Props {
  params: Promise<{ locale: Locale }>;
}

/** Polish slug for both pl and ru locales; `services` for en. */
const SLUG_BY_LOCALE: Record<Locale, string> = {
  pl: 'uslugi',
  en: 'services',
  ru: 'uslugi',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug(SLUG_BY_LOCALE[locale], locale);
  return page ? buildPageMetadata(page, locale) : {};
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageRenderer slug={SLUG_BY_LOCALE[locale]} locale={locale} />;
}
