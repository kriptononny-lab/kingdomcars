/**
 * Bootstrap for tsx-driven CLI scripts (`npm run seed`, `npm run migrate`).
 *
 * Run via `tsx --import ./scripts/bootstrap-env.mts ...`. Two responsibilities,
 * both of which MUST run before the target script imports anything that reads
 * `process.env` or pulls `server-only`-marked modules:
 *
 *   1. Register an ESM resolve hook that aliases the `server-only` marker to
 *      an empty stub. The real package throws if it reaches a non-RSC context
 *      — which is exactly what would happen here, since rate-limit.ts and
 *      friends declare `import 'server-only'`. Next's bundler enforces the
 *      client/server split in production; for CLI tools we deliberately
 *      bypass it (mirrors `tests/stubs/server-only.ts` aliased by Vitest).
 *
 *   2. Populate `process.env` from `.env.local` / `.env`. We avoid Node's
 *      `--env-file` flag because it triggers Payload 3's `bin/loadEnv.js`,
 *      which currently does `import default from '@next/env'` — incompatible
 *      with Next 16's CJS-namespace export shape.
 */
import fs from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';

register('./stubs/server-only-loader.mjs', import.meta.url);

for (const file of ['.env.local', '.env']) {
  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  try {
    // process.loadEnvFile is native in Node 20.6+. engines field requires >=22.
    process.loadEnvFile(filePath);
  } catch {
    // ignore — malformed file or unsupported Node version
  }
}
