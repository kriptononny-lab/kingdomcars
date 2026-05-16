import { HeroBackdrop } from '@/components/blocks/hero-parts/HeroBackdrop';
import { HeroVan } from '@/components/blocks/hero-parts/HeroVan';
import { Container } from '@/components/layout/Container';
import { CTAButton } from '@/components/layout/CTAButton';
import type { LinkValue } from '@/types/blocks/common';
import type { HeroBlock as HeroBlockData } from '@/types/blocks/content';

interface Props {
  block: HeroBlockData;
}

function renderCta(cta: LinkValue | undefined, variant: 'primary' | 'secondary') {
  if (!cta?.label) return null;
  if (cta.kind === 'anchor' && cta.anchor) {
    return (
      <CTAButton href={`#${cta.anchor}`} variant={variant}>
        {cta.label}
      </CTAButton>
    );
  }
  if (cta.kind === 'external' && cta.url) {
    return (
      <CTAButton
        href={cta.url}
        variant={variant}
        target={cta.newTab ? '_blank' : undefined}
        rel="noopener"
      >
        {cta.label}
      </CTAButton>
    );
  }
  return (
    <CTAButton openCtaForm variant={variant}>
      {cta.label}
    </CTAButton>
  );
}

export function HeroBlockView({ block }: Props) {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden pt-[76px]">
      <HeroBackdrop />
      <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          {block.eyebrow ? (
            <div className="text-gold mb-5 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase">
              <span aria-hidden="true" className="bg-gold block h-[2px] w-8" />
              {block.eyebrow}
            </div>
          ) : null}
          <h1 className="font-heading mb-5 text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.15] font-semibold tracking-wider uppercase">
            {block.titleLine1}
            {block.titleLine2 ? (
              <>
                <br />
                {block.titleLine2}
              </>
            ) : null}
            {block.titleHighlight ? (
              <span className="text-gold"> {block.titleHighlight}</span>
            ) : null}
          </h1>
          {block.description ? (
            <p className="text-text-muted mb-9 max-w-[480px] text-lg leading-relaxed">
              {block.description}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-4">
            {renderCta(block.ctaPrimary, 'primary')}
            {renderCta(block.ctaSecondary, 'secondary')}
          </div>
        </div>
        <div className="hidden lg:block">
          <HeroVan />
        </div>
      </Container>
    </section>
  );
}
