import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import type { ImageGalleryBlock as ImageGalleryBlockData } from '@/types/blocks/content';

interface Props {
  block: ImageGalleryBlockData;
}

const FALLBACK_W = 1200;
const FALLBACK_H = 800;

/**
 * Responsive image grid. Uses Payload's `sizes.card` (768×512) variant.
 * Sizes attribute is tuned to the layout: ~33vw at lg, full width on mobile.
 */
export function ImageGalleryBlockView({ block }: Props) {
  return (
    <section className="py-20">
      <Container>
        {block.sectionTitle ? <SectionHeader title={block.sectionTitle} /> : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.images.map((entry, i) => {
            const src = entry.image.sizes?.card?.url ?? entry.image.url;
            return (
              <figure key={i} className="overflow-hidden rounded-lg border border-white/5">
                <Image
                  src={src}
                  alt={entry.image.alt ?? ''}
                  width={entry.image.sizes?.card?.width ?? FALLBACK_W}
                  height={entry.image.sizes?.card?.height ?? FALLBACK_H}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full"
                />
                {entry.caption ? (
                  <figcaption className="bg-surface-card text-text-muted px-4 py-3 text-sm">
                    {entry.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
