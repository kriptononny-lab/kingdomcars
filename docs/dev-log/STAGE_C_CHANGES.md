# STAGE_C_CHANGES.md — архитектурные правила §4

Этап C закрывает три нарушения архитектурной спецификации:

1. **Файл >100 строк** (§4 п.1): `src/lib/get-page.ts` (129) → расщеплён на 3 файла
2. **Файл >100 строк** (§4 п.1): `src/components/gdpr/CookieSettingsDialog.tsx` (101) → 87 строк через вынесение хука
3. **Barrel-pattern** (§4 п.5): `src/types/blocks/index.ts` → оставлен только `PageBlock` union

## Часть 1: zip-патч (4 новых файла + 24 модификации = 28 файлов)

### Новые файлы

| Файл                                              | Что внутри                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/get-page-by-slug.ts`                     | `getPageBySlug()` + приватная `asPageDoc()` — 69 строк                      |
| `src/lib/get-page-slugs.ts`                       | `getAllPageSlugs()` — 21 строка                                             |
| `src/lib/get-pages-for-sitemap.ts`                | `SitemapPage` interface + `getAllPagesForSitemap()` — 44 строки             |
| `src/components/gdpr/useSyncFromConsentOnOpen.ts` | хук с `useEffect`/`useState` вынесенный из CookieSettingsDialog — 34 строки |

### Модифицированные файлы (24)

**7 потребителей старого `@/lib/get-page`:**

| Файл                                             | Что изменилось                                       |
| ------------------------------------------------ | ---------------------------------------------------- |
| `src/components/layout/PageRenderer.tsx`         | `get-page` → `get-page-by-slug`                      |
| `src/app/(frontend)/[locale]/page.tsx`           | `get-page` → `get-page-by-slug`                      |
| `src/app/(frontend)/[locale]/cookies/page.tsx`   | `get-page` → `get-page-by-slug`                      |
| `src/app/(frontend)/[locale]/privacy/page.tsx`   | `get-page` → `get-page-by-slug`                      |
| `src/app/(frontend)/[locale]/about/page.tsx`     | `get-page` → `get-page-by-slug`                      |
| `src/app/(frontend)/[locale]/[...slug]/page.tsx` | разделён на 2: `get-page-by-slug` + `get-page-slugs` |
| `src/app/sitemap.ts`                             | `get-page` → `get-pages-for-sitemap`                 |

**14 потребителей старого barrel `@/types/blocks`** → перенаправлены на конкретные модули `./content`/`./business`/`./cta`/`./common`:

| Файл                                          | Куда теперь импортит                            |
| --------------------------------------------- | ----------------------------------------------- |
| `src/types/globals.ts`                        | `LinkValue` → `common`                          |
| `src/components/layout/NavLink.tsx`           | `LinkValue` → `common`                          |
| `src/components/blocks/FeaturesBlock.tsx`     | `FeaturesBlock` → `content`                     |
| `src/components/blocks/CTABlock.tsx`          | `CTABlock` → `cta`, `LinkValue` → `common`      |
| `src/components/blocks/PricingBlock.tsx`      | `PricingBlock` → `business`                     |
| `src/components/blocks/MarqueeBlock.tsx`      | `MarqueeBlock` → `content`                      |
| `src/components/blocks/ContactFormBlock.tsx`  | `ContactFormBlock` → `cta`                      |
| `src/components/blocks/FAQBlock.tsx`          | `FAQBlock` → `business`                         |
| `src/components/blocks/HeroBlock.tsx`         | `HeroBlock` → `content`, `LinkValue` → `common` |
| `src/components/blocks/RichTextBlock.tsx`     | `RichTextBlock` → `content`                     |
| `src/components/blocks/CountersBlock.tsx`     | `CountersBlock` → `business`                    |
| `src/components/blocks/TestimonialsBlock.tsx` | `TestimonialsBlock` → `business`                |
| `src/components/blocks/ServicesBlock.tsx`     | `ServicesBlock` → `business`                    |
| `src/components/blocks/MapBlock.tsx`          | `MapBlock` → `business`                         |
| `src/components/blocks/ImageGalleryBlock.tsx` | `ImageGalleryBlock` → `content`                 |

**`src/types/blocks/index.ts`** — переписан: остался только `PageBlock` union (без `export type { ... } from './business'` и аналогов). Это уже не barrel: union физически не может жить ни в одном sibling-файле, потому что охватывает все три. Семантика уникальна.

**`src/components/gdpr/CookieSettingsDialog.tsx`** — 101 → 87 строк. `useEffect` + два `useState` вынесены в новый хук `useSyncFromConsentOnOpen`. Логика идентична, поведение неизменно.

**`src/components/blocks/BlockRenderer.tsx`** и **`src/types/page.ts`** — НЕ модифицированы. У них корректный импорт `PageBlock` из `@/types/blocks` — это ровно то для чего индекс теперь существует.

## Часть 2: PowerShell-команда (удаление старого файла)

**Выполнять ПОСЛЕ накатывания zip-патча.** Старый `get-page.ts` больше никому не нужен:

```powershell
cd C:\Users\Sergo\Desktop\v2

# Убедиться что новые файлы на месте
Get-ChildItem .\src\lib\get-page*

# Должно вывести 4 файла:
#   get-page-by-slug.ts
#   get-page-slugs.ts
#   get-pages-for-sitemap.ts
#   get-page.ts            ← старый, удаляем дальше

# Удалить старый
Remove-Item .\src\lib\get-page.ts
```

## Проверка после применения

```powershell
npm run lint
npm run typecheck
npm test
docker compose ps
```

Все четыре должны остаться зелёными:

- `lint`: 0 ошибок (новый файл `useSyncFromConsentOnOpen.ts` прогоняется через ESLint)
- `typecheck`: 0 ошибок (все импорты валидны, типы те же)
- `test`: 100/100 passed (никаких тестовых файлов мы не трогали)
- `docker compose ps`: 3 healthy (Docker-стек этим не затронут)

## Архитектурный итог

После Этапа C **ни один файл `src/`** не нарушает §4:

```
✓ Все файлы ≤100 строк (max теперь: 94 строки — BlockRenderer.tsx)
✓ Каждый файл — одна ответственность
✓ Никаких barrel files (index.ts блоков — union builder, не реэкспортер)
✓ Server Components by default (сохранено)
✓ Имена компонентов PascalCase, хуки use*, типы PascalCase (сохранено)
```

## Следующий этап (D)

Доделки из SESSION_HANDOFF_2026-05-15.md:

1. **`server-only` как `file:./local-packages/server-only`** — постоянное решение,
   которое переживает `npm ci` (сейчас стаб в `node_modules/` стирается)
2. **Косметика `src/app/(payload)/layout.tsx`** — содержимое уже эталонное в
   handoff, минута работы
3. **`otplib v12 → v13`** — отложено (breaking change в API)

Дай отмашку «дальше» → начну Этап D.
