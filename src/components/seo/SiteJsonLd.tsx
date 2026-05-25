import { JsonLd } from '@/components/seo/JsonLd';
import { type Locale } from '@/lib/constants';
import { getSiteSettings } from '@/lib/get-globals';
import { type BusinessProfile, organizationJsonLd, webSiteJsonLd } from '@/lib/seo';
import type { SiteSettingsData } from '@/types/globals';

/**
 * Site-wide structured data, rendered once per page from the locale layout.
 * Pulls publicly-safe fields from the `SiteSettings` global (phone, email,
 * address) — those are managed in Payload admin, not env, because they're
 * not secret and editors should be able to change them without a deploy.
 */
function profileFromSettings(s: SiteSettingsData): BusinessProfile {
  const sameAs = [s.facebook, s.instagram, s.googleBusiness].filter(
    (u): u is string => typeof u === 'string' && u.length > 0,
  );
  return {
    phone: s.phonePrimary,
    phoneSecondary: s.phoneSecondary,
    email: s.email,
    address: s.address
      ? {
          streetAddress: s.address,
          postalCode: '',
          addressLocality: 'Warszawa',
          addressCountry: 'PL',
        }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export async function SiteJsonLd({ locale }: { locale: Locale }) {
  const settings = (await getSiteSettings(locale)) ?? {};
  const profile = profileFromSettings(settings as SiteSettingsData);

  return (
    <>
      <JsonLd id="ld-org" data={organizationJsonLd(profile)} />
      <JsonLd id="ld-site" data={webSiteJsonLd(locale)} />
    </>
  );
}
