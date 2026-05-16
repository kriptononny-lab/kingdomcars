import type { CollectionConfig } from 'payload';

import { anyone } from '@/payload/access/anyone';
import { isAdmin } from '@/payload/access/is-admin';

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirects' },
  admin: {
    group: 'Admin',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Source path, e.g. `/old-services`. No host.' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'Target path or absolute URL.' },
    },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 Permanent', value: '301' },
        { label: '302 Temporary', value: '302' },
        { label: '308 Permanent (preserves method)', value: '308' },
      ],
      required: true,
    },
  ],
};
