/* eslint-disable */
// AUTO-GENERATED-LIKE — minimal Payload admin route handler.
// Do NOT add custom logic here; extend via Payload config instead.

import type { Metadata } from 'next';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import config from '@payload-config';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap });

export default Page;
