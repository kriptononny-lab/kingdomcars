/**
 * Empty stub for the `server-only` marker package. Aliased from
 * `vitest.config.ts`. The real package's whole job is to throw on client
 * import (it does so via a `client.js` entry that has `throw`). Under
 * Vitest we *want* server modules to be importable so we can unit-test
 * them; production safety is enforced by Next's bundler instead.
 */
export {};
