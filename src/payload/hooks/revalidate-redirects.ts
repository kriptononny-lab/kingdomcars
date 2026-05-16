import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

import { REVALIDATE } from '@/lib/constants';

/**
 * Invalidate the redirects cache when an admin creates / edits / deletes a
 * rule in the `Redirects` collection. The cache (see `lib/get-redirects.ts`)
 * is loaded once per request bucket and survives until a new write here
 * flips the tag, so the proxy can do O(1) lookups without per-request DB
 * hits.
 *
 * Wrapped in try/catch — Payload hooks also run from CLI scripts (seed /
 * migrate) where `revalidateTag` has no Next.js static-generation store
 * and throws an Invariant. We no-op silently there; in Next runtime the
 * tag flips normally.
 */
function safeRevalidate(): void {
  try {
    revalidateTag(REVALIDATE.TAG_REDIRECTS, 'max');
  } catch {
    // Outside Next runtime — ignore.
  }
}

export const revalidateRedirectsAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate();
  return doc;
};

export const revalidateRedirectsAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate();
  return doc;
};
