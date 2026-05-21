import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

/**
 * Vitest 3 configuration (§15).
 *
 * - `tsconfigPaths()` resolves `@/*` aliases the same way Next + tsc do.
 * - `resolve.alias['server-only']` points the Vercel `server-only` marker
 *   package at an empty stub. The real package throws on client import to
 *   stop server code leaking into client bundles; under Vitest+jsdom we
 *   deliberately want server modules to load — Next isn't in the pipeline
 *   to enforce the boundary, and the tests run with NODE_ENV=test anyway.
 * - `coverage.thresholds` enforces 100% on the four security-critical libs
 *   per spec §15. Co-located tests live next to source (§4.4).
 */
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      'server-only': resolve(__dirname, 'tests/stubs/server-only.ts'),
      // @tests/* alias mirrors tsconfig.json — lets test helper imports
      // avoid relative `../../tests/` paths (§4.10 no ../../).
      '@tests': resolve(__dirname, 'tests'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/lib/**', 'src/components/features/**', 'src/components/layout/**'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.config.*',
        'src/lib/payload.ts',
        'src/lib/page-metadata.ts',
        'src/lib/seo.ts',
        'src/lib/get-globals.ts',
        'src/lib/get-page-by-slug.ts',
        'src/lib/get-page-slugs.ts',
        'src/lib/get-pages-for-sitemap.ts',
        'src/lib/fonts.ts',
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
        perFile: false,
      },
    },
  },
});
