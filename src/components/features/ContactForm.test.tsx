import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const submitMock = vi.fn();

vi.mock('@/actions/submit-contact', () => ({
  submitContactAction: (input: unknown) => submitMock(input),
}));

import { ContactForm } from './ContactForm';

afterEach(() => {
  submitMock.mockReset();
});

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText(/namePlaceholder/), 'Jan Kowalski');
  await user.type(screen.getByPlaceholderText(/phonePlaceholder/), '+48 500 100 200');
  await user.click(screen.getByRole('checkbox'));
}

describe('<ContactForm />', () => {
  it('renders the required fields', () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText(/namePlaceholder/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phonePlaceholder/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/ })).toBeInTheDocument();
  });

  it('renders a honeypot field that is invisible to users', () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="honeypot"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot?.getAttribute('aria-hidden')).toBe('true');
    expect(honeypot?.getAttribute('tabindex')).toBe('-1');
  });

  it('submits valid data and clears on success', async () => {
    submitMock.mockResolvedValue({ ok: true });
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<ContactForm onSuccess={onSuccess} />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /submit/ }));
    await waitFor(() => expect(submitMock).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
    const submitted = submitMock.mock.calls[0]?.[0];
    expect(submitted).toMatchObject({ name: 'Jan Kowalski', phone: '+48 500 100 200', consent: true });
  });

  it('does not submit when consent is not given', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByPlaceholderText(/namePlaceholder/), 'Jan');
    await user.type(screen.getByPlaceholderText(/phonePlaceholder/), '+48 500 100 200');
    // intentionally not clicking the consent checkbox
    await user.click(screen.getByRole('button', { name: /submit/ }));
    await waitFor(() => {}, { timeout: 100 });
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('shows server error message when action returns server error', async () => {
    submitMock.mockResolvedValue({ ok: false, error: 'server' });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /submit/ }));
    expect(await screen.findByText(/errors\.server/)).toBeInTheDocument();
  });

  it('shows rate-limit message on rate-limit error', async () => {
    submitMock.mockResolvedValue({ ok: false, error: 'rate-limit' });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /submit/ }));
    expect(await screen.findByText(/errors\.rateLimit/)).toBeInTheDocument();
  });
});
