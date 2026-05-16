import bundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { staticSecurityHeaders } from './src/lib/security-headers';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/**
 * Production hostname for `next/image` allow-listing. Falls back at build
 * time to the public site host so dev still works; in production CI we
 * require the env var explicitly via `lib/env.ts`.
 */
const imageRemoteHost =
  process.env.NEXT_PUBLIC_SITE_HOST ?? process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  reactCompiler: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: imageRemoteHost
      ? [{ protocol: 'https', hostname: imageRemoteHost }]
      : [],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: '/(.*)', headers: [...staticSecurityHeaders] }];
  },
  async redirects() {
    return [];
  },
  logging: {
    fetches: { fullUrl: false },
  },
};

const composed = withBundleAnalyzer(withNextIntl(withPayload(nextConfig)));

/**
 * Sentry wrapper — uploads source maps at build time, sets `tunnelRoute`
 * so browser uploads to `/sentry-tunnel/...` proxy through our domain (ad
 * blockers strip raw `sentry.io` requests, which gives misleadingly low
 * error counts).
 *
 * `silent: !CI` keeps local builds quiet but lets CI surface upload issues.
 * `widenClientFileUpload: true` ensures source maps cover client chunks.
 */
export default withSentryConfig(composed, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/sentry-tunnel',
  disableLogger: true,
  telemetry: false,
});
