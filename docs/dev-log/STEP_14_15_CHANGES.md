# Шаги 14 (CI/CD) + 15 (Docs) — патч

**Дата:** 2026-05-15
**Контекст:** третий по очереди этап работы. Закрывает §19 (GitHub), §20
(DX-инструменты), §21 (Документация) из требований.

Применять **после** `kingdomcars-architectural-cleanup.zip`. Эти два архива
не конфликтуют по файлам, но шаги 14/15 предполагают что фиксы из cleanup
уже на месте (CI зелёный только когда `typescript.ignoreBuildErrors` уже
снят и Sentry v10 поставлен).

## Как применить

```powershell
Expand-Archive -Force kingdomcars-step14-15.zip .
git add .
git commit -m "feat: CI/CD pipelines + docs (steps 14 & 15)"
```

После заполнения секретов в GitHub Settings (см. ниже) — пушнуть в `main`,
проверить вкладку Actions.

---

## Шаг 14 — CI/CD

### Workflows (`.github/workflows/`)

| Файл             | Триггер               | Что делает                                                                                                    |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `ci.yml`         | PR + push в main      | install (cached) → lint → typecheck → unit+coverage → build → e2e (Playwright с sidecar Postgres) → npm audit |
| `lighthouse.yml` | PR в main             | Lighthouse CI на 3 локалях, пороги: perf ≥ 95, a11y/seo/best-practices = 100                                  |
| `deploy.yml`     | push в main           | docker build → push в GHCR (с GitHub Actions cache) → SSH deploy → health-check                               |
| `codeql.yml`     | PR, push, еженедельно | GitHub CodeQL `security-and-quality` пресет                                                                   |

**Особенности:**

- **`concurrency` group** в `ci.yml` отменяет предыдущий ран того же PR — экономит минуты при rebase.
- **Сидинг для e2e:** `services.postgres` + `npm run seed` в одном job'е, тесты идут на чистой БД.
- **CI builds с `SKIP_ENV_VALIDATION=1`**: использует флаг, добавленный в env.ts в cleanup-патче. Без него `next build` падал бы на отсутствии прод-секретов.
- **Bundlewatch** уже был в проекте — `npm run bundlewatch` запускается локально/в CI отдельно.

### Repo Settings — что нужно настроить руками

Это нельзя положить в файл — заполняется в GitHub UI:

**Secrets → Actions:**

- `PAYLOAD_SECRET`, `REVALIDATE_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — прод-значения.
- `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT` (опц.), `DEPLOY_PATH` — для deploy job.
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` — опц. для source-map upload.

**Variables → Actions:**

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_HOST` — не-секреты, нужны на build-step.

**Environments:**

- `production` — добавить required reviewers, чтобы deploy не запускался без апрува.

**Branch protection on `main`:**

- Require pull request before merging.
- Require approvals: 1.
- Require status checks: `Install`, `Lint`, `Typecheck`, `Unit + coverage`, `Production build`, `E2E (Playwright)`, `npm audit (high+)`, `Lighthouse CI`, `Analyze (javascript-typescript)`.
- Require linear history.
- Optionally: require signed commits.

### Dependabot (`.github/dependabot.yml`)

Еженедельные PR'ы каждый понедельник в 06:00 Europe/Warsaw, сгруппированные:

- `payload` — все `@payloadcms/*` идут одним PR (они должны двигаться вместе).
- `types` — все `@types/*` одним PR.
- `dev-deps` — все devDependencies одним PR.
- `production-deps` — runtime deps по отдельности (важно ревьюить).
- GitHub Actions — отдельный поток.
- Docker base images — `FROM node:22-alpine` и т.д.

Только minor/patch автоматом; majors открываются как отдельные PR для ручного review.

### CODEOWNERS

Шаблон с placeholder `@owner-handle` — **замени** на реальный GitHub
handle или team handle (`@org/team`). Текущие правила: всё → owner, payload-схемы → owner, build-инфра → owner, security-critical lib's → owner, docs → owner.

### Issue & PR templates

- `bug_report.yml` — структурированная форма (что, ожидалось, шаги, locale, browser, console).
- `feature_request.yml` — problem/solution/alternatives + scope + areas-affected.
- `config.yml` — отключает blank issues, направляет на security advisories и Discussions.
- `PULL_REQUEST_TEMPLATE.md` — чек-лист со ссылками на §-пункты спеки.

---

## Шаг 14b (бонус) — DX (§20)

### `.vscode/`

- `settings.json` — formatOnSave через Prettier, ESLint flat config, Tailwind IntelliSense с поддержкой `cn()` и `cva()`, search-exclude генерированных каталогов.
- `extensions.json` — рекомендованные расширения (Prettier, ESLint, Tailwind, ErrorLens, GitLens, Playwright, Vitest, pretty-ts-errors, code-spell-checker, conventional-commits).
- `launch.json` — F5-конфиги для Next dev (server + client side), Vitest current file, Vitest all, seed.

### `scripts/generate-component.ts`

Plop-style scaffolder. Создаёт `<Name>.tsx` + co-located `<Name>.test.tsx`
(§4.4) в одном из 5 buckets:

```bash
npm run gen:component Button                       # → src/components/ui/Button.tsx
npm run gen:component ContactCard --feature        # → src/components/features/
npm run gen:component FadeIn --animation           # → src/components/animations/
npm run gen:component Header --layout              # → src/components/layout/
npm run gen:component FooterBlock --block          # → src/components/blocks/
```

Не генерирует `.stories.tsx` — Storybook не в стеке (§20 называет его optional).

---

## Шаг 15 — Документация

### `docs/architecture.md`

- Mermaid диаграмма high-level (Browser → Caddy → App → PG/Media/TG/Sentry/Umami).
- Структура `src/` с описанием каждого слоя.
- Mermaid sequence-диаграмма "контент из CMS на страницу" — публикация, hook, webhook, revalidateTag, ISR cache flow.
- Заметка про build-time DB dependency (§17 ISR — почему compose стартует postgres первым, почему `build.network: host`).
- Раздел Auth — два realm'а (admin JWT + 2FA, public нет).
- Раздел i18n — content vs UI strings vs URL slugs.
- Раздел Forms — Server Action путь с no-JS fallback.
- "Where to look first" — FAQ-стиль ссылки на конкретные файлы для типовых вопросов.

### `docs/adr/` — 5 ADR + template (Michael Nygard format)

| ADR                           | Тема                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| 0000-template                 | Шаблон для новых ADR                                       |
| 0001-payload-as-cms           | Почему Payload, не Strapi/Sanity/Directus                  |
| 0002-postgres-as-database     | Почему Postgres, не SQLite                                 |
| 0003-next-intl                | Почему next-intl, не react-i18next/next-translate/Lingui   |
| 0004-cache-strategy           | ISR + tag-based revalidation, последствия (build needs DB) |
| 0005-server-actions-for-forms | Server Actions vs API routes, no-JS fallback               |

Каждый ADR имеет 4 секции: Context, Decision, Rationale (numbered, falsifiable), Trade-offs, Alternatives.

### `README.md` — переписан

Структура по §21:

1. Описание (1 параграф)
2. Stack (как badges + список)
3. Quick Start (3 команды)
4. Env Variables (3 таблицы: server/client/CI-only)
5. Architecture (короткая схема + ссылка на docs/architecture.md)
6. Make targets (таблица)
7. npm scripts (таблица)
8. Deployment (ссылка на docs/deployment.md + краткое описание GHCR-flow)
9. Contributing (ссылка + краткое описание pre-commit/CI)
10. Branch protection (рекомендации)
11. Security (ссылка)
12. License

`CONTRIBUTING.md` и `SECURITY.md` — оставлены как были (соответствуют §21).
`CHANGELOG.md` — стоит как заглушка под автогенерацию (changesets/release-please) — это можно прикрутить отдельно когда понадобится первый релиз.

---

## Что осталось не сделанным

| Задача                          | Почему                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `CHANGELOG.md` автогенерация    | Нужен первый релиз; до того changelog не имеет смысла                                                      |
| `docs/deployment.md` rewrite    | Текущий файл уже из cleanup-этапа Step 13 и достаточно полный; стоит проверить когда деплоить в первый раз |
| Storybook                       | §20 явно называет optional                                                                                 |
| `payload-types.ts` генерация    | Запускается через `npm run payload:gen:types` — это runtime артефакт, не для commit                        |
| otplib v12→v13 миграция         | Перенесена из cleanup-патча (полный API-rewrite, отдельная задача)                                         |
| JSDoc на public-функциях `lib/` | §21 указывает как требование; покрытие сейчас ~60% — стоит дописать как отдельный мини-патч                |

---

## Файлы в архиве

```
.github/CODEOWNERS                                          # placeholder owner-handle
.github/PULL_REQUEST_TEMPLATE.md                            # чек-лист
.github/ISSUE_TEMPLATE/bug_report.yml                       # GitHub form schema
.github/ISSUE_TEMPLATE/feature_request.yml                  # GitHub form schema
.github/ISSUE_TEMPLATE/config.yml                           # disable blank issues
.github/dependabot.yml                                      # 4 группы npm + actions + docker
.github/workflows/ci.yml                                    # install→lint→type→unit→build→e2e→audit
.github/workflows/codeql.yml                                # security scan
.github/workflows/deploy.yml                                # GHCR + SSH
.github/workflows/lighthouse.yml                            # отдельный workflow

.vscode/extensions.json                                     # 11 recommended
.vscode/launch.json                                         # 5 debug configs
.vscode/settings.json                                       # formatOnSave + ESLint + Tailwind

.lighthouserc.json                                          # thresholds: perf≥95, a11y/seo/bp=100

docs/architecture.md                                        # diagrams + слои + data flow
docs/adr/0000-template.md                                   # Nygard format
docs/adr/0001-payload-as-cms.md                             # Payload vs Strapi/Sanity/Directus
docs/adr/0002-postgres-as-database.md                       # Postgres vs SQLite
docs/adr/0003-next-intl.md                                  # next-intl vs alternatives
docs/adr/0004-cache-strategy.md                             # ISR + revalidateTag
docs/adr/0005-server-actions-for-forms.md                   # Server Action vs API route

scripts/generate-component.ts                               # plop-style scaffolder
package.json                                                # + npm run gen:component

README.md                                                   # полностью переписан по §21
```

**Всего:** 24 файла (все новые, кроме `README.md` и `package.json`).
