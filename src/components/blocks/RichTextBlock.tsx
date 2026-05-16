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
    <section className="py-16">
      <Container className="prose prose-invert max-w-3xl">
        <RichText data={block.content} />
      </Container>
    </section>
  );
}
