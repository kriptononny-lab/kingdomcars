import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const BASE =
  'inline-flex items-center justify-center rounded-lg px-7 py-3 font-heading text-sm font-semibold uppercase tracking-wider transition-all duration-300 motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 min-h-[44px]';

const VARIANTS = {
  primary:
    'bg-gold text-black motion-safe:hover:bg-gold-light motion-safe:hover:shadow-[0_8px_24px_rgba(232,168,37,0.4)]',
  secondary:
    'border-2 border-gold bg-transparent text-gold motion-safe:hover:bg-gold motion-safe:hover:text-black',
} as const;

interface CommonProps {
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
  className?: string;
}

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; openCtaForm?: never };
type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; openCtaForm?: boolean };

export function CTAButton(props: LinkProps | ButtonProps) {
  const { variant = 'primary', className, children } = props;
  const cls = cn(BASE, VARIANTS[variant], className);
  if ('href' in props && props.href) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { openCtaForm, variant: _v, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button
      type="button"
      data-cta-open={openCtaForm ? 'true' : undefined}
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
