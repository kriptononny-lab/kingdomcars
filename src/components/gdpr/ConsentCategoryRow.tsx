'use client';

interface Props {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}

/**
 * One row in <CookieSettingsDialog>. The `necessary` category passes
 * `disabled` + `checked` so the toggle is visible but immovable —
 * shows the user what's always on without letting them disable it.
 */
export function ConsentCategoryRow({ title, description, checked, disabled, onChange }: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="accent-gold mt-1 h-4 w-4 disabled:opacity-50"
      />
      <span>
        <span className="font-heading text-text-primary block text-sm font-semibold tracking-wider uppercase">
          {title}
        </span>
        <span className="text-text-muted block text-xs">{description}</span>
      </span>
    </label>
  );
}
