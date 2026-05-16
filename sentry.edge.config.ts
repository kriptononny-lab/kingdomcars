import * as Sentry from '@sentry/nextjs';

/**
 * Sentry init for the Edge runtime (Next 16's edge functions, our proxy.ts
 * pipeline). Edge has no Node APIs — keep init lean. Same DSN, same release.
 */

const dsn = process.env.SENTRY_DSN;
const release = process.env.SENTRY_RELEASE ?? process.env.NEXT_PUBLIC_SENTRY_RELEASE;

if (dsn) {
  Sentry.init({
    dsn,
    release,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    sendDefaultPii: false,
  });
}
