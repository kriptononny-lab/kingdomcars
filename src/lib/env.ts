import { z } from 'zod';

/**
 * Server-only env schema. Imported only from server code.
 * Throws synchronously at module load if any required var is missing/invalid.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be ≥ 32 chars'),
  PAYLOAD_PUBLIC_SERVER_URL: z.string().url(),
  REVALIDATE_SECRET: z.string().min(16),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),
  // Optional override — used in e2e tests and staging to redirect Telegram
  // traffic to a local mock server. Falls through to `TELEGRAM.API_BASE`.
  TELEGRAM_API_BASE: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

/**
 * Client-exposed env. Anything here is bundled into the browser — never put secrets.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_HOST: z.string().min(1),
  NEXT_PUBLIC_ANALYTICS_URL: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_RELEASE: z.string().min(1).optional(),
});

/**
 * Escape hatch (t3-env style): when `SKIP_ENV_VALIDATION=1` we skip the
 * strict parse and return `process.env` as-is. Use cases:
 *
 *   • Docker / CI `next build` when prod secrets live outside the build
 *     environment (they're injected at runtime instead).
 *   • `lint` / `typecheck` runs that don't actually execute the code.
 *
 * Never set this on a running server — env.ts is the only barrier between
 * a typo in a secret name and a production outage.
 */
const skipValidation = process.env.SKIP_ENV_VALIDATION === '1';

function parse<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, unknown>,
  label: string,
): z.infer<T> {
  if (skipValidation) return source as z.infer<T>;
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid ${label} environment variables:\n${issues}`);
  }
  return result.data;
}

/**
 * True when we're running on a Node-style runtime — covers production server
 * code AND Vitest+jsdom (where `window` is injected by jsdom but `process`
 * is also defined). A real browser bundle has `window` but no `process`,
 * so the second branch correctly evaluates to `false` there.
 */
const isServerSide =
  globalThis.window === undefined ||
  (typeof process !== 'undefined' && typeof process.versions?.node === 'string');

/** Validated client-safe environment variables (safe to expose to the browser). */
export const clientEnv = parse(clientSchema, process.env, 'client');

/** Validated server-only environment variables. Throws on missing required vars. */
export const serverEnv = isServerSide
  ? parse(serverSchema, process.env, 'server')
  : ({} as z.infer<typeof serverSchema>);
