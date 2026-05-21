# Stage 0 — Hotfix существующего

**Дата:** 13 мая 2026. После Stage 0 проект готов идти в Step 9 (SEO).

Этап чинит то, что было сломано в существующем коде, прежде чем достраивать недостающие куски (steps 9–15). Сам по себе ничего нового не добавляет, кроме мелких файлов-фундамента (bundlewatch config, revalidate webhook).

## 17 правок

### Безопасность

1. **`src/lib/security-headers.ts` — переписан.** CSP теперь генерируется per-request с nonce + `'strict-dynamic'`. Статические заголовки (HSTS, X-Frame-Options и т.д.) отделены в `staticSecurityHeaders` и применяются через `next.config.ts`. §13 архитектуры теперь действительно соблюдён — раньше `'unsafe-inline'` рядом с `'strict-dynamic'` нивелировал всю защиту.

2. **`src/proxy.ts` — новый (заменяет `src/middleware.ts`).** Next 16 переименовал `middleware` → `proxy`. Заодно теперь генерирует CSP-nonce, прокидывает его в request headers (`x-nonce`, чтобы RSC мог читать через `headers()`), и стэмпит CSP на response. `src/middleware.ts` удалён.

3. **`next.config.ts`.** `experimental.reactCompiler` → корень `reactCompiler` (Next 16 промоутнул в stable). `remotePatterns` для `next/image` больше не использует `localhost` fallback — пустой массив = «только same-origin», что безопаснее. CSP из headers() убрана (теперь только static).

4. **`src/payload/collections/users.ts`.** `// TODO(step-11)` — комментарий, что 2FA подключим на этапе security вместе с CSP-nonce / Sentry. Сейчас плагин с точным именем `payload-plugin-mfa` не существует, нужно отдельно подбирать решение.

### Кэширование (§17)

5. **`src/payload/hooks/revalidate-page.ts`.** `revalidateTag(tag)` → `revalidateTag(tag, 'max')` — Next 16 требует `cacheLife`-профиль вторым аргументом.

6. **`src/app/(frontend)/[locale]/api/revalidate/route.ts` — новый.** Раньше там была пустая директория. Webhook авторизуется через `Authorization: Bearer ${REVALIDATE_SECRET}`, принимает `{ tag: 'pages'|'header'|'footer'|'site-settings' }`, выполняет `revalidateTag(tag, 'max')`. Возвращает 401/400/200.

### React-корректность

7. **`src/types/globals.ts`.** Добавлено опциональное `id` поле в `NavItem` (Payload авто-генерит для каждой row в array). Это позволяет использовать стабильный key в React.

8. **`src/components/layout/Header.tsx`.** `key={i}` → `key={item.id ?? item.link.label}`.
9. **`src/components/layout/MobileMenu.tsx`.** То же.
10. **`src/components/layout/Footer.tsx`.** То же для `columns` и `legalLinks`.

> Остаются `key={i}` в блоках (`FeaturesBlock`, `CTABlock`, `PricingBlock`, `MarqueeBlock`, `FAQBlock`, `CountersBlock`, `TestimonialsBlock`, `ServicesBlock`, `ImageGalleryBlock`). Они не критичны (контент статичный из CMS, не переставляется на клиенте), но это техдолг. Зачищу при следующей итерации блоков.

### Чистота кода

11. **`src/payload/collections/pages.ts`.** Удалён unused `import { anyone }` и фейковая ссылка `void anyone;`. Раньше `anyone` импортировался «для совместимости» — это просто было лишнее.

### Логотип и favicon

12. **`public/logo.png` (5.8 MB) — удалён.**
13. **`public/logo.webp` — новый, 21 KB.** Wordmark-версия (лев + KINGDOMCARS), 512px, основной источник для `<Logo>`. `next/image` авто-генерит responsive AVIF/WebP по `sizes`.
14. **`public/logo-mark.webp` — новый, 22 KB.** Только лев без надписи, 512px. Будет использован для OG-картинок и в местах, где нужно маленькое изображение.
15. **`public/favicon.ico` — новый, 14 KB.** Multi-resolution (16/32/48 px), легаси `/favicon.ico` для старых браузеров.
16. **`public/favicon/{favicon.svg, apple-touch-icon.png, icon-16.png, icon-32.png, icon-192.png, icon-512.png}` — новый набор.** SVG (22 KB) — монохромный потрейс силуэта льва для современных браузеров; PNG-набор для Android/iOS/PWA.
17. **`src/components/layout/Logo.tsx`.** Источник `/logo.png` → `/logo.webp`. Добавлен `fetchPriority="high"` для LCP-форсирования.
18. **`src/app/layout.tsx`.** Добавлен `metadata.icons` со всеми favicon-вариантами. Эта мета наследуется в `(frontend)` и `(payload)`.

### Bundle budget (§11)

19. **`bundlewatch.config.json` — новый.** Пороги на критичные чанки (framework, main, layout, page) суммарно ≤ 100 KB gzip — соответствие §11. Подцепится в CI на шаге 14.
20. **`package.json`.** `bundlewatch` возвращён в `devDependencies`, добавлен скрипт `npm run bundlewatch`.

## Что НЕ поменялось намеренно

- **`payload-plugin-mfa`** — не подключаем, см. правку #4. Отложено на Step 11.
- **`Sentry`** — `@sentry/nextjs` уже в deps, но `instrumentation.ts` и SDK init напишем на Step 11.
- **`/api/health` endpoint** — Step 11 (вместе с Sentry и `lib/analytics.ts`).
- **Контент-блоки `key={i}`** — техдолг, не критика, см. список выше.

## Метрики до/после Stage 0

| Параметр                         | До                                                     | После                                            |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `public/` общий размер           | ~6 MB                                                  | 604 KB (-90%)                                    |
| Логотип LCP-asset                | 5.7 MB PNG                                             | 21 KB WebP (-99.6%)                              |
| CSP `script-src`                 | `'unsafe-inline' 'strict-dynamic'` (= `unsafe-inline`) | `'nonce-XXX' 'strict-dynamic'` (реальная защита) |
| `revalidate` webhook             | пустая директория                                      | живой endpoint с auth                            |
| Файлы > 100 строк                | 0                                                      | 0 (правило соблюдено)                            |
| Установленных `key={i}` в layout | 4                                                      | 0                                                |

## Команды для проверки локально

После распаковки свежего архива:

```powershell
cd C:\Users\Sergo\Desktop\v2
npm install        # включая bundlewatch теперь
npm run seed       # должен пройти как раньше
npm run dev        # warning'и про reactCompiler и middleware теперь должны исчезнуть

# Проверка CSP в браузере:
# Открой /pl, DevTools → Network → click any HTML response → Headers
# Content-Security-Policy должен содержать "nonce-XXXX" вместо unsafe-inline для script-src.

# Проверка revalidate webhook (REVALIDATE_SECRET из .env.local):
curl -X POST http://localhost:3000/pl/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag":"pages"}'
# Ожидание: {"ok":true,"tag":"pages"}

# Проверка favicon в DevTools (Network → favicon.svg, favicon.ico должны грузиться)
```

## Что дальше

Stage 0 готов. Следующий этап — **Step 9 (SEO)**:

- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`
- `lib/seo.ts` с хелперами JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`)
- `buildPageMetadata` дополнить `alternates.languages` (hreflang) и OG-полями
- `app/global-error.tsx`

Жду подтверждения, чтобы продолжить.
