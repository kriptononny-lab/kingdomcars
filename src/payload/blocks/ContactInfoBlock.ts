import type { Block } from 'payload';

/**
 * Contact info section — pulls phone/email/address/hours from SiteSettings
 * global at render time. Only block-specific overrides (title, map URL)
 * are stored here so contact data stays in a single place.
 */
export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  labels: { singular: 'Contact info', plural: 'Contact info blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true, localized: true },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: {
        description: 'Google Maps embed URL (iframe src). Leave empty to hide the map.',
      },
    },
  ],
};
