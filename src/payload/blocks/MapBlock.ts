import type { Block } from 'payload';

export const MapBlock: Block = {
  slug: 'map',
  labels: { singular: 'Map', plural: 'Map blocks' },
  fields: [
    { name: 'sectionLabel', type: 'text', required: true, localized: true },
    { name: 'titleLine1', type: 'text', required: true, localized: true },
    { name: 'titleHighlight', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    {
      name: 'cities',
      type: 'array',
      minRows: 0,
      fields: [{ name: 'name', type: 'text', required: true, localized: true }],
    },
  ],
};
