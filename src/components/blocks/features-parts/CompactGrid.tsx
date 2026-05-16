import { Icon, type IconKey } from '@/components/ui/Icon';
import type { FeaturesBlock as FeaturesBlockData } from '@/types/blocks/content';

interface Props {
  items: FeaturesBlockData['items'];
}

const ICON_FALLBACK: IconKey = 'check';

/**
 * Three-column compact grid: icon + title + subtitle in a horizontal card.
 * Used for short, scannable benefits (e.g. "fast", "secure", "24/7").
 */
export function CompactGrid({ items }: Props) {
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
