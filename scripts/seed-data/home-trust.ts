import type { Locale } from '@/lib/constants';

type Block = Record<string, unknown> & { blockType: string };

export function marqueeBlock(locale: Locale): Block {
  const text = {
    pl: 'KINGDOMCARS ♔ TRANSPORT TOWAROWY ♔ WARSZAWA ♔ 24/7 ♔ LOGISTYKA ♔ POLSKA ♔ PRZEPROWADZKI ♔ BEZPIECZEŃSTWO',
    en: 'KINGDOMCARS ♔ FREIGHT TRANSPORT ♔ WARSAW ♔ 24/7 ♔ LOGISTICS ♔ POLAND ♔ MOVING ♔ SAFETY',
    ru: 'KINGDOMCARS ♔ ГРУЗОПЕРЕВОЗКИ ♔ ВАРШАВА ♔ 24/7 ♔ ЛОГИСТИКА ♔ ПОЛЬША ♔ ПЕРЕЕЗДЫ ♔ БЕЗОПАСНОСТЬ',
  }[locale];
  return { blockType: 'marquee', text };
}

export function trustBlock(locale: Locale): Block {
  const items = {
    pl: [
      { title: 'Sprawdzony przewoźnik', subtitle: 'Licencjonowany od 2019', icon: 'check' },
      { title: '4.9★ Google Reviews', subtitle: 'Ponad 127 opinii klientów', icon: 'star' },
      { title: 'Pełne ubezpieczenie', subtitle: 'OC + AC + Cargo', icon: 'shield' },
      { title: 'Faktura VAT', subtitle: 'Dla firm i osób prywatnych', icon: 'file' },
    ],
    en: [
      { title: 'Verified carrier', subtitle: 'Licensed since 2019', icon: 'check' },
      { title: '4.9★ Google Reviews', subtitle: 'Over 127 client reviews', icon: 'star' },
      { title: 'Full insurance', subtitle: 'OC + AC + Cargo', icon: 'shield' },
      { title: 'VAT invoice', subtitle: 'For companies and individuals', icon: 'file' },
    ],
    ru: [
      { title: 'Проверенный перевозчик', subtitle: 'Лицензирован с 2019', icon: 'check' },
      { title: '4.9★ Google Reviews', subtitle: 'Более 127 отзывов клиентов', icon: 'star' },
      { title: 'Полное страхование', subtitle: 'OC + AC + Cargo', icon: 'shield' },
      { title: 'Счёт-фактура НДС', subtitle: 'Для компаний и частных лиц', icon: 'file' },
    ],
  }[locale];
  return { blockType: 'features', variant: 'trust', items };
}

export function countersBlock(locale: Locale): Block {
  const labels = {
    pl: ['Zadowolonych klientów', 'Lat na rynku', 'Zawsze dostępni', 'Bezpieczeństwa'],
    en: ['Satisfied clients', 'Years in business', 'Always available', 'Safety'],
    ru: ['Довольных клиентов', 'Лет на рынке', 'Всегда доступны', 'Безопасность'],
  }[locale];
  const suffixes = {
    pl: ['+', ' lat', '/7', '%'],
    en: ['+', ' yrs', '/7', '%'],
    ru: ['+', ' лет', '/7', '%'],
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
