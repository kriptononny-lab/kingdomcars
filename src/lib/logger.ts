import pino, { type Logger, type LoggerOptions } from 'pino';

import { HEADERS } from '@/lib/constants';
import { serverEnv } from '@/lib/env';

const baseOptions: LoggerOptions = {
  level: serverEnv.LOG_LEVEL ?? 'info',
  base: { service: 'kingdomcars-web' },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.email', '*.phone', '*.password'],
    censor: '[REDACTED]',
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const prettyTransport =
  serverEnv.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss.l' } }
    : undefined;

export const logger = pino({
  ...baseOptions,
  ...(prettyTransport ? { transport: prettyTransport } : {}),
});

/** Create a child logger scoped to a request (§16, correlation via x-request-id). */
export function withRequestId(requestId: string): Logger {
  return logger.child({ requestId });
}

interface HeaderReader {
  get(name: string): string | null;
}

const REQUEST_ID_PATTERN = /^[\w.:-]{1,128}$/;

/**
 * Pull a valid request-id from a Headers-like object or generate a fresh one.
 * Single source of truth for parse-and-validate; also used inside `proxy.ts`
 * so both entry points apply the same rule.
 *
 * Validation is paranoid on purpose — clients/proxies can inject arbitrary
 * values here, and the id ends up in structured logs and Sentry tags.
 */
export function getRequestId(headers?: HeaderReader | undefined): string {
  const raw = headers?.get(HEADERS.REQUEST_ID);
  if (raw && REQUEST_ID_PATTERN.test(raw)) return raw;
  return crypto.randomUUID();
}

/**
 * Sugar for the common route-handler / server-action case: derive a tagged
 * logger from request headers in one call. Always returns a tagged logger
 * (generates a fresh id if the header is missing — happens on /api/* paths
 * where the proxy matcher doesn't run).
 */
export function loggerFromHeaders(headers?: HeaderReader | undefined): Logger {
  return withRequestId(getRequestId(headers));
}
