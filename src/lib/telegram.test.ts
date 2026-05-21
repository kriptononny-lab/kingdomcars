import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyEnv, restoreEnv, snapshotEnv } from '@tests/fixtures/env-stubs';

let snap: ReturnType<typeof snapshotEnv>;

beforeEach(() => {
  vi.resetModules();
  snap = snapshotEnv();
  applyEnv();
});

afterEach(() => {
  restoreEnv(snap);
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const sample = { name: 'John', phone: '+48 500 100 200', locale: 'pl' };

describe('sendTelegramMessage', () => {
  it('posts to api.telegram.org by default and returns true on 200', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 200 }));
    const { sendTelegramMessage } = await import('./telegram');
    expect(await sendTelegramMessage(sample)).toBe(true);
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(String(url)).toMatch(/^https:\/\/api\.telegram\.org\/botTESTBOT\/sendMessage$/);
    const body = JSON.parse(String(init?.body));
    expect(body.chat_id).toBe('-100test');
    expect(body.parse_mode).toBe('HTML');
    expect(body.text).toContain('<b>Name:</b> John');
  });

  it('honours TELEGRAM_API_BASE override', async () => {
    applyEnv({ TELEGRAM_API_BASE: 'http://localhost:9999' });
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 200 }));
    const { sendTelegramMessage } = await import('./telegram');
    await sendTelegramMessage(sample);
    expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
      'http://localhost:9999/botTESTBOT/sendMessage',
    );
  });

  it('returns false on non-2xx status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 500 }));
    const { sendTelegramMessage } = await import('./telegram');
    expect(await sendTelegramMessage(sample)).toBe(false);
  });

  it('returns false when fetch throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    const { sendTelegramMessage } = await import('./telegram');
    expect(await sendTelegramMessage(sample)).toBe(false);
  });

  it('escapes HTML in user-supplied fields', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 200 }));
    const { sendTelegramMessage } = await import('./telegram');
    await sendTelegramMessage({ ...sample, name: '<script>alert(1)</script>' });
    const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body));
    expect(body.text).not.toContain('<script>');
    expect(body.text).toContain('&lt;script&gt;');
  });

  it('includes only provided optional fields', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 200 }));
    const { sendTelegramMessage } = await import('./telegram');
    await sendTelegramMessage({ ...sample, email: 'a@b.com', service: 'office' });
    const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body));
    expect(body.text).toContain('Email');
    expect(body.text).toContain('Service');
    expect(body.text).not.toContain('Message:');
  });

  it('returns false when aborted after timeout', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    vi.useFakeTimers();
    const { sendTelegramMessage } = await import('./telegram');
    const promise = sendTelegramMessage(sample);
    await vi.advanceTimersByTimeAsync(6000);
    expect(await promise).toBe(false);
  });
});
