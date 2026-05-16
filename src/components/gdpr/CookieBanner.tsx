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
      className="bg-surface-card/95 fixed inset-x-0 bottom-0 z-40 border-t border-white/10 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:gap-6 lg:py-3">
        <div className="flex-1 pr-10 lg:pr-0">
          <h2 className="font-heading text-text-primary text-sm font-semibold tracking-wider uppercase">
            {t('title')}
          </h2>
          <p className="text-text-muted mt-1 text-xs leading-relaxed">{t('body')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => set(REJECT_ALL)}
            className="text-text-muted motion-safe:hover:border-gold/40 motion-safe:hover:text-gold min-h-[40px] rounded-md border border-white/10 px-3 text-xs font-semibold tracking-wider uppercase"
          >
            {t('acceptNecessary')}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="text-text-muted motion-safe:hover:border-gold/40 motion-safe:hover:text-gold min-h-[40px] rounded-md border border-white/10 px-3 text-xs font-semibold tracking-wider uppercase"
          >
            {t('customize')}
          </button>
          <button
            type="button"
            onClick={() => set(ACCEPT_ALL)}
            className="bg-gold motion-safe:hover:bg-gold/90 min-h-[40px] rounded-md px-4 text-xs font-semibold tracking-wider text-black uppercase"
          >
            {t('acceptAll')}
          </button>
        </div>
        <button
          type="button"
          onClick={() => set(REJECT_ALL)}
          aria-label={tCommon('close')}
          className="text-text-muted absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md motion-safe:hover:bg-white/5 lg:hidden"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
