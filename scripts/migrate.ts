/**
 * Schema-sync + migration runner. Run via:
 *   tsx --import ./scripts/bootstrap-env.mts scripts/migrate.ts
 *
 * How schema sync works in Payload 3 / @payloadcms/db-postgres:
 *   On `getPayload()`, the postgres adapter's `connect()` calls
 *   `pushDevSchema()` automatically when NODE_ENV !== 'production'.
 *   The seeder docker-compose service sets NODE_ENV=development, so
 *   any new tables (new blocks, collections) are created before the
 *   seed or build runs.
 *
 * This script then also calls `db.migrate()` to apply any pending
 * named migration files from src/migrations/ (safe to call when empty).
 *
 * Rationale for not using the `payload migrate` CLI: it uses ts-node with
 * its own config and ignores our tsconfig `paths`, so `@/lib/...` imports
 * inside payload.config.ts fail to resolve.
 */
import { getPayload } from 'payload';

import { logger } from '@/lib/logger';
import config from '@/payload/payload.config';

async function main() {
  // getPayload triggers pushDevSchema (NODE_ENV=development set by seeder service)
  const payload = await getPayload({ config });

  // Apply any named migration files (no-op if src/migrations/ is empty)
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
