# Step 9 — SEO

**Дата:** 13 мая 2026. После Step 9 закрыт §7 архитектуры (Lighthouse SEO = 100 ready).

Этап добавляет: динамический sitemap, robots, PWA-manifest, OG-image, JSON-LD (Organization / WebSite / LocalBusiness / BreadcrumbList / FAQPage), hreflang в каждый Metadata, global-error fallback. Заодно догнал две мелочи из Stage 0.

## Stage 0.1 (микрофиксы по логам seed)

1. **`src/payload/payload.config.ts`** — `import sharp from 'sharp'` + `sharp` в `buildConfig`. Убирает warning `Image resizing enabled but sharp not installed`. Без этого Media-коллекция не генерит image sizes (thumbnail/card/og/hero).
2. **`scripts/bootstrap-env.ts` → `scripts/bootstrap-env.mts`** + правка script в `package.json`. Убирает warning `MODULE_TYPELESS_PACKAGE_JSON`. Альтернатива была добавить `"type": "module"` в package.json — но это потребовало бы переезд всех `.js` на ESM, что инвазивнее.

## Step 9 — 11 новых файлов, 5 правок

### Новые файлы

| Файл                                              | Зачем                                                                                                                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/seo.ts`                                  | JSON-LD builders: `organizationJsonLd`, `webSiteJsonLd`, `localBusinessJsonLd`, `breadcrumbJsonLd`, `faqPageJsonLd`. Чистые функции, возвращают plain объекты                                                           |
| `src/components/seo/JsonLd.tsx`                   | RSC, эмитит `<script type="application/ld+json">` с **CSP-nonce** (тем самым, что генерится в `src/proxy.ts`). Без nonce браузер заблокировал бы скрипт под `'strict-dynamic'`                                          |
| `src/components/seo/SiteJsonLd.tsx`               | RSC, читает SiteSettings и рендерит site-wide `Organization` + `WebSite` JSON-LD                                                                                                                                        |
| `src/app/sitemap.ts`                              | Динамический sitemap с `MetadataRoute.Sitemap` типом. Per-Page-per-Locale + `alternates.languages` для hreflang. `revalidate: 3600`                                                                                     |
| `src/app/robots.ts`                               | `MetadataRoute.Robots`. Disallow `/admin`, `/api`. Sitemap-ссылка                                                                                                                                                       |
| `src/app/manifest.ts`                             | PWA manifest. Использует favicon-set из Stage 0 (192/512 + maskable). Theme/background `#0a0a0a`, accent `#e6c47a`                                                                                                      |
| `src/app/global-error.tsx`                        | Top-level error fallback с собственным `<html>`/`<body>`. Inline-стили (нет i18n — она по определению уже сломалась). TODO(step-11) для Sentry reportError                                                              |
| `src/app/(frontend)/[locale]/opengraph-image.tsx` | Динамический OG 1200×630 через `next/og`. Локаль-aware: латиница (PL/EN) использует `Oswald-LatinExt.woff2`, RU использует `Oswald-Cyrillic.woff2`. Runtime `nodejs` — нужен `fs` для чтения шрифтов из `public/fonts/` |

### Изменённые файлы

| Файл                                     | Что                                                                                                                                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/page-metadata.ts`               | `alternates.languages` (hreflang) + `x-default` → pl. Заполняются `openGraph` (title/description/url/siteName/locale/type) и `twitter` (summary_large_image). Поддержан опциональный `slugByLocale` для случаев, когда slug per-locale различается |
| `src/lib/get-page.ts`                    | Новая функция `getAllPagesForSitemap()` — multi-locale fetch с группировкой по document id. Возвращает `{ id, updatedAt, slugByLocale }` для каждой страницы                                                                                       |
| `src/app/(frontend)/[locale]/layout.tsx` | `<SiteJsonLd locale={locale} />` первым ребёнком `<body>` — Organization + WebSite на каждой странице                                                                                                                                              |
| `src/app/(frontend)/[locale]/page.tsx`   | `<JsonLd data={localBusinessJsonLd(...)} />` на главной (Google штрафует за дубли LocalBusiness на других страницах)                                                                                                                               |
| `src/components/blocks/FAQBlock.tsx`     | `<JsonLd data={faqPageJsonLd(block.items)} />` inline. Стабильный key вместо `key={i}`. Закрывает требование §7 «Schema.org разметка для FAQ»                                                                                                      |
| `src/types/blocks/business.ts`           | `FAQBlock.items` теперь имеют опциональный `id` (Payload auto-генерит)                                                                                                                                                                             |

## Покрытие §7 (SEO requirements)

| Требование                             | Статус                                                                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `generateMetadata` на каждой странице  | ✅ (было)                                                                                                                                                             |
| hreflang alternates + `x-default` → pl | ✅ Step 9                                                                                                                                                             |
| Canonical URLs (с учётом локали)       | ✅ (было)                                                                                                                                                             |
| Динамический sitemap.xml               | ✅ Step 9                                                                                                                                                             |
| Динамический robots.txt                | ✅ Step 9                                                                                                                                                             |
| JSON-LD: Organization                  | ✅ Step 9 (в layout)                                                                                                                                                  |
| JSON-LD: WebSite                       | ✅ Step 9 (в layout)                                                                                                                                                  |
| JSON-LD: BreadcrumbList                | ⚠️ Helper готов в `seo.ts`, но не подключён — у нас нет UI-блока breadcrumbs пока (для `/about`, `/privacy` нужны). Подключу как только появится breadcrumb-компонент |
| JSON-LD: LocalBusiness                 | ✅ Step 9 (только на `/`)                                                                                                                                             |
| JSON-LD: FAQPage                       | ✅ Step 9 (внутри FAQBlock)                                                                                                                                           |
| OG-image: динамическая через next/og   | ✅ Step 9                                                                                                                                                             |
| Twitter Card (summary_large_image)     | ✅ Step 9                                                                                                                                                             |
| PWA manifest.json                      | ✅ Step 9                                                                                                                                                             |
| `lang` атрибут на `<html>`             | ✅ (было)                                                                                                                                                             |
| Семантический HTML                     | ✅ (было)                                                                                                                                                             |

## Что должно работать после применения

```powershell
cd C:\Users\Sergo\Desktop\v2
npm run dev
```

Открой:

1. **`/sitemap.xml`** — XML со всеми страницами × 3 локали + hreflang `<xhtml:link>`.
2. **`/robots.txt`** — `User-agent: *`, `Disallow: /admin, /api`, ссылка на sitemap.
3. **`/manifest.webmanifest`** — JSON с иконками 192/512.
4. **`/pl/opengraph-image`** (и `/en/opengraph-image`, `/ru/opengraph-image`) — должна отдаваться PNG 1200×630 с брендом + tagline на нужной локали. Можно проверить через Open Graph Debugger или просто открыть URL в браузере.
5. **DevTools → Elements**: в `<body>` главной должно быть 3 `<script type="application/ld+json">` (Organization, WebSite, LocalBusiness). На любой странице с FAQ-блоком — ещё один FAQPage. Все с `nonce="..."`.
6. **DevTools → Elements → `<head>`**: должны быть `<link rel="alternate" hreflang="pl"/en/ru/x-default">` для каждой страницы.
7. **DevTools → Network → ответ HTML → Headers**: `Content-Security-Policy` с `nonce-XXXX`, и тот же nonce — в `<script>` тегах JSON-LD. Если nonce'ы не совпадают → CSP заблокирует и JSON-LD не отрендерится; нужно отлаживать `src/proxy.ts`.
8. **DevTools → Lighthouse → SEO**: должно быть **100**.

## Что НЕ сделано в Step 9 (намеренно)

- **BreadcrumbList не подключён** — нет ещё UI breadcrumbs. Подключу в Step 10 или при отдельном проходе по `/about`, `/privacy` страницам, когда добавим хлебные крошки.
- **Per-page OG-картинка с заголовком страницы** — сейчас OG только локаль-уровня (бренд + tagline). Если хотите OG с конкретным title каждой страницы, нужно положить `opengraph-image.tsx` в `[...slug]/` тоже и доставать title через `params`. Это плюс ~80 строк нового файла. Сделаем когда определимся, нужно ли это (для SaaS-страниц обычно нужно, для сайта-визитки часто хватает локаль-уровня).
- **JSON-LD `Article` для блог-постов** — пока блогом не пахнет.
- **Visual regression на OG** — Step 12 (Playwright screenshots).

## Что дальше

Step 10 — **GDPR**. Cookie banner + privacy/cookie pages content + analytics-gate. Когда подтвердишь, что Step 9 локально работает (особенно `/sitemap.xml` и Lighthouse SEO).
