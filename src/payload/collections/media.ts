import type { CollectionConfig } from 'payload';

import { anyone } from '@/payload/access/anyone';
import { isAdmin } from '@/payload/access/is-admin';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'payload-media',
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 80 } },
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 240, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: false,
      admin: {
        description: 'Describe the image for screen readers. Leave blank for decorative images.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
};
