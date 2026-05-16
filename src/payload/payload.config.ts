import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';
import { serverEnv } from '@/lib/env';
import { FormSubmissions } from '@/payload/collections/form-submissions';
import { Media } from '@/payload/collections/media';
import { Pages } from '@/payload/collections/pages';
import { Redirects } from '@/payload/collections/redirects';
import { Users } from '@/payload/collections/users';
import { Footer } from '@/payload/globals/footer';
import { Header } from '@/payload/globals/header';
import { SiteSettings } from '@/payload/globals/site-settings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  serverURL: serverEnv.PAYLOAD_PUBLIC_SERVER_URL,
  secret: serverEnv.PAYLOAD_SECRET,
  cors: [serverEnv.PAYLOAD_PUBLIC_SERVER_URL],
  csrf: [serverEnv.PAYLOAD_PUBLIC_SERVER_URL],
  // Sharp powers automatic image resize/format conversion for the Media
  // collection (thumbnail/card/og/hero sizes). Without this, Payload logs
  // the "Image resizing is enabled but sharp not installed" warning even
  // though the package is present.
  sharp,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — KingdomCars admin' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: serverEnv.DATABASE_URL } }),
  localization: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [Users, Pages, Media, FormSubmissions, Redirects],
  globals: [SiteSettings, Header, Footer],
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, '../payload-types.ts') },
  telemetry: false,
});
