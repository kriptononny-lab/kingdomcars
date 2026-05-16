import type { Block } from 'payload';

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact form', plural: 'Contact form blocks' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
  ],
};
