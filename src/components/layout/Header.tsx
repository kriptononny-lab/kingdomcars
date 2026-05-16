import { Phone } from 'lucide-react';
import { getLocale } from 'next-intl/server';

import { Container } from '@/components/layout/Container';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Logo } from '@/components/layout/Logo';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { NavLink } from '@/components/layout/NavLink';
import type { Locale } from '@/lib/constants';
import { getHeader, getSiteSettings } from '@/lib/get-globals';
import type { HeaderData, SiteSettingsData } from '@/types/globals';

/**
 * Sticky transparent header with backdrop-blur. RSC — fetches both globals
 * once on the server. MobileMenu (client) receives the same nav items as a
 * plain prop, so client JS does not refetch.
 */
export async function Header() {
  const locale = (await getLocale()) as Locale;
  const [header, settings] = await Promise.all([getHeader(locale), getSiteSettings(locale)]);
  const data = (header ?? {}) as HeaderData;
  const cfg = (settings ?? {}) as SiteSettingsData;
  const navItems = data.navItems ?? [];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-surface/85 backdrop-blur-md">
      <Container className="flex h-[76px] items-center justify-between gap-6">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-8 lg:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.id ?? item.link.label}
              link={item.link}
              className="font-heading text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-text-primary motion-safe:hover:text-gold"
            />
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {cfg.phonePrimary ? (
            <a
              href={`tel:${cfg.phonePrimary.replaceAll(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-md border border-gold/30 px-3 py-2 font-heading text-sm font-semibold text-gold motion-safe:hover:bg-gold/10"
              aria-label={`Call ${cfg.phonePrimary}`}
            >
              <Phone size={14} aria-hidden="true" />
              {cfg.phonePrimary}
            </a>
          ) : null}
          <LanguageSwitcher />
          {data.ctaLabel ? (
            <button
              type="button"
              data-cta-open="true"
              className="min-h-[44px] rounded-lg bg-gold px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wider text-black motion-safe:hover:bg-gold-light"
            >
              {data.ctaLabel}
            </button>
          ) : null}
        </div>
        <MobileMenu navItems={navItems} ctaLabel={data.ctaLabel} />
      </Container>
    </header>
  );
}
