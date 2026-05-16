'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ConsentCategoryRow } from '@/components/gdpr/ConsentCategoryRow';
import { useCookieConsent } from '@/components/gdpr/CookieConsentProvider';
import { useSyncFromConsentOnOpen } from '@/components/gdpr/useSyncFromConsentOnOpen';
import { ACCEPT_ALL } from '@/types/consent';

/**
 * Per-category consent dialog. Opened either from the banner ("Customize")
 * or from the Footer link (returning visitor renewing consent).
 *
 * Local toggle state is synced from the live consent whenever the dialog
 * opens — see `useSyncFromConsentOnOpen`.
 */
export function CookieSettingsDialog() {
  const t = useTranslations('cookies');
  const tCommon = useTranslations('common');
  const { consent, isSettingsOpen, closeSettings, set } = useCookieConsent();
  const { analytics, setAnalytics, marketing, setMarketing } = useSyncFromConsentOnOpen(
    isSettingsOpen,
    consent,
  );

  return (
    <Dialog.Root open={isSettingsOpen} onOpenChange={(o) => (o ? null : closeSettings())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 motion-safe:animate-[fadeIn_200ms]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-card p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <Dialog.Title className="font-heading text-base font-semibold uppercase tracking-wider text-text-primary">
              {t('title')}
            </Dialog.Title>
            <Dialog.Close
              aria-label={tCommon('close')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted motion-safe:hover:bg-white/5"
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="space-y-4">
            <ConsentCategoryRow
              title={t('categories.necessary')}
              description={t('categories.necessaryDesc')}
              checked
              disabled
            />
            <ConsentCategoryRow
              title={t('categories.analytics')}
              description={t('categories.analyticsDesc')}
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentCategoryRow
              title={t('categories.marketing')}
              description={t('categories.marketingDesc')}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => set({ necessary: true, analytics, marketing })}
              className="min-h-[44px] flex-1 rounded-md border border-white/10 px-4 text-sm font-semibold uppercase tracking-wider text-text-primary motion-safe:hover:border-gold/40 motion-safe:hover:text-gold"
            >
              {t('save')}
            </button>
            <button
              type="button"
              onClick={() => set(ACCEPT_ALL)}
              className="min-h-[44px] flex-1 rounded-md bg-gold px-4 text-sm font-semibold uppercase tracking-wider text-black motion-safe:hover:bg-gold/90"
            >
              {t('acceptAll')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
