SHELL := /bin/bash
COMPOSE := docker compose

.PHONY: help up down restart logs ps build seed migrate shell backup restore test lint typecheck format clean install dev

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install npm dependencies (host-side, dev only)
	npm ci

dev: ## Run Next.js dev server locally (no docker)
	npm run dev

up: ## Start full stack: postgres → build app with live DB → bring up everything
	@echo "[up] Starting postgres first so the builder can connect..."
	$(COMPOSE) up -d postgres
	@echo "[up] Waiting for postgres to be healthy..."
	@until $(COMPOSE) ps postgres --format '{{.Status}}' | grep -q healthy; do sleep 2; done
	@echo "[up] Building app image (builder stage connects via host network)..."
	$(COMPOSE) build app
	@echo "[up] Bringing up the full stack..."
	$(COMPOSE) up -d
	$(COMPOSE) ps

down: ## docker compose down
	$(COMPOSE) down

restart: ## restart the app container
	$(COMPOSE) restart app

logs: ## follow app logs
	$(COMPOSE) logs -f app

ps: ## list running services
	$(COMPOSE) ps

build: ## build app image only (assumes postgres already running)
	$(COMPOSE) build app

seed: ## run seed script inside app container
	$(COMPOSE) exec app npm run seed

migrate: ## run payload migrations
	$(COMPOSE) exec app npm run payload:migrate

shell: ## shell into app container
	$(COMPOSE) exec app sh

backup: ## pg_dump → ./backups/
	./scripts/backup-db.sh

restore: ## restore from latest dump (DUMP=file.sql override)
	./scripts/restore-db.sh $(DUMP)

test: ## run unit + e2e tests
	npm run test && npm run test:e2e

lint: ## run eslint
	npm run lint

typecheck: ## run tsc --noEmit
	npm run typecheck

format: ## run prettier --write
	npm run format

clean: ## drop volumes + remove containers
	$(COMPOSE) down -v --remove-orphans
