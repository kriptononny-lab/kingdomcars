import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';

/**
 * next-intl routing for the public site.
 *
 * - `localePrefix: 'as-needed'` keeps `/` as the Polish (default) home.
 *   English lives at `/en`, Russian at `/ru`.
 * - `pathnames` declare localised URL slugs for known static routes (§3).
 *   Dynamic Payload pages use a separate `urlSlug` field (localised), resolved
 *   by `src/app/(frontend)/[locale]/[...slug]/page.tsx` (added in step 6).
 */
export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': {
      pl: '/o-nas',
      en: '/about',
      ru: '/o-nas',
    },
    '/privacy': {
      pl: '/polityka-prywatnosci',
      en: '/privacy',
      ru: '/politika-konfidentsialnosti',
    },
    '/cookies': {
      pl: '/polityka-cookies',
      en: '/cookies',
      ru: '/polityka-cookies',
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
