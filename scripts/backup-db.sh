#!/usr/bin/env bash
# =============================================================================
# Postgres backup — runs against the `postgres` service via docker compose
# exec, writes a gzipped dump to ./backups/, rotates anything older than
# 7 days. Designed to be cron-friendly (see docs/deployment.md).
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

# Read DB creds from .env (or environment if exported).
if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi
DB="${POSTGRES_DB:-kingdomcars}"
USER="${POSTGRES_USER:-payload}"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/db-$TIMESTAMP.sql.gz"

echo "[backup] dumping $DB → $OUT"
docker compose exec -T postgres pg_dump \
  --username="$USER" \
  --dbname="$DB" \
  --format=plain \
  --no-owner \
  --no-acl \
  | gzip -9 > "$OUT"

# Sanity-check: dump shouldn't be tiny.
SIZE=$(stat -c%s "$OUT" 2>/dev/null || stat -f%z "$OUT")
if [[ "$SIZE" -lt 1024 ]]; then
  echo "[backup] WARNING: dump is only ${SIZE} bytes — investigate" >&2
fi

echo "[backup] rotating dumps older than ${RETENTION_DAYS} days"
find "$BACKUP_DIR" -name 'db-*.sql.gz' -type f -mtime "+${RETENTION_DAYS}" -delete

echo "[backup] done — kept files:"
ls -1tr "$BACKUP_DIR"/db-*.sql.gz 2>/dev/null | tail -10
