# KingdomCars

Production-grade Next.js 16 + Payload 3 website for KingdomCars
freight-transport (Warsaw). Localised in Polish (default), English, and
Russian. Single-deployment monolith — one container for app + admin, one
for Postgres, one for Caddy.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Payload](https://img.shields.io/badge/Payload-3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Postgres](https://img.shields.io/badge/Postgres-16-336791)
![License](https://img.shields.io/badge/license-UNLICENSED-red)

---

## Stack

- **Framework:** Next.js 16 (App Router, RSC by default)
- **Language:** TypeScript 5 (strict + `noUncheckedIndexedAccess`)
- **CMS:** Payload 3 (mounted at `/admin`, Postgres adapter)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Animation:** Framer Motion (`useReducedMotion`-aware)
- **i18n:** next-intl + Payload `localization`
- **Forms:** react-hook-form + Zod, submitted via Server Actions
- **Tests:** Vitest + Testing Library + Playwright + axe-core
- **Monitoring:** Sentry (optional, free tier)
- **Analytics:** Umami / Plausible (privacy-first, no-cookie)
- **Deploy:** Docker + Caddy (auto-HTTPS) + GitHub Actions → GHCR + SSH

---

## Quick start

```bash
git clone <repo>
cd kingdomcars
cp .env.example .env
# Edit .env — at minimum set POSTGRES_PASSWORD, PAYLOAD_SECRET,
# REVALIDATE_SECRET, TELEGRAM_BOT_TOKEN/CHAT_ID. The .env file is read by
# both `docker compose` and the app itself.

make up        # bring up postgres → build app → start full stack
make seed      # create admin user + pages + navigation + site settings
```

After `make seed`, log in at `<your-host>/admin` with the email/password
from your env (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`). **Rotate the
password immediately.** Enable 2FA in your user profile.

### Local dev without Docker

```bash
npm ci
npm run dev       # http://localhost:3000
```

You'll need a Postgres reachable at `DATABASE_URL`. The fastest path:
`docker compose up -d postgres` then `npm run dev` against
`localhost:5432`.

---

## Environment variables

Full reference with descriptions: [`.env.example`](./.env.example).

### Server (required at runtime, optional at build via `SKIP_ENV_VALIDATION=1`)

| Name | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string |
| `PAYLOAD_SECRET` | ✅ | ≥ 32-char random string, rotate on compromise |
| `PAYLOAD_PUBLIC_SERVER_URL` | ✅ | Public URL of the Payload admin |
| `REVALIDATE_SECRET` | ✅ | ≥ 16-char webhook auth for `/api/revalidate` |
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from `@BotFather` |
| `TELEGRAM_CHAT_ID` | ✅ | Chat ID receiving form submissions |
| `LOG_LEVEL` | ⚪ | `info` default; `debug` for local dev |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | ⚪ | Distributed rate-limit (falls back to in-memory) |
| `SENTRY_DSN` / `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | ⚪ | Error reporting + source maps |

### Client (bundled into the browser — never put secrets)

| Name | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL (used for OG, hreflang, canonical) |
| `NEXT_PUBLIC_SITE_HOST` | ✅ | Host portion only (used for `next/image remotePatterns`) |
| `NEXT_PUBLIC_ANALYTICS_URL` / `_ID` | ⚪ | Umami / Plausible script URL + site ID |
| `NEXT_PUBLIC_SENTRY_DSN` / `_RELEASE` | ⚪ | Browser-side Sentry |

### CI-only

| Name | Purpose |
|---|---|
| `SKIP_ENV_VALIDATION=1` | Pass it at build time when secrets are injected later (CI builds, Docker `next build` step). |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Override seed defaults — required in production. |

---

## Architecture

```
Browser ── HTTPS ──> Caddy ── proxy:3000 ──> Next.js + Payload (one container)
                                                  │
                                                  ├──> Postgres 16
                                                  ├──> payload-media (volume)
                                                  └──> Telegram Bot API
```

Detailed: diagrams, data flow, cache strategy, auth realms → [`docs/architecture.md`](./docs/architecture.md).

Decision records (why Payload, why Postgres, why next-intl, caching, forms)
→ [`docs/adr/`](./docs/adr/).

---

## Make targets

| Command | Action |
|---|---|
| `make up` | Start full stack: postgres → build → app → caddy |
| `make down` | Stop everything (volumes preserved) |
| `make restart` | Restart the app container only |
| `make logs` | Follow app logs |
| `make ps` | List running services |
| `make seed` | Run idempotent seed (admin, pages, nav, settings) |
| `make migrate` | Apply Payload migrations |
| `make shell` | `sh` into the app container |
| `make backup` | `pg_dump` → `./backups/<timestamp>.sql.gz` |
| `make restore DUMP=…` | Restore from a dump file |
| `make test` | Unit + e2e |
| `make lint` / `typecheck` / `format` | Quality checks |
| `make clean` | Drop volumes + remove orphan containers |

---

## npm scripts

The above maps onto these for non-Docker workflows:

| Script | Action |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint with `--max-warnings=0` |
| `npm run format[:check]` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (unit + component) |
| `npm run test:cov` | Coverage with v8 reporter |
| `npm run test:e2e` | Playwright (desktop + mobile chrome) |
| `npm run test:e2e:update-snapshots` | Update Playwright visual snapshots |
| `npm run seed` | Seed via tsx (uses bootstrap-env loader) |
| `npm run payload:migrate` | Run Payload migrations via tsx |
| `npm run analyze` | Bundle analyser |
| `npm run bundlewatch` | Bundle-size check vs budgets |
| `npm run gen:component <Name>` | Scaffold a new component + test |

---

## Deployment

See [`docs/deployment.md`](./docs/deployment.md) for the full guide
(provisioning a fresh VPS, DNS, TLS, cron, monitoring).

Continuous deployment runs on push to `main`:
[.github/workflows/deploy.yml](./.github/workflows/deploy.yml) builds the
image, pushes to GHCR, and SSHes into the server to pull + restart.

---

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) — local setup, code style,
naming, commit format (Conventional Commits), PR process.

The PR template at [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md)
lists the merge checklist. Pre-commit (`lefthook`) runs ESLint + Prettier
+ Commitlint locally; CI re-runs everything + adds typecheck, build,
Playwright, Lighthouse, CodeQL, `npm audit`.

### Branch protection (recommended)

- `main` requires PR + 1 review + all CI checks green.
- Linear history (rebase/squash only — no merge commits).
- Signed commits (optional, encouraged).

---

## Security

See [`SECURITY.md`](./SECURITY.md) — supported versions, disclosure
process, SLA.

Reports go through GitHub's private security advisories; please don't open
public issues for vulnerabilities.

---

## License

UNLICENSED — proprietary. All rights reserved.
