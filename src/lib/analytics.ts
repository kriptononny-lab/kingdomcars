/**
 * Analytics utilities (§14, §16).
 *
 * This project uses Umami self-hosted (or Plausible) — both are
 * GDPR-compliant, privacy-first, and cookieless by default. No consent
 * banner is legally required for cookieless analytics, but we still gate
 * tracking behind the user's `analytics` consent category as best practice.
 *
 * The Umami script is injected by `<Analytics />` in `components/gdpr/`
 * only after consent is granted. This module provides the helper for
 * programmatic event tracking (e.g. form submission, CTA click).
 *
 * @see https://umami.is/docs/tracker-functions
 */

/** Shape of the Umami tracker injected by the script tag. */
interface UmamiTracker {
  track: (eventName: string, data?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

/**
 * Track a custom event via Umami.
 *
 * Safe to call without consent check — silently no-ops if the tracker
 * script hasn't been injected yet (i.e. consent was denied or not yet given).
 *
 * @param eventName - Umami event name (snake_case recommended).
 * @param data      - Optional key/value payload attached to the event.
 *
 * @example
 * trackEvent('contact_form_submit', { locale: 'pl' });
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.umami?.track(eventName, data);
}
