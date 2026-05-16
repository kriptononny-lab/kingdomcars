# STAGE_B_CHANGES.md — чистка корня и перенос истории

Этап B убирает технический мусор из корня репозитория и переносит
session-логи разработки в `docs/dev-log/`. После этого корень соответствует
§5 и §21 (только `README.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`,
`CHANGELOG.md`).

## Часть 1: zip-патч (новые/перенесённые файлы)

Все 17 файлов в `docs/dev-log/`:

- 15 копий session-логов (LOCAL_SETUP_STATUS, STAGE_0/0_2/0_3/A, STEP_9/10/11/11_1/12/12_KNOWN_ISSUES/13/13_1/14_15/CLEANUP)
- `SESSION_HANDOFF_2026-05-15.md` — handoff из текущей сессии
- `README.md` — индекс с таблицей хронологии и принципиальные решения

Плюс **обновлённый** `public/README.md` — убрано ложное обоснование «fallback
для скрейперов» (OG meta-теги работают без статических PNG, я это написал
ради защиты лишних файлов).

## Часть 2: команды для PowerShell (удаление мусора и оригиналов)

**Выполнять ПОСЛЕ накатывания zip-патча**, чтобы история точно уже была
скопирована в `docs/dev-log/` до удаления оригиналов.

```powershell
cd C:\Users\Sergo\Desktop\v2

# 1. Убедиться что dev-log содержит всё что переносим
Get-ChildItem .\docs\dev-log\ | Measure-Object | Select-Object -ExpandProperty Count
# Должно вывести 17 (15 STAGE/STEP/LOCAL_SETUP + 1 SESSION_HANDOFF + 1 README)

# 2. Удалить мусор из корня
Remove-Item .\debug-home.html `
            .\og-pl.png, .\og-pl-v2.png `
            .\og-en.png, .\og-en-v2.png `
            .\og-ru.png, .\og-ru-v2.png `
            .\project-tree.txt `
            .\tsconfig.tsbuildinfo `
            -ErrorAction SilentlyContinue

# 3. Удалить build/test артефакты (они в .gitignore, но занимают место)
Remove-Item .\coverage, .\test-results, .\playwright-report `
            -Recurse -Force -ErrorAction SilentlyContinue

# 4. Удалить session-логи из корня (теперь в docs/dev-log/)
Remove-Item .\LOCAL_SETUP_STATUS.md, `
            .\STAGE_0_CHANGES.md, .\STAGE_0_2_CHANGES.md, .\STAGE_0_3_CHANGES.md, `
            .\STAGE_A_CHANGES.md, `
            .\STEP_9_CHANGES.md, .\STEP_10_CHANGES.md, `
            .\STEP_11_CHANGES.md, .\STEP_11_1_CHANGES.md, `
            .\STEP_12_CHANGES.md, .\STEP_12_KNOWN_ISSUES.md, `
            .\STEP_13_CHANGES.md, .\STEP_13_1_CHANGES.md, `
            .\STEP_14_15_CHANGES.md, .\STEP_CLEANUP_CHANGES.md `
            -ErrorAction SilentlyContinue
```

## Часть 3: правка .gitignore (3 строки)

Добавить в конец `.gitignore`, секция «Misc»:

```
# Debug / scratch artifacts that occasionally appear in the working tree
debug-home.html
og-*.png
project-tree.txt
```

Это страховка — даже если в будущем кто-то снова создаст такие файлы при
отладке, git их не зацепит.

## Проверка после применения

```powershell
# Корень должен содержать только канонические файлы (без STAGE/STEP/og/debug)
Get-ChildItem -File | Select-Object Name | Format-Table -AutoSize
# Ожидается видеть: .dockerignore .editorconfig .env* .gitignore .lighthouserc.json
# .npmrc .nvmrc .prettier* CHANGELOG.md CONTRIBUTING.md Dockerfile* LICENSE
# Makefile README.md SECURITY.md bundlewatch.config.json commitlint.config.ts
# docker-compose*.yml eslint.config.mjs instrumentation*.ts next-env.d.ts
# next.config.ts package*.json playwright.config.ts postcss.config.mjs
# sentry.*.config.ts tsconfig.json vitest.config.ts

# Quality gates должны остаться зелёными
npm run lint
npm run typecheck
npm test

# Стек должен остаться healthy
docker compose ps
```

## Что НЕ затронуто

- Никакого изменения кода в `src/`
- Не трогаю `package.json`, `tsconfig.json`, `next.config.ts`
- Существующий `docker-compose.yml`, `Dockerfile`, `Makefile` — без изменений
- Список зависимостей не меняется
