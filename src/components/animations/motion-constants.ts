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
