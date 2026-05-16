import { beforeEach, describe, expect, it, vi } from 'vitest';

const ENV = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://u:p@h:5432/d',
  PAYLOAD_SECRET: 'a'.repeat(32),
  PAYLOAD_PUBLIC_SERVER_URL: 'http://localhost:3000',
  REVALIDATE_SECRET: 'a'.repeat(20),
  TELEGRAM_BOT_TOKEN: 'tok',
  TELEGRAM_CHAT_ID: '123',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SITE_HOST: 'localhost',
  LOG_LEVEL: 'silent',
};

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
});

function makeHeaders(map: Record<string, string>) {
  return {
    get(name: string): string | null {
      return map[name.toLowerCase()] ?? null;
    },
  };
}

describe('getRequestId', () => {
  it('returns the incoming id when valid', async () => {
    const { getRequestId } = await import('./logger');
    expect(getRequestId(makeHeaders({ 'x-request-id': 'abc-123' }))).toBe('abc-123');
  });

  it('accepts uuid-shaped ids', async () => {
    const { getRequestId } = await import('./logger');
    const id = 'eea7f6c7-ab5e-4ac1-9176-a61e342cf17e';
    expect(getRequestId(makeHeaders({ 'x-request-id': id }))).toBe(id);
  });

  it('replaces ids with disallowed characters', async () => {
    const { getRequestId } = await import('./logger');
    const r = getRequestId(makeHeaders({ 'x-request-id': 'bad id!@#' }));
    expect(r).not.toBe('bad id!@#');
    expect(r).toMatch(/^[\w.:-]+$/);
  });

  it('replaces ids longer than 128 chars', async () => {
    const { getRequestId } = await import('./logger');
    const long = 'a'.repeat(200);
    expect(getRequestId(makeHeaders({ 'x-request-id': long }))).not.toBe(long);
  });

  it('generates a UUID when the header is missing', async () => {
    const { getRequestId } = await import('./logger');
    const r = getRequestId(makeHeaders({}));
    expect(r).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('generates a UUID when headers object is undefined', async () => {
    const { getRequestId } = await import('./logger');
    expect(getRequestId()).toMatch(/^[0-9a-f-]+$/);
  });
});

describe('loggerFromHeaders', () => {
  it('returns a tagged child logger', async () => {
    const { loggerFromHeaders } = await import('./logger');
    const log = loggerFromHeaders(makeHeaders({ 'x-request-id': 'tag-1' }));
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
  });
});
