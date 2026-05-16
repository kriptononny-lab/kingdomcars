/**
 * Catch-all for `/.well-known/*` requests (Chrome DevTools probes for
 * `appspecific/com.chrome.devtools.json`, Apple `apple-app-site-association`,
 * etc.). Without this route the catch-all `[locale]/[...slug]` matches,
 * Payload then queries `pages` with `slug=".well-known"` and Postgres
 * rejects the request because the locale enum has no `.well-known` value.
 *
 * Returns 404 directly — fast, doesn't touch the database, doesn't pollute
 * the dev log with `enum_in` errors.
 */
export function GET() {
  return new Response('Not Found', { status: 404 });
}
