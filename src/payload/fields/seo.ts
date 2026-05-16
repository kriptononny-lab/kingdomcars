import type { GroupField } from 'payload';

/**
 * Reusable SEO group used on Pages and any other publicly-visible document.
 * All text fields are localised so each locale can have its own meta (§6, §7).
 */
export const seoField: GroupField = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: '50–60 characters. Falls back to document title.' },
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: '120–160 characters.' },
      maxLength: 200,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '1200×630, JPG/PNG. Falls back to default OG.' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Block search engines from indexing this page.' },
    },
  ],
};
