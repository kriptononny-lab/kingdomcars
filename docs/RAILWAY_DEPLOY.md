# Деплой на Railway

## 1. Подготовка (один раз)

### GitHub репозиторий

Залей проект на GitHub (если не сделано):

```powershell
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/ВАШ_АККАУНТ/kingdomcars-v2.git
git push -u origin main
```

### Создание проекта на Railway

1. Зайди на [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → выбери репозиторий
3. Railway автоматически найдёт `railway.toml` и `docker/Dockerfile`

## 2. База данных

В Railway проекте:

1. **+ New** → **Database** → **Add PostgreSQL**
2. Зайди в PostgreSQL сервис → вкладка **Variables**
3. Скопируй `DATABASE_URL` (нужна на следующем шаге)

## 3. Переменные окружения

В Railway → твой app-сервис → вкладка **Variables**, добавь:

| Переменная                  | Значение                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `NODE_ENV`                  | `production`                                                                               |
| `DATABASE_URL`              | (из PostgreSQL сервиса — Railway вставит автоматически через `${{Postgres.DATABASE_URL}}`) |
| `PAYLOAD_SECRET`            | случайная строка 32+ символа (генератор: `openssl rand -hex 32`)                           |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://ВАШ_ДОМЕН.up.railway.app`                                                         |
| `NEXT_PUBLIC_SITE_URL`      | `https://ВАШ_ДОМЕН.up.railway.app`                                                         |
| `NEXT_PUBLIC_SITE_HOST`     | `ВАШ_ДОМЕН.up.railway.app`                                                                 |
| `REVALIDATE_SECRET`         | случайная строка 16+ символов                                                              |
| `TELEGRAM_BOT_TOKEN`        | токен бота (или `dummy` если не нужно)                                                     |
| `TELEGRAM_CHAT_ID`          | chat id (или `0` если не нужно)                                                            |
| `LOG_LEVEL`                 | `info`                                                                                     |
| `SEED_ADMIN_EMAIL`          | `admin@kingdomcars.pl`                                                                     |
| `SEED_ADMIN_PASSWORD`       | надёжный пароль 12+ символов                                                               |

> **Важно:** `DATABASE_URL` Railway может подставить автоматически, если соединить сервисы: в Variables напиши `${{Postgres.DATABASE_URL}}`

## 4. Первый деплой + seed

После первого деплоя база данных пустая. Запусти seed через Railway Shell:

1. В app-сервисе → **Shell** (вверху справа)
2. Введи:

```bash
NODE_ENV=development npx tsx --import ./scripts/bootstrap-env.mts scripts/migrate.ts
node -e "require('./scripts/bootstrap-env.mts')" 2>/dev/null; NODE_ENV=development npx tsx --import ./scripts/bootstrap-env.mts scripts/seed.ts
```

Или проще — добавь переменную `SEED_ON_START=true` и сделаем auto-seed при первом запуске.

## 5. Готово

Railway выдаст URL вида `https://kingdomcars-v2-production.up.railway.app`

---

## Бесплатный лимит Railway

- $5 кредитов при регистрации (хватит на 2-3 недели демо)
- PostgreSQL включён в кредиты
- Для постоянного хостинга нужен план Hobby ($5/мес)
