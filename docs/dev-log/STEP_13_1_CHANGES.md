# Step 13.1 — Docker patch (audit fixes)

**Date:** 2026-05-14
**Status:** delivered
**Replaces:** 2 files from Step 13. Removes the broken umami overlay.

---

## Why

Self-audit after Step 13 turned up three issues. Two are fix-critical
(media loss, sharp on alpine); one is convenience (optional env propagation).
Patch swaps two files and removes one that was incomplete.

## Changes

### 🔴 `Dockerfile` — fix payload-media path + libc6-compat in runner

- `mkdir -p ./payload-media` (was `./media`) — matches
  `staticDir: 'payload-media'` in `src/payload/collections/media.ts`.
- `RUN apk add --no-cache libc6-compat` in runner stage — sharp depends
  on it for image resize.
- Removed misleading comment about `payload generate:types` (we don't
  run it — known issue documented in HANDOFF).

### 🔴 `docker-compose.yml` — fix payload-media volume mount + env_file

- `payload-media:/app/payload-media` (was `/app/media`) — without this
  fix, uploaded files would disappear on container restart.
- `env_file: - .env` added to `app` service so optional env vars
  (`SENTRY_DSN`, `NEXT_PUBLIC_ANALYTICS_*`, `UPSTASH_REDIS_*`) get
  forwarded to the container. The explicit `environment:` block still
  validates required vars via `:?`.

### 🟡 `docker-compose.umami.yml` — REMOVED

The original overlay had two unfixed bugs that would prevent it from
working out of the box:
- No init script to create the `umami` database in the shared Postgres.
- No Caddy site block for `analytics.<domain>` — so even when Umami is
  up, Caddy can't proxy to it.

Removed so the Step 13 stack is reliably "just works". Add Umami via a
separate small patch when it's actually needed (cleanup phase).

## How to apply

```powershell
cd C:\Users\Sergo\Desktop\v2
Expand-Archive -LiteralPath 'C:\Users\Sergo\Desktop\kingdomcars-step13_1.zip' -DestinationPath . -Force
# Remove the broken umami overlay from Step 13 — it's been deleted from
# the patch but the file from the previous extract still sits on disk.
Remove-Item docker-compose.umami.yml -ErrorAction SilentlyContinue
```

## Smoke (same as Step 13)

```powershell
docker stop kc-postgres  # free port 5432
docker compose build      # ~3-5 min first time
docker compose up -d
docker compose ps         # wait for all three "healthy"
curl http://localhost/api/health
# Expected: {"status":"ok","payload":"up","db":"up"}
```

## Known limitations (not blockers; tracked for follow-up patches)

- **`make seed` / `make migrate` won't work yet** in the production Docker
  stack — the standalone runner has neither `tsx` nor the Payload CLI.
  Workaround for now: run seed on the host before first deploy
  (`npm install && npm run seed` against the same `DATABASE_URL`).
  Proper fix in **Patch 13.2**: add a `tools` service with
  `target: builder` and `profiles: ["tools"]`.
- **Windows hosts**: `make backup` / `make restore` use bash, so they
  need Git Bash or WSL. The Makefile already declares `SHELL := /bin/bash`,
  so `make` itself will fail without bash in PATH. On Windows, run
  `bash ./scripts/backup-db.sh` directly if `make` complains.
- **Umami analytics**: see above — opt-in, deferred. Will be re-added in
  its own patch.

## What's next

After you confirm `docker compose up -d` brings all three services healthy,
we move to **Step 14 — CI/CD** (`.github/workflows/{ci,deploy,codeql}.yml`,
Dependabot, `.vscode/`, isolated Postgres for e2e in CI).
