import type { Block } from 'payload';

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Pricing', plural: 'Pricing blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'people', type: 'text', required: true, localized: true },
        { name: 'price', type: 'text', required: true },
        { name: 'unit', type: 'text', required: true, localized: true },
      ],
    },
    { name: 'note', type: 'text', localized: true },
  ],
};
