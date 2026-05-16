import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config (§15).
 *
 * Project-level `testIgnore` replaces in-spec `test.skip(callback)` — the
 * latter is only valid inside a test body, not at file top level (the
 * `testInfo` parameter is undefined there). Filtering at the project layer
 * is cleaner anyway: one source of truth for what runs on which viewport.
 *
 * Two parallel `webServer` entries:
 *   1. `telegram-mock-server.ts` (port 9999) — 200 on any POST.
 *   2. `npm run dev` — Next on 3000 with `TELEGRAM_API_BASE` overridden.
 *
 * Tests share the dev database; namespaced via per-run UUIDs.
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      // mobile-only suite is skipped on desktop viewport
      testIgnore: ['**/mobile-nav.spec.ts'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      // desktop-only and visual-snapshot suites only run on desktop
      testIgnore: ['**/language-switcher.spec.ts', '**/visual.spec.ts'],
    },
  ],
  webServer: [
    {
      command: 'npx tsx tests/fixtures/telegram-mock-server.ts',
      port: 9999,
      reuseExistingServer: !isCI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev',
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      env: { TELEGRAM_API_BASE: 'http://localhost:9999' },
    },
  ],
});
