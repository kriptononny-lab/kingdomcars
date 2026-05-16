import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main';
  children: ReactNode;
}

/**
 * Centred page-width wrapper. Defaults to `<div>`, swap via `as` prop.
 * Single source of truth for max-width and side padding.
 */
export function Container({ as: Tag = 'div', className, children, ...rest }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1200px] px-6', className)} {...rest}>
      {children}
    </Tag>
  );
}
