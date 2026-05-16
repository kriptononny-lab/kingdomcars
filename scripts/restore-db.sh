#!/usr/bin/env bash
# =============================================================================
# Postgres restore — replays a gzipped dump (created by backup-db.sh) into
# the running `postgres` service. Refuses to run without explicit confirmation
# because it DROPs and recreates the database.
#
# Usage:
#   ./scripts/restore-db.sh                       # latest dump in ./backups
#   ./scripts/restore-db.sh path/to/dump.sql.gz
#   FORCE=1 ./scripts/restore-db.sh …             # skip confirmation (CI)
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi
DB="${POSTGRES_DB:-kingdomcars}"
USER="${POSTGRES_USER:-payload}"

DUMP="${1:-}"
if [[ -z "$DUMP" ]]; then
  DUMP="$(ls -1t "$BACKUP_DIR"/db-*.sql.gz 2>/dev/null | head -1 || true)"
fi
if [[ -z "$DUMP" || ! -f "$DUMP" ]]; then
  echo "[restore] no dump file found (looked in $BACKUP_DIR)" >&2
  exit 1
fi

echo "[restore] will replace database '$DB' from '$DUMP'"
if [[ "${FORCE:-0}" != "1" ]]; then
  read -r -p "  Proceed? Type 'yes' to confirm: " ANS
  [[ "$ANS" == "yes" ]] || { echo "[restore] aborted"; exit 1; }
fi

# Drop + recreate to ensure a clean slate.
docker compose exec -T postgres psql -U "$USER" -d postgres -c "DROP DATABASE IF EXISTS $DB;"
docker compose exec -T postgres psql -U "$USER" -d postgres -c "CREATE DATABASE $DB OWNER $USER;"

# Stream the gunzipped dump into psql.
gunzip -c "$DUMP" | docker compose exec -T postgres psql -U "$USER" -d "$DB"

echo "[restore] done"
