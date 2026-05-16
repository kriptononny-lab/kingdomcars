import * as Sentry from '@sentry/nextjs';

/**
 * Next 16 instrumentation entry. Loaded once per process by Next, before
 * any application code. We dispatch to the runtime-specific Sentry init
 * (Node or Edge), and re-export `captureRequestError` so framework errors
 * for RSC / route handlers flow into Sentry automatically.
 *
 * `register` is async because dynamic `import()` for the runtime-specific
 * file is the documented way to load it conditionally (the Sentry team
 * specifically warns against top-level imports — they'd pull Node APIs into
 * the Edge bundle).
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
