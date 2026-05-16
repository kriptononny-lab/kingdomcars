'use client';

import Script from 'next/script';

import { useCookieConsent } from '@/components/gdpr/CookieConsentProvider';

/**
 * Analytics gate per §14: Umami self-hosted is only injected after the
 * visitor explicitly opts into the `analytics` category. No tracker fires
 * before consent, satisfying GDPR/ePrivacy "no cookies before consent".
 *
 * `NEXT_PUBLIC_ANALYTICS_URL` / `NEXT_PUBLIC_ANALYTICS_ID` are env-gated
 * (defined optional in `src/lib/env.ts`). If absent → nothing loads; a
 * dev-only warning surfaces the misconfiguration without polluting prod
 * logs (real prod ought to have them set via deployment env).
 */
export function Analytics() {
  const { consent } = useCookieConsent();
  const url = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  if (!consent?.analytics) return null;

  if (!url || !id) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[analytics] consent granted but NEXT_PUBLIC_ANALYTICS_URL / NEXT_PUBLIC_ANALYTICS_ID are not set',
      );
    }
    return null;
  }

  return (
    <Script src={url} data-website-id={id} data-do-not-track="true" strategy="lazyOnload" async />
  );
}
