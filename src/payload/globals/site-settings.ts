import type { GlobalConfig } from 'payload';

import { REVALIDATE } from '@/lib/constants';
import { anyone } from '@/payload/access/anyone';
import { isAdmin } from '@/payload/access/is-admin';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-page';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange(REVALIDATE.TAG_SETTINGS)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            { name: 'phonePrimary', type: 'text' },
            { name: 'phoneSecondary', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'text', localized: true },
            { name: 'hours', type: 'text', localized: true },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'googleBusiness', type: 'text' },
          ],
        },
        {
          label: 'Defaults',
          fields: [
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            { name: 'organisationName', type: 'text', defaultValue: 'KingdomCars' },
          ],
        },
      ],
    },
  ],
};
