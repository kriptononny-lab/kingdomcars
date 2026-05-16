import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import type { Media } from '@/types/media';

import type { BaseBlock, LinkValue } from './common';

export interface HeroBlock extends BaseBlock {
  blockType: 'hero';
  eyebrow?: string;
  titleLine1: string;
  titleLine2?: string;
  titleHighlight?: string;
  description?: string;
  ctaPrimary?: LinkValue;
  ctaSecondary?: LinkValue;
}

export interface FeaturesBlock extends BaseBlock {
  blockType: 'features';
  variant: 'compact' | 'trust' | 'numbered';
  sectionTitle?: string;
  items: Array<{ title: string; subtitle?: string; icon?: string }>;
  quote?: string;
}

export interface MarqueeBlock extends BaseBlock {
  blockType: 'marquee';
  text: string;
}

export interface RichTextBlock extends BaseBlock {
  blockType: 'richText';
  content: SerializedEditorState;
}

export interface ImageGalleryBlock extends BaseBlock {
  blockType: 'imageGallery';
  sectionTitle?: string;
  images: Array<{ image: Media; caption?: string }>;
}
