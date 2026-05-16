# ADR-0005: Server Actions for the contact form

- **Status:** Accepted
- **Date:** 2026-02-18
- **Decision-maker:** Project lead

## Context

The contact form (§12) needs to:

- Validate with the same Zod schema on client and server.
- Rate-limit by IP.
- Persist to Payload `form-submissions`.
- Fire-and-forget to Telegram (5s timeout; user sees success either way).
- Work without JavaScript (no-JS visitor or slow first paint).
- Stay CSRF-safe.

## Decision

Submission goes through a **Next.js Server Action**
(`src/actions/submit-contact.ts`). The no-JS fallback is a thin **Route
Handler** at `POST /api/contact` that re-parses `FormData` into the same
Zod shape and invokes the same action.

## Rationale

1. **Type-safe end to end.** The Server Action takes `ContactInput`; the
   client passes it; no manual JSON deserialisation, no `as` casts at the
   boundary.

2. **CSRF protection is automatic.** Server Actions run with the
   `Origin`/`Host` header check Next builds in. A plain Route Handler
   would need a CSRF token + double-submit cookie.

3. **Cleaner client code.** No `fetch('/api/contact', { ... })` boilerplate.
   `react-hook-form`'s `handleSubmit(async (values) => submitContactAction(values))`
   reads as a function call, not as an HTTP request.

4. **One Zod schema** — `contactSchema` is imported by the form, the
   action, and the fallback route. DRY without indirection.

5. **No-JS gracefully degrades.** The `<form action="/api/contact" method="POST">`
   markup is a vanilla browser submission; the route handler converts
   `FormData` → object → Zod parse → same action.

## Trade-offs

1. **Server Actions are tied to React Server Components.** We can't share
   the action with a non-Next consumer (mobile app, external API). The
   route handler provides the public HTTP interface if we ever need it.

2. **Action errors return generic `{ ok: false, error: '...' }`.** Granular
   field errors come back as `details`; the route handler serialises that to
   JSON for non-JS callers.

3. **Debugging Server Actions is harder** — there's no Network-tab request
   to inspect. We mitigate with structured `logger.error({ err }, …)` in
   the action and Sentry capture of unhandled cases.

## Why not API routes only

- Would need CSRF tokens, manual JSON parsing, type sharing through a
  shared `lib/api/contact-client.ts`.
- Would still need a Server Action for the no-JS path, OR a Route Handler
  that processes FormData differently — duplicated logic.

## Why not GraphQL

- One endpoint, one verb. No multi-resource queries on the public site.
  GraphQL adds tooling cost (codegen, schema reload) for zero benefit here.
