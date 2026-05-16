'use client';

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /**
   * How far the element follows the pointer relative to its own size.
   * `0.3` means up to 30 % of width/height of pull. Default `0.3`.
   */
  strength?: number;
}

/**
 * Magnetic hover: the element drifts toward the pointer within its bounds.
 * Mobile / touch devices and reduced-motion users get a static element —
 * `pointermove` is fired by touch too, so we explicitly bail out on
 * `pointerType: 'touch'` and on `useReducedMotion()`.
 */
export function Magnetic({ children, className, strength = 0.3 }: Props) {
  const prefersReduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.5 });

  if (prefersReduced) return <span className={className}>{children}</span>;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
    >
      {children}
    </m.span>
  );
}
