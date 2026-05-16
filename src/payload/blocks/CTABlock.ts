import type { Block } from 'payload';

import { linkField } from '@/payload/fields/link';

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTA blocks' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'ctas',
      type: 'array',
      minRows: 0,
      maxRows: 3,
      fields: [linkField],
    },
  ],
};
