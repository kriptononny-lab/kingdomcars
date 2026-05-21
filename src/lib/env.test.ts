import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyEnv, restoreEnv, snapshotEnv } from '@tests/fixtures/env-stubs';

let snap: ReturnType<typeof snapshotEnv>;

beforeEach(() => {
  vi.resetModules();
  snap = snapshotEnv();
});

afterEach(() => restoreEnv(snap));

describe('env parsing', () => {
  it('accepts a fully valid env', async () => {
    applyEnv();
    const mod = await import('./env');
    expect(mod.serverEnv.DATABASE_URL).toBe('postgres://u:p@h:5432/d');
    expect(mod.clientEnv.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
  });

  it('applies default LOG_LEVEL when omitted', async () => {
    applyEnv({}, ['LOG_LEVEL']);
    const mod = await import('./env');
    expect(mod.serverEnv.LOG_LEVEL).toBe('info');
  });

  it('throws when DATABASE_URL is missing', async () => {
    applyEnv({}, ['DATABASE_URL']);
    await expect(import('./env')).rejects.toThrow(/DATABASE_URL/);
  });

  it('throws when DATABASE_URL is not a URL', async () => {
    applyEnv({ DATABASE_URL: 'not-a-url' });
    await expect(import('./env')).rejects.toThrow(/DATABASE_URL/);
  });

  it('throws when PAYLOAD_SECRET is too short', async () => {
    applyEnv({ PAYLOAD_SECRET: 'short' });
    await expect(import('./env')).rejects.toThrow(/PAYLOAD_SECRET/);
  });

  it('throws when REVALIDATE_SECRET is too short', async () => {
    applyEnv({ REVALIDATE_SECRET: '1234' });
    await expect(import('./env')).rejects.toThrow(/REVALIDATE_SECRET/);
  });

  it('throws on invalid LOG_LEVEL', async () => {
    applyEnv({ LOG_LEVEL: 'shout' });
    await expect(import('./env')).rejects.toThrow(/LOG_LEVEL/);
  });

  it('accepts optional TELEGRAM_API_BASE override', async () => {
    applyEnv({ TELEGRAM_API_BASE: 'http://localhost:9999' });
    const mod = await import('./env');
    expect(mod.serverEnv.TELEGRAM_API_BASE).toBe('http://localhost:9999');
  });

  it('rejects malformed TELEGRAM_API_BASE', async () => {
    applyEnv({ TELEGRAM_API_BASE: 'not-a-url' });
    await expect(import('./env')).rejects.toThrow(/TELEGRAM_API_BASE/);
  });

  it('throws when NEXT_PUBLIC_SITE_URL is missing', async () => {
    applyEnv({}, ['NEXT_PUBLIC_SITE_URL']);
    await expect(import('./env')).rejects.toThrow(/client environment|NEXT_PUBLIC_SITE_URL/);
  });

  it('SKIP_ENV_VALIDATION=1 bypasses parsing entirely', async () => {
    // Missing DATABASE_URL would normally throw — with the flag it must not.
    applyEnv({ SKIP_ENV_VALIDATION: '1' }, ['DATABASE_URL']);
    await expect(import('./env')).resolves.toBeDefined();
  });
});
