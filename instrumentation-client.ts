import * as Sentry from '@sentry/nextjs';

/**
 * Browser-side Sentry init. Loaded automatically by Next 16 from a root-level
 * `instrumentation-client.ts` (replaces the legacy `sentry.client.config.ts`).
 *
 * Session Replay is DISABLED deliberately — replays capture rendered DOM,
 * including form values pre-submit; that's a PII risk we don't accept given
 * the GDPR scope (§14). The traditional error tracking is enough.
 *
 * `NEXT_PUBLIC_SENTRY_DSN` is the browser-safe twin of `SENTRY_DSN`. Both
 * point to the same project; we keep them separate so we can decommission
 * client-side reporting independently if needed.
 */

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const release = process.env.NEXT_PUBLIC_SENTRY_RELEASE;

if (dsn) {
  Sentry.init({
    dsn,
    release,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    sendDefaultPii: false,
    // Disable Session Replay integrations — GDPR + spec §14.
    integrations: [],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      // Browser extensions injecting failing scripts on our pages.
      /chrome-extension/i,
      /moz-extension/i,
    ],
  });
}

/**
 * Hook required by Next 16's router instrumentation. Re-exported from
 * `@sentry/nextjs` per their integration guide.
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
