import type { GroupField } from 'payload';

/**
 * Reusable link field — covers both internal page refs and external URLs.
 * Used by Header/Footer navigation and CTA blocks (§6).
 */
export const linkField: GroupField = {
  name: 'link',
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
    },
    {
      name: 'kind',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Internal (page)', value: 'internal' },
        { label: 'External URL', value: 'external' },
        { label: 'Anchor on current page', value: 'anchor' },
      ],
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { condition: (_, siblingData) => siblingData?.kind === 'internal' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.kind === 'external' },
    },
    {
      name: 'anchor',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'anchor',
        description: 'Section id without `#`, e.g. `services`.',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
      admin: { condition: (_, siblingData) => siblingData?.kind === 'external' },
    },
  ],
};
