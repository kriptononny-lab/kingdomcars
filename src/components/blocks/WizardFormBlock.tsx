'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { WizardStep1 } from '@/components/blocks/wizard-parts/WizardStep1';
import { WizardStep2 } from '@/components/blocks/wizard-parts/WizardStep2';
import { WizardStep3 } from '@/components/blocks/wizard-parts/WizardStep3';
import { Container } from '@/components/layout/Container';
import { useContactSubmit } from '@/hooks/useContactSubmit';
import { type Locale } from '@/lib/constants';
import { contactDefaults, contactSchema, type ContactInput } from '@/lib/contact-schema';
import type { WizardFormBlock as WizardFormBlockData } from '@/types/blocks/cta';

type ServiceKey = 'apartment' | 'warehouse' | 'trash' | 'office';
type PeopleKey = '1' | '2' | '3' | '3+';

interface Props {
  block: WizardFormBlockData;
}

const TOTAL_STEPS = 3;

export function WizardFormBlockView({ block }: Props) {
  const t = useTranslations('form');
  const tw = useTranslations('wizard');
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...contactDefaults, locale },
  });
  const { submit, pending } = useContactSubmit(form, {
    locale,
    onSuccess: () => setDone(true),
  });

  const stepTitles = [t('step1Title'), t('step2Title'), t('step3Title')];

  const handleService = (key: ServiceKey) => {
    form.setValue('service', key);
    setStep(2);
  };
  const handlePeople = (key: PeopleKey) => {
    form.setValue('people', key);
    setStep(3);
  };

  return (
    <section id="wizard" className="bg-surface-section py-28">
      <Container className="max-w-2xl">
        <p className="text-gold mb-1 text-center text-xs font-semibold tracking-widest uppercase">
          {t('stepIndicator', { current: step, total: TOTAL_STEPS })}
        </p>
        <h2 className="font-heading mb-8 text-center text-[clamp(1.4rem,2.5vw,2rem)] font-semibold tracking-wide uppercase">
          {done ? tw('doneTitle') : block.sectionTitle || stepTitles[step - 1]}
        </h2>

        {done ? (
          <p className="text-text-secondary text-center">{t('success')}</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <input type="hidden" {...form.register('locale')} />
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
              {...form.register('honeypot')}
            />

            {step === 1 && (
              <WizardStep1
                selected={(form.watch('service') as ServiceKey) ?? null}
                onSelect={handleService}
              />
            )}
            {step === 2 && (
              <WizardStep2
                selected={(form.watch('people') as PeopleKey) ?? null}
                onSelect={handlePeople}
              />
            )}
            {step === 3 && (
              <WizardStep3
                register={form.register}
                errors={form.formState.errors}
                pending={pending}
              />
            )}

            {step > 1 && !done && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-text-muted mt-4 text-sm underline"
              >
                {tw('back')}
              </button>
            )}
          </form>
        )}
      </Container>
    </section>
  );
}
