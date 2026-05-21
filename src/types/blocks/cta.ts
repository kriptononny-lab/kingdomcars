import type { BaseBlock, LinkValue } from './common';

export interface ContactFormBlock extends BaseBlock {
  blockType: 'contactForm';
  title: string;
  subtitle?: string;
}

/**
 * Each `cta` item in the Payload array wraps a `linkField` group.
 * Payload schema: `array > fields: [linkField]` where linkField.name = 'link'.
 * At runtime this produces `Array<{ id: string; link: LinkValue }>`.
 */
export interface CTABlock extends BaseBlock {
  blockType: 'cta';
  title: string;
  body?: string;
  ctas?: Array<{ id?: string; link: LinkValue }>;
}

export interface WizardFormBlock extends BaseBlock {
  blockType: 'wizardForm';
  sectionTitle: string;
  subtitle?: string;
}
