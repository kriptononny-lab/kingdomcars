import type { Block } from 'payload';

import { linkField } from '@/payload/fields/link';

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero blocks' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'titleLine1', type: 'text', required: true, localized: true },
    { name: 'titleLine2', type: 'text', localized: true },
    { name: 'titleHighlight', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { ...linkField, name: 'ctaPrimary', label: 'Primary CTA' },
    { ...linkField, name: 'ctaSecondary', label: 'Secondary CTA' },
  ],
};
