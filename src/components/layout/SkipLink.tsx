import { useTranslations } from 'next-intl';

/**
 * Visible-on-focus "skip to content" link — first focusable element on every
 * page so keyboard users bypass the header (§10).
 *
 * The accompanying CSS (`.skip-link:not(:focus)`) lives in globals.css.
 */
export function SkipLink() {
  const t = useTranslations('common');
  return (
    <a
      href="#main"
      className="skip-link bg-gold font-heading focus:ring-gold-light absolute top-2 left-2 z-50 rounded-md px-4 py-2 text-sm font-semibold text-black focus:ring-2 focus:outline-none"
    >
      {t('skipToContent')}
    </a>
  );
}
