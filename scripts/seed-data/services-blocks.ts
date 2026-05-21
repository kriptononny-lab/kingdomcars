import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function servicesHeroBlock(locale: Locale): Block {
  const T = {
    pl: {
      eyebrow: 'Transport · Przeprowadzki · Warszawa',
      titleLine1: 'Profesjonalne usługi',
      titleHighlight: 'transportowe w Warszawie',
      description:
        'Przeprowadzki mieszkań, biur i magazynów. Wywóz śmieci i odpadów. Działamy 24/7 na terenie całej Polski — szybko, bezpiecznie i z pełnym ubezpieczeniem.',
      cta: 'Zamów teraz',
    },
    en: {
      eyebrow: 'Transport · Moving · Warsaw',
      titleLine1: 'Professional transport',
      titleHighlight: 'services in Warsaw',
      description:
        'Apartment, office and warehouse moves. Waste removal. We operate 24/7 across Poland — fast, safe and fully insured.',
      cta: 'Order now',
    },
    ru: {
      eyebrow: 'Транспорт · Переезды · Варшава',
      titleLine1: 'Профессиональные транспортные',
      titleHighlight: 'услуги в Варшаве',
      description:
        'Переезды квартир, офисов и складов. Вывоз мусора и отходов. Работаем 24/7 по всей Польше — быстро, безопасно и с полным страхованием.',
      cta: 'Заказать сейчас',
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

export function servicesDetailBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Szczegóły naszych usług',
    en: 'Our services in detail',
    ru: 'Подробнее о наших услугах',
  }[locale];
  const quote = {
    pl: 'Każde zlecenie wyceniamy indywidualnie. Zadzwoń lub wypełnij formularz — oddzwonimy w 15 minut z dokładną wyceną.',
    en: 'Every job is quoted individually. Call or fill in the form — we will call back within 15 minutes with an exact price.',
    ru: 'Каждый заказ оценивается индивидуально. Позвоните или заполните форму — перезвоним в течение 15 минут с точной ценой.',
  }[locale];
  const items = {
    pl: [
      {
        title: 'Transport mieszkań — przeprowadzka bez stresu',
        subtitle:
          'Zajmujemy się całym procesem: pakowanie, demontaż mebli, transport i montaż w nowym miejscu. Obsługujemy kawalerki, duże mieszkania i całe domy w Warszawie i okolicach.',
      },
      {
        title: 'Transport biur — minimalny przestój w pracy',
        subtitle:
          'Przeprowadzamy biura w weekendy lub po godzinach pracy, by nie zakłócać codziennej działalności firmy. Transportujemy sprzęt IT, dokumenty i meble biurowe.',
      },
      {
        title: 'Transport magazynów — duże gabaryty i palety',
        subtitle:
          'Obsługujemy przeprowadzki magazynów, hurtowni i sklepów. Dysponujemy sprzętem do transportu ciężkich i niestandardowych ładunków.',
      },
      {
        title: 'Wywóz śmieci — szybki odbiór w ciągu 24h',
        subtitle:
          'Wywozimy gruz, stare meble, odpady po remoncie i inne niepotrzebne rzeczy. Legalny transport na certyfikowane składowisko, zaświadczenie o wywozie w cenie.',
      },
      {
        title: 'Transport gabarytów — fortepiany, sejfy, sprzęt',
        subtitle:
          'Specjalizujemy się w transporcie niestandardowych przedmiotów: pianin, fortepianów, sejfów, sprzętu medycznego i artystycznego. Pełne ubezpieczenie Cargo.',
      },
      {
        title: 'Ekspresowy transport — dostawa na dziś',
        subtitle:
          'Potrzebujesz szybkiego transportu? Realizujemy zlecenia ekspresowe nawet tego samego dnia. Zadzwoń — sprawdzimy dostępność i przyjdziemy kiedy potrzebujesz.',
      },
    ],
    en: [
      {
        title: 'Apartment moves — stress-free relocation',
        subtitle:
          'We handle the entire process: packing, furniture disassembly, transport and reassembly at the new location. We serve studios, large apartments and whole houses in Warsaw and surroundings.',
      },
      {
        title: 'Office moves — minimal business downtime',
        subtitle:
          'We move offices on weekends or after hours to avoid disrupting daily operations. We transport IT equipment, documents and office furniture.',
      },
      {
        title: 'Warehouse moves — heavy loads and pallets',
        subtitle:
          'We handle warehouse, wholesale and retail shop moves. We have equipment for heavy and non-standard cargo transport.',
      },
      {
        title: 'Waste removal — pickup within 24 hours',
        subtitle:
          'We remove rubble, old furniture, post-renovation waste and other unwanted items. Legal transport to a certified facility, disposal certificate included.',
      },
      {
        title: 'Oversized transport — pianos, safes, equipment',
        subtitle:
          'We specialise in non-standard items: upright and grand pianos, safes, medical and artistic equipment. Full Cargo insurance.',
      },
      {
        title: 'Express transport — same-day delivery',
        subtitle:
          'Need urgent transport? We fulfil express orders even on the same day. Call us — we will check availability and come when you need us.',
      },
    ],
    ru: [
      {
        title: 'Перевозка квартир — переезд без стресса',
        subtitle:
          'Занимаемся всем процессом: упаковка, разборка мебели, транспортировка и сборка на новом месте. Обслуживаем студии, большие квартиры и дома в Варшаве и окрестностях.',
      },
      {
        title: 'Перевозка офисов — минимальный простой',
        subtitle:
          'Перевозим офисы в выходные или после рабочего времени, чтобы не нарушать работу компании. Транспортируем IT-оборудование, документы и офисную мебель.',
      },
      {
        title: 'Перевозка складов — тяжёлые грузы и паллеты',
        subtitle:
          'Выполняем переезды складов, оптовых баз и магазинов. Располагаем техникой для транспортировки тяжёлых и нестандартных грузов.',
      },
      {
        title: 'Вывоз мусора — вывоз в течение 24 часов',
        subtitle:
          'Вывозим строительный мусор, старую мебель, отходы после ремонта. Легальный вывоз на сертифицированный полигон, справка о вывозе включена.',
      },
      {
        title: 'Крупногабаритный транспорт — рояли, сейфы',
        subtitle:
          'Специализируемся на нестандартных предметах: пианино, рояли, сейфы, медицинское и художественное оборудование. Полное страхование Cargo.',
      },
      {
        title: 'Экспресс-транспорт — доставка в день обращения',
        subtitle:
          'Нужна срочная перевозка? Выполняем экспресс-заказы даже в тот же день. Позвоните — проверим наличие и приедем когда нужно.',
      },
    ],
  }[locale];
  return { blockType: 'features', variant: 'numbered', sectionTitle, items, quote };
}
