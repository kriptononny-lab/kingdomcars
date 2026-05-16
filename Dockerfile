# syntax=docker/dockerfile:1.7
# =============================================================================
# KingdomCars production image (§18.1-3).
#
# Stages:
#   1. deps     — install full dependency tree (cached separately from src)
#   2. builder  — next build (standalone output, needs live DB for ISR pages)
#   3. runner   — node:24-alpine + standalone output + non-root nextjs:1001
#
# Node 24 pinned across all stages so it matches the host's npm 11 lockfile
# format. Mixing host npm 11 (lockfileVersion v3 with new optionalDependency
# resolution) with container npm 10 (Node 22 default) causes `npm ci` to
# choke on legitimate hoisting differences. Bump in lockstep.
#
# IMPORTANT: §17 mandates `generateStaticParams` + ISR for Payload pages,
# which means `next build` connects to Postgres during page-data collection.
# This image is built with `network_mode: host` (see docker-compose.yml) so
# the builder stage reaches `localhost:5432` where `make up` has just
# started the postgres service. Linux servers handle this natively; on
# Docker Desktop (Windows/macOS) host networking is emulated via
# `host.docker.internal`.
#
# Backlog (cleanup patch):
#   • Stop overriding the bundler when Turbopack fixes standalone external
#     resolution (`dataloader`, `pino` modules)
# =============================================================================

# -------- 1. deps -----------------------------------------------------------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
# Match host npm 11 so `npm ci` reads the lockfile with the same resolution
# rules used to write it. node:24-alpine still ships npm 10 by default.
RUN npm install -g npm@11
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY scripts/patch-payload.mjs ./scripts/patch-payload.mjs
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# -------- 2. builder --------------------------------------------------------
FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* — inlined into client bundle.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_HOST

# Server-side vars — read by env.ts during page-data collection.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG PAYLOAD_PUBLIC_SERVER_URL
ARG REVALIDATE_SECRET
ARG TELEGRAM_BOT_TOKEN
ARG TELEGRAM_CHAT_ID

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SITE_HOST=$NEXT_PUBLIC_SITE_HOST \
    DATABASE_URL=$DATABASE_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    PAYLOAD_PUBLIC_SERVER_URL=$PAYLOAD_PUBLIC_SERVER_URL \
    REVALIDATE_SECRET=$REVALIDATE_SECRET \
    TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN \
    TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Use webpack: Turbopack's standalone external resolution misses pino/dataloader.
RUN npx next build --webpack

# -------- 3. runner ---------------------------------------------------------
FROM node:24-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p ./payload-media && chown -R nextjs:nodejs ./payload-media

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
