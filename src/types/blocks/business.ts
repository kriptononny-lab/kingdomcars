import type { BaseBlock } from './common';

export interface CountersBlock extends BaseBlock {
  blockType: 'counters';
  items: Array<{ target: number; suffix: string; label: string }>;
}

export interface ServicesBlock extends BaseBlock {
  blockType: 'services';
  sectionTitle: string;
  items: Array<{
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
  cities: string[];
}

export interface PricingBlock extends BaseBlock {
  blockType: 'pricing';
  sectionTitle: string;
  items: Array<{ people: string; price: string; unit: string }>;
  note?: string;
}

export interface TestimonialsBlock extends BaseBlock {
  blockType: 'testimonials';
  sectionTitle: string;
  items: Array<{ name: string; location: string; text: string; tag?: string; rating: number }>;
}

export interface FAQBlock extends BaseBlock {
  blockType: 'faq';
  sectionTitle: string;
  items: Array<{ id?: string; question: string; answer: string }>;
}
