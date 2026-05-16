import type { Block } from 'payload';

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'location', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', required: true, localized: true },
        { name: 'tag', type: 'text', localized: true },
        {
          name: 'rating',
          type: 'number',
          required: true,
          defaultValue: 5,
          min: 1,
          max: 5,
        },
      ],
    },
  ],
};
