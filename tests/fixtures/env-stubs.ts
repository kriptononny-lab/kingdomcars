/**
 * Shared `process.env` helpers for tests that exercise `lib/env.ts` or any
 * module that imports `serverEnv` at top level. `vi.stubEnv` only patches
 * Vite's `import.meta.env`; our schema reads `process.env` directly, so we
 * mutate that and snapshot for restore.
 *
 * `@types/node` types `NODE_ENV` as readonly. That's a hint for app code,
 * not a hard guarantee — tests legitimately need to mutate it. We cast
 * via the standard `ProcessEnv as Record<string, string | undefined>`
 * to bypass the readonly narrowing in this one fixture.
 */

type MutableEnv = Record<string, string | undefined>;
const env = process.env as MutableEnv;

export const ENV_KEYS = [
  'NODE_ENV',
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'PAYLOAD_PUBLIC_SERVER_URL',
  'REVALIDATE_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'TELEGRAM_API_BASE',
  'LOG_LEVEL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SITE_HOST',
] as const;

export const baseValidEnv: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://u:p@h:5432/d',
  PAYLOAD_SECRET: 'a'.repeat(32),
  PAYLOAD_PUBLIC_SERVER_URL: 'http://localhost:3000',
  REVALIDATE_SECRET: 'a'.repeat(20),
  TELEGRAM_BOT_TOKEN: 'TESTBOT',
  TELEGRAM_CHAT_ID: '-100test',
  LOG_LEVEL: 'silent',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SITE_HOST: 'localhost',
};

export function snapshotEnv(): Record<string, string | undefined> {
  const snap: Record<string, string | undefined> = {};
  for (const k of ENV_KEYS) snap[k] = env[k];
  return snap;
}

export function restoreEnv(snap: Record<string, string | undefined>): void {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete env[k];
    else env[k] = snap[k];
  }
}

export function applyEnv(extra: Record<string, string> = {}, skip: readonly string[] = []): void {
  for (const k of ENV_KEYS) delete env[k];
  const merged = { ...baseValidEnv, ...extra };
  for (const [k, v] of Object.entries(merged)) {
    if (!skip.includes(k)) env[k] = v;
  }
}
