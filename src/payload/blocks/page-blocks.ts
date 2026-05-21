import type { Block } from 'payload';

import { ContactFormBlock } from '@/payload/blocks/ContactFormBlock';
import { ContactInfoBlock } from '@/payload/blocks/ContactInfoBlock';
import { CountersBlock } from '@/payload/blocks/CountersBlock';
import { CTABlock } from '@/payload/blocks/CTABlock';
import { FAQBlock } from '@/payload/blocks/FAQBlock';
import { FeaturesBlock } from '@/payload/blocks/FeaturesBlock';
import { HeroBlock } from '@/payload/blocks/HeroBlock';
import { ImageGalleryBlock } from '@/payload/blocks/ImageGalleryBlock';
import { MapBlock } from '@/payload/blocks/MapBlock';
import { MarqueeBlock } from '@/payload/blocks/MarqueeBlock';
import { PricingBlock } from '@/payload/blocks/PricingBlock';
import { RichTextBlock } from '@/payload/blocks/RichTextBlock';
import { ServicesBlock } from '@/payload/blocks/ServicesBlock';
import { TestimonialsBlock } from '@/payload/blocks/TestimonialsBlock';
import { WizardFormBlock } from '@/payload/blocks/WizardFormBlock';

/**
 * Runtime registry of available page-layout blocks. Order here determines
 * the order shown in the Payload admin block picker.
 */
export const pageBlocks: Block[] = [
  HeroBlock,
  FeaturesBlock,
  MarqueeBlock,
  CountersBlock,
  ServicesBlock,
  MapBlock,
  PricingBlock,
  ContactFormBlock,
  ContactInfoBlock,
  WizardFormBlock,
  TestimonialsBlock,
  FAQBlock,
  RichTextBlock,
  ImageGalleryBlock,
  CTABlock,
];
