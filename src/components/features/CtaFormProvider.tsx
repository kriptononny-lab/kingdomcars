'use client';

import { useEffect, useState } from 'react';

import { ContactFormDialog } from '@/components/features/ContactFormDialog';

/**
 * Globally listens for clicks on `[data-cta-open="true"]` and opens the
 * contact-form modal. Mounted once at layout root. No props — uses event
 * delegation so any future CTA button works automatically.
 */
export function CtaFormProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest('[data-cta-open="true"]');
      if (!trigger) return;
      event.preventDefault();
      setOpen(true);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <ContactFormDialog open={open} onOpenChange={setOpen} />;
}
