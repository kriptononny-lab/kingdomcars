'use client';

import { useTranslations } from 'next-intl';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { ContactFormFooter } from '@/components/features/ContactFormFooter';
import type { ContactInput } from '@/lib/contact-schema';

const FIELD_CLASS =
  'w-full min-h-[44px] rounded-lg border border-white/10 bg-surface-card px-4 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:border-gold focus:outline-none';

interface Props {
  register: UseFormRegister<ContactInput>;
  errors: FieldErrors<ContactInput>;
  pending: boolean;
}

export function WizardStep3({ register, errors, pending }: Props) {
  const t = useTranslations('form');
  return (
    <div className="flex flex-col gap-3">
      <input
        className={FIELD_CLASS}
        placeholder={t('namePlaceholder')}
        autoComplete="name"
        {...register('name')}
      />
      {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}

      <input
        className={FIELD_CLASS}
        placeholder={t('phonePlaceholder')}
        autoComplete="tel"
        inputMode="tel"
        {...register('phone')}
      />
      {errors.phone ? <p className="text-xs text-red-400">{errors.phone.message}</p> : null}

      <input
        type="email"
        className={FIELD_CLASS}
        placeholder={t('emailPlaceholder')}
        autoComplete="email"
        {...register('email')}
      />

      <textarea
        rows={3}
        className={`${FIELD_CLASS} min-h-[80px] py-2`}
        placeholder={t('messagePlaceholder')}
        {...register('message')}
      />

      <ContactFormFooter
        register={register}
        consentError={errors.consent?.message}
        rootError={errors.root?.message}
        pending={pending}
      />
    </div>
  );
}
