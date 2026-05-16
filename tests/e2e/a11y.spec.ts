import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * Accessibility scan, strict mode.
 *
 * Three known violations were addressed in the architectural cleanup patch
 * (see STEP_12_KNOWN_ISSUES.md):
 *   • button-name → `ServicesBlock` now sets `aria-label={cta || title}`
 *   • link-name   → `NavLink` falls back to anchor/url/slug when label empty
 *   • color-contrast → consent text on `bg-gold` switched to `text-black/80`
 *
 * The suite now asserts NO critical or serious violations. Moderate findings
 * are logged for awareness but don't fail the build (Lighthouse a11y = 100
 * is the production gate per §10).
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const EXPECT_CLEAN = true;
const BANNER = /cookie/i;

async function dismissBanner(page: Page) {
  const banner = page.getByRole('region', { name: BANNER });
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button').nth(1).click();
    await expect(banner).not.toBeVisible();
  }
}

async function scanAndReport(page: Page, label: string) {
  await dismissBanner(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const critical = results.violations.filter((v) => v.impact === 'critical');
  const serious = results.violations.filter((v) => v.impact === 'serious');
  const moderate = results.violations.filter((v) => v.impact === 'moderate');

  // eslint-disable-next-line no-console
  console.log(
    `[a11y:${label}] critical=${critical.length} serious=${serious.length} moderate=${moderate.length}` +
      (results.violations.length > 0
        ? `\n  rules: ${[...new Set(results.violations.map((v) => v.id))].join(', ')}`
        : ''),
  );

  if (EXPECT_CLEAN) {
    expect(results.violations).toEqual([]);
  } else {
    // Informational mode — assert only that axe ran successfully. Real
    // violations are tracked in STEP_12_KNOWN_ISSUES.md and will be fixed
    // in the cleanup patch after Step 15, at which point EXPECT_CLEAN
    // flips to true.
    expect(typeof results.violations.length).toBe('number');
  }
}

test.describe('Accessibility', () => {
  test('home (pl) has no critical axe violations', async ({ page }) => {
    await page.goto('/');
    await scanAndReport(page, 'home-pl');
  });

  test('home (en) has no critical axe violations', async ({ page }) => {
    await page.goto('/en');
    await scanAndReport(page, 'home-en');
  });

  test('about (pl) has no critical axe violations', async ({ page }) => {
    await page.goto('/o-nas');
    await scanAndReport(page, 'about-pl');
  });
});
