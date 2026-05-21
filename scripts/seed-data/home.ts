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
  return {
    title: titles[locale],
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
