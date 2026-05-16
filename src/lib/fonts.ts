import localFont from 'next/font/local';

/**
 * Self-hosted variable brand fonts (GDPR-clean — no Google CDN, §14).
 *
 * Files come from Fontsource via npm (see public/fonts/README.md). Variable
 * fonts contain weights 200–700 in a single file per subset. unicode-range
 * lets the browser fetch only what's needed for the rendered glyphs.
 *
 * Files must exist at `public/fonts/`. Missing files = hard build failure.
 *
 * Preload strategy: only Latin is `preload: true`. The PL home content is
 * Latin + a handful of diacritics already covered by it. LatinExt and
 * Cyrillic are fetched on-demand via unicode-range only when those scripts
 * actually appear on the page. Preloading all six caused Chrome to flag
 * "preloaded but not used" because most pages use exactly one subset.
 */
export const oswald = localFont({
  src: [
    {
      path: '../../public/fonts/Oswald-Latin.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../../public/fonts/Oswald-LatinExt.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../../public/fonts/Oswald-Cyrillic.woff2',
      style: 'normal',
      weight: '200 700',
    },
  ],
  variable: '--font-oswald',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const sourceSans = localFont({
  src: [
    {
      path: '../../public/fonts/SourceSans3-Latin.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../../public/fonts/SourceSans3-LatinExt.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../../public/fonts/SourceSans3-Cyrillic.woff2',
      style: 'normal',
      weight: '200 700',
    },
  ],
  variable: '--font-source-sans',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
});
