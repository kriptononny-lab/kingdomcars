/**
 * Bootstrap for tsx-driven CLI scripts (`npm run seed`, `npm run migrate`).
 *
 * Run via `tsx --import ./scripts/bootstrap-env.mts ...`. Three
 * responsibilities, all of which MUST run before the target script imports
 * anything that reads `process.env` or pulls `server-only`-marked modules:
 *
 *   1. Register an ESM resolve hook that aliases the `server-only` marker to
 *      an empty stub. The real package throws if it reaches a non-RSC context
 *      — which is exactly what would happen here, since rate-limit.ts and
 *      friends declare `import 'server-only'`. Next's bundler enforces the
 *      client/server split in production; for CLI tools we deliberately
 *      bypass it (mirrors `tests/stubs/server-only.ts` aliased by Vitest).
 *
 *   2. Physically stub `node_modules/server-only/index.js` for the duration
 *      of the script. tsx on Windows + Node 24 routes TS imports through
 *      the CJS loader, which does NOT trigger the ESM resolve hook from (1)
 *      — so without this fallback `server-only` throws at require time.
 *      The original file is restored on process exit (incl. SIGINT/SIGTERM)
 *      so `npm run dev` afterwards still has the real package and its
 *      client/server-boundary protection.
 *
 *   3. Populate `process.env` from `.env.local` / `.env`. We avoid Node's
 *      `--env-file` flag because it triggers Payload 3's `bin/loadEnv.js`,
 *      which currently does `import default from '@next/env'` — incompatible
 *      with Next 16's CJS-namespace export shape.
 */
import fs from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';

// (1) ESM resolve hook — catches `import 'server-only'` in pure-ESM paths.
register('./stubs/server-only-loader.mjs', import.meta.url);

// (2) CJS fallback — temporarily blank the package's index.js. The ESM hook
//     above wins on ESM imports; this only matters when tsx falls back to
//     CJS require (Windows + Node 24, tsx's CJS transformer).
const SERVER_ONLY_PATH = path.resolve(
  process.cwd(),
  'node_modules',
  'server-only',
  'index.js',
);
const STUB_BODY = '// stubbed by scripts/bootstrap-env.mts for CLI run\nmodule.exports = {};\n';

if (fs.existsSync(SERVER_ONLY_PATH)) {
  const original = fs.readFileSync(SERVER_ONLY_PATH, 'utf8');
  // Idempotent: don't restore a stub if the file was ALREADY a stub when we
  // arrived (e.g. STUB_SERVER_ONLY=1 was set previously and patch-payload.mjs
  // already wrote it). In that case there's nothing meaningful to restore.
  const wasAlreadyStubbed = original.includes('module.exports = {}');
  if (!wasAlreadyStubbed) {
    fs.writeFileSync(SERVER_ONLY_PATH, STUB_BODY, 'utf8');
    const restore = () => {
      try {
        fs.writeFileSync(SERVER_ONLY_PATH, original, 'utf8');
      } catch {
        // best-effort: process is already tearing down
      }
    };
    process.on('exit', restore);
    // SIGINT/SIGTERM don't fire 'exit' unless we exit explicitly here.
    // eslint-disable-next-line unicorn/no-process-exit -- CLI bootstrap signal handlers.
    process.on('SIGINT', () => process.exit(130));
    // eslint-disable-next-line unicorn/no-process-exit -- CLI bootstrap signal handlers.
    process.on('SIGTERM', () => process.exit(143));
  }
}

// (3) Populate env from .env.local / .env.
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
