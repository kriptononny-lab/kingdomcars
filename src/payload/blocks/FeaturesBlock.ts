import type { Block } from 'payload';

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Features', plural: 'Features blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'compact',
      options: [
        { label: 'Compact (badges row)', value: 'compact' },
        { label: 'Trust (4-column icons)', value: 'trust' },
        { label: 'Numbered (large 01-06 grid)', value: 'numbered' },
      ],
    },
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'subtitle', type: 'text', localized: true },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Calendar', value: 'calendar' },
            { label: 'Clock', value: 'clock' },
            { label: 'Map', value: 'map' },
            { label: 'Check', value: 'check' },
            { label: 'Star', value: 'star' },
            { label: 'Shield', value: 'shield' },
            { label: 'File', value: 'file' },
          ],
        },
      ],
    },
    { name: 'quote', type: 'textarea', localized: true },
  ],
};
