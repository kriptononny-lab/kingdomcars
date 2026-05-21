import type { BaseBlock } from './common';

export interface CountersBlock extends BaseBlock {
  blockType: 'counters';
  items: Array<{ id?: string; target: number; suffix: string; label: string }>;
}

export interface ServicesBlock extends BaseBlock {
  blockType: 'services';
  sectionTitle: string;
  items: Array<{
    id?: string;
    title: string;
    cta: string;
    iconKey: 'apartment' | 'warehouse' | 'trash' | 'office';
  }>;
}

export interface MapBlock extends BaseBlock {
  blockType: 'map';
  sectionLabel: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  /** Payload array field — each item is an object with `name` + generated `id`. */
  cities: Array<{ id?: string; name: string }>;
}

export interface PricingBlock extends BaseBlock {
  blockType: 'pricing';
  sectionTitle: string;
  items: Array<{ id?: string; people: string; price: string; unit: string }>;
  note?: string;
}

export interface TestimonialsBlock extends BaseBlock {
  blockType: 'testimonials';
  sectionTitle: string;
  items: Array<{
    id?: string;
    name: string;
    location: string;
    text: string;
    tag?: string;
    rating: number;
  }>;
}

export interface FAQBlock extends BaseBlock {
  blockType: 'faq';
  sectionTitle: string;
  items: Array<{ id?: string; question: string; answer: string }>;
}

export interface ContactInfoBlock extends BaseBlock {
  blockType: 'contactInfo';
  sectionTitle: string;
  /**
   * Google Maps iframe `src` URL. Rendered only when non-empty.
   * Contact details (phones, email, address) are injected server-side
   * from the SiteSettings global — not stored in this block.
   */
  mapEmbedUrl?: string;
}
