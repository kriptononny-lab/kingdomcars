'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { submitContactAction, type ContactActionResult } from '@/actions/submit-contact';
import { type Locale } from '@/lib/constants';
import { contactDefaults, type ContactInput } from '@/lib/contact-schema';

interface Options {
  locale: Locale;
  onSuccess?: () => void;
}

/**
 * Wraps the contact server action call and the result→form-error mapping
 * inside a `useTransition`. Keeps ContactForm.tsx focused on markup; the
 * three failure branches (rate-limit / per-field validation / server) live
 * here next to their localised strings.
 */
export function useContactSubmit(
  form: UseFormReturn<ContactInput>,
  { locale, onSuccess }: Options,
) {
  const t = useTranslations('form');
  const [pending, startTransition] = useTransition();
  const { handleSubmit, reset, setError } = form;

  const submit = handleSubmit((values) => {
    startTransition(async () => {
      const res: ContactActionResult = await submitContactAction(values);
      if (res.ok) {
        reset({ ...contactDefaults, locale });
        onSuccess?.();
        return;
      }
      if (res.error === 'rate-limit') {
        setError('root', { message: t('errors.rateLimit') });
        return;
      }
      if (res.error === 'validation' && res.details) {
        for (const [path, msg] of Object.entries(res.details)) {
          setError(path as keyof ContactInput, { message: msg });
        }
        return;
      }
      setError('root', { message: t('errors.server') });
    });
  });

  return { submit, pending };
}
