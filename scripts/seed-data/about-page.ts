import type { Locale } from '@/lib/constants';

import { aboutHeroBlock, aboutStatsBlock, aboutTrustBlock } from './about-blocks';

type Block = Record<string, unknown> & { blockType: string };

function aboutCountersBlock(locale: Locale): Block {
  const labels = {
    pl: ['Zadowolonych klientów', 'Lat doświadczenia', 'Dostępność', 'Terminowości'],
    en: ['Satisfied clients', 'Years of experience', 'Availability', 'On-time rate'],
    ru: ['Довольных клиентов', 'Лет опыта', 'Доступность', 'Пунктуальность'],
  }[locale];
  const suffixes = {
    pl: ['+', '+', '/7', '%'],
    en: ['+', '+', '/7', '%'],
    ru: ['+', '+', '/7', '%'],
  }[locale];
  return {
    blockType: 'counters',
    items: [
      { target: 3200, suffix: suffixes[0], label: labels[0] },
      { target: 5, suffix: suffixes[1], label: labels[1] },
      { target: 24, suffix: suffixes[2], label: labels[2] },
      { target: 100, suffix: suffixes[3], label: labels[3] },
    ],
  };
}

function aboutStoryBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Nasza historia i wartości',
    en: 'Our history and values',
    ru: 'Наша история и ценности',
  }[locale];
  const quote = {
    pl: 'Wierzymy, że dobry transport to nie tylko przewiezienie rzeczy z punktu A do B — to troska o każdy szczegół, szacunek do czasu klienta i odpowiedzialność za powierzone mienie.',
    en: "We believe that good transport is not just moving things from A to B — it is attention to every detail, respect for the client's time, and responsibility for their belongings.",
    ru: 'Мы верим, что хорошая перевозка — это не просто доставить вещи из А в Б. Это внимание к каждой детали, уважение ко времени клиента и ответственность за доверенное имущество.',
  }[locale];
  const items = {
    pl: [
      {
        title: '2019 — narodziny KingdomCars',
        subtitle:
          'Firma założona przez logistyków, którzy dostrzegli brak rzetelnych firm przeprowadzkowych w Warszawie. Zaczęliśmy od jednego busa i wielkich ambicji.',
      },
      {
        title: '2020-2021 — pierwsze 1000 klientów',
        subtitle:
          'Polecenia zadowolonych klientów przyspieszyły wzrost. Rozszerzyliśmy flotę i zatrudniliśmy pierwszych pracowników.',
      },
      {
        title: '2022 — certyfikacja i ubezpieczenia',
        subtitle:
          'Uzyskaliśmy pełne ubezpieczenie OC + AC + Cargo oraz certyfikaty potwierdzające zgodność z wymogami dla przewoźników drogowych.',
      },
      {
        title: '2023-2024 — ekspansja ogólnopolska',
        subtitle:
          'Rozszerzyliśmy zasięg na całą Polskę. Sieć zaufanych partnerów logistycznych pozwala realizować zlecenia od Gdańska po Kraków.',
      },
      {
        title: 'Dziś — 3200+ klientów i praca 24/7',
        subtitle:
          'Dostępni całą dobę, siedem dni w tygodniu. Każde zlecenie — duże czy małe — traktujemy z taką samą starannością.',
      },
      {
        title: 'Jutro — nowe usługi i technologie',
        subtitle:
          'Inwestujemy w narzędzia do śledzenia transportu, ekologiczną flotę i lepszy system komunikacji z klientem.',
      },
    ],
    en: [
      {
        title: '2019 — KingdomCars is born',
        subtitle:
          'Founded by logistics professionals who noticed a lack of reliable moving companies in Warsaw. Started with one van and big ambitions.',
      },
      {
        title: '2020-2021 — first 1,000 clients',
        subtitle:
          'Word of mouth from satisfied clients accelerated our growth. We expanded the fleet and hired our first employees.',
      },
      {
        title: '2022 — certification and insurance',
        subtitle:
          'We obtained full OC + AC + Cargo insurance and certificates confirming compliance with legal requirements for road carriers.',
      },
      {
        title: '2023-2024 — nationwide expansion',
        subtitle:
          'We expanded across all of Poland. A network of trusted logistics partners handles assignments from Gdansk to Krakow.',
      },
      {
        title: 'Today — 3200+ clients and 24/7',
        subtitle:
          'Available around the clock, seven days a week. Every assignment — large or small — is treated with the same care.',
      },
      {
        title: 'Tomorrow — new services and tech',
        subtitle:
          'We invest in shipment tracking tools, an eco-friendly fleet, and a better client communication system.',
      },
    ],
    ru: [
      {
        title: '2019 — рождение KingdomCars',
        subtitle:
          'Основана логистами, заметившими нехватку надёжных переездных компаний в Варшаве. Начали с одного фургона и больших амбиций.',
      },
      {
        title: '2020-2021 — первые 1000 клиентов',
        subtitle:
          'Рекомендации довольных клиентов ускорили рост. Расширили автопарк и наняли первых сотрудников.',
      },
      {
        title: '2022 — сертификация и страхование',
        subtitle:
          'Получили полное страхование OC + AC + Cargo и сертификаты соответствия требованиям для автоперевозчиков.',
      },
      {
        title: '2023-2024 — расширение по всей Польше',
        subtitle:
          'Расширили зону покрытия на всю Польшу. Сеть проверенных партнёров — от Гданьска до Кракова.',
      },
      {
        title: 'Сегодня — 3200+ клиентов, 24/7',
        subtitle:
          'Доступны круглосуточно семь дней в неделю. Каждый заказ выполняем с одинаковой тщательностью.',
      },
      {
        title: 'Завтра — новые услуги и технологии',
        subtitle:
          'Инвестируем в отслеживание перевозок, экологичный автопарк и улучшенную систему коммуникации.',
      },
    ],
  }[locale];
  return { blockType: 'features', variant: 'numbered', sectionTitle, items, quote };
}

function aboutContactBlock(locale: Locale): Block {
  const T = {
    pl: {
      title: 'Masz pytania? Chętnie odpowiemy',
      subtitle: 'Skontaktuj się — odpiszemy w ciągu 15 minut.',
    },
    en: {
      title: 'Have questions? We are happy to help',
      subtitle: 'Contact us — we will reply within 15 minutes.',
    },
    ru: {
      title: 'Есть вопросы? Ответим с удовольствием',
      subtitle: 'Свяжитесь с нами — ответим в течение 15 минут.',
    },
  }[locale];
  return { blockType: 'contactForm', ...T };
}

export function aboutPageData(locale: Locale) {
  const titles = {
    pl: 'O nas — KingdomCars Warszawa',
    en: 'About us — KingdomCars Warsaw',
    ru: 'О нас — KingdomCars Варшава',
  };
  return {
    title: titles[locale],
    slug: 'about',
    _status: 'published',
    layout: [
      aboutHeroBlock(locale),
      aboutStatsBlock(locale),
      aboutCountersBlock(locale),
      aboutStoryBlock(locale),
      aboutTrustBlock(locale),
      aboutContactBlock(locale),
    ],
  };
}
