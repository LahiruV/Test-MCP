import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MOCK_CREDENTIALS } from '../../mocks/handlers';
import { renderApp } from '../../test/renderApp';

describe('route guards', () => {
  it('sends an anonymous visitor from /dashboard to the login page', async () => {
    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('returns the visitor to the page they asked for after signing in', async () => {
    const user = userEvent.setup();
    renderApp('/dashboard');

    // Redirected to /login?next=%2Fdashboard, then back again after login.
    await user.type(await screen.findByLabelText('Email address'), MOCK_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), MOCK_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('shows a loading state rather than flashing the login page', async () => {
    renderApp('/dashboard');

    // Session restore is in flight on the first paint.
    expect(screen.getByRole('status')).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Sign in' });
  });

  it('restores an existing session on mount instead of asking for credentials', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp('/login');

    await user.type(await screen.findByLabelText('Email address'), MOCK_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), MOCK_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await screen.findByRole('heading', { name: 'Dashboard' });

    // Stand-in for a page refresh: the mock session outlives the React tree.
    unmount();
    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('keeps a signed-in user off the login page', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp('/login');

    await user.type(await screen.findByLabelText('Email address'), MOCK_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), MOCK_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await screen.findByRole('heading', { name: 'Dashboard' });

    unmount();
    renderApp('/login');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
