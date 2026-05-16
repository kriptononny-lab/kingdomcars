# Step 10 — GDPR Cookie Consent

Per §14 of the architecture spec.

## What was added

### New files (8)

| File | Lines | Purpose |
|---|---|---|
| `src/types/consent.ts` | 28 | Types + `REJECT_ALL` / `ACCEPT_ALL` constants |
| `src/lib/consent.ts` | 18 | Shared cookie name + TTL (client + server) |
| `src/lib/actions/save-consent.ts` | 34 | Server action — writes cookie with correct attributes |
| `src/components/gdpr/CookieConsentProvider.tsx` | 92 | Client provider with React context |
| `src/components/gdpr/CookieBanner.tsx` | 74 | Fixed bottom-bar with 4 actions |
| `src/components/gdpr/CookieSettingsDialog.tsx` | 95 | Radix modal with per-category toggles |
| `src/components/gdpr/ConsentCategoryRow.tsx` | 34 | Toggle row helper (extracted to stay <100 lines) |
| `src/components/gdpr/Analytics.tsx` | 43 | Umami gate — only mounts after `consent.analytics === true` |
| `src/components/gdpr/CookieSettingsLink.tsx` | 24 | Footer button to reopen settings dialog |

### Modified files (2)

| File | Change |
|---|---|
| `src/app/(frontend)/[locale]/layout.tsx` | Wraps children in `<CookieConsentProvider>`; mounts `<Analytics />` |
| `src/components/layout/Footer.tsx` | Appends `<CookieSettingsLink />` to legal links row |

## UX choices (confirmed with user)

- **Format**: hybrid — bottom-bar with Accept all / Necessary only / Customize, where Customize opens a settings modal with per-category toggles.
- **Close (X) = Necessary only**: GDPR-conservative per CJEU C-673/17 *Planet49* — absence of explicit consent = no consent.
- **Renewable**: cookie TTL 12 months; visitors can revise via Footer link at any time.

## Cookie attributes

| Attribute | Value | Why |
|---|---|---|
| Name | `__Host-consent` (prod) / `consent` (dev) | `__Host-` prefix requires `Secure`, blocked on plain-HTTP localhost |
| `Path` | `/` | Required by `__Host-` prefix |
| `Secure` | prod=true, dev=false | HTTPS-only in prod; dev runs over HTTP localhost |
| `SameSite` | `Lax` | Sent on top-level navigation, safe vs CSRF |
| `HttpOnly` | `false` | Banner provider reads it client-side to skip banner for returning users |
| `Max-Age` | 31 536 000 (12 months) | §14 "renewable" requirement |

## Architectural notes

### Client-side cookie read (preserves SSG)

`<CookieConsentProvider>` reads `document.cookie` in `useEffect`, **not** via
`cookies()` in the server layout. If we called `await cookies()` in the
layout, every Payload-driven page would become dynamically rendered, killing
the SSG strategy required by §17. By reading client-side after hydration we
keep all pages statically generatable; the banner appears via a single
post-hydration state transition (no flash for returning visitors because
banner mounting is gated on `consent === null`).

### Analytics gate

`<Analytics />` is mounted inside the provider so it can read consent via
context. It returns `null` unless `consent.analytics === true` AND both
`NEXT_PUBLIC_ANALYTICS_URL` / `NEXT_PUBLIC_ANALYTICS_ID` env vars are set
(both already declared optional in `src/lib/env.ts` from earlier setup).

When env vars missing in production → silent skip. In dev → `console.warn`
flags the misconfiguration without breaking the build.

The Umami script uses `strategy="lazyOnload"` per §17 (third-party scripts
must not block render).

### File-size compliance

All files ≤100 lines per §1. `CookieSettingsDialog` initially clocked at
122 lines including a nested `Row` helper component — extracted to
`ConsentCategoryRow.tsx` to comply.

## What's deferred

- **2FA for admin** (`payload-plugin-mfa` placeholder in `users.ts`) → Step 11
- **Sentry integration** → Step 11
- **Tests for cookie flow** (Playwright) → Step 12
- **Umami self-hosted in docker-compose** → Step 13
- **Privacy / Cookie policy content** is already in Payload from Step 8 seed; editors can rewrite via admin

## Manual verification checklist

1. Open `/` in incognito → bottom bar visible with PL/EN/RU localized strings (depending on URL)
2. Click "Accept all" → banner hides, `document.cookie` has `consent` key, value has `analytics:true,marketing:true`
3. Reload page → no banner (consent persisted)
4. Click "Cookie settings" link in footer → modal opens with current toggles checked
5. Toggle Analytics off → click Save → cookie updates; if NEXT_PUBLIC_ANALYTICS_URL is set, Umami script unmounts
6. Test "Necessary only" path: clear cookies, click "Necessary only" → cookie set with `analytics:false`
7. Test X close: clear cookies, click X → equivalent to "Necessary only"
8. Test Umami gate: set both env vars, accept analytics → `<script>` for Umami appears in DOM; revoke → script removed
