import type { CollectionConfig } from 'payload';

import { isAdmin } from '@/payload/access/is-admin';
import { hashIp } from '@/payload/hooks/hash-ip';

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Submission', plural: 'Form submissions' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'locale', 'createdAt'],
    description: 'Contact form submissions. IP is stored hashed (SHA-256 + secret).',
  },
  access: {
    // Submissions are created by a server action with elevated privileges,
    // never by an authenticated browser user — so create = nobody.
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [hashIp],
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: false },
    { name: 'phone', type: 'text', required: true, maxLength: 32 },
    { name: 'message', type: 'textarea', required: false, maxLength: 2000 },
    {
      name: 'service',
      type: 'text',
      admin: { description: 'Selected service category (apartment/office/...).' },
    },
    {
      name: 'people',
      type: 'text',
      admin: { description: 'Selected crew size (1/2/3/3+).' },
    },
    {
      name: 'locale',
      type: 'select',
      options: ['pl', 'en', 'ru'],
      required: true,
    },
    {
      name: 'ip',
      type: 'text',
      admin: { description: 'Hashed (SHA-256). Original IP is never stored.', readOnly: true },
    },
    { name: 'userAgent', type: 'text', admin: { readOnly: true } },
  ],
};
