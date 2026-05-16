'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from 'react';

import { CookieBanner } from '@/components/gdpr/CookieBanner';
import { CookieSettingsDialog } from '@/components/gdpr/CookieSettingsDialog';
import { saveConsent } from '@/lib/actions/save-consent';
import { CONSENT_COOKIE_REGEX } from '@/lib/consent';
import type { ConsentState } from '@/types/consent';

function readClientCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const match = CONSENT_COOKIE_REGEX.exec(document.cookie);
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]!)) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return null;
  }
}

interface Ctx {
  /** `null` until the visitor makes an explicit choice. */
  consent: ConsentState | null;
  set: (next: ConsentState) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const ConsentContext = createContext<Ctx | null>(null);

export function useCookieConsent(): Ctx {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within <CookieConsentProvider>');
  return ctx;
}

/**
 * Reads consent client-side (via `document.cookie`) so the layout that
 * embeds this provider can stay statically rendered. The banner is mounted
 * only after hydration confirms there's no consent cookie — avoids the
 * brief banner flash for returning users that purely-client banners cause.
 */
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // `undefined` = not hydrated; `null` = hydrated, no cookie → show banner.
  // The initial value MUST be `undefined` to distinguish "we don't know yet"
  // (SSR + first paint) from "we know there's no consent" (post-hydration).
  // eslint-disable-next-line unicorn/no-useless-undefined -- intentional tri-state.
  const [consent, setConsent] = useState<ConsentState | null | undefined>(undefined);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Read the consent cookie once on mount and lift it into React state.
    // This is the documented "sync from external system on hydration"
    // pattern — exactly what the rule's docs say IS the legitimate use of
    // setState in an effect; the static analyser can't tell apart.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration sync.
    setConsent(readClientCookie());
  }, []);

  const set = useCallback((next: ConsentState) => {
    setConsent(next);
    startTransition(() => {
      void saveConsent(next);
    });
    setSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<Ctx>(
    () => ({ consent: consent ?? null, set, isSettingsOpen, openSettings, closeSettings }),
    [consent, set, isSettingsOpen, openSettings, closeSettings],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {consent === null ? <CookieBanner /> : null}
      <CookieSettingsDialog />
    </ConsentContext.Provider>
  );
}
