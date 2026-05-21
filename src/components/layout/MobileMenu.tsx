'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { NavLink } from '@/components/layout/NavLink';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/lib/utils';
import type { HeaderData } from '@/types/globals';

interface Props {
  navItems: NonNullable<HeaderData['navItems']>;
  ctaLabel?: string;
}

export function MobileMenu({ navItems, ctaLabel }: Props) {
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useLockBodyScroll(open);
  useFocusTrap(drawerRef, { active: open, onClose: close });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('openMenu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="text-gold inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden"
      >
        <Menu aria-hidden="true" />
      </button>

      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={tCommon('menu')}
        className={cn(
          'bg-surface-section fixed top-0 right-0 z-50 flex h-[100dvh] w-[min(360px,80vw)] flex-col gap-6 p-6 shadow-2xl transition-transform lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t('closeMenu')}
          className="text-text-muted motion-safe:hover:text-gold ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md"
        >
          <X aria-hidden="true" />
        </button>
        <nav aria-label={tCommon('menu')} className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id ?? item.link.label}
              link={item.link}
              onClick={close}
              className="font-heading text-text-primary px-2 py-2 text-sm font-semibold tracking-wider uppercase"
            />
          ))}
        </nav>
        {ctaLabel ? (
          <button
            type="button"
            data-cta-open="true"
            onClick={close}
            className="bg-gold font-heading mt-auto min-h-[44px] rounded-lg px-5 py-3 text-sm font-semibold tracking-wider text-black uppercase"
          >
            {ctaLabel}
          </button>
        ) : null}
        <div className="border-t border-white/5 pt-4">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
