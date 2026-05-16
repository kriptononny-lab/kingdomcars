'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Container } from '@/components/layout/Container';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  useEffect(() => {
    // TODO(step-11): report to Sentry via captureException
    console.error('Page error:', error);
  }, [error]);

  return (
    <Container as="section" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-heading text-3xl font-semibold uppercase tracking-wider text-gold">
        {t('serverErrorTitle')}
      </h1>
      <p className="max-w-md text-text-muted">{t('serverErrorDescription')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 inline-flex min-h-[44px] items-center rounded-lg bg-gold px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wider text-black motion-safe:hover:bg-gold-light"
      >
        {tCommon('retry')}
      </button>
    </Container>
  );
}
