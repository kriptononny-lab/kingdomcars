import type { MetadataRoute } from 'next';

import { clientEnv } from '@/lib/env';

/**
 * Dynamic robots.txt (§7). Disallows /admin (Payload UI) and /api (REST +
 * route handlers) — they're not crawl-worthy and surface secrets through
 * 401 messages that don't belong in search results. Sitemap is referenced
 * so search engines find it without a manual submission.
 */
export default function robots(): MetadataRoute.Robots {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
