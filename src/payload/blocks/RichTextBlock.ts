import type { Block } from 'payload';

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich text', plural: 'Rich text blocks' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
};
