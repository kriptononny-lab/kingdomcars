import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function aboutHeroBlock(locale: Locale): Block {
  const T = {
    pl: {
      eyebrow: 'Nasza historia · Nasze wartości',
      titleLine1: 'Kim jesteśmy',
      titleHighlight: 'i co nas wyróżnia',
      description:
        'KingdomCars to warszawska firma transportowa z ponad 5-letnim doświadczeniem. Powstaliśmy z pasji do logistyki i potrzeby zapewnienia klientom rzetelnej, profesjonalnej usługi — na czas i bez stresu.',
      cta: 'Skontaktuj się',
    },
    en: {
      eyebrow: 'Our story · Our values',
      titleLine1: 'Who we are',
      titleHighlight: 'and what sets us apart',
      description:
        'KingdomCars is a Warsaw-based transport company with over 5 years of experience. We were founded out of a passion for logistics and a commitment to delivering a reliable, professional service — on time and stress-free.',
      cta: 'Contact us',
    },
    ru: {
      eyebrow: 'Наша история · Наши ценности',
      titleLine1: 'Кто мы',
      titleHighlight: 'и что нас отличает',
      description:
        'KingdomCars — варшавская транспортная компания с более чем 5-летним опытом. Мы были основаны из любви к логистике и стремления обеспечить клиентам надёжный, профессиональный сервис — вовремя и без стресса.',
      cta: 'Связаться',
    },
  }[locale];
  return {
    blockType: 'hero',
    eyebrow: T.eyebrow,
    titleLine1: T.titleLine1,
    titleHighlight: T.titleHighlight,
    description: T.description,
    ctaPrimary: { label: T.cta, kind: 'anchor', anchor: 'contact-form' },
  };
}

export function aboutStatsBlock(locale: Locale): Block {
  const items = {
    pl: [
      { title: 'Założona w 2019 roku', subtitle: 'Ponad 5 lat na rynku', icon: 'calendar' },
      { title: '3200+ klientów', subtitle: 'Którzy nam zaufali', icon: 'check' },
      { title: 'Warszawa i cała Polska', subtitle: 'Zasięg naszych usług', icon: 'map' },
    ],
    en: [
      { title: 'Founded in 2019', subtitle: 'Over 5 years in business', icon: 'calendar' },
      { title: '3200+ clients', subtitle: 'Who have trusted us', icon: 'check' },
      { title: 'Warsaw and all Poland', subtitle: 'Our service coverage', icon: 'map' },
    ],
    ru: [
      { title: 'Основана в 2019 году', subtitle: 'Более 5 лет на рынке', icon: 'calendar' },
      { title: '3200+ клиентов', subtitle: 'Которые нам доверяют', icon: 'check' },
      { title: 'Варшава и вся Польша', subtitle: 'Зона наших услуг', icon: 'map' },
    ],
  }[locale];
  return { blockType: 'features', variant: 'compact', items };
}

export function aboutTrustBlock(locale: Locale): Block {
  const items = {
    pl: [
      {
        title: 'Licencja przewoźnika',
        subtitle: 'Licencja na krajowy transport drogowy rzeczy',
        icon: 'check',
      },
      {
        title: 'Ubezpieczenie OC + Cargo',
        subtitle: 'Każdy ładunek jest objęty pełnym ubezpieczeniem',
        icon: 'shield',
      },
      {
        title: '4.9★ Google Reviews',
        subtitle: 'Ponad 127 opinii zadowolonych klientów',
        icon: 'star',
      },
      {
        title: 'Faktura VAT',
        subtitle: 'Dla firm i osób prywatnych, rozliczamy B2B',
        icon: 'file',
      },
    ],
    en: [
      {
        title: 'Carrier licence',
        subtitle: 'Licence for national road freight transport',
        icon: 'check',
      },
      {
        title: 'OC + Cargo insurance',
        subtitle: 'Every cargo is covered by full insurance',
        icon: 'shield',
      },
      {
        title: '4.9★ Google Reviews',
        subtitle: 'Over 127 reviews from satisfied clients',
        icon: 'star',
      },
      {
        title: 'VAT invoice',
        subtitle: 'For companies and individuals, B2B billing',
        icon: 'file',
      },
    ],
    ru: [
      {
        title: 'Лицензия перевозчика',
        subtitle: 'Лицензия на нац. автомобильные грузоперевозки',
        icon: 'check',
      },
      {
        title: 'Страхование OC + Cargo',
        subtitle: 'Каждый груз покрыт полным страхованием',
        icon: 'shield',
      },
      {
        title: '4.9★ Google Reviews',
        subtitle: 'Более 127 отзывов довольных клиентов',
        icon: 'star',
      },
      {
        title: 'Счёт-фактура НДС',
        subtitle: 'Для компаний и частных лиц, расчёты B2B',
        icon: 'file',
      },
    ],
  }[locale];
  return { blockType: 'features', variant: 'trust', items };
}
