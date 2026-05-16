# ADR-0002: Postgres as the database

- **Status:** Accepted
- **Date:** 2026-02-10
- **Decision-maker:** Project lead

## Context

Payload 3 supports two database adapters that fit our deployment shape:

- `@payloadcms/db-postgres` — real Postgres
- `@payloadcms/db-sqlite` — file-based SQLite

We host on a single VPS; the workload is content-management for one
business, not a high-traffic SaaS.

## Decision

We use **Postgres 16** via `@payloadcms/db-postgres`.

## Rationale

1. **Backup & restore are boring.** `pg_dump` + `pg_restore` are well-known,
   tested in every hosting environment, and produce text files that
   git-diff and grep. `scripts/backup-db.sh` is 20 lines, runs from cron.

2. **Concurrent writes without WAL lock contention.** Payload's `versions`
   feature (drafts) writes alongside reads. SQLite would serialise these;
   Postgres handles them concurrently with MVCC. At single-editor scale
   you'd never notice — but the moment a webhook revalidation fires
   mid-edit, you'd see "database is locked" errors on SQLite.

3. **JSONB columns for blocks.** Payload stores layout blocks as JSON.
   Postgres `jsonb` is queryable and indexed; SQLite's JSON1 is fine but
   slower at scale.

4. **Production-grade FULL TEXT search later.** If the site ever needs
   site-wide search, Postgres `tsvector` is in-tree. SQLite FTS5 is also
   fine but limited (no language stemming for Polish).

5. **No CGO/native concerns.** SQLite needs `better-sqlite3` (native). On
   Alpine, we'd need musl rebuilds. Postgres adapter is pure JS.

## Trade-offs

- Postgres needs its own container, volume, and password. That's the
  whole "complexity tax" — about 30 lines of compose YAML.
- The build needs DB access (per ADR-0004 caching strategy). Compose
  starts Postgres first, then builds with host-network access.

## What we'd choose SQLite for instead

A throwaway demo, a personal blog, or a Lambda-deployed read-only export.
Neither describes this project.
