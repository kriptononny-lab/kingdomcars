/**
 * Schema.org JSON-LD builders per §7. Each returns a plain object that the
 * `<JsonLd>` Server Component serialises into a JSON-LD `<script>`.
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { SITE, type Locale } from '@/lib/constants';
import { clientEnv } from '@/lib/env';

interface PostalAddress {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
}

/** Optional business profile data used to populate JSON-LD schemas. */
export interface BusinessProfile {
  phone?: string;
  email?: string;
  address?: PostalAddress;
  sameAs?: string[];
}

const url = (): string => clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

/**
 * Generate `Organization` JSON-LD schema.
 * @param p - Optional business profile overrides.
 */
export function organizationJsonLd(p: BusinessProfile = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.NAME,
    url: url(),
    logo: `${url()}/logo-mark.webp`,
    ...(p.phone && { telephone: p.phone }),
    ...(p.email && { email: p.email }),
    ...(p.address && { address: { '@type': 'PostalAddress', ...p.address } }),
    ...(p.sameAs?.length && { sameAs: p.sameAs }),
  };
}

/**
 * Generate `WebSite` JSON-LD schema with locale-aware SearchAction.
 * @param locale - Active locale for the siteLinks search box target.
 */
export function webSiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.NAME,
    url: url(),
    inLanguage: locale,
    description: SITE.TAGLINE[locale],
  };
}

/**
 * Generate `LocalBusiness` JSON-LD schema for the homepage.
 * @param p - Business profile (phone, email, address).
 */
export function localBusinessJsonLd(p: BusinessProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: SITE.NAME,
    url: url(),
    image: `${url()}/logo-mark.webp`,
    priceRange: '€€',
    ...(p.phone && { telephone: p.phone }),
    ...(p.email && { email: p.email }),
    ...(p.address && { address: { '@type': 'PostalAddress', ...p.address } }),
    areaServed: { '@type': 'Country', name: 'Poland' },
  };
}

/** A single breadcrumb item for `BreadcrumbList` JSON-LD. */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate `BreadcrumbList` JSON-LD schema.
 * @param items - Ordered list of breadcrumb items.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** A single FAQ item for `FAQPage` JSON-LD. */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Generate `FAQPage` JSON-LD schema for FAQ sections.
 * @param items - Array of question/answer pairs.
 */
export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
