# ADR-0001: Payload as the CMS

- **Status:** Accepted
- **Date:** 2026-02-10
- **Decision-maker:** Project lead

## Context

The project needs a CMS that lets a non-technical editor change page
content, add new pages, and translate everything across PL / EN / RU.
Candidates evaluated:

- **Payload 3** (TS, integrates into the Next.js process, Postgres adapter)
- **Strapi 5** (Node + plugins, separate service)
- **Sanity** (hosted, structured content, GROQ)
- **Directus** (DB-first, generates schema from existing tables)

## Decision

We use **Payload 3**, mounted into the same Next.js application at `/admin`.

## Rationale

1. **One deployment, one runtime.** Payload 3 plugs into the Next.js
   process — no second container, no second deploy target, no inter-service
   auth handshake. The whole stack is `app + postgres + caddy`.

2. **TS-first schema.** Collections, globals, and block schemas are TypeScript
   files in our own repo. We get autocompletion in admin UI customisations,
   diff-friendly schema changes in git, and `payload generate:types`
   produces a real `payload-types.ts`.

3. **Localisation built in.** `localization.locales` + `localized: true` on
   a field is the entire setup. Strapi requires the i18n plugin (separate
   versioning, plugin-API quirks).

4. **No vendor lock.** Sanity is hosted-only; project requirements include
   "deploy on a fresh VPS in three commands" (§22), incompatible with that.

5. **Postgres-native.** `@payloadcms/db-postgres` writes plain SQL; we can
   `pg_dump` and restore like any other Postgres database. Directus does
   the same but its admin UX is weaker for content authoring.

## Trade-offs

- Payload's monorepo couples admin and frontend deploy cycles. A bug in our
  page code can take admin down. Acceptable at our scale; not for a
  multi-tenant SaaS.
- Payload's TS error messages are dense — schema mismatches surface as deep
  generic-type errors. We mitigate with narrow domain types in `src/types/`
  (e.g. `PageDoc`).
- Smaller ecosystem than Strapi. We've not hit a missing-plugin problem yet.

## Status of consequences

We're on Payload 3.40+. The first MFA + cache-tagged ISR set-up was the
roughest part of integration; everything else has been straightforward.
