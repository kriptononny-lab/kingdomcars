'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import { revealVariants } from '@/components/animations/motion-constants';

interface Props {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
  className?: string;
  /** Fraction of element visible before triggering (0–1). Default 0.2. */
  amount?: number;
  /** If true, allows re-trigger on re-entry. Default false (once). */
  repeat?: boolean;
}

/**
 * IntersectionObserver-based fade-up. Triggers once by default — saving CPU
 * for users scrolling back through long pages.
 */
export function Reveal({
  children,
  as = 'div',
  className,
  amount = 0.2,
  repeat = false,
}: Props) {
  const Component = m[as];
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount }}
      variants={revealVariants}
      className={className}
    >
      {children}
    </Component>
  );
}
