import type { Transition, Variants } from 'framer-motion';

import { ANIMATION } from '@/lib/constants';

/**
 * Default ease curve for all in-view reveals.
 *
 * framer-motion v12 narrowed `Transition['ease']` to a union that doesn't
 * include the loose `number[]`-typed cubic-bezier tuple we'd get from
 * spreading `EASING_OUT_QUART` (which is `readonly number[]` upstream).
 * Cast back to the 4-tuple shape the runtime accepts, then let the
 * compiler narrow the export type via `as const`.
 */
export const EASE_OUT_QUART = [
  ANIMATION.EASING_OUT_QUART[0],
  ANIMATION.EASING_OUT_QUART[1],
  ANIMATION.EASING_OUT_QUART[2],
  ANIMATION.EASING_OUT_QUART[3],
] as [number, number, number, number];

export const TRANSITION_BASE: Transition = {
  duration: ANIMATION.DURATION_BASE_MS / 1000,
  ease: EASE_OUT_QUART,
};

export const TRANSITION_SECTION: Transition = {
  duration: ANIMATION.DURATION_SECTION_MS / 1000,
  ease: EASE_OUT_QUART,
};

/** Fade + slight rise from 12px below. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_BASE },
};

/** Larger lift for hero / section-level reveals. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_SECTION },
};

/** Container — orchestrates children only. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Item inside a Stagger group. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_BASE },
};

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Slide-in variants factory. Distance is in pixels (default 24). Direction
 * controls which axis to come in from. Returned variants share the standard
 * base transition so timing matches FadeIn / Reveal.
 *
 * Explicit per-axis branches (not `[axis]: value`) — framer-motion's
 * `Variant` type carries a `[key: \`--${string}\`]: …` CSS-variable index
 * signature that conflicts with computed-key writes to plain `x` / `y`
 * properties. Two literal-keyed returns satisfy the typer.
 */
export function slideInVariants(direction: SlideDirection, distance = 24): Variants {
  const sign = direction === 'right' || direction === 'down' ? 1 : -1;
  const offset = sign * distance;
  if (direction === 'left' || direction === 'right') {
    return {
      hidden: { opacity: 0, x: offset },
      visible: { opacity: 1, x: 0, transition: TRANSITION_BASE },
    };
  }
  return {
    hidden: { opacity: 0, y: offset },
    visible: { opacity: 1, y: 0, transition: TRANSITION_BASE },
  };
}

/**
 * Pulse used on CTAs and badges to draw attention. The Y of `1.04` is
 * deliberately small — the spec (§9) restricts UI micro-animations to
 * `transform`/`opacity` and 200–400 ms durations.
 */
export function pulseVariants(intensity = 1.04): Variants {
  return {
    rest: { scale: 1 },
    pulse: {
      scale: [1, intensity, 1],
      transition: { duration: 1.6, ease: 'easeInOut', repeat: Infinity },
    },
  };
}
