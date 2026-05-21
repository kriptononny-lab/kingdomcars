# KingdomCars — Session Handoff 2026-05-15

## TL;DR — текущий статус

**Стек поднят и работает end-to-end.** Docker compose стек из 3 контейнеров (postgres + app + caddy) собирается с нуля и стартует:

```
curl http://localhost/api/health → 200 OK
                                   {"status":"ok","payload":"up","db":"up"}
```

Image `v2-app:latest` собран за 149 секунд без `--legacy-peer-deps`, без `ignoreBuildErrors`, 100/100 тестов проходят, lint и typecheck зелёные.

Учётка админа: `admin@kingdomcars.example.com` / `ChangeMe!Now123` (поменять при первом логине).

## Что сделано в этой сессии

Прошли все стадии из плана: применены 2 архитектурных патча, починены 130 lint-ошибок (вылезли после `npm install` с обновлённым unicorn-plugin), починены 9 настоящих TS-ошибок (которые прятались под `ignoreBuildErrors: true`), починен Docker build (была цепь проблем: lockfile sync → Node 22 vs 24 → npm 10 vs 11 → `.npmrc` legacy-peer-deps → `String.raw` в config.matcher).

### Прошли quality gates с нуля

- `npm run lint` — 0 errors, 0 warnings (было 130 errors)
- `npm run typecheck` — 0 errors (было 9 настоящих, спрятанных под флагом)
- `npm test` — 100/100 passed (11 тест-файлов, +1 новый env-валидационный)
- `npm run seed` — заполняет БД, создаёт админа, накатывает страницы
- `docker compose build app` — successful image build
- `docker compose up -d` — 3 healthy контейнера

### Применённые патчи (10 файлов в outputs)

В порядке применения:

1. **`kingdomcars-architectural-cleanup.zip`** (25 файлов) — главный cleanup-патч из предыдущей сессии. Sentry v9→v10, server-only ESM stub, `ignoreBuildErrors` снят, locale bug fix, a11y fixes, contrast fix.

2. **`kingdomcars-step14-15.zip`** (24 файла) — CI/CD workflows + 6 ADRs + docs/architecture.md + VS Code config + Lighthouse + dependabot.

3. **`kingdomcars-lint-cleanup.zip`** (17 файлов) — фиксы lint-ошибок после npm install:
   - eslint.config.mjs: убраны дубликаты jsx-a11y/import (бандлятся в eslint-config-next), добавлены coverage/playwright-report/test-results в ignores, отключены 5 unicorn-правил которые конфликтуют с архитектурой (consistent-function-scoping, no-await-expression-member, prefer-global-this, prefer-module, import-style), добавлен argsIgnorePattern `^_` для @typescript-eslint/no-unused-vars
   - CLI скрипты (seed, migrate, patch-payload, telegram-mock): точечные disable `unicorn/no-process-exit` с rationale
   - React effects (AnimatedCounter, CookieConsent, CookieSettings): точечные disable `react-hooks/set-state-in-effect` (новое строгое правило React 19.2)
   - Type imports в e2e тестах, MobileMenu.test, setup.ts
   - utils.ts: replaceAll вместо replace, убрана object-default-param
   - types/blocks/index.ts: переписан через `export type { ... } from './module'`

4. **`kingdomcars-lint-cleanup-2.zip`** (5 файлов) — финальная зачистка lint:
   - CookieConsentProvider: disable `no-useless-undefined` (tri-state намеренный)
   - CookieSettingsDialog: disable перемещён на конкретные setState вызовы
   - JsonLd: replaceAll + String.raw
   - cookie-banner.spec: `5_000` → `5000`
   - setup.ts: typeof import → import type \* as NextIntl

5. **`kingdomcars-typecheck-fixes.zip`** (6 файлов) — фиксы 9 настоящих TS-ошибок:
   - scripts/seed.ts: убраны 4× `@ts-expect-error` (Payload API стал лояльнее)
   - actions/submit-contact.ts: убран лишний @ts-expect-error, err→error
   - app/(payload)/layout.tsx: rewrite с `serverFunction` + `handleServerFunctions` (Payload 3 beta-128 breaking change)
   - components/animations/motion-constants.ts: `EASE_OUT_QUART` → tuple [n,n,n,n] (framer-motion v12 narrowed Transition['ease'])
   - lib/logger.ts: `headers?: ...` опциональный (2 функции)
   - tests/fixtures/env-stubs.ts: cast `process.env as Record<string, string|undefined>` (@types/node 22+ readonly NODE_ENV)

6. **`kingdomcars-fix-payload-layout.zip`** (1 файл) — изменил импорт `handleServerFunctions` с `@payloadcms/next/utilities` (не существует) на `@payloadcms/next/layouts`.

7. **`kingdomcars-dockerfile-node24.zip`** (1 файл) — обновлён Dockerfile: Node 22→24 на всех 3 стадиях, добавлен `RUN npm install -g npm@11` (синхронизация с npm 11.8 на хосте), восстановлен `COPY --from=deps /app/node_modules`.

8. **`kingdomcars-dockerfile-npmrc.zip`** (1 файл) — добавлен `.npmrc*` в `COPY package.json package-lock.json* .npmrc* ./`. Без него Docker без флага `legacy-peer-deps=true` пытался резолвить peer-deps (monaco-editor, webpack, yjs), которых не было в lockfile.

### Ad-hoc фиксы (без архива, через PowerShell)

- `src/proxy.ts`: `config.matcher` с `String.raw\`...\``обратно в обычный string literal с экранированием`\\.`. Next 16 webpack-парсер не поддерживает TaggedTemplateExpression в `config.matcher[0]`. Добавлен точечный `// eslint-disable-next-line unicorn/prefer-string-raw -- ...`
- `node_modules/server-only/`: создан физический stub (package.json + index.js + index.mjs с правильным exports map для CJS+ESM). Это **временный фикс** — не переживает `npm ci`. Постоянное решение запланировано как следующий шаг.

## Что осталось доделать (по убыванию приоритета)

### 1. server-only как локальный пакет проекта (РАБОТА В ПРОЦЕССЕ)

**Проблема:** `node_modules/server-only/` стирается при любом `npm ci` или `npm install` (если main lockfile не содержит этой записи). У нового разработчика или в CI seed/migrate упадут с `Cannot find module 'server-only'`.

**План:**

1. Создать `local-packages/server-only/` с тремя файлами (package.json, index.js, index.mjs) — те же что сейчас в node_modules
2. Добавить в `package.json`:
   ```json
   "dependencies": {
     "server-only": "file:./local-packages/server-only"
   }
   ```
3. `npm install` создаст симлинк/copy в node_modules автоматически
4. Создать `docs/adr/0006-server-only-stub.md` объясняющий почему стаб нужен (Vitest+jsdom, tsx CLI скрипты — не в Next pipeline)

**Я начал делать в моей копии когда сессия закончилась.** В следующей сессии — продолжить с создания трёх файлов в `local-packages/server-only/`, обновить package.json, прогнать `npm install`, убедиться что `npm run seed` работает (сначала удалить руками `node_modules/server-only/` чтобы проверить что симлинк из local-packages работает).

### 2. Косметика: `src/app/(payload)/layout.tsx`

В файле слегка покороблены метаданные после неудачных heredoc-вставок через PowerShell. Семантически работает (TS не ругается, рантайм OK, Payload-админка использует свои метаданные). Эталонная версия — в zip `kingdomcars-fix-payload-layout.zip`. Чинится открытием в VS Code и заменой содержимого на эталон.

Эталон файла:

```tsx
/* eslint-disable */
import type { Metadata } from 'next';
import config from '@payload-config';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import '@payloadcms/next/css';
import { importMap } from './importMap';

type Args = { children: React.ReactNode };

export const metadata: Metadata = {
  title: 'KingdomCars admin',
  description: 'CMS for KingdomCars',
};

/**
 * Required since Payload 3 beta-128: the admin RootLayout now needs a
 * Server Function to handle form-state, field-validation, and similar
 * round-trips that used to hit /api/form-state. `handleServerFunctions`
 * is the single entry that dispatches them.
 *
 * @see https://github.com/payloadcms/payload/pull/8481
 */
const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
```

### 3. otplib v12 → v13 миграция

Отложено как non-blocking. v13 — полностью переписанный API. См. `npm warn deprecated @otplib/preset-default@12.0.1 / @otplib/plugin-crypto@12.0.1 / @otplib/plugin-thirty-two@12.0.1`. Затронет `src/lib/totp.ts` и его тесты.

### 4. GitHub Settings (для CI/CD из step14-15)

Документировано в `STEP_14_15_CHANGES.md`. Нужно настроить:

- Secrets: SENTRY_AUTH_TOKEN, deploy keys, etc
- Variables: NEXT_PUBLIC_SITE_URL, environments
- Environments: production, staging
- Branch protection: main → required reviews + checks
- CODEOWNERS работает только если включить branch protection с code owners

### 5. Сменить дефолтный admin password

`admin@kingdomcars.example.com` / `ChangeMe!Now123` → залогиниться в http://localhost/admin и поменять. Дальше `SEED_ADMIN_PASSWORD` env-var управляет дефолтом (см. `scripts/seed.ts`).

## Ключевые конфигурации проекта

### Хост (Windows)

- Path: `C:\Users\Sergo\Desktop\v2\`
- Node 24.13.1, npm 11.8.0
- Docker Desktop 4.73, engine linux/amd64
- PowerShell + PSReadLine (нестабилен на длинных heredoc; крэшится при больших вставках — используем notepad или zip-патчи для больших правок)

### .env (генерировался ранее, у пользователя на диске)

```
POSTGRES_PASSWORD=DE47tidGNfOTp6ux8hlKV1km3SzPRe2Z
PAYLOAD_SECRET=<48 chars>
REVALIDATE_SECRET=<32 chars>
TELEGRAM_BOT_TOKEN=<placeholder>
TELEGRAM_CHAT_ID=<placeholder>
DATABASE_URL=postgres://payload:DE47tidGNfOTp6ux8hlKV1km3SzPRe2Z@postgres:5432/kingdomcars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_HOST=localhost
```

### Контейнеры (docker compose)

- `v2-postgres-1`: postgres:16-alpine, healthy, порт 5432
- `v2-app-1`: v2-app:latest (Node 24 + Next 16.2.6 + Payload 3), healthy, internal 3000
- `v2-caddy-1`: caddy:2-alpine, healthy, порты 80/443

## Уроки этой сессии (для следующей)

1. **PowerShell heredoc нестабилен** для длинных многострочных файлов. PSReadLine крэшится. Используем zip-патчи через `Expand-Archive`, либо `notepad` для коротких правок.

2. **`Get-Content -Raw` + `.Replace(...)`** работает только для простых паттернов без CR/LF неоднозначностей. Для сложных правок — zip-патч.

3. **PowerShell `+` в multi-line replace** — два `Replace` подряд с конкатенацией `+ "`r`n" +` не работают как ожидалось. PowerShell интерпретирует разрыв строки.

4. **ESLint flat-config 9.x с eslint-config-next 16** не терпит явных импортов `eslint-plugin-jsx-a11y` или `eslint-plugin-import` — они уже бандлятся, и явная регистрация вызывает "Cannot redefine plugin".

5. **React 19.2 добавил `react-hooks/set-state-in-effect`** — false-positive на:
   - Hydration sync (читать localStorage/cookie на mount)
   - Reduced-motion ветке анимаций
   - re-sync state при открытии диалога

   Решение: точечный disable с rationale-комментарием. Альтернатива (useSyncExternalStore) overkill для UI.

6. **Payload 3 beta-128 breaking change**: `RootLayout` теперь требует `serverFunction` проп + `handleServerFunctions` импортируется из `@payloadcms/next/layouts` (НЕ из `/utilities`, хотя по PR-диффу значится так).

7. **framer-motion v12** narrowed тип `Transition['ease']`. `[...readonlyArray]` больше не assignable. Использовать явный tuple литерал `[number, number, number, number] as const`.

8. **`@types/node` 22+** делает `process.env.NODE_ENV` readonly. Для тестовых фикстур — каст `as Record<string, string|undefined>`.

9. **`ESLint unicorn/prefer-string-raw` авто-фиксер опасен для `config.matcher` Next-middleware**. Он превращает `'string\\.'` в `String.raw\`string\\.\``, что Next 16 webpack-парсер отвергает как `TaggedTemplateExpression`. Помечать как `// eslint-disable-next-line unicorn/prefer-string-raw` с rationale.

10. **`.npmrc` с `legacy-peer-deps=true`** меняет состав lockfile (peer-deps не записываются). Если Docker без `.npmrc`, `npm ci` падает в строгом режиме. Решение: копировать `.npmrc` в Docker через `COPY package.json package-lock.json* .npmrc* ./`.

11. **Node + npm версии хоста и Docker должны совпадать** (или быть близкими) для совместимости lockfile. Mixing host npm 11 + container npm 10 ломает `npm ci`.

12. **`server-only` стаб нужен и для CJS и для ESM**. Только ESM-loader-hook не покрывает `tsx` который транспилирует CJS-flagged Payload config.

13. **`docker builder prune` + `--no-cache`** не всегда инвалидирует слой `COPY package-lock.json*` — нужно изменить **состав** COPY-инструкции (добавить `.npmrc*`), чтобы Docker увидел разницу.

## Артефакты сессии в /mnt/user-data/outputs/

Эти патчи **уже применены** к пользовательскому проекту, но сохранены для воспроизводимости/отката:

- `kingdomcars-architectural-cleanup.zip` + `STEP_CLEANUP_CHANGES.md`
- `kingdomcars-step14-15.zip` + `STEP_14_15_CHANGES.md`
- `kingdomcars-lint-cleanup.zip` — 17 файлов
- `kingdomcars-lint-cleanup-2.zip` — 5 файлов
- `kingdomcars-typecheck-fixes.zip` — 6 файлов
- `kingdomcars-fix-payload-layout.zip` — 1 файл
- `kingdomcars-dockerfile-node24.zip` — 1 файл
- `kingdomcars-dockerfile-npmrc.zip` — 1 файл

## Следующая сессия — что делать первым

1. Открыть это резюме
2. Начать с задачи #1 (server-only как `file:./local-packages/server-only`)
3. После — задача #2 (косметика layout.tsx через notepad)
4. Затем #3-#5 в любом порядке

Команды для проверки что стек ещё жив в начале следующей сессии:

```powershell
cd C:\Users\Sergo\Desktop\v2
docker compose ps
curl http://localhost/api/health
```
