'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  staggerContainer,
  staggerItem,
} from '@/components/animations/motion-constants';

interface StaggerProps {
  children: ReactNode;
  as?: 'div' | 'ul' | 'ol' | 'section';
  className?: string;
  amount?: number;
}

/**
 * Reveal a list of items sequentially while it scrolls into view. Wrap each
 * child in `<StaggerItem>` so the container's staggerChildren can target them
 * via the variants context.
 */
export function Stagger({ children, as = 'div', className, amount = 0.15 }: StaggerProps) {
  const Component = m[as];
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  as?: 'div' | 'li' | 'article';
  className?: string;
}

export function StaggerItem({ children, as = 'div', className }: StaggerItemProps) {
  const Component = m[as];
  return (
    <Component variants={staggerItem} className={className}>
      {children}
    </Component>
  );
}
