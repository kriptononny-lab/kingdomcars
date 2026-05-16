/**
 * Programmatic migration runner. Run via:
 *   tsx --import ./scripts/bootstrap-env.mts scripts/migrate.ts
 *
 * Rationale: the `payload migrate` CLI is a thin wrapper that uses TS-Node
 * with its own config — it ignores our `tsconfig.json` `paths`, so any
 * `import '@/lib/...'` inside `payload.config.ts` fails to resolve. We
 * import the same config the running app uses, then call Payload's
 * migration API directly. The tsx bootstrap also stubs `server-only` so
 * collections/hooks that pull `rate-limit.ts` don't crash here.
 */
import { getPayload } from 'payload';

import { logger } from '@/lib/logger';
import config from '@/payload/payload.config';

async function main() {
  const payload = await getPayload({ config });
  await payload.db.migrate();
  logger.info('migrations applied');
  // eslint-disable-next-line unicorn/no-process-exit -- CLI script.
  process.exit(0);
}

main().catch((error) => {
  logger.error({ err: error }, 'migration failed');
  // eslint-disable-next-line unicorn/no-process-exit -- CLI script.
  process.exit(1);
});
