# Stage 0.2 — Cosmetic fixes after Step 10

Small bugs surfaced via visual review + DevTools. Not Step-tier work, but worth fixing before Step 11.

## Files changed

| File | Issue | Fix |
|---|---|---|
| `src/proxy.ts` | `/.well-known/appspecific/com.chrome.devtools.json` probes from Chrome DevTools fell through to the catch-all `[locale]/[...slug]` route, caused 500 errors in dev logs and contributed to "3 errors" count in DevTools | Added `\.well-known` to the matcher's negative lookahead |
| `src/components/layout/Logo.tsx` | Chrome warning "Image with src has either width or height modified, but not the other" — `className="h-auto w-auto"` competed with explicit `width={size} height={size}` attributes | Removed the className; `next/image` sizing through attrs alone is sufficient |
| `src/components/blocks/PricingBlock.tsx` | Pricing rendered as `od80 zł` (no space between "od" and price). Trailing space inside `<span>od </span>` was being trimmed because the next inline node ran without whitespace context | Moved spacing to `mr-1` utility on the `<span>` — visible in any browser regardless of whitespace handling |
| `src/lib/fonts.ts` | "preloaded but not used" warning × 4 in Chrome console. Six `localFont` subsets (Latin / LatinExt / Cyrillic × 2 families) all had `preload: true`, but a typical page uses only one subset — Chrome flags the others | Set all six to `preload: false`. CSS `unicode-range` rules fetch the right subset on demand. Cost: ~50–100 ms FCP on Latin pages because Latin isn't preloaded either. Acceptable trade vs constant warnings. Re-tune in Step 12 with real Lighthouse data |

## Note on placeholder images seen in earlier screenshots

The grey "broken image" icons in the hero and service cards were *not* missing
Payload media. The Hero and Services blocks don't have `image`/`media` fields
in their schemas — they use **inline SVG**: `<HeroVan>` for the hero and
`<ServiceIcon kind="apartment|warehouse|trash|office">` for cards. The
placeholders were a DevTools mobile-emulator rendering artefact (50% zoom +
responsive mode). They render correctly without DevTools, or with DevTools
closed.

No media autoseed needed.

## What changed vs original plan

I had quoted media autoseed as part of Stage 0.2. After auditing the block schemas, that turned out to be unnecessary — there are no `media` references on the home page. Dropped from scope; just the four file edits above.
