/**
 * Node.js module customization hook: redirects `import 'server-only'` to an
 * empty stub. Mirrors the Vitest alias trick in `tests/stubs/server-only.ts`,
 * but for `tsx`-driven script runs (seed, migrate). The real `server-only`
 * package's whole purpose is to throw if loaded outside an RSC/server context
 * — that protection is enforced by Next's bundler in production; in CLI tools
 * we want server modules to be importable so we can populate the DB.
 *
 * Registered from `bootstrap-env.mts` via `module.register()`. Resolve-only
 * hook is enough: short-circuit to the stub URL and Node's default loader
 * happily reads an empty ESM module from it.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') {
    return {
      shortCircuit: true,
      format: 'module',
      url: new URL('server-only.mjs', import.meta.url).href,
    };
  }
  return nextResolve(specifier, context);
}
