import type { Block } from 'payload';

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services', plural: 'Services blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'cta', type: 'text', required: true, localized: true },
        {
          name: 'iconKey',
          type: 'select',
          required: true,
          options: [
            { label: 'Apartment', value: 'apartment' },
            { label: 'Warehouse', value: 'warehouse' },
            { label: 'Trash removal', value: 'trash' },
            { label: 'Office', value: 'office' },
          ],
        },
      ],
    },
  ],
};
