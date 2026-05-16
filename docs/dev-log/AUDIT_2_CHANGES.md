# KingdomCars — Audit 2 (2026-05-15)

> Повторный архитектурный аудит после `SESSION_HANDOFF_2026-05-15_audit.md`.
> Тот handoff утверждал, что проект приведён к спеке за четыре stage-патча.
> Этот аудит **проверил утверждение по факту на содержимом `v2.zip`** и
> закрыл несколько реальных расхождений.

## TL;DR

Спека требует, чтобы корень репозитория содержал `.github/`, `.vscode/`,
`public/` (§5). В `v2.zip` этих директорий **физически нет** — несмотря
на запись в предыдущем handoff'е о том, что Этап A их добавил. Плюс
обнаружены три мелких расхождения с §20 и косметика. Всё закрыто.

```
✓ §4   Файлы ≤ 100 строк            max 100 (CookieConsentProvider.tsx)
✓ §4   No barrels                    оба index.ts — value-файлы (PageBlock union, pageBlocks runtime registry)
✓ §4   No `any` / `@ts-ignore`       0 совпадений
✗→✓ §5  .github/ + .vscode/ + public/  отсутствовали — восстановлены
✗→✓ §20 eslint-plugin-security        не был подключён — добавлен
✓ §13   server-only в prod deps       реальный пакет, не стаб (ADR-0006)
```

## Что обнаружено vs handoff

Handoff `SESSION_HANDOFF_2026-05-15_audit.md` утверждал:

> ✓ §5 Структура проекта — `.github + .vscode + public + compose.prod + Dockerfile.dev`

Фактически в `v2.zip` присутствуют только `Dockerfile.dev` и
`docker-compose.prod.yml`. Три директории `.github/`, `.vscode/`,
`public/` отсутствуют целиком. Не знаю причину расхождения — возможно,
PowerShell `Expand-Archive -Force` не накатил dotted-директории, либо
zip переархивировался из состояния до Stage A. Не важно. Gap реальный,
закрыт в этом аудите.

Ещё три мелких:

1. **`eslint-plugin-security`** — §20 явно перечисляет его в списке
   плагинов, в `eslint.config.mjs` его не было.
2. **`.gitignore`** имел дубль блока `debug-home.html / og-*.png /
   project-tree.txt` (строки 45-48 и 50-53). Косметика.
3. **`tsconfig.tsbuildinfo`** в working tree — gitignored (`*.tsbuildinfo`),
   так что коммитом не уйдёт, но мусорит в `ls`.
4. **`docs/dev-log/README.md`** — таблица упоминала только Stage A,
   плюс блок «принципиальных решений» ссылался на отменённый план
   `local-packages/server-only/` (отменён в Stage D в пользу реального
   пакета + двух стабов, см. ADR-0006).

## Что в патче (20 файлов в `audit-2-fixes.zip`)

### `.github/` — CI/CD и GitHub-плюшки (9 файлов, §19)

| Файл | Назначение |
|---|---|
| `workflows/ci.yml` | install → lint + format:check → typecheck → unit (с coverage artifact) → build (`SKIP_ENV_VALIDATION=1` + bundlewatch) → e2e (Playwright + Postgres service) → npm audit (high) → Lighthouse CI. Параллельные jobs, общий npm cache. |
| `workflows/deploy.yml` | push в `main` → build prod-образа → push в GHCR с двумя тегами (`sha-…` immutable + `latest`) → SSH в прод-хост → `docker compose pull && up -d --no-deps app`. Гейт через GitHub Environment `production`. |
| `workflows/codeql.yml` | JS/TS security scan: push, PR в `main`, и еженедельно (понедельник 04:23 UTC). |
| `dependabot.yml` | npm + Docker + github-actions, weekly, monday 04:00 Europe/Warsaw. Группировки: payload, sentry, eslint, testing, types, next, react, tailwind. |
| `CODEOWNERS` | `* @OWNER` + сужения на инфру, payload-схему, security-чувствительные модули, ADR (immutable). **Заменить `@OWNER` на реальный handle.** |
| `PULL_REQUEST_TEMPLATE.md` | Чек-лист §4 (архитектура), §15 (тесты), §13 (security), §10 (a11y) + UI-скриншоты + migration steps. |
| `ISSUE_TEMPLATE/bug_report.yml` | Структурированный bug с обязательными steps/expected/actual + severity P0–P3. |
| `ISSUE_TEMPLATE/feature_request.yml` | Feature request с problem/solution/alternatives + cross-cutting concerns чек-лист. |
| `ISSUE_TEMPLATE/config.yml` | Blank issues выключены, security → Advisories. **Заменить `OWNER/REPO`.** |

### `.vscode/` — DX (3 файла, §20)

| Файл | Что внутри |
|---|---|
| `settings.json` | formatOnSave, ESLint flat-config fixAll, Tailwind classRegex для `cn()`/`cva()`/`clsx()`, workspace TS sdk, скрытие `.next/coverage/tsbuildinfo/payload-types.ts` из проводника и поиска. |
| `extensions.json` | 13 рекомендованных + 2 unwanted (dprint, stylelint конфликтуют со стеком). |
| `launch.json` | 6 конфигов: Next dev server, attach к 9229, Chrome client, Vitest current/all, Playwright UI + compound «full debug». |

### `public/` — статика (4 файла, §5, §11, §14)

| Файл | Назначение |
|---|---|
| `README.md` | Объясняет три подпапки. GDPR-обоснование self-hosted шрифтов. **Без** ложного «fallback для скрейперов» — современные crawler'ы (FB/X/LinkedIn/Slack/Discord) идут по URL из `<meta property="og:image">` напрямую. |
| `fonts/.gitkeep` | `.woff2` для `next/font/local` (Google Fonts CDN запрещён §14). |
| `favicon/.gitkeep` | Полный набор; `app/manifest.ts` уже ссылается на `/favicon/icon-{192,512}.png`. |
| `locales/.gitkeep` | Опциональные locale-tagged статики. |

Директории нужны ещё и потому, что `Dockerfile` делает
`COPY --from=builder /app/public ./public` — отсутствующая папка ломает build.

### Модифицированные файлы (4)

| Файл | Изменение |
|---|---|
| `.gitignore` | Удалён дубль блока `debug-home.html / og-*.png / project-tree.txt`. |
| `package.json` | Добавлен `"eslint-plugin-security": "^3.0.1"` в `devDependencies` (alphabetical insertion между `jsx-a11y` и `unicorn`). |
| `eslint.config.mjs` | Импорт + `security.configs.recommended` в массив конфигов. Отключены `detect-object-injection` (высокий false-positive rate на типобезопасных `obj[enum]` обращениях; реальный surface защищён `noUncheckedIndexedAccess` + Zod) и `detect-non-literal-fs-filename` (Vitest/seed-скрипты легитимно строят пути динамически). Обоснование в шапке файла. |
| `docs/dev-log/README.md` | Добавлены строки про Stage B/C/D + handoff + этот аудит + TECH_DEBT. Блок «принципиальных решений» обновлён: про `server-only` — настоящий пакет, не стаб; добавлены пояснения про union-builder и compose-overlay. |

## Как накатить

```powershell
# Из корня проекта (где лежит package.json):
cd C:\Users\Sergo\Desktop\v2

# 1. Распаковать поверх — четыре новых директории и четыре перезаписи
Expand-Archive -Path .\audit-2-fixes.zip -DestinationPath . -Force

# 2. Удалить мусорный build artifact (gitignored, но мусорит)
Remove-Item .\tsconfig.tsbuildinfo -ErrorAction SilentlyContinue

# 3. Подтянуть eslint-plugin-security
npm install

# 4. Sanity-check — стек должен оставаться зелёным
npm run lint
npm run typecheck
npm test
docker compose ps
```

Ожидается: lint 0 ошибок, typecheck 0, тесты 100/100, контейнеры healthy.

### Возможные сюрпризы после `npm run lint`

`eslint-plugin-security` recommended-набор содержит десяток правил.
Отключил два самых шумных (`detect-object-injection`, `detect-non-literal-fs-filename`),
но остальные могут зафлажить:

- `detect-unsafe-regex` — если где-то есть катастрофический backtracking (например, `(.+)+$`)
- `detect-non-literal-regexp` — `new RegExp(userInput)`
- `detect-eval-with-expression` — `eval()` / `Function()` с переменной
- `detect-pseudoRandomBytes` — `Math.random()` для security-чувствительных задач

Если что-то всплывёт — это будет один из трёх случаев:

1. **Ложное срабатывание** на безопасном паттерне → `// eslint-disable-next-line security/<rule>` с однострочным rationale-комментарием.
2. **Реальный issue** → пофиксить.
3. **Очень шумно по проекту** → отключить правило глобально в `eslint.config.mjs` рядом с двумя уже отключёнными, с обоснованием в шапке-комментарии.

Если хочешь играть осторожно — могу заменить `security.configs.recommended`
на пустой объект и включать правила точечно. Но это уже отступление от §20,
который говорит «eslint-plugin-security» без уточнений по конфигу.

## Чего НЕ сделал и почему

| Задача | Причина |
|---|---|
| `npm install` | Не моё окружение — у тебя на Windows. |
| Запуск `docker compose ps` / `make up` | Тоже не моё окружение. |
| Замена `@OWNER` в CODEOWNERS и `OWNER/REPO` в Issue config / compose.prod | Это твои реальные значения — впишешь сам. Уже в `TECH_DEBT.md` из прошлого handoff'а. |
| Branch protection / GitHub Secrets / Environment | Настраиваются в Settings репозитория, кодом не задаются. Чек-лист в `TECH_DEBT.md`. |
| otplib v12 → v13 | В `TECH_DEBT.md`. Breaking API, требует переписывания `totp.ts` + 12 ассертов. Не архитектурное расхождение — только deprecation warnings. |
| Storybook | §20 явно говорит «опционально». |
| `@typescript-eslint/strict-type-checked` | Требует включения type-aware linting (`parserOptions.project`), что значительно замедлит lint и каскадно создаст десятки новых ошибок. Текущий конфиг уже жёстко запрещает `any` и `consistent-type-imports`. Если хочешь strict-type-checked — отдельной фазой, не в этом коммите. |

## Следующие шаги после применения

1. **Первый git commit этого состояния** отдельным коммитом:
   ```bash
   git add .
   git commit -m "chore: architectural cleanup pass (audit 2, 2026-05-15)"
   ```

2. **GitHub Settings** (один раз, по чек-листу из `TECH_DEBT.md`):
   - Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`, опц. `SENTRY_AUTH_TOKEN`, `LHCI_GITHUB_APP_TOKEN`
   - Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_HOST`
   - Environment `production` с required reviewers
   - Branch protection на `main`: required PR + 1 review + checks + linear history + Require review from Code Owners

3. **Заменить плейсхолдеры** (точечный коммит):
   - `.github/CODEOWNERS` — `@OWNER` → реальный handle
   - `.github/ISSUE_TEMPLATE/config.yml` — `OWNER/REPO` × 2
   - `docker-compose.prod.yml` — `ghcr.io/OWNER/REPO:latest`

4. **Заполнить `public/fonts/` и `public/favicon/`** реальными файлами.
   До этого — `app/manifest.ts` будет ссылаться на 404, и Lighthouse
   будет ругаться в CI. Это блокер для зелёного `lighthouse.yml`.

5. **После push в репозиторий** — `ci.yml` зажжётся на первом PR.
   Если что-то красное — это, скорее всего, либо `eslint-plugin-security`
   ругается на конкретный паттерн (см. выше), либо Lighthouse валится
   из-за отсутствующих favicon. Точечный фикс.

## Артефакты этой сессии

- `audit-2-fixes.zip` — 20 файлов: 16 новых + 4 модифицированных
- `AUDIT_2_CHANGES.md` — этот документ (положи в `docs/dev-log/` после применения)

Стек должен остаться живым: ни одного изменения в `src/`, в Payload-схеме,
в `next.config.ts`, в Docker, в Caddy, в тестах. Только инфраструктура
вокруг проекта (CI/CD, IDE, статика) и одна строка в `eslint.config.mjs`.
