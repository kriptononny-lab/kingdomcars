# Step 11.1 — Security hardening: seed password + request-id correlation

**Date:** 2026-05-14
**Status:** delivered
**Scope:** two §13/§16 gaps surfaced during the post-Step-11 spec re-audit.

This is a follow-up patch on top of Step 11. No new features; closes two
remaining items before moving on to Step 12 (Tests).

---

## What this fixes

### 1. Seed admin password — fail-loud in production (§13)

`scripts/seed.ts` previously fell back to a hardcoded `'ChangeMe!Now123'`
when `SEED_ADMIN_PASSWORD` was unset. In production this would silently
deploy a known-credential admin account — a §13 violation ("сильный пароль
через seed").

After this patch:
- **Production** (`NODE_ENV=production`): seed throws on boot if
  `SEED_ADMIN_PASSWORD` is unset or shorter than 12 chars.
- **Development**: legacy fallback still works, but emits a loud warning
  via `logger.warn` so it never sneaks past code review.

### 2. `x-request-id` correlation wired end-to-end (§16)

`lib/logger.ts` exposed `withRequestId(...)` but nobody called it. After
this patch the request-id flows through three entry points:

| Entry | What happens |
|---|---|
| **`src/proxy.ts`** (front-end pages) | Generates UUID v4 if missing; forwards on the request to RSC layouts; echoes on the response for client/Sentry correlation |
| **`/api/*` route handlers** | Read or generate via `getRequestId(req.headers)`; tagged logger via `loggerFromHeaders`; echo on `NextResponse` headers |
| **Server Actions** (`submit-contact`) | Read via `await headers()` from Next; tagged logger via `loggerFromHeaders` |
| **Payload hooks** (`check-mfa`) | Read via `req.headers`; tagged logger via `loggerFromHeaders` |

The header name lives in `HEADERS.REQUEST_ID` constant (`@/lib/constants`) —
no magic strings (§4.7). Validation is paranoid (`/^[\w.:-]{1,128}$/`): a
client-supplied id has to look like an id, or we silently replace it.

---

## Files

### Modified

```
scripts/seed.ts                           # SEED_ADMIN_PASSWORD enforcement
src/lib/constants.ts                      # +HEADERS group
src/lib/logger.ts                         # +getRequestId, +loggerFromHeaders
src/proxy.ts                              # generates + forwards + echoes id
src/actions/submit-contact.ts             # loggerFromHeaders(headerStore)
src/app/api/health/route.ts               # tagged log + echo id
src/app/api/revalidate/route.ts           # tagged log + echo id
src/app/api/admin/mfa/setup/route.ts      # tagged log + echo id
src/app/api/admin/mfa/verify/route.ts     # tagged log + echo id
src/payload/hooks/check-mfa.ts            # tagged log
```

### NOT touched (deferred to dedicated cleanup patch)

```
src/app/api/contact/route.ts              # has pre-existing locale bug + as-never casts
src/lib/rate-limit.ts                     # generic helper, callers responsible for tagging
src/lib/telegram.ts                       # generic helper, callers tag
```

---

## How to apply

```powershell
cd C:\Users\Sergo\Desktop\v2
Expand-Archive -LiteralPath kingdomcars-step11_1.zip -DestinationPath . -Force
npm run dev
```

No new npm packages. No env-var changes required for dev (the new `SEED_*`
enforcement only triggers when `NODE_ENV=production`).

---

## Smoke tests

```powershell
# 1. Healthcheck now echoes x-request-id on the response
Invoke-WebRequest -Uri http://localhost:3000/api/health -UseBasicParsing |
  Select-Object -ExpandProperty Headers
# Expect: x-request-id header present with a UUID

# 2. Pass through a custom id — it should round-trip
Invoke-WebRequest -Uri http://localhost:3000/api/health `
  -Headers @{ 'x-request-id' = 'smoketest-1234' } -UseBasicParsing |
  Select-Object -ExpandProperty Headers
# Expect: x-request-id = smoketest-1234

# 3. Bad id — should be replaced
Invoke-WebRequest -Uri http://localhost:3000/api/health `
  -Headers @{ 'x-request-id' = 'has spaces!@#' } -UseBasicParsing |
  Select-Object -ExpandProperty Headers
# Expect: x-request-id = some-uuid (NOT the input)

# 4. Front-end page also echoes
Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing |
  Select-Object -ExpandProperty Headers
# Expect: x-request-id present (set by proxy)
```

In the `npm run dev` console, every log line emitted by tagged paths now
carries `"requestId":"…"` — grep by id to follow one request across layers.

### Seed password check (manual)

```powershell
# Dev — should warn but still work
$env:NODE_ENV = 'development'
npm run seed
# Expect: warning "SEED_ADMIN_PASSWORD unset — using dev default..."

# Prod simulation — should fail
$env:NODE_ENV = 'production'
$env:SEED_ADMIN_PASSWORD = ''
npm run seed
# Expect: "Error: SEED_ADMIN_PASSWORD must be set (≥ 12 chars) in production."
# (Remember to unset $env:NODE_ENV afterwards.)
```

---

## Spec coverage delta after this patch

| Item | Before 11.1 | After 11.1 |
|---|---|---|
| §13 "strong password via seed" | ❌ hardcoded fallback in all envs | ✅ prod enforces, dev warns |
| §16 "correlation via x-request-id" | ❌ helper unused | ✅ wired through proxy + 4 api routes + action + 1 hook |

Remaining §13 partials (tracked for follow-up):

- **Admin login UI override** — Payload admin doesn't yet send `mfaCode` in
  the login form. Backend MFA is fully functional; UI gets its own patch
  (Patch 11.2) after Step 12 lands. Verify-via-API works today.

---

## Notes for future steps

When Step 12 (Tests) lands, `lib/logger.ts` gets unit coverage for:
- `getRequestId` — accept valid id, reject invalid chars, reject length > 128,
  generate UUID when header absent.
- `loggerFromHeaders` — returns tagged child logger.

Both are deterministic and cheap to cover with vitest; aim for 100%.
