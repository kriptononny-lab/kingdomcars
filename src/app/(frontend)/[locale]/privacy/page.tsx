export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageRenderer } from '@/components/layout/PageRenderer';
import type { Locale } from '@/lib/constants';
import { getPageBySlug } from '@/lib/get-page-by-slug';
import { buildPageMetadata } from '@/lib/page-metadata';

interface Props {
  params: Promise<{ locale: Locale }>;
}

const SLUG = 'privacy';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug(SLUG, locale);
  return page ? buildPageMetadata(page, locale) : {};
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageRenderer slug={SLUG} locale={locale} />;
}
