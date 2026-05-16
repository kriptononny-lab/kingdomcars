# Summary

<!-- One paragraph: what changed and why. Link the issue: `Closes #123`. -->

## Type of change

- [ ] Bug fix (non-breaking, fixes an issue)
- [ ] Feature (non-breaking, adds functionality)
- [ ] Breaking change (fix or feature that changes existing behaviour)
- [ ] Chore / docs / refactor (no user-visible change)

## Architecture & code quality (§4)

- [ ] No file exceeds **100 lines** (excluding blank lines / licence headers)
- [ ] One file = one responsibility — no mixed "fetch + render + format"
- [ ] No `any`, `as unknown as`, `@ts-ignore` (use `@ts-expect-error` with reason)
- [ ] Imports follow group order (external → `@/*` → relative), no `../../../`
- [ ] Server Components by default — `'use client'` only where genuinely needed
- [ ] No new barrel files (`index.ts` that only re-exports)
- [ ] New constants live in `lib/constants.ts` or alongside the feature

## Tests (§15)

- [ ] Unit / integration tests added or updated
- [ ] E2E test added or updated (if user-facing flow changed)
- [ ] `npm run test` and `npm run test:e2e` pass locally
- [ ] Coverage didn't drop

## Security (§13)

- [ ] No secrets in code, logs, or `NEXT_PUBLIC_*`
- [ ] All user input is validated (Zod) and escaped on output
- [ ] No new `dangerouslySetInnerHTML` without sanitiser or proof-of-safety
- [ ] CORS / CSP / cookie attributes preserved
- [ ] `npm audit` clean at `high` level

## Accessibility (§10)

- [ ] Keyboard-navigable; focus order makes sense
- [ ] All interactive elements have an accessible name
- [ ] Colour contrast ≥ 4.5:1 for text, ≥ 3:1 for UI
- [ ] Touch targets ≥ 44×44 on mobile
- [ ] `prefers-reduced-motion` respected for new animations
- [ ] `@axe-core/playwright` passes on touched pages

## UI screenshots / recordings

<!-- Before / after for visual changes, both desktop and mobile. -->

## Migration steps

<!-- Required if this introduces a breaking change, new env var, or DB migration. -->
