import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Icon, type IconKey } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { FeaturesBlock as FeaturesBlockData } from '@/types/blocks/content';

interface Props {
  block: FeaturesBlockData;
}

const ICON_FALLBACK: IconKey = 'check';

function CompactGrid({ items }: { items: FeaturesBlockData['items'] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-gold/15 bg-surface-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-gold">
          <div className="flex h-[52px] w-[52px] min-w-[52px] items-center justify-center rounded-full bg-gold/10 text-gold">
            <Icon name={(item.icon as IconKey) ?? ICON_FALLBACK} />
          </div>
          <div>
            <h4 className="mb-0.5 font-heading text-[0.95rem] font-semibold uppercase tracking-wider">{item.title}</h4>
            {item.subtitle ? <p className="text-xs text-text-muted">{item.subtitle}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function TrustGrid({ items }: { items: FeaturesBlockData['items'] }) {
  return (
    <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center gap-2 p-3 text-center',
            i < items.length - 1 && 'md:border-r md:border-gold/10',
          )}
        >
          <Icon name={(item.icon as IconKey) ?? ICON_FALLBACK} size={32} className="text-gold" />
          <span className="font-heading text-sm font-semibold tracking-wider">{item.title}</span>
          {item.subtitle ? <span className="text-xs text-text-muted">{item.subtitle}</span> : null}
        </div>
      ))}
    </div>
  );
}

function NumberedGrid({ items, quote }: { items: FeaturesBlockData['items']; quote?: string }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <article key={i} className="relative overflow-hidden rounded-lg border border-white/5 p-9 pb-7 transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-gold/25">
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-2 select-none font-heading text-[4rem] font-bold leading-none text-gold/[0.08]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="relative mb-2 font-heading text-base font-semibold uppercase tracking-wider">{item.title}</h4>
            {item.subtitle ? <p className="relative text-sm leading-relaxed text-text-muted">{item.subtitle}</p> : null}
          </article>
        ))}
      </div>
      {quote ? (
        <blockquote className="mt-10 rounded-lg border border-gold/20 bg-gold/[0.06] p-8 text-base italic leading-relaxed text-text-muted">
          {quote}
        </blockquote>
      ) : null}
    </>
  );
}

export function FeaturesBlockView({ block }: Props) {
  return (
    <section className={cn('py-20', block.variant === 'numbered' && 'bg-surface-section', block.variant === 'trust' && 'border-y border-gold/5 bg-surface-section py-10')}>
      <Container>
        {block.sectionTitle ? <SectionHeader title={block.sectionTitle} /> : null}
        {block.variant === 'compact' ? <CompactGrid items={block.items} /> : null}
        {block.variant === 'trust' ? <TrustGrid items={block.items} /> : null}
        {block.variant === 'numbered' ? <NumberedGrid items={block.items} quote={block.quote} /> : null}
      </Container>
    </section>
  );
}
