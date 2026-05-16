import { expect, test } from '@playwright/test';

/**
 * Visual regression — desktop-only (mobile device-pixel scaling makes
 * snapshots noisy). Mobile project is excluded via `testIgnore` in
 * playwright.config.ts.
 */
test.describe('Visual regression', () => {
  test('home (pl) above-the-fold matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: '[role="region"][aria-label*="cookie" i] { display: none !important; }',
    });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-pl.png', { fullPage: false });
  });

  test('home (en) above-the-fold matches snapshot', async ({ page }) => {
    await page.goto('/en');
    await page.addStyleTag({
      content: '[role="region"][aria-label*="cookie" i] { display: none !important; }',
    });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-en.png', { fullPage: false });
  });

  test('about (pl) matches snapshot', async ({ page }) => {
    await page.goto('/o-nas');
    await page.addStyleTag({
      content: '[role="region"][aria-label*="cookie" i] { display: none !important; }',
    });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('about-pl.png', { fullPage: false });
  });
});
