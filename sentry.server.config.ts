import * as Sentry from '@sentry/nextjs';

/**
 * Sentry init for the Node.js server runtime (RSC, route handlers, server
 * actions). Per spec §13/14: never PII, never cookies, never auth headers.
 *
 * Lives at project root so Next picks it up automatically (Sentry's own
 * convention, separate from `instrumentation.ts`). Cannot use `@/*` path
 * aliases — root files are outside the `src/*` mapping.
 */

const dsn = process.env.SENTRY_DSN;
const release = process.env.SENTRY_RELEASE ?? process.env.NEXT_PUBLIC_SENTRY_RELEASE;

if (dsn) {
  Sentry.init({
    dsn,
    release,
    environment: process.env.NODE_ENV,
    // Sample 10% of traces in prod, 100% in dev — prod-tracing budget is
    // controlled by sample rate, not by toggling tracing off entirely.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    sendDefaultPii: false,
    // Avoid noisy framework-internal warnings (HANDOFF §4).
    ignoreErrors: [
      /transformAlgorithm is not a function/i,
      /Aborted fetch/i,
    ],
    beforeSend(event) {
      const headers = event.request?.headers;
      if (headers) {
        delete headers.cookie;
        delete headers.authorization;
        delete headers['x-payload-token'];
      }
      // Strip query strings entirely — they sometimes carry email/phone in
      // contact-form fallbacks.
      if (event.request?.query_string) {
        event.request.query_string = '<redacted>';
      }
      return event;
    },
  });
}
