import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { HeaderData } from '@/types/globals';

import { MobileMenu } from './MobileMenu';

vi.mock('@/components/layout/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}));

vi.mock('@/components/layout/NavLink', () => ({
  NavLink: ({ link, onClick }: { link: { label: string }; onClick?: () => void }) => (
    <a href="#" onClick={onClick}>
      {link.label}
    </a>
  ),
}));

const nav: NonNullable<HeaderData['navItems']> = [
  { id: '1', link: { label: 'About', kind: 'internal', url: '/about' } },
  { id: '2', link: { label: 'Services', kind: 'internal', url: '/services' } },
];

describe('<MobileMenu />', () => {
  it('hides the drawer initially', () => {
    render(<MobileMenu navItems={nav} />);
    const drawer = screen.getByRole('dialog', { hidden: true });
    expect(drawer.className).toContain('translate-x-full');
  });

  it('opens when the hamburger is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileMenu navItems={nav} />);
    await user.click(screen.getByRole('button', { name: /openMenu/i }));
    const drawer = screen.getByRole('dialog');
    expect(drawer.className).toContain('translate-x-0');
  });

  it('exposes nav items once open', async () => {
    const user = userEvent.setup();
    render(<MobileMenu navItems={nav} />);
    await user.click(screen.getByRole('button', { name: /openMenu/i }));
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders the language switcher inside the drawer', async () => {
    const user = userEvent.setup();
    render(<MobileMenu navItems={nav} />);
    await user.click(screen.getByRole('button', { name: /openMenu/i }));
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileMenu navItems={nav} />);
    await user.click(screen.getByRole('button', { name: /openMenu/i }));
    await user.click(screen.getByRole('button', { name: /closeMenu/i }));
    const drawer = screen.getByRole('dialog', { hidden: true });
    expect(drawer.className).toContain('translate-x-full');
  });

  it('renders the CTA button when ctaLabel is provided', async () => {
    const user = userEvent.setup();
    render(<MobileMenu navItems={nav} ctaLabel="Order now" />);
    await user.click(screen.getByRole('button', { name: /openMenu/i }));
    expect(screen.getByRole('button', { name: 'Order now' })).toBeInTheDocument();
  });
});
