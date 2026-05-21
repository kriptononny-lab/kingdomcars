import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * Cookie-consent banner is rendered with `role="region"` and
 * `aria-label={t('cookies.title')}`, which resolves to localised strings
 * ("Pliki cookie" / "Cookies" / "Файлы cookie") — all contain "cookie".
 *
 * `saveConsent` is a Server Action invoked from inside `startTransition()`.
 * That promise is fire-and-forget from the UI's perspective — `click()`
 * returns as soon as React commits the in-memory state change, before
 * the network round-trip that writes the cookie completes. We poll
 * `document.cookie` to bridge the gap.
 */

const bannerLocator = /cookie/i;

async function readBrowserConsentCookie(page: Page) {
  return page.evaluate(() => {
    const match = document.cookie.match(/(?:^|;\s*)(?:__Host-)?consent=([^;]+)/);
    return match ? decodeURIComponent(match[1]!) : null;
  });
}

test.describe('Cookie banner', () => {
  test('appears for first-time visitor', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('region', { name: bannerLocator })).toBeVisible();
  });

  test('accept-all dismisses the banner and persists consent', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: bannerLocator });
    await banner
      .getByRole('button', { name: /akcept|accept|прин/i })
      .first()
      .click();
    await expect(banner).not.toBeVisible();

    // Server action runs in a transition — poll until cookie lands.
    await expect.poll(() => readBrowserConsentCookie(page), { timeout: 5000 }).toBeTruthy();

    const consent = await readBrowserConsentCookie(page);
    expect(consent).toContain('analytics');
    expect(consent).toContain('true');
  });

  test('reject-necessary also dismisses the banner', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: bannerLocator });
    await banner.getByRole('button').nth(1).click();
    await expect(banner).not.toBeVisible();
  });

  test('customize opens the settings dialog', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: bannerLocator });
    await banner.getByRole('button', { name: /dost|custom/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
