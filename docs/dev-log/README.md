# docs/dev-log

> **Эта папка — историческая. Не справочник.**
> Для понимания текущего состояния архитектуры читай `docs/architecture.md`
> и ADR'ы в `docs/adr/`. Здесь лежит хронология — «как мы сюда пришли».

Каждый файл соответствует одному рабочему интервалу (этап, шаг, или
session). Хранится для целей:

- ретроспективы (что и почему сделали)
- разбора регрессий (когда что-то сломалось — посмотреть какой шаг это
  принёс)
- онбординга (новый разработчик может пробежать историю чтобы понять
  накопленные технические долги и обоснование архитектурных выборов)

## Хронология

| Файл                                  | Период               | Что внутри                                                                                                                                                                   |
| ------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STAGE_0_CHANGES.md`                  | начальный setup      | первичная скаффолдинг, конфиги, базовая структура                                                                                                                            |
| `STAGE_0_2_CHANGES.md`                | setup доделки        | догрузка зависимостей и фиксы                                                                                                                                                |
| `STAGE_0_3_CHANGES.md`                | setup доделки        | догрузка зависимостей и фиксы                                                                                                                                                |
| `LOCAL_SETUP_STATUS.md`               | snapshot             | состояние локального окружения на момент записи                                                                                                                              |
| `STEP_9_CHANGES.md`                   | Шаг 9                | SEO (metadata, sitemap, robots, OG, manifest)                                                                                                                                |
| `STEP_10_CHANGES.md`                  | Шаг 10               | GDPR (cookie banner, privacy/cookie pages, аналитика)                                                                                                                        |
| `STEP_11_CHANGES.md`                  | Шаг 11               | Security headers (CSP, HSTS, etc.)                                                                                                                                           |
| `STEP_11_1_CHANGES.md`                | Шаг 11.1             | Security follow-up                                                                                                                                                           |
| `STEP_12_CHANGES.md`                  | Шаг 12               | Тесты (Vitest setup, unit tests)                                                                                                                                             |
| `STEP_12_KNOWN_ISSUES.md`             | Шаг 12 issues        | известные проблемы тестов                                                                                                                                                    |
| `STEP_13_CHANGES.md`                  | Шаг 13               | Docker, docker-compose, Caddyfile                                                                                                                                            |
| `STEP_13_1_CHANGES.md`                | Шаг 13.1             | Docker follow-up                                                                                                                                                             |
| `STEP_14_15_CHANGES.md`               | Шаги 14–15           | CI/CD, GitHub Actions, ADR, docs                                                                                                                                             |
| `STEP_CLEANUP_CHANGES.md`             | cleanup              | архитектурный cleanup-патч (Sentry v9→v10, locale bug fix, a11y)                                                                                                             |
| `SESSION_HANDOFF_2026-05-15.md`       | session 2026-05-15   | конец сессии перед первым аудитом — фиксирует «100/100 тестов, Docker healthy»                                                                                               |
| `STAGE_A_CHANGES.md`                  | этап A (2026-05-15)  | первая попытка восстановить §5: `.github`, `.vscode`, `public`, `Dockerfile.dev`, `docker-compose.prod.yml`                                                                  |
| `STAGE_B_CHANGES.md`                  | этап B (2026-05-15)  | чистка корня — перенос STEP/STAGE логов в эту папку, обновление `.gitignore`                                                                                                 |
| `STAGE_C_CHANGES.md`                  | этап C (2026-05-15)  | архитектурные правила §4 — split `get-page.ts`, фикс `CookieSettingsDialog`, удаление barrel re-export'ов из `types/blocks/index.ts`                                         |
| `STAGE_D_CHANGES.md`                  | этап D (2026-05-15)  | долги: `server-only` в deps, ADR-0006, новый `TECH_DEBT.md`, синхронизация `vitest.config.ts`                                                                                |
| `SESSION_HANDOFF_2026-05-15_audit.md` | session конец дня    | финальный handoff аудита, утверждение «спека закрыта»                                                                                                                        |
| `AUDIT_2_CHANGES.md`                  | audit 2 (2026-05-15) | повторный аудит — `.github`/`.vscode`/`public` фактически отсутствовали в `v2.zip`, восстановлены; добавлен `eslint-plugin-security` (§20), склейка дубликата в `.gitignore` |
| `TECH_DEBT.md`                        | живой реестр         | отложенные задачи (otplib v12→v13, admin password, GitHub Settings, OWNER-плейсхолдеры)                                                                                      |

## Правила добавления

Когда заканчивается крупная фаза работы:

1. Положи changelog файл сюда: `STAGE_<буква>_CHANGES.md` или `STEP_<номер>_CHANGES.md`
2. Обнови таблицу выше одной строкой
3. **Не** клади changelog в корень репозитория

## Принципиальные решения, выкристаллизовавшиеся в этих логах

Кратко (детали — в самих файлах и в `docs/adr/`):

- **Node 24 + npm 11** на хосте и в Docker — синхронизация форматов lockfile
- **`server-only` — настоящий пакет в prod**, не локальный no-op стаб. Подмена
  отключает RSC client/server boundary check в `next build`. Стабы только для
  tsx CLI (loader hook) и Vitest (alias). См. ADR-0006.
- **Payload 3 beta-128** требует `serverFunction` + `handleServerFunctions` в RootLayout
- **React 19.2** добавил `react-hooks/set-state-in-effect` — точечные disable c rationale-комментариями
- **`.npmrc` с `legacy-peer-deps=true`** должен копироваться в Docker stage, иначе строгий `npm ci` падает
- **framer-motion v12** narrowed `Transition['ease']` — нужен tuple-литерал, а не readonly array
- **`types/blocks/index.ts` — union builder, не barrel.** Файл существует ради единственного значения (`PageBlock` union), которое физически не помещается ни в один sibling-файл. См. шапку самого файла.
- **`docker-compose.prod.yml` — overlay поверх базового compose**, не замена. Применяется через `-f docker-compose.yml -f docker-compose.prod.yml`. Требует Compose 2.24+ из-за `!override` тега.
