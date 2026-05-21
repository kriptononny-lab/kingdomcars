import type { GlobalConfig } from 'payload';

import { REVALIDATE } from '@/lib/constants';
import { anyone } from '@/payload/access/anyone';
import { isAdmin } from '@/payload/access/is-admin';
import { linkField } from '@/payload/fields/link';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-page';

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange(REVALIDATE.TAG_HEADER)] },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation items',
      localized: true,
      minRows: 0,
      maxRows: 10,
      fields: [linkField],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Get a quote',
      admin: { description: 'CTA button text in the header.' },
    },
  ],
};
