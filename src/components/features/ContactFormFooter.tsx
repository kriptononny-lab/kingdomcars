'use client';

import { useTranslations } from 'next-intl';
import type { UseFormRegister } from 'react-hook-form';

import { Link } from '@/i18n/navigation';
import type { ContactInput } from '@/lib/contact-schema';

interface Props {
  register: UseFormRegister<ContactInput>;
  consentError?: string;
  rootError?: string;
  pending: boolean;
}

/**
 * Footer of the contact form: GDPR consent checkbox with rich link to the
 * Privacy Policy, then any consent or root-level error, then the submit
 * button. Split out so ContactForm.tsx stays under the §4.1 line budget.
 *
 * `register` is passed through directly — wrapping it in props for each
 * field would only add noise; the form owns its register and is happy to
 * let the footer attach to specific input names.
 */
export function ContactFormFooter({ register, consentError, rootError, pending }: Props) {
  const t = useTranslations('form');
  return (
    <>
      <label className="flex items-start gap-2 text-xs text-black/80">
        <input type="checkbox" {...register('consent')} className="mt-1" />
        <span>
          {t.rich('consent', {
            policyLink: (chunks) => (
              <Link href="/privacy" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {consentError ? (
        <p role="alert" className="text-xs text-red-900">
          {t('errors.consent')}
        </p>
      ) : null}
      {rootError ? (
        <p role="alert" className="text-sm text-red-900">
          {rootError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="font-heading text-gold mt-1 min-h-[44px] rounded-lg bg-black px-5 py-3 text-sm font-semibold tracking-wider uppercase disabled:opacity-60"
      >
        {pending ? t('submitting') : t('submit')}
      </button>
    </>
  );
}
