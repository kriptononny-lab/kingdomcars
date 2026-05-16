'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCookieConsent } from '@/components/gdpr/CookieConsentProvider';
import { ACCEPT_ALL, REJECT_ALL } from '@/types/consent';

/**
 * Fixed bottom-bar shown until the visitor makes an explicit choice (§14).
 *
 * UX:
 *   - "Accept all"        → consent.{analytics, marketing} = true
 *   - "Necessary only"    → reject everything except strictly-necessary
 *   - "Customize"         → opens per-category settings dialog
 *   - Close (X)           → equivalent to "Necessary only" (GDPR-conservative
 *                            per CJEU C-673/17 Planet49: no choice = no consent)
 *
 * Stays put on scroll; not modal. `safe-area-inset-bottom` for notched phones.
 */
export function CookieBanner() {
  const t = useTranslations('cookies');
  const tCommon = useTranslations('common');
  const { set, openSettings } = useCookieConsent();

  return (
    <div
      role="region"
      aria-label={t('title')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-surface-card/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:gap-6 lg:py-3">
        <div className="flex-1 pr-10 lg:pr-0">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
            {t('title')}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{t('body')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => set(REJECT_ALL)}
            className="min-h-[40px] rounded-md border border-white/10 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted motion-safe:hover:border-gold/40 motion-safe:hover:text-gold"
          >
            {t('acceptNecessary')}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="min-h-[40px] rounded-md border border-white/10 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted motion-safe:hover:border-gold/40 motion-safe:hover:text-gold"
          >
            {t('customize')}
          </button>
          <button
            type="button"
            onClick={() => set(ACCEPT_ALL)}
            className="min-h-[40px] rounded-md bg-gold px-4 text-xs font-semibold uppercase tracking-wider text-black motion-safe:hover:bg-gold/90"
          >
            {t('acceptAll')}
          </button>
        </div>
        <button
          type="button"
          onClick={() => set(REJECT_ALL)}
          aria-label={tCommon('close')}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted motion-safe:hover:bg-white/5 lg:hidden"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
