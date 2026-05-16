# ADR-0006: `server-only` as real dependency + two stubs

- **Status:** Accepted
- **Date:** 2026-05-15
- **Decision-maker:** Architecture review (Stage D)

## Context

The `import 'server-only'` marker, used at the top of every server-side
helper in `src/lib/` (get-page-by-slug, payload, telegram, rate-limit, etc.),
exists to make `next build` fail if any of those modules accidentally end up
in a Client Component bundle. It's a build-time safety rail for the RSC
client/server boundary.

The package is tiny — its `index.js` is empty (so React Server Components can
import it under the `react-server` exports condition without issue), while
its `index.mjs`/`client.js` does `throw new Error('This module cannot be
imported from a Client Component')`. Next.js bundler picks the throwing
entry when the importer is client-side, and the bundle build fails. That's
the whole mechanism.

We have three code paths that touch this marker, and they each need
different behaviour:

1. **`next build` (production):** the real package must be present.
   Without it Next.js' boundary check can't fire and a server module
   silently entering a client chunk would compile cleanly — a regression
   we'd only catch in code review, if ever.
2. **`tsx` CLI runs (`npm run seed`, `npm run migrate`):** the real
   package throws on `import 'server-only'` here because tsx is not the
   React Server Components compiler. The scripts legitimately need to
   import server modules (to talk to Payload and populate the DB), so
   the throw is exactly wrong.
3. **`vitest` (`npm test`):** same as tsx — jsdom isn't Next, the
   `react-server` condition isn't set, and the real package throws,
   blocking unit-testing of any `lib/*.ts` file that touches
   server-only.

Earlier sessions worked around (2) and (3) by deleting the package from
`node_modules` and substituting a hand-written empty stub. The stub kept
falling out at every `npm ci` because it wasn't declared anywhere.

A subsequent plan (see SESSION_HANDOFF_2026-05-15.md) proposed shipping a
no-op `local-packages/server-only/` and pinning the dependency to it via
`file:./local-packages/server-only`. That would have survived `npm ci`, but
it also would have removed protection (1) — the no-op stub doesn't throw on
client import, so Next.js' bundler would happily wave server code into the
client bundle.

## Decision

Declare the real `server-only` package as a direct dependency, and keep
two distinct stubs that override it specifically for the contexts where
the throw is wrong:

- `package.json` → `"server-only": "^0.0.1"`
- `scripts/stubs/server-only-loader.mjs` — Node ESM loader hook that
  short-circuits the `server-only` specifier to an empty stub. Registered
  by `scripts/bootstrap-env.mts` via `module.register()` before any user
  code loads. Used by `tsx --import ./scripts/bootstrap-env.mts ...`,
  which is how `npm run seed` and `npm run migrate` invoke tsx.
- `tests/stubs/server-only.ts` — empty module aliased from
  `vitest.config.ts` (`resolve.alias['server-only'] → tests/stubs/server-only.ts`).
  Vitest's resolver looks at aliases before walking `node_modules`, so the
  alias wins.

The real package is left untouched in `node_modules` and active for
`next build`, `next dev`, and any Node process that doesn't pre-register
one of the two stubs.

## Rationale

1. **Production safety is non-negotiable.** Spec §13 puts the RSC
   client/server boundary in the security column. Substituting an empty
   no-op pinned via `file:./...` would have switched the check off in the
   one environment where it matters (the production bundle that real
   users load).
2. **The two stubs target the right scope.** Each one intercepts the
   import only inside its own process — the loader hook is local to the
   tsx invocation, the alias is local to the Vitest run. They don't
   pollute each other or production.
3. **The dependency now appears in `package-lock.json`.** Earlier
   breakage was caused by the real package being only transitively
   present (or absent altogether after npm hoisting decided to skip it).
   With a direct dependency declaration `npm ci` always installs it; the
   stubs no longer have to compensate for a missing package, only for
   the throw.

## Trade-offs

- **Three places to look** instead of one. A new contributor reading
  `import 'server-only'` in `lib/payload.ts` has to know which of the
  three resolution paths is active in their current task. This ADR is
  the index that points them.
- **`tests/stubs/server-only.ts` and `scripts/stubs/server-only.mjs`
  duplicate each other** (both are just `export {}`). They can't be
  merged because Vitest aliases want a TS file and the Node loader hook
  wants an ESM .mjs, and reaching from one to the other would create a
  circular dependency through `vite-tsconfig-paths` at test time.
- **The loader hook runs only for tsx invocations that pass through
  `bootstrap-env.mts`.** If anyone adds a new CLI script and forgets to
  invoke it as `tsx --import ./scripts/bootstrap-env.mts ...`, the
  script will throw on the first `import 'server-only'` reached. The
  fix is to copy the invocation pattern from `scripts/seed.ts` or
  `scripts/migrate.ts` (which is why the npm scripts pre-baked the
  flag).

## Alternatives considered

- **`local-packages/server-only/` pinned via `file:./...`** — discussed
  above. Rejected because it disables the production RSC boundary check.
- **A single Babel/SWC plugin that strips `import 'server-only'` at
  build time for tsx and Vitest.** Heavier toolchain dependency and
  requires reaching into the two configs in a much more invasive way
  than two ~10-line stub files; also obscures the intent.
- **Don't use `server-only` at all; rely on file naming or ESLint rule
  to enforce the boundary.** ESLint isn't part of `next build`, so the
  check fires only at lint time, not at compile time. Naming
  conventions are even softer. Keeping the React-team-blessed mechanism
  is the lowest-effort, highest-fidelity option.
