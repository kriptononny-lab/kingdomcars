import type { Locale } from '@/lib/constants';

import { lexicalDoc } from './lexical';

type StaticSlug = 'about' | 'privacy' | 'cookies';

interface PageCopy {
  title: string;
  blocks: Array<{ kind: 'h2' | 'h3' | 'p'; text: string }>;
}

const COPY: Record<StaticSlug, Record<Locale, PageCopy>> = {
  about: {
    pl: {
      title: 'O nas',
      blocks: [
        { kind: 'h2', text: 'Kim jesteśmy' },
        { kind: 'p', text: 'KingdomCars to firma transportowa działająca w Warszawie i okolicach.' },
      ],
    },
    en: {
      title: 'About',
      blocks: [
        { kind: 'h2', text: 'Who we are' },
        { kind: 'p', text: 'KingdomCars is a transport company operating in Warsaw and the surrounding region.' },
      ],
    },
    ru: {
      title: 'О нас',
      blocks: [
        { kind: 'h2', text: 'Кто мы' },
        { kind: 'p', text: 'KingdomCars — транспортная компания, работающая в Варшаве и окрестностях.' },
      ],
    },
  },
  privacy: {
    pl: {
      title: 'Polityka prywatności',
      blocks: [
        { kind: 'h2', text: 'Polityka prywatności' },
        { kind: 'p', text: 'Niniejszy dokument opisuje sposób przetwarzania danych osobowych.' },
        { kind: 'p', text: 'Pełna treść zostanie uzupełniona przez administratora.' },
      ],
    },
    en: {
      title: 'Privacy policy',
      blocks: [
        { kind: 'h2', text: 'Privacy policy' },
        { kind: 'p', text: 'This document describes how personal data is processed.' },
        { kind: 'p', text: 'The full text will be added by the administrator.' },
      ],
    },
    ru: {
      title: 'Политика конфиденциальности',
      blocks: [
        { kind: 'h2', text: 'Политика конфиденциальности' },
        { kind: 'p', text: 'Этот документ описывает, как обрабатываются персональные данные.' },
        { kind: 'p', text: 'Полный текст будет добавлен администратором.' },
      ],
    },
  },
  cookies: {
    pl: {
      title: 'Polityka cookies',
      blocks: [
        { kind: 'h2', text: 'Pliki cookie' },
        { kind: 'p', text: 'Strona używa plików cookie zgodnie z polityką prywatności.' },
      ],
    },
    en: {
      title: 'Cookie policy',
      blocks: [
        { kind: 'h2', text: 'Cookies' },
        { kind: 'p', text: 'The site uses cookies in accordance with the privacy policy.' },
      ],
    },
    ru: {
      title: 'Политика cookie',
      blocks: [
        { kind: 'h2', text: 'Файлы cookie' },
        { kind: 'p', text: 'Сайт использует cookie в соответствии с политикой конфиденциальности.' },
      ],
    },
  },
};

const SLUG_PER_LOCALE: Record<StaticSlug, Record<Locale, string>> = {
  about: { pl: 'about', en: 'about', ru: 'about' },
  privacy: { pl: 'privacy', en: 'privacy', ru: 'privacy' },
  cookies: { pl: 'cookies', en: 'cookies', ru: 'cookies' },
};

export function staticPageData(slug: StaticSlug, locale: Locale) {
  const copy = COPY[slug][locale];
  return {
    title: copy.title,
    slug: SLUG_PER_LOCALE[slug][locale],
    _status: 'published',
    layout: [{ blockType: 'richText', content: lexicalDoc(copy.blocks) }],
  };
}

export const STATIC_SLUGS: StaticSlug[] = ['about', 'privacy', 'cookies'];
