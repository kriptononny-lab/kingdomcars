import { createNavigation } from 'next-intl/navigation';

import { routing } from '@/i18n/routing';

/**
 * Locale-aware navigation primitives. Use these everywhere internal links
 * point to a known route — `<Link href="/about" />` automatically renders
 * `/o-nas` in PL, `/about` in EN, `/o-nas` in RU.
 *
 * For unknown paths (Payload pages, anchors), use a plain `<a>` and prepend
 * locale manually via `useLocale()`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
