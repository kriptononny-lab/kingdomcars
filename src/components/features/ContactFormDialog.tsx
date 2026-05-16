'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ContactForm } from '@/components/features/ContactForm';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal wrapper around <ContactForm>. Radix Dialog provides focus-trap,
 * scroll-lock and Escape-to-close out of the box, so we don't reuse our own
 * hooks here.
 */
export function ContactFormDialog({ open, onOpenChange }: Props) {
  const t = useTranslations('form');
  const tCommon = useTranslations('common');
  const [sent, setSent] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!next) setSent(false);
    onOpenChange(next);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 motion-safe:animate-[fadeIn_200ms]" />
        <Dialog.Content className="bg-gold fixed top-1/2 left-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <Dialog.Title className="font-heading text-xl font-semibold tracking-wider text-black uppercase">
              {sent ? t('success') : t('step3Title')}
            </Dialog.Title>
            <Dialog.Close
              aria-label={tCommon('close')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-black motion-safe:hover:bg-black/10"
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{t('step3Title')}</Dialog.Description>
          {sent ? (
            <p className="text-sm text-black/80">{t('success')}</p>
          ) : (
            <ContactForm onSuccess={() => setSent(true)} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
