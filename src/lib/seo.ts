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

export interface BusinessProfile {
  phone?: string;
  email?: string;
  address?: PostalAddress;
  sameAs?: string[];
}

const url = (): string => clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

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

export interface BreadcrumbItem {
  name: string;
  url: string;
}

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

export interface FaqItem {
  question: string;
  answer: string;
}

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
