'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ContactFormField } from '@/components/features/ContactFormField';
import { ContactFormFooter } from '@/components/features/ContactFormFooter';
import { useContactSubmit } from '@/hooks/useContactSubmit';
import { type Locale } from '@/lib/constants';
import { contactDefaults, contactSchema, type ContactInput } from '@/lib/contact-schema';
import { cn } from '@/lib/utils';

interface Props {
  onSuccess?: () => void;
}

const FIELD_CLASS =
  'w-full min-h-[44px] rounded-lg border border-white/10 bg-surface-card px-4 py-2 text-sm text-text-primary placeholder:text-text-subtle focus:border-gold focus:outline-none';

type FieldName = 'name' | 'phone' | 'email' | 'message';
interface FieldDef {
  name: FieldName;
  type?: 'email';
  autoComplete: string;
  inputMode?: 'tel';
  multiline?: boolean;
}

const FIELDS: FieldDef[] = [
  { name: 'name', autoComplete: 'name' },
  { name: 'phone', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'message', autoComplete: 'off', multiline: true },
];

export function ContactForm({ onSuccess }: Props) {
  const t = useTranslations('form');
  const locale = useLocale() as Locale;
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...contactDefaults, locale },
  });
  const { register, formState } = form;
  const { submit, pending } = useContactSubmit(form, { locale, onSuccess });

  const errorMsg = (path: keyof ContactInput) =>
    (formState.errors as Record<string, { message?: string } | undefined>)[path]?.message;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3" aria-busy={pending}>
      <input type="hidden" {...register('locale')} />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register('honeypot')}
      />
      {FIELDS.map((f) => (
        <ContactFormField key={f.name} label={t(f.name)} error={errorMsg(f.name)}>
          {f.multiline ? (
            <textarea
              rows={3}
              className={cn(FIELD_CLASS, 'min-h-[80px] py-2')}
              placeholder={t(`${f.name}Placeholder` as const)}
              {...register(f.name)}
            />
          ) : (
            <input
              type={f.type}
              className={FIELD_CLASS}
              placeholder={t(`${f.name}Placeholder` as const)}
              autoComplete={f.autoComplete}
              inputMode={f.inputMode}
              {...register(f.name)}
            />
          )}
        </ContactFormField>
      ))}
      <ContactFormFooter
        register={register}
        consentError={errorMsg('consent')}
        rootError={formState.errors.root?.message}
        pending={pending}
      />
    </form>
  );
}
