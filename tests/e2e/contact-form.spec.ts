import { expect, test } from '@playwright/test';

import { fetchTelegramMockCalls, uniqueName, uniquePhone } from '../fixtures/test-data';

test.describe('Contact form', () => {
  test('successful submission hits the Telegram mock', async ({ page }) => {
    const before = await fetchTelegramMockCalls();
    const baseline = before.count;

    await page.goto('/');
    // The contact form lives inside a ContactFormBlock; scroll it into view.
    const form = page.locator('form').filter({ has: page.getByRole('button', { name: /.+/ }) }).first();
    await form.scrollIntoViewIfNeeded();

    const name = uniqueName();
    const phone = uniquePhone();
    await form.getByRole('textbox').nth(0).fill(name);
    await form.getByRole('textbox').nth(1).fill(phone);
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: /.+/ }).click();

    // Submission is async; allow up to 8s for the action + persistence + mock call.
    await expect.poll(async () => (await fetchTelegramMockCalls()).count, { timeout: 8000 }).toBeGreaterThan(baseline);

    const after = await fetchTelegramMockCalls();
    const last = after.calls.at(-1);
    expect(last?.body).toContain(name);
    expect(last?.body).toContain('parse_mode');
  });

  test('bot honeypot is invisible to users', async ({ page }) => {
    await page.goto('/');
    const honeypot = page.locator('input[name="honeypot"]').first();
    await expect(honeypot).toBeAttached();
    await expect(honeypot).toBeHidden();
  });
});
