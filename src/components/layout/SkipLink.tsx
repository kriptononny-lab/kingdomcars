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
      className="skip-link absolute left-2 top-2 z-50 rounded-md bg-gold px-4 py-2 font-heading text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-gold-light"
    >
      {t('skipToContent')}
    </a>
  );
}
