import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

function pricingHeroBlock(locale: Locale): Block {
  const T = {
    pl: {
      eyebrow: 'Cennik · Stawki · Warszawa',
      titleLine1: 'Cennik usług',
      titleHighlight: 'transportowych w Warszawie',
      description:
        'Przejrzyste stawki godzinowe bez ukrytych opłat. Cena zależy od liczby pracowników — im większa ekipa, tym szybciej i sprawniej przebiegnie zlecenie.',
      cta: 'Bezpłatna wycena',
    },
    en: {
      eyebrow: 'Pricing · Rates · Warsaw',
      titleLine1: 'Transport service',
      titleHighlight: 'pricing in Warsaw',
      description:
        'Clear hourly rates with no hidden fees. The price depends on the number of workers — the larger the team, the faster and smoother the job.',
      cta: 'Free quote',
    },
    ru: {
      eyebrow: 'Цены · Тарифы · Варшава',
      titleLine1: 'Цены на транспортные',
      titleHighlight: 'услуги в Варшаве',
      description:
        'Прозрачные почасовые тарифы без скрытых платежей. Цена зависит от количества работников — чем больше команда, тем быстрее и эффективнее выполнится заказ.',
      cta: 'Бесплатная оценка',
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

function pricingIncludedBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Co jest wliczone w cenę?',
    en: 'What is included in the price?',
    ru: 'Что включено в цену?',
  }[locale];
  const quote = {
    pl: 'Nie ma żadnych dodatkowych opłat za dojazd w obrębie Warszawy, materiały ochronne ani za wystawienie faktury VAT. Płacisz tylko za czas pracy ekipy.',
    en: "There are no extra charges for travel within Warsaw, protective materials or issuing a VAT invoice. You only pay for the team's working time.",
    ru: 'Никаких дополнительных платежей за приезд в пределах Варшавы, защитные материалы или выставление счёта-фактуры НДС. Вы платите только за рабочее время команды.',
  }[locale];
  const items = {
    pl: [
      {
        title: 'Dojazd na terenie Warszawy — gratis',
        subtitle:
          'Nie naliczamy opłat za dojazd w obrębie Warszawy. Transport poza miasto wyceniamy indywidualnie — 2 zł/km powyżej 30 km.',
      },
      {
        title: 'Materiały ochronne — w cenie',
        subtitle:
          'Koce transportowe, folia stretch i taśmy pakowe są wliczone w cenę zlecenia. Kartony i opakowania specjalne dostępne za dopłatą.',
      },
      {
        title: 'Ubezpieczenie OC + AC + Cargo — zawsze',
        subtitle:
          'Każde zlecenie jest automatycznie objęte pełnym ubezpieczeniem. W razie szkody sporządzamy protokół i wypłacamy odszkodowanie.',
      },
      {
        title: 'Faktura VAT — bez dopłat',
        subtitle:
          'Wystawiamy faktury VAT 23% dla firm i osób prywatnych. Faktura jest wysyłana emailem po zakończeniu zlecenia, bez żadnych dodatkowych kosztów.',
      },
      {
        title: 'Minimum 2 godziny — uczciwe warunki',
        subtitle:
          'Minimalny czas zlecenia to 2 godziny. Rozliczamy każdą rozpoczętą godzinę, bez zaokrąglania w górę do pełnych godzin.',
      },
      {
        title: 'Wycena na miejscu — bezpłatna i wiążąca',
        subtitle:
          'Przyjeżdżamy ocenić zakres prac bez żadnych opłat. Wycena jest wiążąca — cena nie zmieni się w dniu przeprowadzki.',
      },
    ],
    en: [
      {
        title: 'Travel within Warsaw — free',
        subtitle:
          'No charges for travel within Warsaw. Travel outside the city is quoted individually — 2 PLN/km above 30 km.',
      },
      {
        title: 'Protective materials — included',
        subtitle:
          'Moving blankets, stretch film and packing tape are included in the job price. Cardboard boxes and special packaging are available at extra cost.',
      },
      {
        title: 'OC + AC + Cargo insurance — always',
        subtitle:
          'Every job is automatically covered by full insurance. In case of damage we draw up a report and pay compensation.',
      },
      {
        title: 'VAT invoice — no extra charge',
        subtitle:
          'We issue VAT invoices at 23% for companies and individuals. The invoice is sent by email after the job, at no extra cost.',
      },
      {
        title: 'Minimum 2 hours — fair terms',
        subtitle:
          'The minimum job time is 2 hours. We bill every started hour, without rounding up to full hours.',
      },
      {
        title: 'On-site estimate — free and binding',
        subtitle:
          'We come to assess the scope of work at no charge. The estimate is binding — the price will not change on moving day.',
      },
    ],
    ru: [
      {
        title: 'Выезд по Варшаве — бесплатно',
        subtitle:
          'Никаких доплат за выезд в пределах Варшавы. Выезд за город рассчитывается индивидуально — 2 злотых/км свыше 30 км.',
      },
      {
        title: 'Защитные материалы — в стоимости',
        subtitle:
          'Транспортные одеяла, стрейч-плёнка и упаковочная лента включены в стоимость заказа. Картонные коробки и спецупаковка — за доплату.',
      },
      {
        title: 'Страхование OC + AC + Cargo — всегда',
        subtitle:
          'Каждый заказ автоматически покрывается полным страхованием. В случае ущерба составляем акт и выплачиваем компенсацию.',
      },
      {
        title: 'Счёт-фактура НДС — без доплат',
        subtitle:
          'Выставляем счета-фактуры НДС 23% для компаний и частных лиц. Счёт отправляется на email после выполнения заказа.',
      },
      {
        title: 'Минимум 2 часа — честные условия',
        subtitle:
          'Минимальное время заказа — 2 часа. Тарифицируем каждый начатый час без округления до полных часов.',
      },
      {
        title: 'Оценка на месте — бесплатно и обязательно',
        subtitle:
          'Приезжаем оценить объём работ без какой-либо платы. Оценка обязательна — цена не изменится в день переезда.',
      },
    ],
  }[locale];
  return { blockType: 'features', variant: 'numbered', sectionTitle, items, quote };
}

function pricingFaqBlock(locale: Locale): Block {
  const sectionTitle = { pl: 'Pytania o cennik', en: 'Pricing questions', ru: 'Вопросы о ценах' }[
    locale
  ];
  const items = {
    pl: [
      {
        question: 'Od czego zależy cena przeprowadzki?',
        answer:
          'Cena zależy głównie od liczby pracowników i czasu pracy. Na cenę wpływają też: piętra bez windy, odległość od drogi do mieszkania, liczba i gabaryt mebli. Zadzwoń — wycenimy bezpłatnie.',
      },
      {
        question: 'Czy można dostać rabat przy dłuższym zleceniu?',
        answer:
          'Tak, przy zleceniach powyżej 8 godzin lub stałej współpracy oferujemy rabaty. Skontaktuj się z nami, aby omówić indywidualne warunki.',
      },
      {
        question: 'Kiedy płacę — przed czy po przeprowadzce?',
        answer:
          'Płatność następuje po zakończeniu zlecenia. Przyjmujemy gotówkę i przelew bankowy. Dla firm możliwa jest płatność na fakturę z odroczonym terminem.',
      },
      {
        question: 'Co jeśli przeprowadzka potrwa dłużej niż planowano?',
        answer:
          'Każda dodatkowa godzina jest rozliczana według tej samej stawki godzinowej. Zawsze informujemy o przekroczeniu planowanego czasu przed jego upływem.',
      },
    ],
    en: [
      {
        question: 'What determines the price of a move?',
        answer:
          'The price mainly depends on the number of workers and working time. Other factors include: floors without a lift, distance from the road to the apartment, number and size of furniture. Call us — we will quote for free.',
      },
      {
        question: 'Can I get a discount for a longer job?',
        answer:
          'Yes, for jobs over 8 hours or ongoing cooperation we offer discounts. Contact us to discuss individual terms.',
      },
      {
        question: 'When do I pay — before or after the move?',
        answer:
          'Payment is made after the job is completed. We accept cash and bank transfer. For companies, payment by invoice with a deferred deadline is possible.',
      },
      {
        question: 'What if the move takes longer than planned?',
        answer:
          'Each additional hour is billed at the same hourly rate. We always inform you about exceeding the planned time before it happens.',
      },
    ],
    ru: [
      {
        question: 'От чего зависит цена переезда?',
        answer:
          'Цена зависит в основном от числа работников и времени работы. На цену влияют: этажи без лифта, расстояние от дороги до квартиры, количество и габариты мебели. Позвоните — оценим бесплатно.',
      },
      {
        question: 'Можно ли получить скидку при длительном заказе?',
        answer:
          'Да, при заказах свыше 8 часов или постоянном сотрудничестве предлагаем скидки. Свяжитесь с нами для обсуждения индивидуальных условий.',
      },
      {
        question: 'Когда я плачу — до или после переезда?',
        answer:
          'Оплата производится после завершения заказа. Принимаем наличные и банковский перевод. Для компаний возможна оплата по счёту с отсрочкой платежа.',
      },
      {
        question: 'Что если переезд займёт больше времени?',
        answer:
          'Каждый дополнительный час тарифицируется по той же ставке. Мы всегда предупреждаем о превышении планируемого времени заблаговременно.',
      },
    ],
  }[locale];
  return { blockType: 'faq', sectionTitle, items };
}

function pricingCtaBlock(locale: Locale): Block {
  const T = {
    pl: {
      title: 'Chcesz poznać dokładną cenę?',
      subtitle: 'Zadzwoń lub zostaw prośbę — wycenimy bezpłatnie w 15 minut.',
    },
    en: {
      title: 'Want to know the exact price?',
      subtitle: 'Call or leave a request — we will quote for free within 15 minutes.',
    },
    ru: {
      title: 'Хотите узнать точную цену?',
      subtitle: 'Позвоните или оставьте заявку — оценим бесплатно в течение 15 минут.',
    },
  }[locale];
  return { blockType: 'contactForm', ...T };
}

export function pricingPageData(locale: Locale) {
  const titles = {
    pl: 'Cennik przeprowadzek Warszawa — KingdomCars',
    en: 'Moving prices Warsaw — KingdomCars',
    ru: 'Цены на переезды Варшава — KingdomCars',
  };
  const slugs = { pl: 'cennik', en: 'pricing', ru: 'cennik' };
  const pricingItems = {
    pl: [
      { people: '1 osoba', price: '150 zł', unit: '/h' },
      { people: '2 osoby', price: '200 zł', unit: '/h' },
      { people: '3 osoby', price: '250 zł', unit: '/h' },
      { people: '3+ osób', price: '300 zł', unit: '/h' },
    ],
    en: [
      { people: '1 person', price: '150 zł', unit: '/hr' },
      { people: '2 people', price: '200 zł', unit: '/hr' },
      { people: '3 people', price: '250 zł', unit: '/hr' },
      { people: '3+ people', price: '300 zł', unit: '/hr' },
    ],
    ru: [
      { people: '1 человек', price: '150 zł', unit: '/ч' },
      { people: '2 человека', price: '200 zł', unit: '/ч' },
      { people: '3 человека', price: '250 zł', unit: '/ч' },
      { people: '3+ человек', price: '300 zł', unit: '/ч' },
    ],
  }[locale];
  const pricingNote = {
    pl: 'Ceny są przybliżone za godzinę',
    en: 'Prices are approximate per hour',
    ru: 'Цены приблизительные за час',
  }[locale];
  const pricingSectionTitle = {
    pl: 'Stawki godzinowe',
    en: 'Hourly rates',
    ru: 'Почасовые тарифы',
  }[locale];
  return {
    title: titles[locale],
    slug: slugs[locale],
    _status: 'published',
    layout: [
      pricingHeroBlock(locale),
      {
        blockType: 'pricing',
        sectionTitle: pricingSectionTitle,
        note: pricingNote,
        items: pricingItems,
      } as Block,
      pricingIncludedBlock(locale),
      pricingFaqBlock(locale),
      pricingCtaBlock(locale),
    ],
  };
}
