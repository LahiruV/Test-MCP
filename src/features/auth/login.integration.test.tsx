import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MOCK_CREDENTIALS } from '../../mocks/handlers';
import { renderApp } from '../../test/renderApp';

async function signIn(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('Email address'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  return user;
}

describe('login flow', () => {
  it('signs in with valid credentials and lands on the dashboard', async () => {
    renderApp('/login');

    await signIn(MOCK_CREDENTIALS.email, MOCK_CREDENTIALS.password);

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(`Signed in as ${MOCK_CREDENTIALS.email}`)).toBeInTheDocument();
  });

  it('shows a generic banner on bad credentials and stays on the login page', async () => {
    renderApp('/login');

    await signIn(MOCK_CREDENTIALS.email, 'wrong-password-1');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Email or password is incorrect');
    // The message must not hint at which half was wrong.
    expect(alert).not.toHaveTextContent(/email address/i);
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('validates client-side without calling the API', async () => {
    // onUnhandledRequest is "error", and no login handler call should happen
    // at all - the resolver rejects before the request is made.
    const user = userEvent.setup();
    renderApp('/login');

    await user.click(await screen.findByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('clears a field error once the value is corrected', async () => {
    const user = userEvent.setup();
    renderApp('/login');

    const email = await screen.findByLabelText('Email address');
    await user.type(email, 'not-an-email');
    await user.tab();

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();

    await user.clear(email);
    await user.type(email, MOCK_CREDENTIALS.email);

    await waitFor(() => {
      expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
    });
  });

  it('locks the form after five consecutive failures', async () => {
    const user = userEvent.setup();
    renderApp('/login');

    await user.type(await screen.findByLabelText('Email address'), MOCK_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), 'wrong-password-1');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await user.click(submitButton);
      await screen.findByRole('alert');
    }

    expect(await screen.findByText(/too many failed attempts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('signs out and returns to the login page', async () => {
    const user = await signInAndReachDashboard();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });
});

async function signInAndReachDashboard() {
  renderApp('/login');
  const user = await signIn(MOCK_CREDENTIALS.email, MOCK_CREDENTIALS.password);
  await screen.findByRole('heading', { name: 'Dashboard' });
  return user;
}
