# Step 11 — Security, Sentry, 2FA, Healthcheck

**Date:** 2026-05-14
**Status:** delivered (per Promise/HANDOFF §9)

Closes spec §13 (Security) and §16 (Monitoring & Logs).

---

## Summary

Three production-readiness layers go in this step:

1. **Sentry** — error reporting on Node, Edge, and browser runtimes. PII-clean
   per GDPR (§14). Replay is OFF deliberately.
2. **Admin 2FA** — TOTP (RFC 6238) for Payload admin login. New fields on
   `users`, two REST endpoints for setup, and a `beforeLogin` hook that
   challenges MFA-enabled accounts.
3. **Healthcheck + login rate-limit** — `/api/health` probes DB + Payload for
   LB / uptime monitors; login attempts are rate-limited per IP (5 / 15min).

No existing green behaviour from Stage 0 / Step 9 / Step 10 is affected. The
Sentry SDK no-ops cleanly when `SENTRY_DSN` is unset, so dev without env
config keeps working unchanged.

---

## New files

```
sentry.server.config.ts                            # Node runtime init
sentry.edge.config.ts                              # Edge runtime init
instrumentation-client.ts                          # Browser init (Replay off)
instrumentation.ts                                 # register() + onRequestError

src/app/api/health/route.ts                        # GET /api/health
src/app/api/admin/mfa/setup/route.ts               # POST — gen secret + QR
src/app/api/admin/mfa/verify/route.ts              # POST — verify code, enable
src/lib/totp.ts                                    # otplib wrapper
src/payload/hooks/check-mfa.ts                     # beforeLogin guard
```

## Modified files

```
next.config.ts                  # withSentryConfig wrap + tunnelRoute
src/proxy.ts                    # matcher excludes sentry-tunnel
src/lib/env.ts                  # NEXT_PUBLIC_SENTRY_DSN / RELEASE + Sentry org/proj/auth
src/lib/constants.ts            # LOGIN_RATE_LIMIT constant
src/lib/rate-limit.ts           # checkLoginRateLimit alongside contact limiter
src/payload/collections/users.ts # mfaEnabled, mfaSecret fields + beforeLogin hook
src/app/global-error.tsx        # Sentry.captureException (TODO removed)
.env.example                    # documented new env vars
package.json                    # +otplib, +qrcode, +@types/qrcode
```

## New env vars

| Var                                                 | Required | Notes                                          |
| --------------------------------------------------- | -------- | ---------------------------------------------- |
| `SENTRY_DSN`                                        | optional | Server-side reporting. SDK no-ops when unset.  |
| `NEXT_PUBLIC_SENTRY_DSN`                            | optional | Browser-side reporting (usually = SENTRY_DSN). |
| `NEXT_PUBLIC_SENTRY_RELEASE`                        | optional | Short SHA / semver; CI fills it in Step 14.    |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | optional | Source-map upload — CI only.                   |

All are already wired through `lib/env.ts` Zod schema; missing values just disable the feature.

---

## How to apply

```powershell
cd C:\Users\Sergo\Desktop\v2

# 1. Extract this zip over the project (overwrites listed files only).
Expand-Archive -LiteralPath kingdomcars-step11.zip -DestinationPath . -Force

# 2. Install the three new packages.
npm install

# 3. Restart dev.
npm run dev
```

`npm install` also re-runs `scripts/patch-payload.mjs` automatically (postinstall).

---

## Manual smoke tests

After `npm run dev` is up:

```powershell
# Healthcheck — must return 200 with status=ok
curl http://localhost:3000/api/health

# Sentry — only meaningful if SENTRY_DSN is set; otherwise the no-op path
# is silently exercised.

# MFA setup — first log in to /admin in the browser, copy the cookie, then
# (replace COOKIE with the Payload session cookie value):
curl -X POST http://localhost:3000/api/admin/mfa/setup `
  -H "Cookie: payload-token=COOKIE"
# Response: { ok:true, secret, otpauthUrl, qrDataUrl }
# Scan qrDataUrl with Google Authenticator / 1Password.

# Then verify:
curl -X POST http://localhost:3000/api/admin/mfa/verify `
  -H "Cookie: payload-token=COOKIE" `
  -H "Content-Type: application/json" `
  -d '{"token":"123456"}'
# Response on success: { ok:true } — and mfaEnabled flips to true.
```

After verification, subsequent **login attempts for that user** through the
admin UI will fail until the UI is extended to send `mfaCode` in the request
body. This is a known gap, documented for follow-up. CLI / API logins can
already pass MFA by including `mfaCode` in the JSON body of `/api/users/login`.

---

## Design notes

### Why a `tunnelRoute`

Ad-blockers and corporate firewalls drop direct requests to `sentry.io`. With
`tunnelRoute: '/sentry-tunnel'`, the SDK uploads via our own domain — the
proxy matcher in `src/proxy.ts` was updated to NOT process `/sentry-tunnel/*`
so the tunnel works unimpeded.

### Why MFA secret is `read: () => false`

Field-level read access of `false` means even admins can't see another user's
TOTP secret through the API. The `beforeLogin` hook reads it via
`overrideAccess: true` directly in the same process — no API round trip, no
exposure surface.

### Why beforeLogin throws plain `Error`

Payload 3 surfaces the error message back to the client in the login
response. Generic messages like "Invalid MFA code" and "Too many login
attempts" don't leak account state (we deliberately don't say "no such
user" vs "wrong password").

### Why login rate-limit is per-IP, not per-username

Per-username limit + slow hash gives an attacker a free user enumeration
oracle: try a known user, get a long response time + lockout; try an unknown
user, get a fast response. IP-keying treats every attempt the same. Payload's
built-in `maxLoginAttempts` (5/h per user) is the second layer.

---

## Known gaps (deferred to later steps)

- Payload admin UI doesn't render an `mfaCode` input — needs a custom
  `Login` view override (Payload 3 `admin.components.views`). Out of Step 11
  scope; tracked for a UI follow-up.
- `instrumentation-client.ts` has `integrations: []` — drops the default
  BrowserTracing integration too. Re-enabling it without Replay is fine; left
  off in this cut to confirm zero PII leakage before tuning.
- No tests yet (Step 12). Once Vitest is wired, `lib/totp.ts` gets 100%
  coverage per spec §15 ("100% on `lib/rate-limit.ts`, `lib/env.ts`,
  `lib/telegram.ts`"); add `lib/totp.ts` to that list.

---

## Checklist

- [x] Sentry: server / edge / browser runtimes initialised
- [x] PII-clean (`sendDefaultPii: false`, headers scrubbed, no Replay)
- [x] `tunnelRoute` set, proxy matcher excludes it
- [x] Source-map upload wired (CI envs in §22)
- [x] `instrumentation.ts` registers correct config per runtime
- [x] `global-error.tsx` reports to Sentry
- [x] `/api/health` returns 200/503 with DB + Payload status
- [x] `lib/totp.ts` covers generate / build URL / verify with 30s window
- [x] `users` collection has `mfaEnabled` (readonly) + `mfaSecret` (no-read)
- [x] `beforeLogin` enforces login rate-limit + MFA when enabled
- [x] `/api/admin/mfa/setup` and `/verify` exist, both require session
- [x] `lib/rate-limit.ts` exposes `checkLoginRateLimit`
- [x] `.env.example` documents all new vars
- [x] `package.json` adds otplib + qrcode + @types/qrcode

---

**Next:** Step 12 — Tests (Vitest setup, unit tests for `lib/totp.ts` /
`lib/rate-limit.ts` / `lib/env.ts`, Playwright e2e on key flows + axe).
