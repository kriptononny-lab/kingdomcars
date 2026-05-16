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
        <div
          key={i}
          className="border-gold/15 bg-surface-card motion-safe:hover:border-gold flex items-center gap-4 rounded-lg border p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 motion-safe:hover:-translate-y-1"
        >
          <div className="bg-gold/10 text-gold flex h-[52px] w-[52px] min-w-[52px] items-center justify-center rounded-full">
            <Icon name={(item.icon as IconKey) ?? ICON_FALLBACK} />
          </div>
          <div>
            <h4 className="font-heading mb-0.5 text-[0.95rem] font-semibold tracking-wider uppercase">
              {item.title}
            </h4>
            {item.subtitle ? <p className="text-text-muted text-xs">{item.subtitle}</p> : null}
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
            i < items.length - 1 && 'md:border-gold/10 md:border-r',
          )}
        >
          <Icon name={(item.icon as IconKey) ?? ICON_FALLBACK} size={32} className="text-gold" />
          <span className="font-heading text-sm font-semibold tracking-wider">{item.title}</span>
          {item.subtitle ? <span className="text-text-muted text-xs">{item.subtitle}</span> : null}
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
          <article
            key={i}
            className="motion-safe:hover:border-gold/25 relative overflow-hidden rounded-lg border border-white/5 p-9 pb-7 transition-all duration-300 motion-safe:hover:-translate-y-1"
          >
            <span
              aria-hidden="true"
              className="font-heading text-gold/[0.08] pointer-events-none absolute top-2 right-4 text-[4rem] leading-none font-bold select-none"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="font-heading relative mb-2 text-base font-semibold tracking-wider uppercase">
              {item.title}
            </h4>
            {item.subtitle ? (
              <p className="text-text-muted relative text-sm leading-relaxed">{item.subtitle}</p>
            ) : null}
          </article>
        ))}
      </div>
      {quote ? (
        <blockquote className="border-gold/20 bg-gold/[0.06] text-text-muted mt-10 rounded-lg border p-8 text-base leading-relaxed italic">
          {quote}
        </blockquote>
      ) : null}
    </>
  );
}

export function FeaturesBlockView({ block }: Props) {
  return (
    <section
      className={cn(
        'py-20',
        block.variant === 'numbered' && 'bg-surface-section',
        block.variant === 'trust' && 'border-gold/5 bg-surface-section border-y py-10',
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
