import { CompactGrid } from '@/components/blocks/features-parts/CompactGrid';
import { NumberedGrid } from '@/components/blocks/features-parts/NumberedGrid';
import { TrustGrid } from '@/components/blocks/features-parts/TrustGrid';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { cn } from '@/lib/utils';
import type { FeaturesBlock as FeaturesBlockData } from '@/types/blocks/content';

interface Props {
  block: FeaturesBlockData;
}

/**
 * Three rendering variants are switched by `block.variant`:
 *   - `compact`  → 3-col icon cards (CompactGrid)
 *   - `trust`    → 4-col trust strip (TrustGrid)
 *   - `numbered` → numbered process grid + optional pull-quote (NumberedGrid)
 *
 * Background and vertical padding are owned here; each variant only renders
 * its grid.
 */
export function FeaturesBlockView({ block }: Props) {
  return (
    <section
      id={block.variant === 'numbered' ? 'advantages' : undefined}
      className={cn(
        'py-28',
        block.variant === 'numbered' && 'bg-surface-section',
        block.variant === 'trust' && 'border-gold/5 bg-surface-section border-y py-14',
      )}
    >
      <Container>
        {block.sectionTitle ? <SectionHeader title={block.sectionTitle} /> : null}
        {block.variant === 'compact' ? <CompactGrid items={block.items} /> : null}
        {block.variant === 'trust' ? <TrustGrid items={block.items} /> : null}
        {block.variant === 'numbered' ? (
          <NumberedGrid items={block.items} quote={block.quote} />
        ) : null}
      </Container>
    </section>
  );
}
