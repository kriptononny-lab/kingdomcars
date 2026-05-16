'use client';

import { useTranslations } from 'next-intl';

import { useCookieConsent } from '@/components/gdpr/CookieConsentProvider';

/**
 * Button rendered in the Footer that re-opens the cookie settings dialog.
 * Lets visitors revise their consent at any time — required for
 * "renewable" consent under §14.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations('cookies');
  const { openSettings } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className={className ?? 'text-sm text-text-muted motion-safe:hover:text-gold'}
    >
      {t('customize')}
    </button>
  );
}
