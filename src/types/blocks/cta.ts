import type { BaseBlock, LinkValue } from './common';

export interface ContactFormBlock extends BaseBlock {
  blockType: 'contactForm';
  title: string;
  subtitle?: string;
}

export interface CTABlock extends BaseBlock {
  blockType: 'cta';
  title: string;
  body?: string;
  ctas?: LinkValue[];
}
