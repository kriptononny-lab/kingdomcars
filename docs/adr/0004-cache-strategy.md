# ADR-0004: Cache & revalidation strategy

- **Status:** Accepted
- **Date:** 2026-02-15
- **Decision-maker:** Project lead

## Context

The site is content-heavy (Payload-driven pages) but updates infrequently:
typical editor activity is a few changes per week. Visitors are spread
across PL / EN / RU. We need:

- Fast TTFB on most requests.
- Editorial changes visible within a few seconds without a redeploy.
- A clear story for cache invalidation (`/about` should refresh only `/about`,
  not the whole site).

## Decision

**ISR with `revalidate: 3600` + tag-based `revalidateTag()` from Payload
afterChange hooks.**

- `generateStaticParams` on every locale-aware route enumerates published
  pages at build time.
- `getPageBySlug` uses `unstable_cache` with three tags: `pages`,
  `pages:{locale}`, `pages:{slug}`.
- The `revalidate-page.ts` hook fires `POST /api/revalidate` with the
  shared secret on any page publish/update, targeting the narrowest tag.
- API routes (`/contact`, `/health`) are `cache: 'no-store'`.
- Static assets get `Cache-Control: public, max-age=31536000, immutable`
  via `next/image` defaults.

## Rationale

1. **Build-time SSG + occasional rebuild = best TTFB.** Pages are served
   from the cache on every hit between rebuilds.
2. **Tag-scoped invalidation is precise.** A single page edit doesn't
   purge `/about` and `/services`. Less unnecessary rebuilds, predictable
   perceived freshness.
3. **No external cache.** No Varnish, no Cloudflare in front. Caddy proxies
   raw; Next's in-memory cache handles repeat hits.
4. **Editor experience.** Publish → 1-2 second propagation. Without the
   webhook, content sits behind a 60-min wall.

## Trade-offs

1. **Build needs a live DB.** This is the most surprising consequence —
   `next build` connects to Postgres to collect page data. That dictated
   the `compose up postgres → build app → compose up` orchestration in
   `Makefile :up` and the `build.network: host` setting.
2. **Cache is process-local.** A multi-instance deployment would need
   either shared cache (Redis-backed) or sticky routing per-tag. Single-
   container deployment makes this moot for us.
3. **`unstable_cache` API isn't stable yet.** Next 16 still ships it; we'll
   migrate to whatever lands as the stable replacement when it does.

## What we ruled out

- **Fully dynamic (no caching).** Every request hits Postgres → TTFB
  triples, page becomes a moving target for Lighthouse.
- **Hourly rebuild + cron.** Loses the publish-to-live latency we want.
- **`force-static` with no revalidate.** Means a redeploy on every edit
  — defeats the CMS.
- **Cloudflare in front.** Adds a vendor dependency and additional cache
  layer to invalidate. Not justified at our traffic level.

## Operational note

The revalidate webhook secret must be ≥ 16 chars (`env.ts` enforces).
Rotate it via env update + container restart — no migrations needed.
