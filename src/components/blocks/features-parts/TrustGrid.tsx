import { Icon, type IconKey } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { FeaturesBlock as FeaturesBlockData } from '@/types/blocks/content';

interface Props {
  items: FeaturesBlockData['items'];
}

const ICON_FALLBACK: IconKey = 'check';

/**
 * Centred four-column row used as a "trust strip" above the fold:
 * licence badges, years-in-business, fleet size, coverage area.
 * Right-divider between cells (except the last) on tablet+.
 */
export function TrustGrid({ items }: Props) {
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
