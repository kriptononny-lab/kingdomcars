import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { LOCALES, SITE, type Locale } from '@/lib/constants';

/**
 * Dynamic OG image per locale (§7). Renders the brand mark + tagline at
 * 1200×630 — the size every social platform expects. Falls back to system
 * fonts if the custom font fails to load (decorative, not load-blocking).
 *
 * Runtime: Node.js. The Edge runtime can't read from `public/fonts/` via
 * `fs`; we'd have to bundle fonts as imports, which is a lot of glue for
 * marginal latency win on a cached endpoint.
 */

export const runtime = 'nodejs';
export const alt = SITE.NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Params {
  params: Promise<{ locale: string }>;
}

function fontFile(locale: Locale): string {
  return locale === 'ru' ? 'Oswald-Cyrillic.woff2' : 'Oswald-LatinExt.woff2';
}

async function loadFont(locale: Locale): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(path.join(process.cwd(), 'public', 'fonts', fontFile(locale)));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : 'pl';
  const tagline = SITE.TAGLINE[locale];
  const font = await loadFont(locale);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1408 100%)',
        color: '#e6c47a',
        fontFamily: 'Oswald, sans-serif',
        padding: 80,
      }}
    >
      <div style={{ fontSize: 140, fontWeight: 700, letterSpacing: 8, lineHeight: 1 }}>
        {SITE.NAME.toUpperCase()}
      </div>
      <div
        style={{
          fontSize: 36,
          marginTop: 32,
          color: '#f4e4b1',
          maxWidth: 900,
          textAlign: 'center',
          opacity: 0.9,
        }}
      >
        {tagline}
      </div>
    </div>,
    {
      ...size,
      fonts: font ? [{ name: 'Oswald', data: font, style: 'normal', weight: 700 }] : undefined,
    },
  );
}
