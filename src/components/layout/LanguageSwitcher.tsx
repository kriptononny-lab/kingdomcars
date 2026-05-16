'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, type Locale } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Switches the active locale while keeping the current pathname (next-intl's
 * navigation API rewrites the path for the chosen locale's pathnames map).
 *
 * - `aria-current="true"` on the active locale (§10).
 * - `useTransition` keeps the UI responsive during the route change.
 */
export function LanguageSwitcher() {
  const t = useTranslations('languages');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function change(target: Locale) {
    if (target === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  }

  return (
    <div role="group" aria-label={tHeader('language')} className="flex items-center gap-1">
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            disabled={isPending}
            aria-current={active ? 'true' : undefined}
            aria-label={tHeader('currentLanguage', { language: t(l) })}
            className={cn(
              'min-h-[36px] rounded-md px-2 py-1 font-heading text-xs font-semibold uppercase tracking-wider transition-colors',
              active
                ? 'bg-gold text-black'
                : 'text-text-muted motion-safe:hover:bg-gold/10 motion-safe:hover:text-gold',
              isPending && 'opacity-50',
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
