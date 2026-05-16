import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LanguageSwitcher } from './LanguageSwitcher';

const replaceMock = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/about',
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pl',
}));

/**
 * The component renders each locale code as the button's visible text.
 * We query by text (a `button` element matches the {selector: 'button'}
 * filter) since the i18n mock substitutes a single key for every aria-label.
 */
function buttonByLabel(label: 'pl' | 'en' | 'ru') {
  return screen.getByText(label, { selector: 'button' });
}

describe('<LanguageSwitcher />', () => {
  it('renders one button per locale', () => {
    render(<LanguageSwitcher />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders the three locale codes as visible labels', () => {
    render(<LanguageSwitcher />);
    expect(buttonByLabel('pl')).toBeInTheDocument();
    expect(buttonByLabel('en')).toBeInTheDocument();
    expect(buttonByLabel('ru')).toBeInTheDocument();
  });

  it('marks the active locale with aria-current="true"', () => {
    render(<LanguageSwitcher />);
    expect(buttonByLabel('pl').getAttribute('aria-current')).toBe('true');
  });

  it('inactive locales do not carry aria-current', () => {
    render(<LanguageSwitcher />);
    expect(buttonByLabel('en').getAttribute('aria-current')).toBeNull();
    expect(buttonByLabel('ru').getAttribute('aria-current')).toBeNull();
  });

  it('triggers navigation when an inactive locale is clicked', async () => {
    replaceMock.mockClear();
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    await user.click(buttonByLabel('en'));
    expect(replaceMock).toHaveBeenCalledWith('/about', { locale: 'en' });
  });

  it('does not navigate when the active locale is clicked', async () => {
    replaceMock.mockClear();
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    await user.click(buttonByLabel('pl'));
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('wraps buttons in a group landmark', () => {
    render(<LanguageSwitcher />);
    const group = screen.getByRole('group');
    expect(within(group).getAllByRole('button')).toHaveLength(3);
  });
});
