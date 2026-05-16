'use client';

import { useEffect, useState } from 'react';

import { REJECT_ALL, type ConsentState } from '@/types/consent';

/**
 * Returns local toggle state for the cookie settings dialog and keeps it
 * synchronised with the saved consent whenever the dialog re-opens.
 *
 * Without this, closing the dialog with unsaved changes and reopening it
 * would still show the in-flight checkbox values instead of the actual
 * persisted choice.
 *
 * The lint rule's static analysis can't see that `isOpen` guards the
 * `setState` calls so they only fire on open, not every render — hence
 * the targeted disable.
 */
export function useSyncFromConsentOnOpen(isOpen: boolean, consent: ConsentState | null) {
  const initial = consent ?? REJECT_ALL;
  const [analytics, setAnalytics] = useState(initial.analytics);
  const [marketing, setMarketing] = useState(initial.marketing);

  useEffect(() => {
    if (isOpen) {
      const next = consent ?? REJECT_ALL;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional re-sync on open.
      setAnalytics(next.analytics);
      setMarketing(next.marketing);
    }
  }, [isOpen, consent]);

  return { analytics, setAnalytics, marketing, setMarketing };
}
