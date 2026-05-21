# Deployment

Production deploy of KingdomCars to a single VPS via Docker Compose.

## Prerequisites

- Linux host with public IPv4 (Ubuntu 24 LTS tested)
- Domain pointed at the host's A/AAAA records
- Ports 80 + 443 open to the world
- Docker Engine ≥ 24 and Docker Compose v2 plugin

```bash
# install docker (Ubuntu / Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
# log out + back in for the group to take effect
```

## First-time setup

```bash
git clone <repo-url> kingdomcars && cd kingdomcars
cp .env.docker.example .env
$EDITOR .env                              # fill secrets — see comments
# Edit docker/caddy/Caddyfile: comment out the `:80 { import site_common }`
# block and uncomment the `{$SITE_DOMAIN} { import site_common }` block.

make up                                   # builds + starts app/postgres/caddy
make seed                                 # creates initial admin user
```

`make up` is `docker compose up -d --build`. First build takes 3–5 minutes
(npm install + next build). Subsequent builds reuse the deps layer and
finish in 30–60 seconds.

The image is **~200 MB** thanks to standalone output + alpine base.

## Daily ops

```bash
make logs        # tail app logs
make ps          # list services
make shell       # exec sh inside the app container
make migrate     # apply Payload migrations after a schema change
make restart     # restart just the app container
```

## Backups

`scripts/backup-db.sh` runs `pg_dump | gzip` into `./backups/` with timestamped
filenames and 7-day rotation. Run manually with `make backup`.

### Cron

Add to the deploy user's crontab (`crontab -e`):

```cron
# Every day at 03:17 UTC — pick a random minute to avoid herd thunder.
17 3 * * *  cd /opt/kingdomcars && /usr/bin/make backup >> /var/log/kc-backup.log 2>&1
```

Recovery is symmetric:

```bash
make restore                             # restore latest dump (with prompt)
make restore DUMP=backups/db-20260514-0317.sql.gz
```

Restore is **destructive** — it drops + recreates the database. The script
prompts for confirmation unless `FORCE=1` is set.

## Updating

```bash
git pull
make up                                  # rebuilds + recreates containers
make migrate                             # if schema changed
```

Zero-downtime updates are out of scope for this stack — expect ~10 s of
504 errors during recreate. If you need true zero-downtime, put a second
host behind a load balancer.

## Enabling Umami analytics (opt-in)

```bash
# Add to .env:
#   UMAMI_APP_SECRET=<random 32+ chars>
#   ANALYTICS_DOMAIN=analytics.your-domain.com
# Add a DNS A record for analytics.* pointing at the same host.

docker compose -f docker-compose.yml -f docker-compose.umami.yml up -d
# First visit: log in to https://analytics.<domain> with admin / umami,
# change the password immediately, then register your site.
# Set NEXT_PUBLIC_ANALYTICS_URL + NEXT_PUBLIC_ANALYTICS_ID in .env and
# redeploy app.
```

## Troubleshooting

- **`caddy` keeps restarting** — usually Let's Encrypt rate-limit or DNS
  not yet propagated. Check `docker compose logs caddy`. Switch the
  Caddyfile back to localhost mode while you investigate.
- **`app` healthy but 502 from Caddy** — Caddy reaches the app on the
  internal network; confirm the app's healthcheck is green with
  `docker compose ps`.
- **Database connection refused** — Postgres healthcheck takes ~20 s on
  first boot; `app` is configured to wait via `depends_on: condition:
service_healthy`, so the first `make up` should "just work" but cold
  starts can take a minute.
- **Disk fills with Docker logs** — already mitigated by `json-file`
  driver with 10 MB × 3 file rotation per service, but if you have many
  long-running deploys, prune the docker system periodically:
  `docker system prune -f --volumes` (⚠ check what it'll delete first).
