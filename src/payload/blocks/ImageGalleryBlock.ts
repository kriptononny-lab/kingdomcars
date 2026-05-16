import type { Block } from 'payload';

export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Image gallery', plural: 'Image gallery blocks' },
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      maxRows: 24,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
  ],
};
