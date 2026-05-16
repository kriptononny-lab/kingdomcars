'use server';

import { cookies } from 'next/headers';

import { CONSENT_COOKIE, CONSENT_TTL_SEC } from '@/lib/consent';
import type { ConsentState } from '@/types/consent';

/**
 * Persist consent choice. Called from `<CookieConsentProvider>` after the
 * visitor clicks Accept/Reject/Save in the banner or settings dialog.
 *
 * Cookie attributes per §13/14:
 *   - `Secure` in production (HTTPS only)
 *   - `SameSite=Lax` — sent on top-level navigation, safe vs CSRF
 *   - `httpOnly=false` — banner provider needs to read it to know whether
 *     to show the banner on subsequent visits; consent state contains no
 *     secrets, so XSS exposure is acceptable
 *   - `Path=/` and no `Domain` — required by `__Host-` prefix
 */
export async function saveConsent(state: ConsentState): Promise<void> {
  const value = JSON.stringify({
    necessary: true,
    analytics: state.analytics === true,
    marketing: state.marketing === true,
  });

  (await cookies()).set(CONSENT_COOKIE, value, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CONSENT_TTL_SEC,
    httpOnly: false,
  });
}
