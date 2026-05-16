# ADR-0003: next-intl as the i18n library

- **Status:** Accepted
- **Date:** 2026-02-12
- **Decision-maker:** Project lead

## Context

The site ships in PL (default), EN, RU. UI strings live in JSON files;
content lives in Payload. We need:

- Locale-prefixed routing (`/`, `/en/...`, `/ru/...`).
- **Locale-specific URL slugs** (`/uslugi` vs `/services`).
- `hreflang` alternates including `x-default`.
- Compatibility with App Router + RSC.

Candidates evaluated:

- **next-intl** — App-Router-first, message-loader pattern.
- **react-i18next** — most popular, but designed for Pages Router; App
  Router story relies on a third-party `i18next-nextjs` adapter.
- **next-translate** — abandonware at time of writing (last release 2024).
- **Lingui** — extraction-based, heavy CLI.

## Decision

We use **next-intl 4** with App Router middleware and the `pathnames` config.

## Rationale

1. **Native App Router support.** `setRequestLocale` works inside RSC,
   `useTranslations` inside Client. No adapter layer.

2. **Localised pathnames out of the box.**

   ```ts
   defineRouting({
     pathnames: {
       '/about': { pl: '/o-nas', en: '/about', ru: '/o-nas' },
     },
   });
   ```

   `<Link href="/about">` renders the right URL per locale. Other libs
   require custom redirects.

3. **Statically rendered.** `setRequestLocale(locale)` lets pages opt out of
   dynamic rendering and stay in the ISR cache. Critical for our LCP target.

4. **`localePrefix: 'as-needed'`.** Default locale lives at `/`, others get
   `/en/…`. Matches the spec's URL shape (§3) without a redirect hop.

5. **Small bundle.** No translation engine in the client bundle — messages
   are JSON, looked up by key. Comparable to `react-intl` formatters.

## Trade-offs

- `<Link>` is typed against the `pathnames` enum. Dynamic Payload pages
  (`/[...slug]`) aren't in that enum — for those we use a typed
  `@ts-expect-error` boundary in `NavLink.tsx`. Acceptable; the runtime
  resolution is sound.
- next-intl evolves quickly; v3→v4 had small breaking changes in the
  middleware signature. Pinned exact version in package.json acceptable.

## Alternatives we didn't pick

- `react-i18next` — its App-Router story is a known wart; we don't want the
  half-supported adapter on the upgrade path.
- DIY (`Accept-Language` middleware + JSON loader) — would have to
  re-implement `hreflang`, pathnames, and TypeScript ergonomics. Not worth
  the maintenance.
