/**
 * Per-run unique markers so e2e submissions don't collide with prior test
 * runs in the shared dev database (§15 dev-DB compromise). The admin can
 * grep `FormSubmissions` by `e2e-` prefix to clean up.
 */
import { randomBytes } from 'node:crypto';

const RUN_ID = randomBytes(4).toString('hex');

export function e2eMarker(label: string): string {
  return `e2e-${label}-${RUN_ID}-${Date.now()}`;
}

export function uniqueName(): string {
  return `E2E User ${RUN_ID}`;
}

export function uniquePhone(): string {
  // Polish format, prefix kept identical so client-side regex passes.
  const tail = (Date.now() % 10_000_000).toString().padStart(7, '0');
  return `+48 500 ${tail.slice(0, 3)} ${tail.slice(3)}`;
}

export function uniqueEmail(): string {
  return `e2e-${RUN_ID}@example.test`;
}

export async function fetchTelegramMockCalls(baseURL = 'http://localhost:9999') {
  const res = await fetch(`${baseURL}/__last`);
  return (await res.json()) as { count: number; calls: Array<{ body: string; at: string }> };
}
