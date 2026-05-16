import type { Metadata } from 'next';

/**
 * Root passthrough layout. Each route group ((frontend), (payload)) renders
 * its own `<html>`/`<body>` — this layer just satisfies Next.js' requirement
 * that an `app/layout.tsx` exists at the root.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kingdomcars.example.com'),
  // Favicon set — referenced from public/ paths. Legacy /favicon.ico is
  // auto-served by Next at the root; the others are wired explicitly so the
  // browser picks the right format/size.
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};
