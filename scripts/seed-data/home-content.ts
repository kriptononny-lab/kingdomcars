import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function advantagesBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Atuty naszej współpracy',
    en: 'Benefits of working with us',
    ru: 'Преимущества сотрудничества',
  }[locale];
  const quote = {
    pl: 'Wybierając naszą firmę, zyskują Państwo wiarygodnego partnera, który zapewnia kompleksowe i wysokiej jakości usługi transportu towarów. Cenimy Państwa czas i bezpieczeństwo, dlatego oferujemy wyłącznie sprawdzone rozwiązania i indywidualne podejście do każdego klienta.',
    en: 'By choosing our company, you gain a trustworthy partner providing comprehensive, high-quality freight transport services. We value your time and safety, offering only proven solutions and an individual approach to every client.',
    ru: 'Выбирая нашу компанию, вы получаете надёжного партнёра, обеспечивающего комплексные и высококачественные услуги грузоперевозок. Мы ценим ваше время и безопасность, предлагая только проверенные решения и индивидуальный подход к каждому клиенту.',
  }[locale];
  const items = {
    pl: [
      {
        title: '3200+ zadowolonych klientów',
        subtitle:
          'Ponad 3200 klientów, którzy nam zaufali i korzystają z naszych usług regularnie.',
      },
      {
        title: '5 lat na rynku',
        subtitle: 'Od 5 lat z powodzeniem działamy na rynku usług transportowych w Polsce.',
      },
      {
        title: 'Kontrola transportu ładunków',
        subtitle: 'Pełna kontrola nad każdym etapem transportu — od odbioru do dostarczenia.',
      },
      {
        title: 'Ekspresowa dostawa',
        subtitle: 'Zapewniamy ekspresową dostawę szybciej niż firmy posiadające własne magazyny.',
      },
      {
        title: 'Elastyczne rozwiązania',
        subtitle:
          'Nasza firma oferuje elastyczne rozwiązania logistyczne dopasowane do potrzeb klienta.',
      },
      {
        title: 'Elastyczne formy płatności',
        subtitle: 'Oferujemy usługi w ramach umowy i elastyczne formy płatności.',
      },
    ],
    en: [
      {
        title: '3200+ satisfied clients',
        subtitle: 'Over 3200 clients who trusted us and use our services regularly.',
      },
      {
        title: '5 years in business',
        subtitle:
          'For 5 years we have been successfully operating in the transport services market in Poland.',
      },
      {
        title: 'Cargo transport control',
        subtitle: 'Full control over every stage of transport — from pickup to delivery.',
      },
      {
        title: 'Express delivery',
        subtitle: 'We provide express delivery faster than companies with their own warehouses.',
      },
      {
        title: 'Flexible solutions',
        subtitle: 'Our company offers flexible logistics solutions tailored to client needs.',
      },
      {
        title: 'Flexible payment options',
        subtitle: 'We offer services under contract and flexible payment forms.',
      },
    ],
    ru: [
      {
        title: '3200+ довольных клиентов',
        subtitle:
          'Более 3200 клиентов, которые нам доверяют и регулярно пользуются нашими услугами.',
      },
      {
        title: '5 лет на рынке',
        subtitle: 'Уже 5 лет мы успешно работаем на рынке транспортных услуг в Польше.',
      },
      {
        title: 'Контроль грузоперевозок',
        subtitle: 'Полный контроль каждого этапа перевозки — от забора до доставки.',
      },
      {
        title: 'Экспресс-доставка',
        subtitle: 'Обеспечиваем экспресс-доставку быстрее компаний, имеющих собственные склады.',
      },
      {
        title: 'Гибкие решения',
        subtitle: 'Наша компания предлагает гибкие логистические решения под нужды клиента.',
      },
      {
        title: 'Гибкие формы оплаты',
        subtitle: 'Работаем по договору и предлагаем гибкие формы оплаты.',
      },
    ],
  }[locale];
  return { blockType: 'features', variant: 'numbered', sectionTitle, items, quote };
}

export function servicesBlock(locale: Locale): Block {
  const sectionTitle = { pl: 'Świadczone przez nas usługi', en: 'Our services', ru: 'Наши услуги' }[
    locale
  ];
  const cards = {
    pl: ['Transport mieszkań', 'Transport magazynów', 'Wywóz śmieci', 'Transport biur'],
    en: ['Apartment moves', 'Warehouse transport', 'Waste removal', 'Office moves'],
    ru: ['Перевозка квартир', 'Перевозка складов', 'Вывоз мусора', 'Перевозка офисов'],
  }[locale];
  const cta = { pl: 'Wybierz', en: 'Select', ru: 'Выбрать' }[locale];
  const keys = ['apartment', 'warehouse', 'trash', 'office'] as const;
  return {
    blockType: 'services',
    sectionTitle,
    items: keys.map((iconKey, i) => ({ title: cards[i]!, cta, iconKey })),
  };
}

export function mapBlock(locale: Locale): Block {
  const T = {
    pl: {
      sectionLabel: 'Pokrycie',
      titleLine1: 'Działamy w',
      titleHighlight: 'całej Polsce',
      description:
        'Dostarczamy ładunki do każdego miasta i regionu. Posiadamy zaufanych partnerów logistycznych, dzięki czemu transport przebiega szybko, terminowo i bezpiecznie.',
    },
    en: {
      sectionLabel: 'Coverage',
      titleLine1: 'We operate',
      titleHighlight: 'all over Poland',
      description:
        'We deliver cargo to every city and region. We have trusted logistics partners, ensuring transport is fast, on time and safe.',
    },
    ru: {
      sectionLabel: 'Покрытие',
      titleLine1: 'Работаем по',
      titleHighlight: 'всей Польше',
      description:
        'Доставляем грузы в любой город и регион. У нас есть надёжные логистические партнёры, поэтому перевозка проходит быстро, вовремя и безопасно.',
    },
  }[locale];
  const cityNames = {
    pl: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Katowice', 'Lublin'],
    en: ['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Katowice', 'Lublin'],
    ru: ['Варшава', 'Краков', 'Гданьск', 'Вроцлав', 'Познань', 'Лодзь', 'Катовице', 'Люблин'],
  }[locale];
  return { blockType: 'map', ...T, cities: cityNames.map((name) => ({ name })) };
}
