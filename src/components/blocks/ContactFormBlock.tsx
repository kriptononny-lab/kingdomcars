import { ContactForm } from '@/components/features/ContactForm';
import { Container } from '@/components/layout/Container';
import type { ContactFormBlock as ContactFormBlockData } from '@/types/blocks/cta';

interface Props {
  block: ContactFormBlockData;
}

export function ContactFormBlockView({ block }: Props) {
  return (
    <section id="contact-form" className="bg-gold relative overflow-hidden py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading mb-2 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-wider text-black uppercase">
            {block.title}
          </h2>
          {block.subtitle ? <p className="mb-7 text-black/70">{block.subtitle}</p> : null}
        </div>
        <div className="max-w-[460px]">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
