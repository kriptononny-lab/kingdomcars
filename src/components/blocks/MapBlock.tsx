import { PolandMap } from '@/components/blocks/map-parts/PolandMap';
import { Container } from '@/components/layout/Container';
import type { MapBlock as MapBlockData } from '@/types/blocks/business';

interface Props {
  block: MapBlockData;
}

export function MapBlockView({ block }: Props) {
  return (
    <section className="relative overflow-hidden bg-surface-section py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span aria-hidden="true" className="block h-1 w-12 rounded-sm bg-gold" />
              <span className="font-heading text-sm font-semibold uppercase tracking-wider text-text-muted">
                {block.sectionLabel}
              </span>
            </div>
            <h3 className="mb-5 font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-semibold uppercase leading-tight tracking-wider">
              {block.titleLine1} <span className="text-gold">{block.titleHighlight}</span>
            </h3>
            <p className="mb-6 text-base leading-relaxed text-text-muted">{block.description}</p>
            <ul className="flex flex-wrap gap-2">
              {block.cities.map((city) => (
                <li
                  key={city}
                  className="rounded-full border border-gold/20 bg-gold/[0.08] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-gold"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <PolandMap />
          </div>
        </div>
      </Container>
    </section>
  );
}
