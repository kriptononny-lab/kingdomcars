import { getLocale } from 'next-intl/server';

import { CookieSettingsLink } from '@/components/gdpr/CookieSettingsLink';
import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/layout/Logo';
import { NavLink } from '@/components/layout/NavLink';
import type { Locale } from '@/lib/constants';
import { getFooter, getSiteSettings } from '@/lib/get-globals';
import type { FooterData, SiteSettingsData } from '@/types/globals';

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const [footer, settings] = await Promise.all([getFooter(locale), getSiteSettings(locale)]);
  const data = (footer ?? {}) as FooterData;
  const cfg = (settings ?? {}) as SiteSettingsData;

  return (
    <footer className="border-t border-white/5 bg-surface-section py-12">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo size={56} />
            {data.tagline ? (
              <p className="mt-4 max-w-sm text-sm text-text-muted">{data.tagline}</p>
            ) : null}
            {cfg.phonePrimary ? (
              <a
                href={`tel:${cfg.phonePrimary.replaceAll(/\s+/g, '')}`}
                className="mt-4 inline-block font-heading text-base text-gold"
              >
                {cfg.phonePrimary}
              </a>
            ) : null}
            {cfg.address ? <p className="mt-1 text-sm text-text-muted">{cfg.address}</p> : null}
            {cfg.hours ? <p className="text-sm text-text-muted">{cfg.hours}</p> : null}
          </div>
          {(data.columns ?? []).map((column) => (
            <div key={column.id ?? column.heading ?? ''}>
              {column.heading ? (
                <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
                  {column.heading}
                </h4>
              ) : null}
              <ul className="space-y-2">
                {(column.links ?? []).map((entry) => (
                  <li key={entry.id ?? entry.link.label}>
                    <NavLink
                      link={entry.link}
                      className="text-sm text-text-muted motion-safe:hover:text-gold"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
          <p className="text-xs text-text-muted">
            {data.copyright ?? `© ${new Date().getFullYear()} ${cfg.organisationName ?? 'KingdomCars'}`}
          </p>
          <ul className="flex flex-wrap gap-4">
            {(data.legalLinks ?? []).map((entry) => (
              <li key={entry.id ?? entry.link.label}>
                <NavLink
                  link={entry.link}
                  className="text-xs text-text-muted motion-safe:hover:text-gold"
                />
              </li>
            ))}
            <li>
              <CookieSettingsLink className="text-xs text-text-muted motion-safe:hover:text-gold" />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
