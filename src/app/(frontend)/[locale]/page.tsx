export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PageRenderer } from '@/components/layout/PageRenderer';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/lib/constants';
import { getSiteSettings } from '@/lib/get-globals';
import { getPageBySlug } from '@/lib/get-page-by-slug';
import { buildPageMetadata } from '@/lib/page-metadata';
import { localBusinessJsonLd } from '@/lib/seo';
import type { SiteSettingsData } from '@/types/globals';

interface Props {
  params: Promise<{ locale: Locale }>;
}

const SLUG = 'home';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug(SLUG, locale);
  return page ? buildPageMetadata(page, locale) : {};
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = ((await getSiteSettings(locale)) ?? {}) as SiteSettingsData;
  return (
    <>
      <JsonLd
        id="ld-business"
        data={localBusinessJsonLd({
          phone: settings.phonePrimary,
          phoneSecondary: settings.phoneSecondary,
          email: settings.email,
          address: settings.address
            ? {
                streetAddress: settings.address,
                postalCode: '',
                addressLocality: 'Warszawa',
                addressCountry: 'PL',
              }
            : undefined,
        })}
      />
      <PageRenderer slug={SLUG} locale={locale} />
    </>
  );
}
