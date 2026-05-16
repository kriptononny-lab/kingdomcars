/* eslint-disable */
import type { Metadata } from 'next';
import config from '@payload-config';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import '@payloadcms/next/css';
import { importMap } from './importMap';

type Args = { children: React.ReactNode };

export const metadata: Metadata = {
  title: 'KingdomCars admin',
  description: 'CMS for KingdomCars',
};

/**
 * Required since Payload 3 beta-128: the admin RootLayout now needs a
 * Server Function to handle form-state, field-validation, and similar
 * round-trips that used to hit /api/form-state. `handleServerFunctions`
 * is the single entry that dispatches them.
 *
 * @see https://github.com/payloadcms/payload/pull/8481
 */
const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;