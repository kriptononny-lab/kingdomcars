import type { Block } from 'payload';

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 20,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
};
