import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function pricingBlock(locale: Locale): Block {
  const sectionTitle = { pl: 'Ceny', en: 'Pricing', ru: 'Цены' }[locale];
  const note = {
    pl: 'Ceny są przybliżone za godzinę',
    en: 'Prices are approximate per hour',
    ru: 'Цены приблизительные за час',
  }[locale];
  const people = {
    pl: ['1 osoba', '2 osoby', '3 osoby', '3+ osób'],
    en: ['1 person', '2 people', '3 people', '3+ people'],
    ru: ['1 человек', '2 человека', '3 человека', '3+ человек'],
  }[locale];
  const unit = { pl: '/h', en: '/hr', ru: '/ч' }[locale];
  const prices = ['150 zł', '200 zł', '250 zł', '300 zł'];
  return {
    blockType: 'pricing',
    sectionTitle,
    note,
    items: people.map((p, i) => ({ people: p, price: prices[i]!, unit })),
  };
}

export function contactFormBlock(locale: Locale): Block {
  const T = {
    pl: {
      title: 'Potrzebujesz pomocy specjalisty? Pomożemy',
      subtitle: 'Skontaktujemy się w ciągu 15 minut.',
    },
    en: {
      title: 'Need a specialist? We will help',
      subtitle: 'We will get back to you within 15 minutes.',
    },
    ru: { title: 'Нужна помощь специалиста? Поможем', subtitle: 'Свяжемся в течение 15 минут.' },
  }[locale];
  return { blockType: 'contactForm', ...T };
}

export function testimonialsBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Opinie naszych klientów',
    en: "Our clients' reviews",
    ru: 'Отзывы наших клиентов',
  }[locale];
  const items = {
    pl: [
      {
        name: 'Agnieszka',
        location: 'Warszawa · 2 tygodnie temu',
        text: 'Bardzo rzetelna i profesjonalna ekipa. Szybka, sprawna i bezpieczna przeprowadzka. Polecam każdemu, kto szuka pewnej firmy.',
        tag: 'Przeprowadzka',
        rating: 5,
      },
      {
        name: 'Paweł K.',
        location: 'Warszawa · miesiąc temu',
        text: 'Wszystko poszło sprawnie i bez stresu. Usługa zrealizowana szybko i w przystępnej cenie. Chłopaki wynieśli wszystko, nie uszkodzili niczego.',
        tag: 'Transport',
        rating: 5,
      },
      {
        name: 'Kasia L.',
        location: 'Warszawa · 3 tygodnie temu',
        text: 'Profesjonalnie, szybko, bezproblemowo. Polecam w 100%. Bardzo dobra obsługa i sprawne wykonanie usługi. Cena adekwatna do jakości.',
        tag: 'Przeprowadzka',
        rating: 5,
      },
    ],
    en: [
      {
        name: 'Agnieszka',
        location: 'Warsaw · 2 weeks ago',
        text: 'Very reliable and professional team. Fast, efficient and safe move. I recommend to anyone looking for a trustworthy company.',
        tag: 'Moving',
        rating: 5,
      },
      {
        name: 'Paweł K.',
        location: 'Warsaw · 1 month ago',
        text: 'Everything went smoothly and without stress. Service done quickly and at an affordable price. The guys moved everything without damaging anything.',
        tag: 'Transport',
        rating: 5,
      },
      {
        name: 'Kasia L.',
        location: 'Warsaw · 3 weeks ago',
        text: 'Professional, fast, problem-free. 100% recommended. Very good service and efficient execution. Price adequate to the quality.',
        tag: 'Moving',
        rating: 5,
      },
    ],
    ru: [
      {
        name: 'Agnieszka',
        location: 'Варшава · 2 недели назад',
        text: 'Очень надёжная и профессиональная команда. Быстрый, чёткий и безопасный переезд. Рекомендую всем, кто ищет надёжную компанию.',
        tag: 'Переезд',
        rating: 5,
      },
      {
        name: 'Paweł K.',
        location: 'Варшава · месяц назад',
        text: 'Всё прошло гладко и без стресса. Услуга выполнена быстро и по доступной цене. Ребята вынесли всё, ничего не повредили.',
        tag: 'Транспорт',
        rating: 5,
      },
      {
        name: 'Kasia L.',
        location: 'Варшава · 3 недели назад',
        text: 'Профессионально, быстро, без проблем. Рекомендую на 100%. Очень хорошее обслуживание и чёткое выполнение. Цена соответствует качеству.',
        tag: 'Переезд',
        rating: 5,
      },
    ],
  }[locale];
  return { blockType: 'testimonials', sectionTitle, items };
}

export function contactInfoBlock(locale: string): Block {
  const sectionTitle =
    {
      pl: 'Skontaktuj się z nami',
      en: 'Contact us',
      ru: 'Свяжитесь с нами',
    }[locale] ?? 'Skontaktuj się z nami';

  return {
    blockType: 'contactInfo',
    sectionTitle,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.8!2d20.99!3d52.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDEzJzQ4LjAiTiAyMcKwMDAnMDAuMCJF!5e0!3m2!1spl!2spl!4v1',
  };
}

export function wizardFormBlock(locale: string): Block {
  const sectionTitle =
    {
      pl: 'Co przewozimy?',
      en: 'What are we transporting?',
      ru: 'Что перевозим?',
    }[locale] ?? 'Co przewozimy?';
  const subtitle = {
    pl: 'Wypełnij w 3 krokach — odpiszemy w 15 minut.',
    en: 'Fill in 3 steps - we will reply within 15 minutes.',
    ru: 'Заполните за 3 шага — ответим в течение 15 минут.',
  }[locale];
  return { blockType: 'wizardForm', sectionTitle, subtitle };
}
