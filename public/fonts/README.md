# Self-hosted variable fonts (GDPR)

The project must **never** load fonts from third-party CDNs (Google Fonts, Cloudflare, etc.) — under EU/PL law that requires explicit consent before the request fires.

## Required files

```
public/fonts/
├── Oswald-Latin.woff2          (~28 KB)
├── Oswald-LatinExt.woff2       (~24 KB, Polish ą/ć/ę/ł/…)
├── Oswald-Cyrillic.woff2       (~16 KB, Russian)
├── SourceSans3-Latin.woff2     (~29 KB)
├── SourceSans3-LatinExt.woff2  (~59 KB)
└── SourceSans3-Cyrillic.woff2  (~19 KB)
```

These are **variable** fonts — weights 200–700 are packed into one file each. Total payload ~175 KB across six files; browsers fetch only the subset(s) needed for the current page's glyphs (handled automatically by next/font/local).

## Source

Both fonts are SIL Open Font License (OFL), redistributable.

Files are extracted from [Fontsource](https://fontsource.org) variable packages:
- `@fontsource-variable/oswald`
- `@fontsource-variable/source-sans-3`

If you need to regenerate them:

```bash
npm pack @fontsource-variable/oswald@latest
tar -xzf fontsource-variable-oswald-*.tgz
# copy package/files/oswald-latin-wght-normal.woff2 → public/fonts/Oswald-Latin.woff2
# etc. (rename per the list above)
```

## Verification

After placing the files, `next/font/local` declarations in `src/lib/fonts.ts` will preload the Latin subsets as critical and serve the rest with `font-display: swap`.

If a file is missing, the dev server throws at startup — that is intentional (fail fast).
