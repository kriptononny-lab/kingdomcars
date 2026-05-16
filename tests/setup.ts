import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import type * as NextIntl from 'next-intl';
import { createElement, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

/**
 * jsdom doesn't ship matchMedia; framer-motion's reduce-motion hook reads it.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * next-intl client hooks вЂ” return key-as-value (tests assert on translation
 * keys, not localised strings, which would be brittle across copy changes).
 */
vi.mock('next-intl', async () => {
  const actual = await vi.importActual<typeof NextIntl>('next-intl');
  function t(key: string): string {
    return key;
  }
  t.rich = (key: string, _values?: Record<string, unknown>) => key;
  return {
    ...actual,
    useTranslations: () => t,
    useLocale: () => 'en',
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

/**
 * `@/i18n/navigation` re-exports `Link` from next-intl. We swap it for a
 * bare anchor so component tests don't need the intl provider.
 */
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement('a', { href }, children),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));
