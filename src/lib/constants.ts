/**
 * Application-wide constants. No magic numbers/strings in feature code (§4.7).
 */

export const SITE = {
  NAME: 'KingdomCars',
  TAGLINE: {
    pl: 'Niezawodny transport towarowy w Polsce',
    en: 'Reliable freight transport in Poland',
    ru: 'Надёжный грузовой транспорт в Польше',
  },
  DEFAULT_OG_LOCALE: 'pl_PL',
} as const;

export const LOCALES = ['pl', 'en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pl';

/** Tailwind breakpoints mirror — for JS-side media queries (§8). */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Rate-limit policy for the contact form (§12). */
export const CONTACT_RATE_LIMIT = {
  REQUESTS: 3,
  WINDOW_SEC: 600,
} as const;

/** Rate-limit policy for the admin login (§13). */
export const LOGIN_RATE_LIMIT = {
  REQUESTS: 5,
  WINDOW_SEC: 900,
} as const;

export const TELEGRAM = {
  API_BASE: 'https://api.telegram.org',
  TIMEOUT_MS: 5000,
} as const;

export const REVALIDATE = {
  PAGES_SEC: 3600,
  TAG_PAGES: 'pages',
  TAG_HEADER: 'header',
  TAG_FOOTER: 'footer',
  TAG_SETTINGS: 'site-settings',
  TAG_REDIRECTS: 'redirects',
} as const;

/** HTTP header names we set or read across the request lifecycle (§16). */
export const HEADERS = {
  REQUEST_ID: 'x-request-id',
  NONCE: 'x-nonce',
} as const;

export const ANIMATION = {
  DURATION_FAST_MS: 200,
  DURATION_BASE_MS: 400,
  DURATION_SECTION_MS: 700,
  EASING_OUT_QUART: [0.22, 1, 0.36, 1] as const,
} as const;
