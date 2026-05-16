import { createHash } from 'node:crypto';

import type { CollectionBeforeChangeHook } from 'payload';

import { serverEnv } from '@/lib/env';

/**
 * Hash any incoming `ip` field with SHA-256 + server secret so we keep
 * the audit trail without storing PII in plain text (§13).
 *
 * The hash is deterministic per (ip + secret) so we can still group
 * repeat submissions from the same actor.
 */
export const hashIp: CollectionBeforeChangeHook = ({ data }) => {
  if (typeof data.ip === 'string' && data.ip.length > 0) {
    const salt = serverEnv.PAYLOAD_SECRET;
    data.ip = createHash('sha256').update(`${salt}:${data.ip}`).digest('hex').slice(0, 32);
  }
  return data;
};
