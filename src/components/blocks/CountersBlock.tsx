'use client';

import { AnimatedCounter } from '@/components/blocks/counter-parts/AnimatedCounter';
import { Container } from '@/components/layout/Container';
import type { CountersBlock as CountersBlockData } from '@/types/blocks/business';

interface Props {
  block: CountersBlockData;
}

/**
 * Animated counters. Client component because IntersectionObserver +
 * requestAnimationFrame can't run on the server.
 *
 * Reduced-motion users see the final value with no animation (handled in AnimatedCounter).
 */
export function CountersBlockView({ block }: Props) {
  return (
    <section className="bg-surface-section py-24">
      <Container className="grid grid-cols-2 gap-10 md:grid-cols-4">
        {block.items.map((item, i) => (
          <AnimatedCounter
            key={item.id ?? i}
            target={item.target}
            suffix={item.suffix}
            label={item.label}
          />
        ))}
      </Container>
    </section>
  );
}
