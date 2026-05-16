import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, SITE } from '@/lib/constants';

/**
 * PWA Web App Manifest (§7). Lightweight — we're not a real PWA (no service
 * worker, no offline UX), but a manifest unlocks "Add to home screen" on
 * Android/iOS and improves Lighthouse PWA score, which is part of §11.
 *
 * Icons reference the favicon set from Stage 0.
 * Theme/background colours come from the gold-on-black brand palette.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.NAME,
    short_name: SITE.NAME,
    description: SITE.TAGLINE[DEFAULT_LOCALE],
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    lang: DEFAULT_LOCALE,
    icons: [
      { src: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
