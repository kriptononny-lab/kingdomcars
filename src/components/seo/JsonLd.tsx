import 'server-only';

import { headers } from 'next/headers';

/**
 * Serialise a JSON-LD object into a `<script type="application/ld+json">`
 * tag. Server-only — emitted at SSR time so search-engine crawlers see it
 * without executing client JS.
 *
 * Reads the CSP nonce set by `src/proxy.ts` and applies it so the
 * `'strict-dynamic'` CSP allows this inline script. Without the nonce, the
 * browser blocks the script and the structured data is lost.
 */
interface Props {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export async function JsonLd({ data, id }: Props) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  // Escape `<` to prevent breaking out of the <script> tag — defence in
  // depth against malicious content from Payload (e.g. a page title with
  // injected </script>).
  const json = JSON.stringify(data).replaceAll('<', String.raw`\u003c`);
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      id={id}
      // Browser strips the `nonce` attribute after applying CSP (security
      // feature: prevents the client JS from reading it). React then sees
      // server="nonce-xyz" vs client="" on hydration and warns. The
      // mismatch is harmless — the script tag is already in the DOM,
      // CSP already vetted it — so we suppress the warning here only.
      // See: github.com/kentcdodds/nonce-hydration-issues
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
