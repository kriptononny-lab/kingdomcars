# Tech debt

> Known issues and deferred work, kept here so they don't get lost between
> sessions. Each entry: what it is, why it was deferred, what's required to
> close it.

## otplib v12 → v13 migration

- **Where:** `src/lib/totp.ts` + `src/lib/totp.test.ts`
- **Why deferred:** otplib v13 is a complete API rewrite; what's currently
  a one-line `totpauth.check()` call becomes a Generator-based factory.
  Migration touches the lib, every test, and may require a one-shot
  re-encoding pass on any existing TOTP secrets if the default key
  encoding changed.
- **Deprecation warnings on `npm install`:**
  ```
  npm warn deprecated @otplib/preset-default@12.0.1
  npm warn deprecated @otplib/plugin-crypto@12.0.1
  npm warn deprecated @otplib/plugin-thirty-two@12.0.1
  ```
- **Closure criteria:**
  1. Rewrite `src/lib/totp.ts` against the v13 generator API
  2. Update all twelve assertions in `src/lib/totp.test.ts`
  3. Confirm `make seed && npm test` + manual login with a Google
     Authenticator–generated secret still verifies on the first try
  4. Bump the dependency in `package.json` and regenerate `package-lock.json`

## 3-step CTA wizard form

- **Where:** new `src/payload/blocks/WizardFormBlock.ts` + `src/components/blocks/WizardFormBlock.tsx`
- **Why deferred:** v1 site has a multi-step guided form ("Co przewozimy?" → details → contact)
  that doesn't exist in v2. The current `contactFormBlock` renders a single-step RHF form.
- **Closure criteria:**
  1. Add `WizardFormBlock` Payload schema with step config (service options, steps list)
  2. Build client-side `WizardFormBlock.tsx` with step state machine (step 1: service select,
     step 2: size/details, step 3: contact + submit)
  3. On step 3 submit, call the same `submitContactAction` used by `ContactForm`
  4. Add `wizardForm` to `page-blocks.ts` registry and `PageBlock` union
  5. Update seed to replace current `contactFormBlock` with `wizardFormBlock` on home page

- **Where:** `scripts/seed.ts` env defaults
- **Why deferred:** session-specific; needs human intervention through the
  Payload admin UI, not a code change
- **Closure criteria:**
  1. Log into `http://localhost/admin` with the seeded credentials
  2. Change the password to something only the operator knows
  3. Optionally, override `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
     production `.env` so a future `make seed` doesn't try to use the
     placeholder default

## GitHub repo settings

- **Where:** github.com/OWNER/REPO → Settings
- **Why deferred:** UI-only, no code artifact
- **Required actions** (documented in `docs/dev-log/STEP_14_15_CHANGES.md`):
  - Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`,
    `DEPLOY_PATH`, optionally `SENTRY_AUTH_TOKEN`,
    `LHCI_GITHUB_APP_TOKEN`
  - Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_HOST`
  - Environments: `production` with required reviewers
  - Branch protection on `main`: required PR + 1 review + all CI
    checks, linear history, "Require review from Code Owners"
- Also: replace `@OWNER` in `.github/CODEOWNERS` and
  `OWNER/REPO` in `.github/ISSUE_TEMPLATE/config.yml` and
  `docker-compose.prod.yml` (`ghcr.io/OWNER/REPO:latest`).
