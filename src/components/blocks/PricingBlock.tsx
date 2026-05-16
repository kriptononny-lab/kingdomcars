import { PeopleIcon } from '@/components/blocks/pricing-parts/PeopleIcon';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import type { PricingBlock as PricingBlockData } from '@/types/blocks/business';

interface Props {
  block: PricingBlockData;
}

const COUNTS: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

export function PricingBlockView({ block }: Props) {
  return (
    <section id="pricing" className="py-20">
      <Container>
        <SectionHeader title={block.sectionTitle} />
        <div className="mb-7 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {block.items.map((item, i) => {
            const count = COUNTS[i] ?? 4;
            return (
              <article
                key={i}
                className="rounded-lg border border-white/5 bg-surface-card p-9 text-center transition-all duration-300 motion-safe:hover:scale-[1.04] motion-safe:hover:border-gold"
              >
                <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-lg bg-gold text-black">
                  <PeopleIcon count={count} />
                </div>
                <h4 className="mb-2 font-heading text-sm uppercase tracking-wider text-text-muted">
                  {item.people}
                </h4>
                <div className="font-heading text-3xl font-bold">
                  <span className="mr-1 text-sm font-normal text-text-muted">od</span>
                  {item.price}
                  <small className="ml-1 text-base font-normal text-text-muted">{item.unit}</small>
                </div>
              </article>
            );
          })}
        </div>
        {block.note ? (
          <p className="mx-auto w-fit rounded-lg border border-gold/20 px-6 py-2.5 text-center text-sm italic text-text-muted">
            {block.note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
