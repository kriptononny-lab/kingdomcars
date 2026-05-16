import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * The switcher's accessible name is "Current language: <localised>" — which
 * contains the substring "en" inside "Curr**en**t" for ALL buttons. So
 * `getByRole('button', { name: /en/i })` matches every locale button, not
 * just English. We query by the visible 2-letter code instead, anchored
 * with `^…$` so only the exact `<button>en</button>` matches.
 *
 * Mobile project excluded via `testIgnore` in playwright.config.ts.
 */

function localeButton(page: Page, code: 'pl' | 'en' | 'ru') {
  return page.locator('button').filter({ hasText: new RegExp(`^${code}$`, 'i') }).first();
}

test.describe('Language switcher', () => {
  test('switching to English navigates to /en', async ({ page }) => {
    await page.goto('/');
    await localeButton(page, 'en').click();
    await expect(page).toHaveURL(/\/en(\/.*)?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('switching back to Polish navigates to root', async ({ page }) => {
    await page.goto('/en');
    await localeButton(page, 'pl').click();
    await expect(page).toHaveURL(/^[^?#]*\/(\?.*)?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  });

  test('active locale has aria-current="true"', async ({ page }) => {
    await page.goto('/en');
    await expect(localeButton(page, 'en')).toHaveAttribute('aria-current', 'true');
  });
});
