import type { Locale } from '@/lib/constants';

export interface NavTexts {
  advantages: string;
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

export const NAV_TEXTS: Record<Locale, NavTexts> = {
  pl: {
    advantages: 'Korzyści',
    services: 'Usługi',
    pricing: 'Cennik',
    reviews: 'Opinie',
    contact: 'Kontakt',
    about: 'O nas',
    privacy: 'Polityka prywatności',
    cookies: 'Polityka cookies',
    cta: 'Zostaw prośbę',
    footerTagline: 'Profesjonalny transport towarów w Polsce. 24/7.',
    footerHeadings: { company: 'Firma', legal: 'Dokumenty' },
    footerCopyright: '© {year} KingdomCars',
  },
  en: {
    advantages: 'Benefits',
    services: 'Services',
    pricing: 'Pricing',
    reviews: 'Reviews',
    contact: 'Contact',
    about: 'About',
    privacy: 'Privacy policy',
    cookies: 'Cookie policy',
    cta: 'Leave a request',
    footerTagline: 'Professional freight transport in Poland. 24/7.',
    footerHeadings: { company: 'Company', legal: 'Legal' },
    footerCopyright: '© {year} KingdomCars',
  },
  ru: {
    advantages: 'Преимущества',
    services: 'Услуги',
    pricing: 'Цены',
    reviews: 'Отзывы',
    contact: 'Контакт',
    about: 'О нас',
    privacy: 'Политика конфиденциальности',
    cookies: 'Политика cookie',
    cta: 'Оставить заявку',
    footerTagline: 'Профессиональные грузоперевозки в Польше. 24/7.',
    footerHeadings: { company: 'Компания', legal: 'Документы' },
    footerCopyright: '© {year} KingdomCars',
  },
};
