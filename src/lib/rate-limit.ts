import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { CONTACT_RATE_LIMIT, LOGIN_RATE_LIMIT } from '@/lib/constants';
import { serverEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

/**
 * Normalised result returned by every rate-limit check.
 * `success: false` means the caller was throttled and should return 429.
 */
export interface RateLimitResult {
  /** Whether the request is allowed through. */
  success: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the window resets. */
  resetAt: number;
}

interface Policy {
  requests: number;
  windowSec: number;
  prefix: string;
}

const inMemoryStore = new Map<string, number[]>();

function inMemoryLimit(key: string, policy: Policy): RateLimitResult {
  const now = Date.now();
  const windowMs = policy.windowSec * 1000;
  const bucketKey = `${policy.prefix}:${key}`;
  const hits = (inMemoryStore.get(bucketKey) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= policy.requests) {
    return { success: false, remaining: 0, resetAt: (hits[0] ?? now) + windowMs };
  }
  hits.push(now);
  inMemoryStore.set(bucketKey, hits);
  return {
    success: true,
    remaining: policy.requests - hits.length,
    resetAt: now + windowMs,
  };
}

const upstashCache = new Map<string, Ratelimit>();

function getUpstashLimiter(policy: Policy): Ratelimit | null {
  const cached = upstashCache.get(policy.prefix);
  if (cached) return cached;
  if (!serverEnv.UPSTASH_REDIS_REST_URL || !serverEnv.UPSTASH_REDIS_REST_TOKEN) return null;
  const limiter = new Ratelimit({
    redis: new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(policy.requests, `${policy.windowSec} s`),
    analytics: false,
    prefix: policy.prefix,
  });
  upstashCache.set(policy.prefix, limiter);
  return limiter;
}

async function check(key: string, policy: Policy): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(policy);
  if (!limiter) {
    if (serverEnv.NODE_ENV === 'production') {
      logger.warn(
        { prefix: policy.prefix },
        'rate-limit running in-memory in production — set UPSTASH_REDIS_REST_*',
      );
    }
    return inMemoryLimit(key, policy);
  }
  const r = await limiter.limit(key);
  return { success: r.success, remaining: r.remaining, resetAt: r.reset };
}

const CONTACT_POLICY: Policy = {
  requests: CONTACT_RATE_LIMIT.REQUESTS,
  windowSec: CONTACT_RATE_LIMIT.WINDOW_SEC,
  prefix: 'kc:contact',
};

const LOGIN_POLICY: Policy = {
  requests: LOGIN_RATE_LIMIT.REQUESTS,
  windowSec: LOGIN_RATE_LIMIT.WINDOW_SEC,
  prefix: 'kc:login',
};

/**
 * Rate-limit check for the public contact form endpoint.
 *
 * @param key - Unique identifier for the caller (hashed IP address).
 * @returns `RateLimitResult` — call `.success` to decide whether to proceed.
 */
export function checkContactRateLimit(key: string): Promise<RateLimitResult> {
  return check(key, CONTACT_POLICY);
}

/** Brute-force protection on the Payload admin login (§13). 5 / 15min / IP. */
/**
 * Rate-limit check for the Payload admin login endpoint.
 * Stricter than the contact form: fewer requests, longer window.
 *
 * @param key - Unique identifier for the caller (hashed IP address).
 * @returns `RateLimitResult` — call `.success` to decide whether to proceed.
 */
export function checkLoginRateLimit(key: string): Promise<RateLimitResult> {
  return check(key, LOGIN_POLICY);
}
