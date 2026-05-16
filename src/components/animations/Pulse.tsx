'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import { pulseVariants } from '@/components/animations/motion-constants';

interface Props {
  children: ReactNode;
  as?: 'div' | 'span' | 'button';
  className?: string;
  /**
   * Peak scale of the pulse. Default `1.04` — small enough to feel like a
   * gentle "tap me" hint, not a distraction. Larger values approach
   * accessibility complaints; keep ≤ 1.08.
   */
  intensity?: number;
}

/**
 * Looping scale pulse for low-stakes attention-getters (CTAs, "new" badges,
 * the open-form button in the header). Animation runs only for users without
 * `prefers-reduced-motion: reduce` thanks to MotionConfig in MotionProvider.
 */
export function Pulse({ children, as = 'div', className, intensity = 1.04 }: Props) {
  const Component = m[as];
  return (
    <Component
      initial="rest"
      animate="pulse"
      variants={pulseVariants(intensity)}
      className={className}
    >
      {children}
    </Component>
  );
}
