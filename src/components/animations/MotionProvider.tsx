'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

import { TRANSITION_BASE } from '@/components/animations/motion-constants';

interface Props {
  children: ReactNode;
}

/**
 * One Motion context for the whole tree.
 *
 * - `LazyMotion features={domAnimation}` ships ~17 KB gz; with `strict` only
 *   the tree-shakable `m.*` namespace is allowed (§11 bundle budget).
 * - `MotionConfig reducedMotion="user"` makes every `m.*` element automatic-
 *   ally skip transitions when the user has `prefers-reduced-motion: reduce`,
 *   so individual wrappers don't have to check (§9).
 */
export function MotionProvider({ children }: Props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={TRANSITION_BASE}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
