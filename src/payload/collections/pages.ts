import type { CollectionConfig } from 'payload';

import { isAdmin } from '@/payload/access/is-admin';
import { publishedOnly } from '@/payload/access/published-only';
import { pageBlocks } from '@/payload/blocks';
import { seoField } from '@/payload/fields/seo';
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '@/payload/hooks/revalidate-page';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) =>
        `/${locale.code}${data?.slug === 'home' || !data?.slug ? '' : `/${String(data.slug)}`}?preview=true`,
    },
  },
  access: {
    read: publishedOnly,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    readVersions: isAdmin,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      localized: true,
      admin: {
        description:
          '`home` for the landing page; otherwise URL-safe per locale (e.g. `o-nas` for PL, `about` for EN).',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page layout',
      minRows: 0,
      blocks: pageBlocks,
    },
    seoField,
  ],
};
