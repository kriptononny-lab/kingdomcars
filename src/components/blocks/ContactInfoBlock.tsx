import { Mail, MapPin, Phone } from 'lucide-react';
import { getLocale } from 'next-intl/server';

import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import type { Locale } from '@/lib/constants';
import { getSiteSettings } from '@/lib/get-globals';
import type { ContactInfoBlock as ContactInfoBlockData } from '@/types/blocks/business';
import type { SiteSettingsData } from '@/types/globals';

interface Props {
  block: ContactInfoBlockData;
}

interface ContactRowProps {
  icon: React.ReactNode;
  value: string;
  href?: string;
}

function ContactRow({ icon, value, href }: ContactRowProps) {
  const cls =
    'text-text-primary motion-safe:hover:text-gold flex items-start gap-3 transition-colors';
  const content = (
    <>
      <span className="text-gold mt-0.5 shrink-0">{icon}</span>
      <span className="text-sm leading-relaxed">{value}</span>
    </>
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  return <div className={cls}>{content}</div>;
}

function buildRows(cfg: SiteSettingsData) {
  const rows: ContactRowProps[] = [];
  if (cfg.phonePrimary) {
    rows.push({
      icon: <Phone size={16} />,
      value: cfg.phonePrimary,
      href: `tel:${cfg.phonePrimary.replaceAll(/\s+/g, '')}`,
    });
  }
  if (cfg.phoneSecondary) {
    rows.push({
      icon: <Phone size={16} />,
      value: cfg.phoneSecondary,
      href: `tel:${cfg.phoneSecondary.replaceAll(/\s+/g, '')}`,
    });
  }
  if (cfg.email) {
    rows.push({ icon: <Mail size={16} />, value: cfg.email, href: `mailto:${cfg.email}` });
  }
  if (cfg.address) {
    rows.push({ icon: <MapPin size={16} />, value: cfg.address });
  }
  return rows;
}

/**
 * Contact info section (§1 of feature list). Pulls phone/email/address
 * from SiteSettings so editors update contact data in one place only.
 * Map embed is optional — set `mapEmbedUrl` in Payload admin.
 */
export async function ContactInfoBlockView({ block }: Props) {
  const locale = (await getLocale()) as Locale;
  const settings = ((await getSiteSettings(locale)) ?? {}) as SiteSettingsData;
  const rows = buildRows(settings);

  return (
    <section id="contact" className="bg-surface-section py-28">
      <Container>
        <SectionHeader title={block.sectionTitle} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {rows.map((row, i) => (
              <ContactRow key={i} {...row} />
            ))}
            {settings.hours ? (
              <p className="text-text-muted border-gold/20 mt-2 border-t pt-4 text-sm">
                {settings.hours}
              </p>
            ) : null}
          </div>
          {block.mapEmbedUrl ? (
            <div className="overflow-hidden rounded-lg border border-white/5">
              <iframe
                src={block.mapEmbedUrl}
                title="Location map"
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
