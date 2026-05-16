import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('Polish home (root) loads with lang=pl', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    await expect(page.locator('main')).toBeVisible();
  });

  test('English home loads with lang=en', async ({ page }) => {
    const res = await page.goto('/en');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('Russian home loads with lang=ru', async ({ page }) => {
    const res = await page.goto('/ru');
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  });

  test('home echoes a request-id header', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const id = res.headers()['x-request-id'];
    expect(id).toBeTruthy();
    expect(id).toMatch(/^[\w.:-]+$/);
  });

  test('hreflang alternates are present on home', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('link[rel="alternate"][hreflang]').count();
    expect(links).toBeGreaterThanOrEqual(3);
  });
});
