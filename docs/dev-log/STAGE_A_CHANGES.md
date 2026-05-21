# STAGE_A_CHANGES.md — критичная структура из §5

Накат поверх текущего проекта закрывает четыре пропуска относительно
архитектурной спеки §5/§19/§20. Ничего не удаляет, только добавляет.

## Что добавлено (19 файлов)

### `.github/` — CI/CD и GitHub-плюшки (§19)

| Файл                                 | Назначение                                                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workflows/ci.yml`                   | install → lint → format:check → typecheck → unit-tests (с coverage artifact) → build (+ bundlewatch informational) → e2e (Playwright + Postgres service) → npm audit (high+) |
| `workflows/deploy.yml`               | push в `main` → build prod-образа → push в GHCR → SSH в прод-хост → `docker compose pull && up -d --no-deps app`. Использует `production` environment для гейтинга.          |
| `workflows/codeql.yml`               | JS/TS security scan: на push, PR, и еженедельно (cron понедельник 04:23 UTC)                                                                                                 |
| `workflows/lighthouse.yml`           | LHCI против билда с моковым Postgres; гейты из существующего `.lighthouserc.json`                                                                                            |
| `dependabot.yml`                     | npm + Docker + github-actions, еженедельно по понедельникам, грейминг (payload/sentry/eslint/testing/types)                                                                  |
| `CODEOWNERS`                         | `* @OWNER` + сужения на инфру, payload-схему, security-чувствительные модули, ADR. **Заменить `@OWNER` на реальный GitHub-хэндл**                                            |
| `PULL_REQUEST_TEMPLATE.md`           | Чек-лист по §4/§13 + скриншоты UI                                                                                                                                            |
| `ISSUE_TEMPLATE/bug_report.yml`      | Структурированный bug-репорт                                                                                                                                                 |
| `ISSUE_TEMPLATE/feature_request.yml` | Feature request с обязательными problem/solution полями                                                                                                                      |
| `ISSUE_TEMPLATE/config.yml`          | Blank issues выключены, security-vuln идёт в Advisories                                                                                                                      |

**Что нужно настроить руками в Settings репозитория** (документировано
для следующего шага):

- Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`,
  `SENTRY_AUTH_TOKEN` (опц.), `LHCI_GITHUB_APP_TOKEN` (опц.)
- Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_HOST`
- Environments: `production` (с required reviewers)
- Branch protection на `main`: required PR + 1 review + checks
  (CI / Lint, Typecheck, Unit tests, Build, E2E, audit / CodeQL), linear history,
  Require review from Code Owners

### `.vscode/` — DX (§20)

| Файл              | Что внутри                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `settings.json`   | formatOnSave, ESLint fixAll, Tailwind classRegex для `cn()`/`cva()`, workspace TS sdk, скрытие .next/coverage/tsbuildinfo из проводника и поиска                           |
| `extensions.json` | 13 рекомендованных расширений (ESLint, Prettier, Tailwind, ErrorLens, GitLens, Pretty TS Errors, YAML, Docker, GH Actions, Playwright, Jest, code-spell, even-better-toml) |
| `launch.json`     | 6 конфигов: Next dev, server attach (port 9229), client Chrome, Vitest current/all, Playwright debug + compound «full debug»                                               |

### `public/` — статика (§5, §11, §14)

| Файл               | Назначение                                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`        | Объясняет три подпапки + GDPR-обоснование self-hosted fonts + что OG генерится через `app/opengraph-image.tsx`, а статические PNG в `public/locales/` — fallback |
| `fonts/.gitkeep`   | Сюда кладутся `.woff2` для `next/font/local` (загрузка из Google Fonts CDN запрещена §14)                                                                        |
| `favicon/.gitkeep` | Полный набор фавиконов; `app/manifest.ts` уже ссылается на `/favicon/icon-{192,512}.png`                                                                         |
| `locales/.gitkeep` | Опциональные статические OG-картинки как fallback для скрейперов                                                                                                 |

Подпапки нужны ещё и потому, что `Dockerfile` делает `COPY --from=builder
/app/public ./public` — без существующей директории build упадёт.

### `Dockerfile.dev` — dev-образ

Простой `node:24-alpine` + `npm ci` + `npm run dev`, с `WATCHPACK_POLLING=true`
и `CHOKIDAR_USEPOLLING=true` для надёжного hot-reload на Docker Desktop
(Windows/macOS bind-mount'ы). Не делает `next build`, не упаковывает
standalone, не оборачивает Sentry.

### `docker-compose.prod.yml` — production overlay

Накатывается через `docker compose -f docker-compose.yml -f docker-compose.prod.yml ...`.
Не дублирует базу — добавляет прод-харденинг:

- `postgres`: убирает `ports: 5432:5432` (через `!override []`), `restart: always`, лимиты cpu 1 / mem 1G
- `app`: `image: ghcr.io/OWNER/REPO:latest` (заменить OWNER/REPO), `build: !reset null`, `read_only: true` с `tmpfs` для `/tmp` и `/app/.next/cache`, `cap_drop: ALL` + минимальные `cap_add`, `no-new-privileges`, лимиты cpu 2 / mem 2G, ужесточённый healthcheck (15s/3s/3)
- `caddy`: `cap_drop: ALL` + `NET_BIND_SERVICE`, лимиты cpu 0.5 / mem 256M

**Что подправить руками:**

1. `.github/CODEOWNERS` — заменить `@OWNER` на реальный GitHub-хэндл
2. `.github/ISSUE_TEMPLATE/config.yml` — заменить `OWNER/REPO` на путь репо
3. `docker-compose.prod.yml` — `image: ghcr.io/OWNER/REPO:latest` → реальный путь

## Что проверено

- Все 9 YAML-файлов парсятся (с поправкой на Compose-специфичный `!override` тег)
- Все 3 JSON-файла парсятся
- Структура `public/` соответствует §5 и не ломает `Dockerfile`'s COPY-инструкцию

## Что НЕ затронуто

- Существующий `docker-compose.yml` — не меняется, продолжает работать как раньше
- Существующий `Dockerfile` — не меняется
- Никакой код в `src/` — не затронут
- `package.json` / `tsconfig.json` / `next.config.ts` — без изменений

## Следующий этап (B)

Чистка мусора в корне репо (`debug-home.html`, `og-*.png`, `coverage/`,
`test-results/`, `tsconfig.tsbuildinfo`, `project-tree.txt`) и перенос
`STAGE_*.md` / `STEP_*.md` / `LOCAL_SETUP_STATUS.md` в `docs/dev-log/`.

Дай отмашку «дальше» → начну Этап B.
