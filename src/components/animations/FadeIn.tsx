'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import { fadeInVariants } from '@/components/animations/motion-constants';

interface Props {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
  className?: string;
  /** Delay in seconds before the animation starts. */
  delay?: number;
}

/**
 * Fade + 12px rise on mount. Server-rendered `children` remain server.
 * Reduced-motion users see instant `opacity: 1, y: 0` (handled by MotionConfig).
 */
export function FadeIn({ children, as = 'div', className, delay = 0 }: Props) {
  const Component = m[as];
  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={delay > 0 ? { delay } : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}
