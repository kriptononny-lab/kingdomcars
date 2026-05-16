import type { GlobalConfig } from 'payload';

import { REVALIDATE } from '@/lib/constants';
import { anyone } from '@/payload/access/anyone';
import { isAdmin } from '@/payload/access/is-admin';
import { linkField } from '@/payload/fields/link';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-page';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange(REVALIDATE.TAG_FOOTER)] },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Column', plural: 'Columns' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [linkField],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      defaultValue: '© KingdomCars',
    },
    {
      name: 'legalLinks',
      type: 'array',
      labels: { singular: 'Legal link', plural: 'Legal links' },
      maxRows: 5,
      fields: [linkField],
    },
  ],
};
