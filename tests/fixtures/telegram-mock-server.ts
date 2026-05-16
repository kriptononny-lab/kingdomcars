import { createServer } from 'node:http';

/**
 * Tiny Telegram-API stub for Playwright (§15). Listens on PORT (default
 * 9999), accepts every `POST /bot<token>/sendMessage`, replies `{ ok: true }`.
 * Records last N payloads in memory for assertions via the side-channel
 * GET /__last endpoint — handy when an e2e wants to verify Telegram was
 * actually called with the expected text.
 *
 * Run via Playwright's `webServer`: `npx tsx tests/fixtures/telegram-mock-server.ts`.
 */

const PORT = Number(process.env.TELEGRAM_MOCK_PORT ?? 9999);
const MAX_RECORDED = 50;

const recorded: Array<{ method: string; url: string; body: string; at: string }> = [];

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/__last') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: recorded.length, calls: recorded }));
    return;
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      recorded.push({ method: req.method ?? '?', url: req.url ?? '?', body, at: new Date().toISOString() });
      while (recorded.length > MAX_RECORDED) recorded.shift();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, result: { message_id: recorded.length } }));
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[telegram-mock] listening on http://localhost:${PORT}`);
});

const shutdown = () => {
  // eslint-disable-next-line unicorn/no-process-exit -- test fixture CLI.
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
