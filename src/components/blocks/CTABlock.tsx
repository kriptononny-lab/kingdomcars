import { Container } from '@/components/layout/Container';
import { CTAButton } from '@/components/layout/CTAButton';
import type { LinkValue } from '@/types/blocks/common';
import type { CTABlock as CTABlockData } from '@/types/blocks/cta';

interface Props {
  block: CTABlockData;
}

function ctaHref(link: LinkValue): string | undefined {
  if (link.kind === 'anchor' && link.anchor) return `#${link.anchor}`;
  if (link.kind === 'external' && link.url) return link.url;
  return undefined;
}

export function CTABlockView({ block }: Props) {
  return (
    <section className="bg-gold py-16">
      <Container className="text-center">
        <h2 className="font-heading mb-3 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-wider text-black uppercase">
          {block.title}
        </h2>
        {block.body ? <p className="mx-auto mb-7 max-w-2xl text-black/70">{block.body}</p> : null}
        {block.ctas && block.ctas.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {block.ctas.map((entry, i) => {
              const { link } = entry;
              const href = ctaHref(link);
              if (href) {
                return (
                  <CTAButton
                    key={entry.id ?? i}
                    href={href}
                    variant={i === 0 ? 'primary' : 'secondary'}
                    target={link.kind === 'external' && link.newTab ? '_blank' : undefined}
                    rel={link.kind === 'external' ? 'noopener' : undefined}
                  >
                    {link.label}
                  </CTAButton>
                );
              }
              return (
                <CTAButton
                  key={entry.id ?? i}
                  openCtaForm
                  variant={i === 0 ? 'primary' : 'secondary'}
                >
                  {link.label}
                </CTAButton>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
