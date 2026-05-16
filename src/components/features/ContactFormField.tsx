import type { ReactNode } from 'react';

interface Props {
  label: string;
  error?: string;
  children: ReactNode;
}

/**
 * Label + control + error row for ContactForm. `role="alert"` on the error
 * span lets assistive tech announce validation messages without us having
 * to wire up `aria-live` regions manually.
 *
 * The visual styling matches the rest of the form (uppercase tracked label,
 * red error in 12px). Layout is owned by the parent `<form>`'s flex gap.
 */
export function ContactFormField({ label, error, children }: Props) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-heading font-semibold tracking-wider text-black/70 uppercase">
        {label}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
