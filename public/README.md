# `public/` — static assets served at `/`

Three deliberate subfolders, each tracked with `.gitkeep` so the directory
exists even when empty (the production `Dockerfile` does
`COPY --from=builder /app/public ./public` — a missing folder breaks the build).

## `fonts/`

Self-hosted `.woff2` font files referenced by `src/lib/fonts.ts` through
`next/font/local`. Google Fonts CDN is **forbidden** (§14 GDPR — that CDN
transmits the visitor's IP to Google without consent). Add at least two
weights per family, set `display: 'swap'` and preload only the weights used
above the fold.

## `favicon/`

Full favicon set. `src/app/manifest.ts` references `/favicon/icon-192.png`
and `/favicon/icon-512.png` for PWA install. A complete set covering Apple
touch + Microsoft tiles is recommended — generate with
[realfavicongenerator.net](https://realfavicongenerator.net/) and drop the
output here.

## `locales/`

Locale-tagged static files (e.g. policy PDFs, locale-specific images). The
**dynamic** OG image is generated at request time by
`src/app/(frontend)/[locale]/opengraph-image.tsx` — there is no static
fallback here. Don't add one unless a specific scraper is observed
mishandling the dynamic URL; modern crawlers (Facebook, X, LinkedIn, Slack,
Discord) all follow the `<meta property="og:image">` URL directly.
