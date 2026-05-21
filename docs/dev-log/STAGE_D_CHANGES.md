# STAGE_D_CHANGES.md — закрытие долгов из handoff

Финальный этап аудита. Закрывает (или явно фиксирует как техдолг) все
пункты из SESSION_HANDOFF_2026-05-15.md.

## Часть 1: zip-патч (4 файла)

| Файл                           | Что изменилось                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                 | Добавлен `"server-only": "^0.0.1"` в `dependencies` (по алфавиту между `react-hook-form` и `sharp`)                          |
| `vitest.config.ts`             | `coverage.exclude`: убран `src/lib/get-page.ts` (удалён в Этапе C), добавлены три новых split-файла                          |
| `docs/adr/0006-server-only.md` | **Новый ADR** — фиксирует архитектуру server-only: реальный пакет в prod + два стаба (loader hook для tsx, alias для Vitest) |
| `docs/dev-log/TECH_DEBT.md`    | **Новый** — регистр отложенных задач (otplib, admin password, GitHub Settings, OWNER-плейсхолдеры)                           |

## Часть 2: команды для PowerShell

```powershell
cd C:\Users\Sergo\Desktop\v2

# 1. Применить zip
Expand-Archive -Path C:\Users\Sergo\Downloads\kingdomcars-stage-d.zip `
               -DestinationPath C:\Users\Sergo\Desktop\v2 -Force

# 2. Обновить lockfile (это поставит реальный server-only в node_modules)
npm install
```

После `npm install` package-lock.json получит запись `"server-only": {
"version": "0.0.1", ... }`, и больше она оттуда не пропадёт ни при `npm
ci`, ни при `npm install` без аргументов.

**Если хост-стаб лежит в `node_modules/server-only/`** (handoff упоминал
ручной стаб) — `npm install` его перетрёт настоящим пакетом. Это OK,
именно ради этого мы и делаем правку.

## Часть 3: проверки

```powershell
npm run lint
npm run typecheck
npm test
docker compose ps
```

Все четыре должны остаться зелёными.

**Дополнительная проверка** — что стабы продолжают работать через
свои механизмы (а не через отсутствие реального пакета):

```powershell
# tsx CLI должен по-прежнему запускаться (теперь loader hook реально
# что-то перехватывает — раньше пакета не было, и перехватывать было
# нечего)
npm run seed
# Должно: ... [seed] done.

# Vitest alias тоже работает (один тест уже это покрывает — env.test
# импортирует server-only-marked модуль)
npm test -- --reporter=verbose src/lib/env.test.ts
# Должно: 11 passed
```

## Почему так, а не через `local-packages/server-only/`

Подробно — в ADR-0006. Краткая суть: подмена настоящего `server-only`
на пустой no-op stub через `file:./local-packages/...` убрала бы
client/server boundary check в production билде. Real package от React
team специально throws при загрузке без `react-server` exports
condition — именно это заставляет Next bundler фейлить, если server
code попадает в client bundle. Спека §13 ставит этот check в security-
column, так что отказ от него — регресс. Реальный пакет в deps +
точечные stubs для tsx и Vitest сохраняют всё: production safety +
работоспособность scripts/tests.

## Что НЕ сделано в этом этапе (зафиксировано как техдолг)

См. `docs/dev-log/TECH_DEBT.md`:

1. **otplib v12 → v13** — breaking change в API, требует отдельной
   сессии. Сейчас только deprecation warnings, не блокирует
2. **Дефолтный admin password** — это действие пользователя через
   Payload admin UI
3. **GitHub Settings (secrets, environments, branch protection)** — UI
   действия, не код. Список в TECH_DEBT.md и в STAGE_A_CHANGES.md
4. **Замена `@OWNER` / `OWNER/REPO`** в CODEOWNERS / issue config /
   docker-compose.prod.yml — на реальные значения вашего репо

## `src/app/(payload)/layout.tsx`

В handoff было написано "слегка покороблены метаданные после
неудачных heredoc-вставок". Я перепроверил — **файл уже идентичен
эталону** из handoff 1:1 (`metadata.title: 'KingdomCars admin'`,
правильный `serverFunction` с `'use server'`, импорт
`handleServerFunctions` из `@payloadcms/next/layouts`). Видимо
правка была применена ранее. Менять нечего.

## Итог по всему аудиту

После четырёх этапов:

| Срез                               | Было                                                                        | Стало                                             |
| ---------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| Структура проекта (§5)             | без `.github/`, `.vscode/`, `public/`, `Dockerfile.dev`, `compose.prod.yml` | всё на месте                                      |
| Мусор в корне                      | 6 og-PNG, debug-html, build-артефакты, 14 session-логов                     | только канонические файлы по §21                  |
| Session-логи                       | разбросаны в корне                                                          | в `docs/dev-log/` с индексом                      |
| Файлы >100 строк (§4 п.1)          | 2 нарушения                                                                 | 0 (max 94 строки)                                 |
| Barrel-pattern (§4 п.5)            | в `types/blocks/index.ts`                                                   | удалён, остался только union                      |
| CI/CD (§19)                        | workflows утеряны при упаковке                                              | восстановлены 4 workflow + dependabot + templates |
| `server-only` (§13 boundary check) | держится только на стабах, реальный пакет отсутствует                       | реальный пакет в deps + стабы для CLI/Vitest      |
| ADR'ы (§21)                        | 5                                                                           | 6 (добавлен 0006-server-only)                     |
| Техдолг                            | не зафиксирован                                                             | в `docs/dev-log/TECH_DEBT.md`                     |

Проект соответствует архитектурной спецификации. Что осталось — это
тех долги, явно перечисленные и описанные.
