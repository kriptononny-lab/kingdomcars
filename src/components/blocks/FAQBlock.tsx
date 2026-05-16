import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/seo';
import type { FAQBlock as FAQBlockData } from '@/types/blocks/business';

interface Props {
  block: FAQBlockData;
}

/**
 * FAQ rendered as native <details>/<summary> — fully accessible, no JS needed.
 * Emits `FAQPage` JSON-LD inline so Google can surface FAQ rich results from
 * this section (§7). Scoped to this block instance only — multiple FAQ
 * blocks on the same page each get their own JSON-LD which is fine.
 */
export function FAQBlockView({ block }: Props) {
  return (
    <section className="py-20">
      <JsonLd data={faqPageJsonLd(block.items)} />
      <Container>
        <SectionHeader title={block.sectionTitle} />
        <div className="mx-auto max-w-3xl space-y-3">
          {block.items.map((item) => (
            <details
              key={item.id ?? item.question}
              className="group bg-surface-card open:border-gold/20 rounded-lg border border-white/5 p-5 transition-colors duration-200"
            >
              <summary className="font-heading flex cursor-pointer items-center justify-between gap-4 text-base font-semibold tracking-wider uppercase [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-gold transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-text-muted mt-3 text-sm leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
