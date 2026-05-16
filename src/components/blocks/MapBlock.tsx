import { PolandMap } from '@/components/blocks/map-parts/PolandMap';
import { Container } from '@/components/layout/Container';
import type { MapBlock as MapBlockData } from '@/types/blocks/business';

interface Props {
  block: MapBlockData;
}

export function MapBlockView({ block }: Props) {
  return (
    <section className="bg-surface-section relative overflow-hidden py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span aria-hidden="true" className="bg-gold block h-1 w-12 rounded-sm" />
              <span className="font-heading text-text-muted text-sm font-semibold tracking-wider uppercase">
                {block.sectionLabel}
              </span>
            </div>
            <h3 className="font-heading mb-5 text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-semibold tracking-wider uppercase">
              {block.titleLine1} <span className="text-gold">{block.titleHighlight}</span>
            </h3>
            <p className="text-text-muted mb-6 text-base leading-relaxed">{block.description}</p>
            <ul className="flex flex-wrap gap-2">
              {block.cities.map((city) => (
                <li
                  key={city}
                  className="border-gold/20 bg-gold/[0.08] text-gold rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wider"
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
