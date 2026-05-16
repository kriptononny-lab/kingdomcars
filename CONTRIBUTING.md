# Contributing

Thanks for taking the time to contribute. The rules below are non-negotiable — they exist so any new developer can pick up the codebase in 30 minutes.

## Setup

```bash
nvm use            # picks up .nvmrc → Node 22
npm ci
cp .env.example .env.local   # fill in real values
npm run dev
```

## Code style (§4 of the project prompt)

- **Max 100 LOC per file.** Larger → decompose.
- **One file, one responsibility.** Component that fetches *and* renders *and* formats = 3 files.
- **Server Components by default.** `'use client'` only with a written justification (state / browser API / effect).
- **No barrel `index.ts` re-exports.**
- **No `any`, `@ts-ignore`, `as unknown as`.** `@ts-expect-error` must include a reason comment.
- **No magic numbers/strings.** Add to `src/lib/constants.ts` or co-locate.
- **Imports** sorted automatically (Prettier organize-imports). Groups: external → `@/*` → relative.
- **Aliases** `@/*` only — no `../../../`.

### Naming

| Kind | Convention |
|---|---|
| Component file | `PascalCase.tsx` |
| Hook | `useThing.ts` |
| Utility | `kebab-case.ts` |
| Type | `PascalCase`, no `I` prefix |

## Commits

[Conventional Commits](https://www.conventionalcommits.org/). Enforced by commitlint via lefthook.

Examples:
- `feat(form): add honeypot + zod schema`
- `fix(seo): wrong hreflang on /en/about`
- `refactor(header): split LanguageSwitcher into own file`

## Pull requests

- Open against `main` from a feature branch.
- Fill in the PR template — screenshots for UI, tests for logic.
- All CI checks green; one review required.
- Squash- or rebase-merge only (linear history).

## Testing

```bash
npm run test         # vitest
npm run test:e2e     # playwright
npm run lint
npm run typecheck
```

Coverage targets: ≥ 70% on `src/lib/`, 100% on `lib/telegram.ts`, `lib/rate-limit.ts`, `lib/env.ts`.
