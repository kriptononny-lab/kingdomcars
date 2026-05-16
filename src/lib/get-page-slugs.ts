import 'server-only';

import type { Locale } from '@/lib/constants';
import { getPayloadInstance } from '@/lib/payload';

/**
 * List slugs of every published Page in a locale — used by
 * `generateStaticParams` on the catch-all route for build-time SSG.
 */
export async function getAllPageSlugs(locale: Locale): Promise<string[]> {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: 'pages',
    locale,
    depth: 0,
    limit: 1000,
    pagination: false,
  });
  return result.docs
    .map((d) => (d as { slug?: unknown }).slug)
    .filter((s): s is string => typeof s === 'string' && s.length > 0);
}
