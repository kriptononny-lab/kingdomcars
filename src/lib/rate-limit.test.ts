import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyEnv, restoreEnv, snapshotEnv } from '../../tests/fixtures/env-stubs';

let snap: ReturnType<typeof snapshotEnv>;

beforeEach(() => {
  vi.resetModules();
  snap = snapshotEnv();
  applyEnv();
});

afterEach(() => {
  restoreEnv(snap);
  vi.useRealTimers();
});

describe('checkContactRateLimit (in-memory)', () => {
  it('lets the first 3 requests through and blocks the 4th', async () => {
    const { checkContactRateLimit } = await import('./rate-limit');
    const r1 = await checkContactRateLimit('ip-a');
    const r2 = await checkContactRateLimit('ip-a');
    const r3 = await checkContactRateLimit('ip-a');
    const r4 = await checkContactRateLimit('ip-a');
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it('isolates buckets per key', async () => {
    const { checkContactRateLimit } = await import('./rate-limit');
    await checkContactRateLimit('ip-x');
    await checkContactRateLimit('ip-x');
    await checkContactRateLimit('ip-x');
    const other = await checkContactRateLimit('ip-y');
    expect(other.success).toBe(true);
    expect(other.remaining).toBeGreaterThan(0);
  });
});

describe('checkLoginRateLimit (in-memory)', () => {
  it('uses a different bucket prefix than contact limiter', async () => {
    const { checkContactRateLimit, checkLoginRateLimit } = await import('./rate-limit');
    const shared = 'shared-ip';
    await checkContactRateLimit(shared);
    await checkContactRateLimit(shared);
    await checkContactRateLimit(shared);
    const login = await checkLoginRateLimit(shared);
    expect(login.success).toBe(true);
  });

  it('allows 5 login attempts and blocks the 6th', async () => {
    const { checkLoginRateLimit } = await import('./rate-limit');
    const key = 'login-ip';
    for (let i = 0; i < 5; i++) {
      expect((await checkLoginRateLimit(key)).success).toBe(true);
    }
    expect((await checkLoginRateLimit(key)).success).toBe(false);
  });
});
