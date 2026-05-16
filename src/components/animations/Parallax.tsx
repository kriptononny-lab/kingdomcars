'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /**
   * How much the element shifts vertically as it crosses the viewport.
   * `0.2` means it travels at 20 % of the scroll distance, in pixels.
   * Positive — slower than scroll (drifts up). Negative — reverse parallax.
   * Default `0.2`.
   */
  speed?: number;
}

/**
 * Vertical parallax on scroll. Uses `useScroll` with a per-element target
 * so multiple Parallax wrappers don't fight for the document scroll.
 * Reduced-motion users get a static, untransformed element.
 *
 * Restricted to `transform: translateY` per §11 — no `top`/`background-
 * position` transitions that would force layout/paint.
 */
export function Parallax({ children, className, speed = 0.2 }: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  );
}
