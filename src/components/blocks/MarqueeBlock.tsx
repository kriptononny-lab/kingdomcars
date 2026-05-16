import type { MarqueeBlock as MarqueeBlockData } from '@/types/blocks/content';

interface Props {
  block: MarqueeBlockData;
}

/**
 * Continuously-scrolling banner under the hero. CSS-only animation
 * — no JS, so this stays a Server Component.
 *
 * Reduced-motion users see a static line (animation disabled in globals.css).
 */
export function MarqueeBlockView({ block }: Props) {
  const text = block.text;
  return (
    <div className="bg-gold overflow-hidden py-3" aria-label={text}>
      <div
        className="flex w-max whitespace-nowrap will-change-transform"
        style={{ animation: 'marquee 30s linear infinite' }}
        aria-hidden="true"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="font-heading px-8 text-sm font-bold tracking-[0.15em] text-black uppercase"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
