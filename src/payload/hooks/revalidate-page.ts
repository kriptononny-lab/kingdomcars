import { revalidateTag } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload';

import { LOCALES, REVALIDATE } from '@/lib/constants';

/**
 * Invalidate cached page output when a Page document changes (§17).
 *
 * Wrapped in try/catch because `revalidateTag` requires Next.js runtime
 * context (static generation store) — when called from a CLI seed/migration
 * script it throws "Invariant: static generation store missing". Outside
 * Next runtime we just no-op silently; in Next runtime the call succeeds.
 */
function safeRevalidate(tag: string): void {
  try {
    // Next 16 requires a cacheLife profile. `'max'` keeps the previous
    // stale-while-revalidate behaviour. For instant expiration in Server
    // Actions, the spec recommends `updateTag()` instead — we don't need
    // that here because Payload hooks run server-side after persist.
    revalidateTag(tag, 'max');
  } catch {
    // Outside Next runtime (seed scripts, payload CLI) — ignore.
  }
}

function flushPagesCache(): void {
  safeRevalidate(REVALIDATE.TAG_PAGES);
  for (const locale of LOCALES) {
    safeRevalidate(`${REVALIDATE.TAG_PAGES}:${locale}`);
  }
}

export const revalidatePageAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  flushPagesCache();
  return doc;
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  flushPagesCache();
  return doc;
};

export const revalidateGlobalAfterChange =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(tag);
    return doc;
  };
