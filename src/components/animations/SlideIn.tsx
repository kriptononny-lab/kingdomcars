'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import { type SlideDirection, slideInVariants } from '@/components/animations/motion-constants';

interface Props {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
  className?: string;
  /** Direction the element slides in *from*. Default `'left'`. */
  direction?: SlideDirection;
  /** Pixel distance to travel. Default 24. */
  distance?: number;
  /** Delay in seconds. Default 0. */
  delay?: number;
}

/**
 * Slide + fade on mount from a chosen direction. Reduced-motion users see
 * an instant final state (handled globally by MotionProvider).
 */
export function SlideIn({
  children,
  as = 'div',
  className,
  direction = 'left',
  distance = 24,
  delay = 0,
}: Props) {
  const Component = m[as];
  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={slideInVariants(direction, distance)}
      transition={delay > 0 ? { delay } : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}
