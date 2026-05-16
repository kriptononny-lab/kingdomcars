import type { Locale } from '@/lib/constants';

interface NavTexts {
  services: string;
  pricing: string;
  reviews: string;
  contact: string;
  about: string;
  privacy: string;
  cookies: string;
  cta: string;
  footerTagline: string;
  footerHeadings: { company: string; legal: string };
  footerCopyright: string;
}

const TEXTS: Record<Locale, NavTexts> = {
  pl: {
    services: 'Usługi',
    pricing: 'Cennik',
    reviews: 'Opinie',
    contact: 'Kontakt',
    about: 'O nas',
    privacy: 'Polityka prywatności',
    cookies: 'Polityka cookies',
    cta: 'Zamów teraz',
    footerTagline: 'Profesjonalny transport towarów w Polsce. 24/7.',
    footerHeadings: { company: 'Firma', legal: 'Dokumenty' },
    footerCopyright: '© {year} KingdomCars',
  },
  en: {
    services: 'Services',
    pricing: 'Pricing',
    reviews: 'Reviews',
    contact: 'Contact',
    about: 'About',
    privacy: 'Privacy policy',
    cookies: 'Cookie policy',
    cta: 'Order now',
    footerTagline: 'Professional freight transport in Poland. 24/7.',
    footerHeadings: { company: 'Company', legal: 'Legal' },
    footerCopyright: '© {year} KingdomCars',
  },
  ru: {
    services: 'Услуги',
    pricing: 'Цены',
    reviews: 'Отзывы',
    contact: 'Контакт',
    about: 'О нас',
    privacy: 'Политика конфиденциальности',
    cookies: 'Политика cookie',
    cta: 'Заказать сейчас',
    footerTagline: 'Профессиональные грузоперевозки в Польше. 24/7.',
    footerHeadings: { company: 'Компания', legal: 'Документы' },
    footerCopyright: '© {year} KingdomCars',
  },
};

const ANCHOR_KEYS = ['services', 'pricing', 'reviews', 'contact-form'] as const;
const ANCHOR_LABELS: Array<keyof NavTexts> = ['services', 'pricing', 'reviews', 'contact'];

export function headerData(locale: Locale) {
  const t = TEXTS[locale];
  return {
    navItems: ANCHOR_KEYS.map((anchor, i) => ({
      link: { label: t[ANCHOR_LABELS[i]!]! as string, kind: 'anchor' as const, anchor },
    })),
    ctaLabel: t.cta,
  };
}

export function footerData(locale: Locale) {
  const t = TEXTS[locale];
  return {
    tagline: t.footerTagline,
    columns: [
      {
        heading: t.footerHeadings.company,
        links: [
          { link: { label: t.about, kind: 'internal' as const } },
          { link: { label: t.services, kind: 'anchor' as const, anchor: 'services' } },
          { link: { label: t.contact, kind: 'anchor' as const, anchor: 'contact-form' } },
        ],
      },
      {
        heading: t.footerHeadings.legal,
        links: [
          { link: { label: t.privacy, kind: 'internal' as const } },
          { link: { label: t.cookies, kind: 'internal' as const } },
        ],
      },
    ],
    copyright: t.footerCopyright.replace('{year}', String(new Date().getFullYear())),
    legalLinks: [
      { link: { label: t.privacy, kind: 'internal' as const } },
      { link: { label: t.cookies, kind: 'internal' as const } },
    ],
  };
}
