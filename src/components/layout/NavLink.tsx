import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { LinkValue } from '@/types/blocks/common';

interface Props {
  link: LinkValue;
  className?: string;
  onClick?: () => void;
}

/**
 * Compute an accessible name for a link even when the Payload editor has
 * accidentally left `label` empty. Order of preference:
 *   1. trimmed `label`
 *   2. anchor target (`#services` etc.)
 *   3. external URL hostname
 *   4. internal page slug
 *   5. literal "link" (last-resort — should never reach this)
 *
 * Without this fallback an empty label produces an empty `<a>` and axe-core
 * reports a `link-name` violation. The 5-level fallback below means the
 * link always has a non-empty accessible name, even if a Payload editor
 * accidentally clears it.
 */
function accessibleName(link: LinkValue): string {
  const trimmed = link.label?.trim();
  if (trimmed) return trimmed;
  if (link.kind === 'anchor' && link.anchor) return `#${link.anchor}`;
  if (link.kind === 'external' && link.url) {
    try {
      return new URL(link.url).hostname;
    } catch {
      return link.url;
    }
  }
  const pageSlug = typeof link.page === 'object' ? link.page?.slug : link.page;
  if (pageSlug) return `/${pageSlug}`;
  return 'link';
}

/**
 * Render a Payload `LinkValue` as the appropriate anchor or i18n Link.
 *
 * - `kind: 'anchor'` → plain `<a href="#anchor">`
 * - `kind: 'external'` → `<a target rel>` with safe rel
 * - `kind: 'internal'` → next-intl `<Link>` (preserves locale)
 */
export function NavLink({ link, className, onClick }: Props) {
  const cls = cn('inline-flex min-h-[44px] items-center', className);
  const text = accessibleName(link);

  if (link.kind === 'anchor' && link.anchor) {
    return (
      <a href={`#${link.anchor}`} className={cls} onClick={onClick}>
        {text}
      </a>
    );
  }
  if (link.kind === 'external' && link.url) {
    return (
      <a
        href={link.url}
        className={cls}
        target={link.newTab ? '_blank' : undefined}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {text}
      </a>
    );
  }
  const pageSlug = typeof link.page === 'object' ? link.page?.slug : link.page;
  const href = pageSlug ? `/${pageSlug}` : '/';
  return (
    // @ts-expect-error — dynamic Payload-page slug isn't part of next-intl's
    // typed `pathnames` enum (it knows only the static /about, /privacy etc.).
    // The component is unit-tested; runtime resolution is safe.
    <Link href={{ pathname: href }} className={cls} onClick={onClick}>
      {text}
    </Link>
  );
}
