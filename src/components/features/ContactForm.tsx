'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { submitContactAction, type ContactActionResult } from '@/actions/submit-contact';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/lib/constants';
import { contactDefaults, contactSchema, type ContactInput } from '@/lib/contact-schema';
import { cn } from '@/lib/utils';

interface Props {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: Props) {
  const t = useTranslations('form');
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...contactDefaults, locale },
  });
  const { register, handleSubmit, formState, reset, setError } = form;
  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res: ContactActionResult = await submitContactAction(values);
      if (res.ok) {
        reset({ ...contactDefaults, locale });
        onSuccess?.();
      } else if (res.error === 'rate-limit') {
        setError('root', { message: t('errors.rateLimit') });
      } else if (res.error === 'validation' && res.details) {
        for (const [path, msg] of Object.entries(res.details)) {
          setError(path as keyof ContactInput, { message: msg });
        }
      } else {
        setError('root', { message: t('errors.server') });
      }
    });
  });

  const fieldClass =
    'w-full min-h-[44px] rounded-lg border border-white/10 bg-surface-card px-4 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:border-gold focus:outline-none';
  const errorMsg = (path: keyof ContactInput) =>
    (formState.errors as Record<string, { message?: string } | undefined>)[path]?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3" aria-busy={pending}>
      <input type="hidden" {...register('locale')} />
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register('honeypot')} />
      <Field label={t('name')} error={errorMsg('name')}>
        <input className={fieldClass} placeholder={t('namePlaceholder')} autoComplete="name" {...register('name')} />
      </Field>
      <Field label={t('phone')} error={errorMsg('phone')}>
        <input className={fieldClass} placeholder={t('phonePlaceholder')} autoComplete="tel" inputMode="tel" {...register('phone')} />
      </Field>
      <Field label={t('email')} error={errorMsg('email')}>
        <input type="email" className={fieldClass} placeholder={t('emailPlaceholder')} autoComplete="email" {...register('email')} />
      </Field>
      <Field label={t('message')} error={errorMsg('message')}>
        <textarea rows={3} className={cn(fieldClass, 'min-h-[80px] py-2')} placeholder={t('messagePlaceholder')} {...register('message')} />
      </Field>
      <label className="flex items-start gap-2 text-xs text-black/80">
        <input type="checkbox" {...register('consent')} className="mt-1" />
        <span>
          {t.rich('consent', {
            policyLink: (chunks) => <Link href="/privacy" className="underline">{chunks}</Link>,
          })}
        </span>
      </label>
      {errorMsg('consent') ? <p role="alert" className="text-xs text-red-900">{t('errors.consent')}</p> : null}
      {formState.errors.root?.message ? (
        <p role="alert" className="text-sm text-red-900">{formState.errors.root.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 min-h-[44px] rounded-lg bg-black px-5 py-3 font-heading text-sm font-semibold uppercase tracking-wider text-gold disabled:opacity-60"
      >
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-heading font-semibold uppercase tracking-wider text-black/70">{label}</span>
      {children}
      {error ? <span role="alert" className="text-red-700">{error}</span> : null}
    </label>
  );
}
