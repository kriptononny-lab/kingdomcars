import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

function heroBlock(locale: Locale): Block {
  const T = {
    pl: {
      eyebrow: 'Profesjonalny transport towarów',
      titleLine1: 'NIEZAWODNY',
      titleHighlight: 'TRANSPORT',
      titleLine2: 'W POLSCE',
      description: 'Realizujemy zamówienia 24/7 w Warszawie i innych miastach Polski.',
      ctaPrimary: 'Zamów teraz',
      ctaSecondary: 'Zobacz cennik',
    },
    en: {
      eyebrow: 'Professional freight transport',
      titleLine1: 'RELIABLE',
      titleHighlight: 'TRANSPORT',
      titleLine2: 'IN POLAND',
      description: 'Orders fulfilled 24/7 in Warsaw and across Poland.',
      ctaPrimary: 'Order now',
      ctaSecondary: 'View pricing',
    },
    ru: {
      eyebrow: 'Профессиональные грузоперевозки',
      titleLine1: 'НАДЁЖНЫЙ',
      titleHighlight: 'ТРАНСПОРТ',
      titleLine2: 'В ПОЛЬШЕ',
      description: 'Выполняем заказы 24/7 в Варшаве и по всей Польше.',
      ctaPrimary: 'Заказать сейчас',
      ctaSecondary: 'Посмотреть цены',
    },
  }[locale];
  return {
    blockType: 'hero',
    ...T,
    ctaPrimary: { label: T.ctaPrimary, kind: 'anchor', anchor: 'contact-form' },
    ctaSecondary: { label: T.ctaSecondary, kind: 'anchor', anchor: 'pricing' },
  };
}

function servicesBlock(locale: Locale): Block {
  const titles = { pl: 'Nasze usługi', en: 'Our services', ru: 'Наши услуги' };
  const cards = {
    pl: ['Przeprowadzki', 'Magazyny', 'Wywóz odpadów', 'Biura'],
    en: ['Moves', 'Warehouse', 'Waste removal', 'Offices'],
    ru: ['Переезды', 'Склады', 'Вывоз мусора', 'Офисы'],
  }[locale];
  const cta = { pl: 'Zamów', en: 'Order', ru: 'Заказать' }[locale];
  const keys = ['apartment', 'warehouse', 'trash', 'office'] as const;
  return {
    blockType: 'services',
    sectionTitle: titles[locale],
    items: keys.map((iconKey, i) => ({ title: cards[i]!, cta, iconKey })),
  };
}

function pricingBlock(locale: Locale): Block {
  const titles = { pl: 'Cennik', en: 'Pricing', ru: 'Цены' };
  const people = {
    pl: ['1 osoba', '2 osoby', '3 osoby', '3+ osób'],
    en: ['1 person', '2 people', '3 people', '3+ people'],
    ru: ['1 человек', '2 человека', '3 человека', '3+ человек'],
  }[locale];
  const unit = { pl: '/godz', en: '/hr', ru: '/час' }[locale];
  const prices = ['80 zł', '140 zł', '190 zł', '240 zł'];
  return {
    blockType: 'pricing',
    sectionTitle: titles[locale],
    items: people.map((p, i) => ({ people: p, price: prices[i]!, unit })),
  };
}

function contactFormBlock(locale: Locale): Block {
  const t = {
    pl: { title: 'Zamów transport', subtitle: 'Skontaktujemy się w ciągu 15 minut.' },
    en: { title: 'Order transport', subtitle: 'We will reply within 15 minutes.' },
    ru: { title: 'Заказать транспорт', subtitle: 'Свяжемся в течение 15 минут.' },
  }[locale];
  return { blockType: 'contactForm', ...t };
}

export function homePageData(locale: Locale) {
  const titles = { pl: 'Strona główna', en: 'Home', ru: 'Главная' };
  return {
    title: titles[locale],
    slug: 'home',
    _status: 'published',
    layout: [
      heroBlock(locale),
      servicesBlock(locale),
      pricingBlock(locale),
      contactFormBlock(locale),
    ],
  };
}
