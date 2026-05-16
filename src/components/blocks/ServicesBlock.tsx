import { ServiceIcon } from '@/components/blocks/services-parts/ServiceIcon';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import type { ServicesBlock as ServicesBlockData } from '@/types/blocks/business';

interface Props {
  block: ServicesBlockData;
}

export function ServicesBlockView({ block }: Props) {
  return (
    <section id="services" className="py-20">
      <Container>
        <SectionHeader title={block.sectionTitle} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <article
              key={i}
              className="group bg-surface-card flex flex-col overflow-hidden rounded-lg border border-white/5 transition-all duration-300 motion-safe:hover:shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,168,37,0.3)]"
            >
              <div className="flex h-[200px] items-center justify-center overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 motion-safe:group-hover:scale-105">
                  <ServiceIcon kind={item.iconKey} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <h3 className="font-heading text-[0.95rem] font-semibold tracking-wider uppercase">
                  {item.title}
                </h3>
                {/*
                  `aria-label` guarantees an accessible name even if a Payload
                  editor accidentally empties the `cta` field — STEP_12_KNOWN_ISSUES #1.
                  Visible text falls through to `item.title` for the same reason.
                */}
                <button
                  type="button"
                  data-cta-open="true"
                  data-cta-service={item.iconKey}
                  aria-label={item.cta || item.title}
                  className="bg-gold font-heading motion-safe:hover:bg-gold-light mt-auto min-h-[44px] w-full rounded-lg px-4 py-2.5 text-[0.82rem] font-semibold tracking-wider text-black uppercase transition-all duration-300"
                >
                  {item.cta || item.title}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
