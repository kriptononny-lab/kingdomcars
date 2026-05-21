# KingdomCars — статус локального запуска

**Дата документа:** 13 мая 2026 (после шага 8b сборки + локальная отладка под Windows)

## Что уже сделано в коде

Шаги 1–8 архитектурного плана из промпта (`Next_app_Промпт.md`):

1. ✅ Скелет проекта, конфиги, env-валидация, security headers, токены, скрипты
2. ✅ Payload 3 ядро (коллекции Users/Pages/Media/FormSubmissions/Redirects, глобалы Header/Footer/SiteSettings, доступы, хуки)
3. ✅ 13 page-blocks (Hero, Features, Marquee, Counters, Services, Map, Pricing, ContactForm, Testimonials, FAQ, RichText, ImageGallery, CTA) + единый `BlockRenderer` со строго-типизированным switch'ом
4. ✅ i18n через next-intl: 3 локали (pl/en/ru), локализованные slug, middleware, messages JSON
5. ✅ Layouts (root + frontend + per-locale), Header (RSC), MobileMenu (client), Footer, LanguageSwitcher, SkipLink, error/not-found/loading
6. ✅ Pages: главная + about + privacy + cookies + catch-all `[...slug]`, генерация Metadata, SSG params
7. ✅ Framer Motion обёртки FadeIn / Reveal / Stagger с `LazyMotion + reducedMotion="user"`
8. ✅ Идемпотентный seed (4 страницы × 3 локали + Header + Footer + SiteSettings) + контактная форма с Zod, Telegram-отправкой, rate-limit, server action и no-JS fallback

## Что физически развёрнуто локально на Windows 10 Pro 22H2

- ✅ Docker Desktop v4.73.1 установлен и работает
- ✅ Postgres 16 в контейнере `kc-postgres` (порт 5432) — БД `kingdomcars`, пользователь `payload`/`payload`
- ✅ Node v24.13.1, npm 11.8.0 установлены
- ✅ 6 шрифтов variable WOFF2 в `public/fonts/` (Oswald + Source Sans 3 × Latin/LatinExt/Cyrillic)
- ✅ `.env.local` создан и заполнен (PAYLOAD_SECRET, REVALIDATE_SECRET сгенерированы случайно; Telegram — заглушки)
- ✅ 725 пакетов установлено (`node_modules/`)

## Текущая точка остановки

Команда `npm run seed` падала с двумя последовательными ошибками:

1. **`NEXT_PUBLIC_SITE_URL: Required`** — tsx не загружал `.env.local` сам (только Next делает это автоматически).
2. **`Cannot destructure property 'loadEnvConfig' of 'import_env.default'`** — Payload 3 несовместим с Next 16 в `bin/loadEnv.js` (использует default import у CJS-namespace модуля).

После анализа я воспроизвёл проблемы у себя в sandbox, нашёл первопричины и применил три фикса в архив. **`npm run seed` теперь проходит end-to-end** (проверено на чистой установке Linux + Postgres 16):

```
> tsx --import ./scripts/bootstrap-env.ts scripts/seed.ts
[✓] Pulling schema from database...
[INFO] admin created — CHANGE THE PASSWORD
[INFO] seed complete
```

## Что изменилось в проекте после локальной отладки

### Файл `scripts/patch-payload.mjs` (новый)

Запускается автоматически после `npm install` (через `postinstall`). Патчит `node_modules/payload/dist/bin/loadEnv.js`, заменяя:

```js
import nextEnvImport from '@next/env';
```

на:

```js
import * as nextEnvImport from '@next/env';
```

Это **обходной путь** для известной несовместимости Payload 3.x с Next 16 (`@next/env` сменил форму экспорта). Без патча любой импорт `payload` падает.

Когда Payload выпустит официальный фикс, можно будет убрать постинсталл и эту запись из статуса.

### Файл `scripts/bootstrap-env.ts` (новый)

Загружает `.env.local` и `.env` через нативный `process.loadEnvFile()` (Node 20.6+). Подключается через `tsx --import` ДО выполнения `seed.ts`. Заменяет проблемный флаг `--env-file=…` у Node/tsx, который имел побочный эффект — триггерил тот самый `bin/loadEnv.js` Payload (см. выше).

### `scripts/seed.ts` — без изменений по логике

Использует уже подгруженные `process.env` через bootstrap.

### `src/payload/hooks/revalidate-page.ts` — добавлен `safeRevalidate`

`revalidateTag()` из `next/cache` требует рантайма Next.js — при вызове из CLI (seed, миграции) падает с `Invariant: static generation store missing`. Обернул в try/catch: внутри Next работает как раньше, вне Next — silent no-op. Это правильно для seed.

### `package.json`

- `scripts.seed` теперь: `tsx --import ./scripts/bootstrap-env.ts scripts/seed.ts`
- `scripts.postinstall`: `node scripts/patch-payload.mjs`
- `scripts.prepare`: удалён (lefthook ломал установку на Windows без git-репо; вернём, когда инициализируем git)

### `eslint.config.mjs`

- Убран `eslint-plugin-security` (его не было в deps)
- Убран `import/resolver: typescript` (нужен был доп. пакет, без него лучше)

### `package.json` deps

- `@sentry/nextjs` поднят с `^8.55.0` до `^9.20.0` (8.x не поддерживает Next 16)
- Удалены неиспользуемые: `@radix-ui/react-toast`, `@radix-ui/react-checkbox`, `@radix-ui/react-label`, `isomorphic-dompurify`, `bundlewatch`, `eslint-plugin-security`

### `.npmrc` (новый)

Поставил `legacy-peer-deps=true` чтобы любые peer-конфликты между Next 16, Payload 3 и др. библиотеками автоматически обходились — без флагов в командах.

## Что делать дальше — точные команды

Если ты распаковал свежий `kingdomcars-clean.zip` и положил рядом старый `.env.local`:

```powershell
# 1. Перейди в проект
cd C:\Users\Sergo\Desktop\v2

# 2. Убедись, что Postgres работает
docker ps
# Должен быть kc-postgres в статусе Up. Если нет:
# docker start kc-postgres

# 3. Установка (включает postinstall-патч автоматически)
npm install
# Ожидаемый вывод в конце:
# [patch-payload] loadEnv.js patched (Payload 3 ↔ Next 16 compat).
# added ~1322 packages in 3m

# 4. Seed контента
npm run seed
# Должно занять 5–30 секунд. В конце:
# [INFO] admin created — CHANGE THE PASSWORD
# [INFO] seed complete

# 5. Старт dev-сервера
npm run dev
# Дождись:
# ✓ Ready in Xs

# 6. Открой http://localhost:3000 в браузере
# Должна быть главная страница на польском с Hero, Services, Pricing, ContactForm.
# Переключатель PL/EN/RU в шапке — рабочий.
# Админка: http://localhost:3000/admin
# Логин: admin@kingdomcars.example.com  /  ChangeMe!Now123
```

## Что НЕ работает прямо сейчас (намеренно — будет в следующих шагах)

- **Telegram-отправка из формы** — токен в `.env.local` это заглушка `000000000:dummy_…`. Заявка из формы корректно сохраняется в `/admin/collections/form-submissions`, но Telegram-сообщение упадёт с ошибкой 404 в логе сервера (не падает страница). Чтобы включить: создай бота у `@BotFather`, узнай свой chat_id у `@userinfobot`, замени значения в `.env.local`, перезапусти `npm run dev`.

- **SEO meta** — только базовые title/description/canonical. hreflang, OpenGraph картинки, JSON-LD будут в шаге 9.

- **Cookie banner** — нет. Будет в шаге 10 (GDPR).

- **Sentry** — версия 9 уже в deps, но `instrumentation.ts` и SDK init ещё не написаны. Шаг 11.

- **Тесты, Docker, CI** — шаги 12, 13, 14.

## Известные warning'и (не критично)

При `npm run dev` будут warning'и:

- `Invalid next.config.ts options detected: Unrecognized key 'reactCompiler' at "experimental"` — Next 16 переместил флаг из `experimental.reactCompiler` в корень. Поправим в шаге 9 заодно с SEO-обновлениями `next.config.ts`.
- `The "middleware" file convention is deprecated. Please use "proxy" instead.` — Next 16 переименовал middleware → proxy. Старое имя ещё работает в 16.x, удалят в 17. Тоже поправим в шаге 9 (бессмысленно делать сейчас отдельным шагом).
- `turbopackServerFastRefresh — invalid experimental key` — внутренний флаг Turbopack 16, пропадёт сам в следующей минор-версии Next.
- `revalidateTag without second argument is now deprecated` — Next 16 хочет второй аргумент `'max'`. Текущий формат всё ещё работает; обновим в шаге 9.
- `Module type of file:.../bootstrap-env.ts is not specified` — tsx-warning о ESM/CJS детекции, performance penalty минимален, не критично.

## Точная карта файлов с правками от 13.05

```
package.json                            ← новые scripts (seed, postinstall), Sentry 9.x, deps clean
.npmrc                                  ← legacy-peer-deps=true
scripts/patch-payload.mjs               ← НОВЫЙ — postinstall-патч
scripts/bootstrap-env.ts                ← НОВЫЙ — env-loader для seed
src/payload/hooks/revalidate-page.ts    ← safeRevalidate wrapper
src/lib/fonts.ts                        ← variable шрифты (Latin/LatinExt/Cyrillic)
public/fonts/*.woff2                    ← 6 файлов (175 KB total)
eslint.config.mjs                       ← убраны security plugin и typescript resolver
```

## Полная схема архитектурного прогресса

| Шаг   | Тема                                     | Статус              |
| ----- | ---------------------------------------- | ------------------- |
| 1     | Скелет + конфиги                         | ✅                  |
| 2     | Payload ядро                             | ✅                  |
| 3     | Page-blocks                              | ✅                  |
| 4     | i18n (next-intl)                         | ✅                  |
| 5     | Layouts + Header/Footer                  | ✅                  |
| 6     | Pages + dynamic routing                  | ✅                  |
| 7     | Анимации (Framer Motion)                 | ✅                  |
| 8     | Форма + Telegram + seed                  | ✅                  |
| **L** | **Локальный запуск работает**            | ⏳ **здесь сейчас** |
| 9     | SEO (sitemap, hreflang, JSON-LD, OG)     | ⬜                  |
| 10    | GDPR (cookie banner, /privacy, /cookies) | ⬜                  |
| 11    | Security (CSP nonce, Sentry, 2FA)        | ⬜                  |
| 12    | Тесты (Vitest + Playwright + axe)        | ⬜                  |
| 13    | Docker (multistage + Caddy)              | ⬜                  |
| 14    | CI/CD (GitHub Actions, Dependabot)       | ⬜                  |
| 15    | Документация (ADR, deployment.md)        | ⬜                  |
