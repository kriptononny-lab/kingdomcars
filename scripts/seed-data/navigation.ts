import type { Locale } from '@/lib/constants';

import { NAV_TEXTS, type NavTexts } from './navigation-texts';

// anchor → NavTexts key pairs for the header nav (mirrors v1 order)
// services uses a dedicated page URL instead of an anchor
const NAV_ITEMS: Array<{ anchor?: string; url?: string; label: keyof NavTexts }> = [
  { anchor: 'advantages', label: 'advantages' },
  { url: 'uslugi', label: 'services' },
  { url: 'cennik', label: 'pricing' },
  { anchor: 'reviews', label: 'reviews' },
  { anchor: 'contact-form', label: 'contact' },
];

export function headerData(locale: Locale) {
  const t = NAV_TEXTS[locale];
  return {
    navItems: NAV_ITEMS.map(({ anchor, url, label }) => ({
      link: url
        ? {
            label: t[label] as string,
            kind: 'external' as const,
            url: `/${locale}/${url}`,
            newTab: false,
          }
        : { label: t[label] as string, kind: 'anchor' as const, anchor: anchor! },
    })),
    ctaLabel: t.cta,
  };
}

export function footerData(locale: Locale) {
  const t = NAV_TEXTS[locale];
  return {
    tagline: t.footerTagline,
    columns: [
      {
        heading: t.footerHeadings.company,
        links: [
          { link: { label: t.about, kind: 'internal' as const } },
          {
            link: {
              label: t.services,
              kind: 'external' as const,
              url: `/${locale}/uslugi`,
              newTab: false,
            },
          },
          { link: { label: t.contact, kind: 'anchor' as const, anchor: 'contact-form' } },
        ],
      },
      {
        heading: t.footerHeadings.legal,
        links: [
          { link: { label: t.privacy, kind: 'internal' as const } },
          { link: { label: t.cookies, kind: 'internal' as const } },
        ],
      },
    ],
    copyright: t.footerCopyright.replace('{year}', String(new Date().getFullYear())),
    legalLinks: [
      { link: { label: t.privacy, kind: 'internal' as const } },
      { link: { label: t.cookies, kind: 'internal' as const } },
    ],
  };
}
