import type { LinkValue } from '@/types/blocks/common';

/**
 * Payload auto-generates `id` for every array row at runtime. We expose it
 * as optional in the TS view so React can use it as a stable list key
 * without an `as never`/`key={index}` fallback.
 */
interface NavItem {
  id?: string;
  link: LinkValue;
}

export interface HeaderData {
  navItems?: NavItem[];
  ctaLabel?: string;
}

export interface FooterData {
  tagline?: string;
  columns?: Array<{
    id?: string;
    heading?: string;
    links?: NavItem[];
  }>;
  copyright?: string;
  legalLinks?: NavItem[];
}

export interface SiteSettingsData {
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  address?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  googleBusiness?: string;
  organisationName?: string;
}
