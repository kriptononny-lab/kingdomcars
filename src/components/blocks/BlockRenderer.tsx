import { ContactFormBlockView } from '@/components/blocks/ContactFormBlock';
import { CountersBlockView } from '@/components/blocks/CountersBlock';
import { CTABlockView } from '@/components/blocks/CTABlock';
import { FAQBlockView } from '@/components/blocks/FAQBlock';
import { FeaturesBlockView } from '@/components/blocks/FeaturesBlock';
import { HeroBlockView } from '@/components/blocks/HeroBlock';
import { ImageGalleryBlockView } from '@/components/blocks/ImageGalleryBlock';
import { MapBlockView } from '@/components/blocks/MapBlock';
import { MarqueeBlockView } from '@/components/blocks/MarqueeBlock';
import { PricingBlockView } from '@/components/blocks/PricingBlock';
import { RichTextBlockView } from '@/components/blocks/RichTextBlock';
import { ServicesBlockView } from '@/components/blocks/ServicesBlock';
import { TestimonialsBlockView } from '@/components/blocks/TestimonialsBlock';
import type { PageBlock } from '@/types/blocks';

interface Props {
  block: PageBlock;
}

/**
 * Single dispatch point for all page-layout blocks. Discriminated by
 * `blockType` — adding a new block means:
 *   1. extend `PageBlock` union in `types/blocks.ts`
 *   2. add the schema in `payload/blocks/<Name>Block.ts` + register in `index.ts`
 *   3. add a case here
 *
 * TypeScript narrows `block` inside each branch automatically.
 */
export function BlockView({ block }: Props) {
  switch (block.blockType) {
    case 'hero': {
      return <HeroBlockView block={block} />;
    }
    case 'features': {
      return <FeaturesBlockView block={block} />;
    }
    case 'marquee': {
      return <MarqueeBlockView block={block} />;
    }
    case 'counters': {
      return <CountersBlockView block={block} />;
    }
    case 'services': {
      return <ServicesBlockView block={block} />;
    }
    case 'map': {
      return <MapBlockView block={block} />;
    }
    case 'pricing': {
      return <PricingBlockView block={block} />;
    }
    case 'contactForm': {
      return <ContactFormBlockView block={block} />;
    }
    case 'testimonials': {
      return <TestimonialsBlockView block={block} />;
    }
    case 'faq': {
      return <FAQBlockView block={block} />;
    }
    case 'richText': {
      return <RichTextBlockView block={block} />;
    }
    case 'imageGallery': {
      return <ImageGalleryBlockView block={block} />;
    }
    case 'cta': {
      return <CTABlockView block={block} />;
    }
    default: {
      const _exhaustive: never = block;
      void _exhaustive;
      return null;
    }
  }
}

interface ListProps {
  blocks: PageBlock[];
}

/**
 * Render an entire page layout. Each block keyed by Payload `id` if present,
 * falls back to index — Payload always provides `id` on array entries in practice.
 */
export function BlockList({ blocks }: ListProps) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={block.id ?? `${block.blockType}-${i}`} block={block} />
      ))}
    </>
  );
}
