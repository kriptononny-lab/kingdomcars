import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function heroBlock(locale: Locale): Block {
  const T = {
    pl: {
      eyebrow: 'Szybko · Bezpiecznie · Na czas · Tanio',
      titleLine1: 'Niezawodny',
      titleLine2: 'transport towarowy',
      titleHighlight: 'w Polsce',
      description:
        'Zamów transport swojego ładunku — zajmiemy się wszystkim! Profesjonalna obsługa, terminowość i bezpieczeństwo Twojego towaru.',
      ctaPrimary: 'Zostaw prośbę',
      ctaSecondary: 'Nasze usługi',
    },
    en: {
      eyebrow: 'Fast · Safe · On time · Affordable',
      titleLine1: 'Reliable',
      titleLine2: 'freight transport',
      titleHighlight: 'in Poland',
      description:
        'Order transport for your cargo — we will handle everything! Professional service, punctuality and safety for your goods.',
      ctaPrimary: 'Leave a request',
      ctaSecondary: 'Our services',
    },
    ru: {
      eyebrow: 'Быстро · Безопасно · Вовремя · Доступно',
      titleLine1: 'Надёжный',
      titleLine2: 'грузовой транспорт',
      titleHighlight: 'в Польше',
      description:
        'Закажите перевозку груза — мы возьмём всё на себя! Профессиональный сервис, точность и безопасность Вашего груза.',
      ctaPrimary: 'Оставить заявку',
      ctaSecondary: 'Наши услуги',
    },
  }[locale];

  return {
    blockType: 'hero',
    eyebrow: T.eyebrow,
    titleLine1: T.titleLine1,
    titleLine2: T.titleLine2,
    titleHighlight: T.titleHighlight,
    description: T.description,
    ctaPrimary: { label: T.ctaPrimary, kind: 'anchor', anchor: 'contact-form' },
    ctaSecondary: { label: T.ctaSecondary, kind: 'anchor', anchor: 'services' },
  };
}

export function heroStatsBlock(locale: Locale): Block {
  const items = {
    pl: [
      { title: 'Ponad 5 lat doświadczenia', subtitle: 'Na rynku od 2019 roku', icon: 'calendar' },
      { title: 'Pracujemy 24/7', subtitle: 'Zawsze do Twojej dyspozycji', icon: 'clock' },
      { title: 'W całej Polsce', subtitle: 'Transport na terenie kraju', icon: 'map' },
    ],
    en: [
      { title: 'Over 5 years of experience', subtitle: 'In business since 2019', icon: 'calendar' },
      { title: 'We work 24/7', subtitle: 'Always at your disposal', icon: 'clock' },
      { title: 'All over Poland', subtitle: 'Nationwide transport', icon: 'map' },
    ],
    ru: [
      { title: 'Более 5 лет опыта', subtitle: 'На рынке с 2019 года', icon: 'calendar' },
      { title: 'Работаем 24/7', subtitle: 'Всегда к вашим услугам', icon: 'clock' },
      { title: 'По всей Польше', subtitle: 'Перевозки по всей стране', icon: 'map' },
    ],
  }[locale];

  return { blockType: 'features', variant: 'compact', items };
}
