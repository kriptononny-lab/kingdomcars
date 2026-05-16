// Patch Payload 3's `bin/loadEnv.js` for compatibility with Next 16 + Node 22+.
//
// Two surgical edits, both idempotent:
//   1. default import → namespace import (Payload's `@next/env` is CJS;
//      a default import resolves to `module.exports.default` which is undef).
//   2. destructure → property-access with `.default` fallback. On Node 22+,
//      ESM-from-CJS interop puts `@next/env`'s `module.exports` under
//      `.default`, so a plain `const { loadEnvConfig } = ns` yields undefined
//      and Payload crashes with `TypeError: loadEnvConfig is not a function`.
//
// Runs as a postinstall script (cross-platform via Node, no shell deps).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TARGET = path.resolve(
  process.cwd(),
  'node_modules',
  'payload',
  'dist',
  'bin',
  'loadEnv.js',
);

const OLD_DEFAULT_IMPORT = "import nextEnvImport from '@next/env';";
const NEW_NAMESPACE_IMPORT = "import * as nextEnvImport from '@next/env';";

const OLD_DESTRUCTURE = 'const { loadEnvConfig } = nextEnvImport;';
const NEW_RESOLUTION =
  'const loadEnvConfig = nextEnvImport.loadEnvConfig ?? nextEnvImport.default?.loadEnvConfig;';

if (!existsSync(TARGET)) {
  // payload not installed yet — silent exit (postinstall runs in many phases)
  // eslint-disable-next-line unicorn/no-process-exit -- postinstall CLI hook.
  process.exit(0);
}

let content = readFileSync(TARGET, 'utf8');
let changed = false;

if (content.includes(OLD_DEFAULT_IMPORT) && !content.includes(NEW_NAMESPACE_IMPORT)) {
  content = content.replace(OLD_DEFAULT_IMPORT, NEW_NAMESPACE_IMPORT);
  changed = true;
}

if (content.includes(OLD_DESTRUCTURE) && !content.includes(NEW_RESOLUTION)) {
  content = content.replace(OLD_DESTRUCTURE, NEW_RESOLUTION);
  changed = true;
}

if (changed) {
  writeFileSync(TARGET, content, 'utf8');
  console.warn('[patch-payload] loadEnv.js patched (Payload 3 / Next 16 / Node 22+ ESM-CJS interop).');
} else if (content.includes(NEW_RESOLUTION)) {
  console.warn('[patch-payload] loadEnv.js already up to date.');
} else {
  console.warn(
    '[patch-payload] loadEnv.js in unexpected shape — manual review needed (Payload may have refactored).',
  );
}
