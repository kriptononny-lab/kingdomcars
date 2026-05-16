/**
 * Discriminated union of every concrete page block type — the union itself
 * is the unique value of this file, not a re-export collection.
 *
 * This is NOT a barrel: consumers that need concrete block types
 * (HeroBlock, CTABlock, …) import them directly from their owner files
 * (`./content`, `./business`, `./cta`, `./common`). Only the `PageBlock`
 * union — which cannot live in any one of those files because it spans
 * all three — is exposed here.
 *
 * Adding a block:
 *   1. add an interface in the appropriate sibling file
 *   2. add it to the union below
 *   3. TS will require a matching `case` in BlockRenderer's switch
 */

import type {
  CountersBlock,
  FAQBlock,
  MapBlock,
  PricingBlock,
  ServicesBlock,
  TestimonialsBlock,
} from './business';
import type {
  FeaturesBlock,
  HeroBlock,
  ImageGalleryBlock,
  MarqueeBlock,
  RichTextBlock,
} from './content';
import type { CTABlock, ContactFormBlock } from './cta';

export type PageBlock =
  | HeroBlock
  | FeaturesBlock
  | MarqueeBlock
  | CountersBlock
  | ServicesBlock
  | MapBlock
  | PricingBlock
  | ContactFormBlock
  | TestimonialsBlock
  | FAQBlock
  | RichTextBlock
  | ImageGalleryBlock
  | CTABlock;
