import { Star } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import type { TestimonialsBlock as TestimonialsBlockData } from '@/types/blocks/business';

interface Props {
  block: TestimonialsBlockData;
}

const MAX_RATING = 5;

function Stars({ rating }: { rating: number }) {
  const filled = Math.min(MAX_RATING, Math.max(0, rating));
  return (
    <div className="mb-3 flex gap-0.5" aria-label={`Rating: ${filled} out of ${MAX_RATING}`}>
      {Array.from({ length: filled }).map((_, j) => (
        <Star key={j} size={14} className="fill-gold text-gold" aria-hidden="true" />
      ))}
    </div>
  );
}

export function TestimonialsBlockView({ block }: Props) {
  return (
    <section id="reviews" className="py-20">
      <Container>
        <SectionHeader title={block.sectionTitle} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {block.items.map((item, i) => (
            <article
              key={i}
              className="bg-surface-card motion-safe:hover:border-gold/20 rounded-lg border border-white/5 p-7 transition-all duration-300"
            >
              <header className="mb-4 flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="from-gold to-gold-dark font-heading flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-black"
                >
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h5 className="text-[0.92rem] font-semibold">{item.name}</h5>
                  <span className="text-text-muted text-xs">{item.location}</span>
                </div>
              </header>
              <Stars rating={item.rating} />
              <p className="text-text-muted mb-3.5 text-sm leading-relaxed">{item.text}</p>
              {item.tag ? (
                <span className="bg-gold/10 text-gold mt-auto inline-block rounded px-2.5 py-1 text-xs font-semibold">
                  {item.tag}
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
