import { RichText } from '@payloadcms/richtext-lexical/react';

import { Container } from '@/components/layout/Container';
import type { RichTextBlock as RichTextBlockData } from '@/types/blocks/content';

interface Props {
  block: RichTextBlockData;
}

/**
 * Render Payload Lexical content. The default React converter handles
 * headings, lists, links, code, etc. — no custom renderer needed yet.
 */
export function RichTextBlockView({ block }: Props) {
  return (
    <section className="py-12 md:py-16">
      <Container className="[&_h2]:font-heading [&_h2]:text-gold [&_h3]:font-heading [&_h3]:text-text-primary [&_p]:text-text-muted [&_ul]:text-text-muted [&_a]:text-gold max-w-3xl [&_a]:break-words [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-wider [&_h2]:uppercase [&_h2]:md:mt-10 [&_h2]:md:mb-4 [&_h2]:md:text-2xl [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:md:mt-8 [&_h3]:md:mb-3 [&_h3]:md:text-lg [&_p]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:md:mb-4 [&_p]:md:text-base [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:md:pl-6 [&_ul]:md:text-base">
        <RichText data={block.content} />
      </Container>
    </section>
  );
}
