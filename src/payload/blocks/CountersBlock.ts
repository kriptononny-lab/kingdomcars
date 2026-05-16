import type { Block } from 'payload';

export const CountersBlock: Block = {
  slug: 'counters',
  labels: { singular: 'Counters', plural: 'Counters blocks' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'target', type: 'number', required: true, min: 0 },
        {
          name: 'suffix',
          type: 'text',
          localized: true,
          admin: { description: 'e.g. `+`, `/7`, `%`' },
        },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
};
