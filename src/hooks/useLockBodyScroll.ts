'use client';

import { useEffect } from 'react';

/**
 * Lock body scroll while a modal / drawer is open. Compensates the
 * scrollbar width so the layout under the overlay doesn't shift.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = original.overflow;
      document.body.style.paddingRight = original.paddingRight;
    };
  }, [locked]);
}
