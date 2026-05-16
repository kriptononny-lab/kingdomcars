import { useTranslations } from 'next-intl';

import { Container } from '@/components/layout/Container';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <Container
      as="section"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
    >
      <h1 className="font-heading text-3xl font-semibold uppercase tracking-wider text-gold">
        {t('notFoundTitle')}
      </h1>
      <p className="max-w-md text-text-muted">{t('notFoundDescription')}</p>
      <Link
        href="/"
        className="mt-2 inline-flex min-h-[44px] items-center rounded-lg bg-gold px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wider text-black motion-safe:hover:bg-gold-light"
      >
        {t('backHome')}
      </Link>
    </Container>
  );
}
