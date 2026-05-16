import type { Block } from 'payload';

export const MarqueeBlock: Block = {
  slug: 'marquee',
  labels: { singular: 'Marquee', plural: 'Marquee blocks' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Scrolling line under the hero. Separate phrases with `♔` for visual rhythm.',
      },
    },
  ],
};
