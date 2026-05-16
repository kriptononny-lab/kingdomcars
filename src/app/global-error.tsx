'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Global error boundary — Next's last-resort fallback when `app/layout.tsx`
 * itself fails (the per-route `error.tsx` only catches errors *inside* the
 * layout, not errors *in* it). Must render its own `<html>`/`<body>`.
 *
 * No i18n here — by definition, this renders when the layout is broken, and
 * `useTranslations()` would explode again. We accept English-only copy as a
 * trade for reliability.
 *
 * Step 11: errors are forwarded to Sentry via `captureException`. The SDK
 * no-ops cleanly when DSN is unset (dev without env var configured).
 */
interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0a',
          color: '#f4e4b1',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            minHeight: '44px',
            padding: '0.6rem 1.2rem',
            borderRadius: '0.5rem',
            background: '#e6c47a',
            color: '#0a0a0a',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        {error.digest ? (
          <p style={{ opacity: 0.4, fontSize: '0.75rem', marginTop: '2rem' }}>
            Reference: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
