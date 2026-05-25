import type { Locale } from '@/lib/constants';

import { advantagesBlock, mapBlock, servicesBlock } from './home-content';
import {
  contactFormBlock,
  contactInfoBlock,
  pricingBlock,
  testimonialsBlock,
  wizardFormBlock,
} from './home-cta';
import { heroBlock, heroStatsBlock } from './home-hero';
import { countersBlock, marqueeBlock, trustBlock } from './home-trust';

/**
 * Full home-page layout assembled from block factories.
 * Block order mirrors v1 site (1-3-delta.vercel.app).
 *
 * Missing from v2 vs v1:
 *   - 3-step CTA wizard (tracked in TECH_DEBT.md)
 */
export function homePageData(locale: Locale) {
  const titles = { pl: 'Strona główna', en: 'Home', ru: 'Главная' };
  const seoTitles = {
    pl: 'KingdomCars | Transport towarowy Warszawa 24/7',
    en: 'KingdomCars | Freight Transport Poland 24/7',
    ru: 'KingdomCars | Грузоперевозки Польша 24/7',
  };
  const seoDescriptions = {
    pl: 'Transport towarowy w Polsce. Przeprowadzki, transport biur i magazynów. Warszawa i cała Polska. Tel: +48 506 873 074.',
    en: 'Freight transport in Poland. Apartment moves, office and warehouse transport. Warsaw and all Poland. Tel: +48 506 873 074.',
    ru: 'Грузоперевозки в Польше. Переезды квартир, офисов и складов. Варшава и вся Польша. Тел: +48 506 873 074.',
  };
  return {
    title: titles[locale],
    seo: { title: seoTitles[locale], description: seoDescriptions[locale] },
    slug: 'home',
    _status: 'published',
    layout: [
      heroBlock(locale),
      heroStatsBlock(locale),
      marqueeBlock(locale),
      trustBlock(locale),
      countersBlock(locale),
      advantagesBlock(locale),
      servicesBlock(locale),
      mapBlock(locale),
      pricingBlock(locale),
      wizardFormBlock(locale),
      contactFormBlock(locale),
      testimonialsBlock(locale),
      contactInfoBlock(locale),
    ],
  };
}
