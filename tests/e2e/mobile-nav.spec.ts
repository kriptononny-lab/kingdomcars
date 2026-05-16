import { expect, test } from '@playwright/test';

/**
 * The drawer is always in the DOM — it slides via `translate-x-full` (closed)
 * / `translate-x-0` (open). Playwright's `toBeVisible()` treats both as
 * "visible" because neither sets `display: none`. We assert on the class
 * instead.
 *
 * Mobile-only: desktop project excluded via `testIgnore` in playwright.config.
 */

const CLOSED_CLASS = /translate-x-full/;
const OPEN_CLASS = /translate-x-0(?!.*translate-x-full)/;

test.describe('Mobile navigation', () => {
  test('drawer opens via hamburger and closes via Esc', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await hamburger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveClass(OPEN_CLASS);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveClass(CLOSED_CLASS);
  });

  test('drawer closes via close button', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await hamburger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveClass(OPEN_CLASS);

    const closeBtn = dialog.getByRole('button').first();
    await closeBtn.click();
    await expect(dialog).toHaveClass(CLOSED_CLASS);
  });

  test('body scroll is locked while drawer is open', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await hamburger.click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
  });
});
