# Stage 0.3 — Post-Step-10 regressions

Five problems surfaced in the dev log after Stage 0.2:

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 1 | `Hydration mismatch: nonce="..." vs nonce=""` on every JSON-LD `<script>` | Browser strips the `nonce` attribute after applying CSP — known React 19 / Next 15+ behaviour with nonce-based strict-CSP. The script still works; the warning is cosmetic. | `suppressHydrationWarning` on the `<script>` in `JsonLd.tsx`. Nonce-specific escape hatch, [issue #77952](https://github.com/vercel/next.js/issues/77952). |
| 2 | `GET /.well-known/appspecific/com.chrome.devtools.json 500` polluting logs | Matcher exclude in `proxy.ts` doesn't prevent Next from routing the URL to `[locale]/[...slug]`; Payload then runs a SQL query with `_locale = '.well-known'` which the Postgres enum rejects. | Explicit `src/app/.well-known/[...path]/route.ts` that returns 404 immediately, never touches the database. |
| 3 | `GET /logo.png 404` + cascading 500 from BD enum mismatch | `HeroVan.tsx` had a leftover `<image href="/logo.png">` from before the WebP migration. | Changed to `/logo.webp`. |
| 4 | Logo aspect-ratio warning still firing | Stage 0.2 fix applied to disk, but Next's `.next/` cache held the old version. | No code change — user should `rm -rf .next` + restart dev. (Documented in install step.) |
| 5 | Any bad slug from a 404 probe cascades into uncaught 500 | `getPageBySlug` threw the raw Postgres error instead of returning `null`. | Wrapped the `payload.find` call in try/catch; on error, return `null` → caller's `notFound()` already handles that path correctly. |

## Files

| File | Type | Size |
|---|---|---|
| `src/app/.well-known/[...path]/route.ts` | NEW | 13 lines |
| `src/components/blocks/hero-parts/HeroVan.tsx` | MODIFIED | 67 lines (one line changed) |
| `src/lib/get-page.ts` | MODIFIED | 108 lines (8 over the 100-line limit — split deferred to Step 12) |
| `src/components/seo/JsonLd.tsx` | MODIFIED | 41 lines |

## Install (Windows PowerShell)

```powershell
cd C:\Users\Sergo\Desktop\v2

# 1. Stop dev server (Ctrl+C in the dev window)

# 2. Clear stale build cache — necessary for Logo aspect-ratio fix
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Extract the archive
Expand-Archive -LiteralPath "C:\Users\Sergo\Desktop\kingdomcars-stage03.zip" `
  -DestinationPath . -Force

# 4. Restart dev
npm run dev
```

## Sanity check after install

After `✓ Ready`, in incognito Chrome on `http://localhost:3000/en` (hard refresh Ctrl+Shift+R) and DevTools open:

- ✅ **No** `Image with src "/logo.webp" has either width or height modified`
- ✅ **No** `Hydration mismatch ... nonce=""`
- ✅ **No** `GET /.well-known/* 500`
- ✅ **No** `GET /logo.png 404`
- ✅ Only the expected `[analytics] consent granted but NEXT_PUBLIC_ANALYTICS_URL...` warning remains

In the dev-server log, the `enum_in` Postgres errors should stop appearing entirely. The `Pulling schema from database...` spinner during requests is normal in dev — gone in production builds.
