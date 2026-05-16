/**
 * Minimal Lexical-state builders for seed data. Real editing happens in the
 * Payload admin — these helpers exist only to bootstrap pages with valid
 * non-empty content.
 */

interface LexicalText {
  type: 'text';
  text: string;
  format: number;
  style: string;
  mode: 'normal';
  detail: number;
  version: 1;
}

interface LexicalNode {
  type: string;
  format: '' | number;
  indent: 0;
  version: 1;
  children: Array<LexicalText | LexicalNode>;
  direction: 'ltr';
  tag?: string;
  textFormat?: 0;
}

interface LexicalRoot {
  root: LexicalNode;
}

function textNode(text: string): LexicalText {
  return { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 };
}

function paragraph(text: string): LexicalNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [textNode(text)],
    direction: 'ltr',
    textFormat: 0,
  };
}

function heading(text: string, level: 1 | 2 | 3): LexicalNode {
  return {
    type: 'heading',
    tag: `h${level}`,
    format: '',
    indent: 0,
    version: 1,
    children: [textNode(text)],
    direction: 'ltr',
  };
}

export function lexicalDoc(blocks: Array<{ kind: 'h2' | 'h3' | 'p'; text: string }>): LexicalRoot {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: blocks.map((b) =>
        b.kind === 'p' ? paragraph(b.text) : heading(b.text, b.kind === 'h2' ? 2 : 3),
      ),
    },
  };
}
