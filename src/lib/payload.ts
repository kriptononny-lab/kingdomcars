import 'server-only';

import { getPayload, type Payload } from 'payload';

import config from '@/payload/payload.config';

let cached: Payload | null = null;

/**
 * Returns a shared Payload instance for the current process. `getPayload`
 * itself internally caches, but going through this wrapper keeps imports
 * uniform and gives a single place to add tracing/metrics later.
 */
export async function getPayloadInstance(): Promise<Payload> {
  if (cached) return cached;
  cached = await getPayload({ config });
  return cached;
}
