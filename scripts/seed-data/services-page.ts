import type { Locale } from '@/lib/constants';

import { servicesDetailBlock, servicesHeroBlock } from './services-blocks';

type Block = Record<string, unknown> & { blockType: string };

function servicesFeaturesBlock(locale: Locale): Block {
  const items = {
    pl: [
      {
        title: 'Pełne ubezpieczenie OC + Cargo',
        subtitle: 'Każde zlecenie jest ubezpieczone',
        icon: 'shield',
      },
      { title: 'Dostępni 24/7', subtitle: 'Zadzwoń kiedy potrzebujesz', icon: 'clock' },
      { title: 'Faktura VAT', subtitle: 'Rozliczenia dla firm i osób prywatnych', icon: 'file' },
    ],
    en: [
      {
        title: 'Full OC + Cargo insurance',
        subtitle: 'Every job is fully insured',
        icon: 'shield',
      },
      { title: 'Available 24/7', subtitle: 'Call us whenever you need', icon: 'clock' },
      { title: 'VAT invoice', subtitle: 'Billing for companies and individuals', icon: 'file' },
    ],
    ru: [
      {
        title: 'Полное страхование OC + Cargo',
        subtitle: 'Каждый заказ застрахован',
        icon: 'shield',
      },
      { title: 'Доступны 24/7', subtitle: 'Звоните когда нужно', icon: 'clock' },
      { title: 'Счёт-фактура НДС', subtitle: 'Расчёты для компаний и частных лиц', icon: 'file' },
    ],
  }[locale];
  return { blockType: 'features', variant: 'compact', items };
}

function servicesFaqBlock(locale: Locale): Block {
  const sectionTitle = {
    pl: 'Najczęściej zadawane pytania',
    en: 'Frequently asked questions',
    ru: 'Часто задаваемые вопросы',
  }[locale];
  const items = {
    pl: [
      {
        question: 'Ile kosztuje przeprowadzka w Warszawie?',
        answer:
          'Cena zależy od liczby pracowników i czasu pracy. Stawki zaczynają się od 150 zł/h za jedną osobę. Wyceniamy każde zlecenie indywidualnie — zadzwoń lub zostaw prośbę, a oddzwonimy w 15 minut.',
      },
      {
        question: 'Czy oferujecie transport w weekendy i święta?',
        answer:
          'Tak, pracujemy 7 dni w tygodniu przez całą dobę, w tym w weekendy i dni świąteczne. Termin ustalamy telefonicznie lub przez formularz na stronie.',
      },
      {
        question: 'Czy ładunek jest ubezpieczony podczas transportu?',
        answer:
          'Tak. Każde zlecenie jest objęte ubezpieczeniem OC + AC + Cargo. W przypadku szkody sporządzamy protokół i wypłacamy odszkodowanie zgodnie z warunkami polisy.',
      },
      {
        question: 'Czy możecie zapakować rzeczy za mnie?',
        answer:
          'Tak, oferujemy usługę pakowania w cenie od 30 zł/h. Używamy profesjonalnych materiałów: kartony, folia bąbelkowa, koce transportowe i taśmy.',
      },
      {
        question: 'Ile wcześniej trzeba zarezerwować termin?',
        answer:
          'W sezonie (kwiecień–październik) rekomendujemy rezerwację 3-7 dni wcześniej. Poza sezonem często realizujemy zlecenia w ciągu 24-48 godzin. Zadzwoń i sprawdzimy dostępność.',
      },
      {
        question: 'Czy wystawiacie faktury VAT?',
        answer:
          'Tak, wystawiamy faktury VAT 23% zarówno dla firm jak i osób prywatnych. Rozliczamy umowy B2B. Faktura jest wysyłana emailem po zakończeniu zlecenia.',
      },
    ],
    en: [
      {
        question: 'How much does a move in Warsaw cost?',
        answer:
          'The price depends on the number of workers and time worked. Rates start from 150 PLN/h for one person. We quote every job individually — call or leave a request and we will call back within 15 minutes.',
      },
      {
        question: 'Do you offer transport on weekends and holidays?',
        answer:
          'Yes, we work 7 days a week around the clock, including weekends and public holidays. We agree on the date by phone or through the form on the website.',
      },
      {
        question: 'Is the cargo insured during transport?',
        answer:
          'Yes. Every job is covered by OC + AC + Cargo insurance. In the event of damage we draw up a report and pay compensation in accordance with the policy terms.',
      },
      {
        question: 'Can you pack my belongings for me?',
        answer:
          'Yes, we offer a packing service from 30 PLN/h. We use professional materials: cardboard boxes, bubble wrap, moving blankets and tape.',
      },
      {
        question: 'How far in advance do I need to book?',
        answer:
          'In peak season (April–October) we recommend booking 3-7 days in advance. Out of season we often carry out jobs within 24-48 hours. Call and we will check availability.',
      },
      {
        question: 'Do you issue VAT invoices?',
        answer:
          'Yes, we issue VAT invoices at 23% for both companies and individuals. We handle B2B contracts. The invoice is sent by email after the job is completed.',
      },
    ],
    ru: [
      {
        question: 'Сколько стоит переезд в Варшаве?',
        answer:
          'Цена зависит от числа работников и времени работы. Ставки начинаются от 150 злотых/ч за одного человека. Оцениваем каждый заказ индивидуально — позвоните или оставьте заявку, перезвоним в течение 15 минут.',
      },
      {
        question: 'Работаете ли вы в выходные и праздники?',
        answer:
          'Да, работаем 7 дней в неделю круглосуточно, включая выходные и праздничные дни. Дату согласуем по телефону или через форму на сайте.',
      },
      {
        question: 'Застрахован ли груз во время перевозки?',
        answer:
          'Да. Каждый заказ покрыт страхованием OC + AC + Cargo. В случае ущерба составляем акт и выплачиваем компенсацию в соответствии с условиями полиса.',
      },
      {
        question: 'Можете ли вы упаковать вещи за меня?',
        answer:
          'Да, предлагаем услугу упаковки от 30 злотых/ч. Используем профессиональные материалы: картонные ящики, пузырчатую плёнку, транспортные одеяла и скотч.',
      },
      {
        question: 'За сколько нужно бронировать?',
        answer:
          'В сезон (апрель–октябрь) рекомендуем бронировать за 3-7 дней. Вне сезона часто выполняем заказы в течение 24-48 часов. Позвоните и мы проверим наличие.',
      },
      {
        question: 'Выставляете ли вы счета-фактуры НДС?',
        answer:
          'Да, выставляем счета-фактуры НДС 23% как для компаний, так и для частных лиц. Работаем по договорам B2B. Счёт отправляется на email после выполнения заказа.',
      },
    ],
  }[locale];
  return { blockType: 'faq', sectionTitle, items };
}

function servicesCTABlock(locale: Locale): Block {
  const T = {
    pl: {
      title: 'Gotowy na bezstresową przeprowadzkę?',
      subtitle: 'Zostaw prośbę — oddzwonimy w 15 minut z wyceną.',
    },
    en: {
      title: 'Ready for a stress-free move?',
      subtitle: 'Leave a request — we will call back within 15 minutes with a quote.',
    },
    ru: {
      title: 'Готовы к переезду без стресса?',
      subtitle: 'Оставьте заявку — перезвоним в течение 15 минут с ценой.',
    },
  }[locale];
  return { blockType: 'contactForm', ...T };
}

export function servicesPageData(locale: Locale) {
  const titles = {
    pl: 'Usługi transportowe Warszawa — KingdomCars',
    en: 'Transport services Warsaw — KingdomCars',
    ru: 'Транспортные услуги Варшава — KingdomCars',
  };
  const slugs = { pl: 'uslugi', en: 'services', ru: 'uslugi' };
  return {
    title: titles[locale],
    slug: slugs[locale],
    _status: 'published',
    layout: [
      servicesHeroBlock(locale),
      servicesFeaturesBlock(locale),
      {
        blockType: 'services',
        sectionTitle: { pl: 'Co oferujemy', en: 'What we offer', ru: 'Что предлагаем' }[locale],
        items: [
          {
            title: { pl: 'Transport mieszkań', en: 'Apartment moves', ru: 'Перевозка квартир' }[
              locale
            ],
            cta: { pl: 'Zamów', en: 'Order', ru: 'Заказать' }[locale],
            iconKey: 'apartment',
          },
          {
            title: {
              pl: 'Transport magazynów',
              en: 'Warehouse transport',
              ru: 'Перевозка складов',
            }[locale],
            cta: { pl: 'Zamów', en: 'Order', ru: 'Заказать' }[locale],
            iconKey: 'warehouse',
          },
          {
            title: { pl: 'Wywóz śmieci', en: 'Waste removal', ru: 'Вывоз мусора' }[locale],
            cta: { pl: 'Zamów', en: 'Order', ru: 'Заказать' }[locale],
            iconKey: 'trash',
          },
          {
            title: { pl: 'Transport biur', en: 'Office moves', ru: 'Перевозка офисов' }[locale],
            cta: { pl: 'Zamów', en: 'Order', ru: 'Заказать' }[locale],
            iconKey: 'office',
          },
        ],
      } as Block,
      servicesDetailBlock(locale),
      servicesFaqBlock(locale),
      servicesCTABlock(locale),
    ],
  };
}
