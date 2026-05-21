import type { FeaturesBlock as FeaturesBlockData } from '@/types/blocks/content';

interface Props {
  items: FeaturesBlockData['items'];
  quote?: string;
}

/**
 * Numbered article grid for "process / how we work" sections.
 * Faded oversized numeral sits behind each card; optional pull-quote
 * renders below the grid.
 */
export function NumberedGrid({ items, quote }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
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
            <h4 className="font-heading relative mb-3 text-base font-semibold tracking-wider uppercase">
              {item.title}
            </h4>
            {item.subtitle ? (
              <p className="text-text-muted relative text-sm leading-relaxed">{item.subtitle}</p>
            ) : null}
          </article>
        ))}
      </div>
      {quote ? (
        <blockquote className="border-gold/20 bg-gold/[0.06] text-text-muted mt-14 rounded-lg border p-8 text-base leading-relaxed italic">
          {quote}
        </blockquote>
      ) : null}
    </>
  );
}
