# Step 12 — Known Issues (a11y)

These bugs were surfaced by `tests/e2e/a11y.spec.ts` (axe-core) during Step 12
e2e validation. They originate in **project source**, not in the tests.

The a11y suite currently runs in **informational mode** (`EXPECT_CLEAN = false`
in `tests/e2e/a11y.spec.ts`): it logs violations per page but doesn't fail the
build. After the cleanup patch lands (post-Step 15), flip `EXPECT_CLEAN` to
`true` to make the suite strict.

---

## 1. `button-name` (critical) — pricing CTA buttons are empty

**Where:** `<button data-cta-service="apartment|warehouse|trash|office">` on
the home page. They render with no text content, no `aria-label`, no
`aria-labelledby`, no `title`.

**Likely cause:** `CtaFormProvider` / pricing block renders the button shell
but doesn't pass the localised `t('cta.book')` (or equivalent) as children.

**Pages affected:** home (PL, EN, RU).

**Fix in cleanup:** inspect the pricing block component, ensure the button
receives visible text — either a `<span>{t('book')}</span>` child or an
`aria-label` matching the service name.

## 2. `link-name` (serious) — Header nav links are empty

**Where:** `<a href="#services">`, `#pricing`, `#reviews`, `#contact-form`
inside `Header.tsx` and Footer.tsx. Render without inner text.

**Likely cause:** `NavLink` component receives `link.label` but the rendered
template doesn't output it as children, OR the Payload `header` global's nav
items have empty `label` fields, OR the i18n key resolution silently returns
"".

**Pages affected:** all pages (the header is in every layout).

**Fix in cleanup:** inspect `src/components/layout/NavLink.tsx` and verify
`{link.label}` is in the JSX output. Also verify the seed-time Payload
header global has non-empty labels for all three locales.

## 3. `color-contrast` (serious) — consent text on gold background

**Where:** the consent disclaimer `<span>` and link `<a>` inside
`<section id="contact-form" class="bg-gold">`. Foreground `#b0b0b0`
(text-muted), background `#e8a825` (gold). Contrast ratio 1.03 vs required 4.5.

**Pages affected:** any page with `ContactFormBlock` on a gold background.

**Fix in cleanup:** change the consent text class from `text-text-muted` to
`text-black` (or `text-text-primary`) when rendered against the gold panel.
The link's underline + black foreground will satisfy contrast.

---

## How to verify after fix

```powershell
# 1. Flip the flag:
#    tests/e2e/a11y.spec.ts → const EXPECT_CLEAN = true;

# 2. Re-run the suite:
npm run test:e2e -- a11y.spec.ts

# Expected: all 3 specs pass with strict assertion.
```

## How to inspect violations as they exist today

```powershell
npm run test:e2e -- a11y.spec.ts
# Console output shows the summary per page; the HTML report
# (playwright-report/index.html) shows full violation details with
# screenshots and DOM context.
```

---

**Owner:** unassigned — slotted for the architectural cleanup patch that
follows Step 15 (Docs). Tracked alongside the rest of the cleanup backlog:
`as never` casts, arbitrary Tailwind values, touch-target 44 px audit,
`/api/contact` locale bug.
