import type { Locale } from '@/lib/constants';

export type StaticSlug = 'about' | 'privacy' | 'cookies';

export interface PageCopy {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks: Array<{ kind: 'h2' | 'h3' | 'p'; text: string }>;
}

export const STATIC_PAGE_COPY: Record<StaticSlug, Record<Locale, PageCopy>> = {
  about: {
    pl: {
      title: 'O nas',
      seoTitle: 'O nas — KingdomCars | Transport towarowy Warszawa',
      seoDescription:
        'Dowiedz się więcej o KingdomCars — firmie transportowej działającej w Warszawie od 2019 roku. Profesjonalny transport towarów w całej Polsce.',
      blocks: [
        { kind: 'h2', text: 'Kim jesteśmy' },
        {
          kind: 'p',
          text: 'KingdomCars to firma transportowa działająca w Warszawie i okolicach.',
        },
      ],
    },
    en: {
      title: 'About',
      seoTitle: 'About — KingdomCars | Freight Transport Warsaw',
      seoDescription:
        'Learn more about KingdomCars — a transport company operating in Warsaw since 2019. Professional freight transport all over Poland.',
      blocks: [
        { kind: 'h2', text: 'Who we are' },
        {
          kind: 'p',
          text: 'KingdomCars is a transport company operating in Warsaw and the surrounding region.',
        },
      ],
    },
    ru: {
      title: 'О нас',
      seoTitle: 'О нас — KingdomCars | Грузоперевозки Варшава',
      seoDescription:
        'Узнайте больше о KingdomCars — транспортной компании, работающей в Варшаве с 2019 года. Профессиональные грузоперевозки по всей Польше.',
      blocks: [
        { kind: 'h2', text: 'Кто мы' },
        {
          kind: 'p',
          text: 'KingdomCars — транспортная компания, работающая в Варшаве и окрестностях.',
        },
      ],
    },
  },
  privacy: {
    pl: {
      title: 'Polityka prywatności',
      seoTitle: 'Polityka prywatności — KingdomCars',
      seoDescription:
        'Polityka prywatności KingdomCars. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
      blocks: [
        { kind: 'h2', text: 'Polityka prywatności' },
        {
          kind: 'p',
          text: 'Administratorem danych osobowych jest KingdomCars, ul. Warszawska 1, Warszawa.',
        },
        { kind: 'h3', text: 'Jakie dane zbieramy' },
        {
          kind: 'p',
          text: 'Zbieramy dane podane przez użytkownika w formularzach kontaktowych: imię i nazwisko, numer telefonu, adres e-mail oraz treść wiadomości.',
        },
        { kind: 'h3', text: 'Cel przetwarzania' },
        {
          kind: 'p',
          text: 'Dane przetwarzane są wyłącznie w celu udzielenia odpowiedzi na zapytania oraz realizacji usług transportowych.',
        },
        { kind: 'h3', text: 'Prawa użytkownika' },
        {
          kind: 'p',
          text: 'Użytkownik ma prawo dostępu do swoich danych, ich sprostowania, usunięcia oraz wniesienia sprzeciwu wobec przetwarzania.',
        },
        { kind: 'h3', text: 'Kontakt' },
        {
          kind: 'p',
          text: 'W sprawach dotyczących ochrony danych osobowych prosimy o kontakt: info@kingdomcars.pl',
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      seoTitle: 'Privacy Policy — KingdomCars',
      seoDescription:
        'KingdomCars privacy policy. Information about personal data processing in accordance with GDPR.',
      blocks: [
        { kind: 'h2', text: 'Privacy Policy' },
        {
          kind: 'p',
          text: 'The data controller is KingdomCars, ul. Warszawska 1, Warsaw, Poland.',
        },
        { kind: 'h3', text: 'What data we collect' },
        {
          kind: 'p',
          text: 'We collect data provided by users in contact forms: name, phone number, email address and message content.',
        },
        { kind: 'h3', text: 'Purpose of processing' },
        {
          kind: 'p',
          text: 'Data is processed solely to respond to inquiries and provide transport services.',
        },
        { kind: 'h3', text: 'Your rights' },
        {
          kind: 'p',
          text: 'You have the right to access, correct, delete your data and object to its processing at any time.',
        },
        { kind: 'h3', text: 'Contact' },
        {
          kind: 'p',
          text: 'For data protection matters, please contact us at: info@kingdomcars.pl',
        },
      ],
    },
    ru: {
      title: 'Политика конфиденциальности',
      seoTitle: 'Политика конфиденциальности — KingdomCars',
      seoDescription:
        'Политика конфиденциальности KingdomCars. Информация об обработке персональных данных согласно GDPR.',
      blocks: [
        { kind: 'h2', text: 'Политика конфиденциальности' },
        {
          kind: 'p',
          text: 'Администратором персональных данных является KingdomCars, ул. Варшавская 1, Варшава, Польша.',
        },
        { kind: 'h3', text: 'Какие данные мы собираем' },
        {
          kind: 'p',
          text: 'Мы собираем данные, которые пользователь указывает в контактных формах: имя, номер телефона, адрес электронной почты и текст сообщения.',
        },
        { kind: 'h3', text: 'Цель обработки' },
        {
          kind: 'p',
          text: 'Данные обрабатываются исключительно для ответа на запросы и предоставления транспортных услуг.',
        },
        { kind: 'h3', text: 'Права пользователя' },
        {
          kind: 'p',
          text: 'Вы имеете право на доступ к своим данным, их исправление, удаление и возражение против обработки.',
        },
        { kind: 'h3', text: 'Контакт' },
        {
          kind: 'p',
          text: 'По вопросам защиты персональных данных обращайтесь: info@kingdomcars.pl',
        },
      ],
    },
  },
  cookies: {
    pl: {
      title: 'Polityka cookies',
      seoTitle: 'Polityka cookies — KingdomCars',
      seoDescription:
        'Polityka plików cookie KingdomCars. Informacje o używanych plikach cookie i sposobach zarządzania nimi.',
      blocks: [
        { kind: 'h2', text: 'Polityka plików cookie' },
        {
          kind: 'p',
          text: 'Niniejsza polityka opisuje sposób, w jaki strona internetowa KingdomCars używa plików cookie.',
        },
        { kind: 'h3', text: 'Czym są pliki cookie' },
        {
          kind: 'p',
          text: 'Pliki cookie to małe pliki tekstowe zapisywane na urządzeniu użytkownika podczas odwiedzania strony internetowej.',
        },
        { kind: 'h3', text: 'Rodzaje plików cookie' },
        {
          kind: 'p',
          text: 'Niezbędne — wymagane do prawidłowego działania strony (sesja, ustawienia języka).',
        },
        {
          kind: 'p',
          text: 'Analityczne — pomagają zrozumieć, jak użytkownicy korzystają ze strony (Google Analytics).',
        },
        { kind: 'h3', text: 'Zarządzanie plikami cookie' },
        {
          kind: 'p',
          text: 'Użytkownik może zarządzać plikami cookie poprzez ustawienia przeglądarki lub klikając przycisk "Nastroić" w stopce strony.',
        },
      ],
    },
    en: {
      title: 'Cookie policy',
      seoTitle: 'Cookie Policy — KingdomCars',
      seoDescription:
        'KingdomCars cookie policy. Information about cookies used on the website and how to manage them.',
      blocks: [
        { kind: 'h2', text: 'Cookie Policy' },
        { kind: 'p', text: 'This policy describes how KingdomCars website uses cookies.' },
        { kind: 'h3', text: 'What are cookies' },
        {
          kind: 'p',
          text: 'Cookies are small text files stored on your device when you visit a website.',
        },
        { kind: 'h3', text: 'Types of cookies' },
        {
          kind: 'p',
          text: 'Essential — required for the website to function properly (session, language settings).',
        },
        {
          kind: 'p',
          text: 'Analytics — help us understand how users interact with the site (Google Analytics).',
        },
        { kind: 'h3', text: 'Managing cookies' },
        {
          kind: 'p',
          text: 'You can manage cookies through your browser settings or by clicking the "Settings" button in the footer.',
        },
      ],
    },
    ru: {
      title: 'Политика cookie',
      seoTitle: 'Политика cookie — KingdomCars',
      seoDescription:
        'Политика файлов cookie KingdomCars. Информация об используемых файлах cookie и способах управления ими.',
      blocks: [
        { kind: 'h2', text: 'Политика файлов cookie' },
        {
          kind: 'p',
          text: 'Настоящая политика описывает, как сайт KingdomCars использует файлы cookie.',
        },
        { kind: 'h3', text: 'Что такое файлы cookie' },
        {
          kind: 'p',
          text: 'Cookie — это небольшие текстовые файлы, сохраняемые на устройстве пользователя при посещении сайта.',
        },
        { kind: 'h3', text: 'Виды файлов cookie' },
        {
          kind: 'p',
          text: 'Необходимые — требуются для корректной работы сайта (сессия, настройки языка).',
        },
        {
          kind: 'p',
          text: 'Аналитические — помогают понять, как пользователи взаимодействуют с сайтом (Google Analytics).',
        },
        { kind: 'h3', text: 'Управление cookie' },
        {
          kind: 'p',
          text: 'Вы можете управлять файлами cookie через настройки браузера или нажав кнопку "Настроить" в подвале сайта.',
        },
      ],
    },
  },
};

export const SLUG_PER_LOCALE: Record<StaticSlug, Record<Locale, string>> = {
  about: { pl: 'about', en: 'about', ru: 'about' },
  privacy: { pl: 'privacy', en: 'privacy', ru: 'privacy' },
  cookies: { pl: 'cookies', en: 'cookies', ru: 'cookies' },
};
