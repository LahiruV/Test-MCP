import { useState } from 'react';
import { Button } from '../components/Button';
import { useAuth } from '../features/auth/useAuth';

/**
 * Placeholder post-login destination. Route protection lands in MCPJ-5.
 */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <section className="w-full max-w-[400px] rounded-card bg-white p-8 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-500">
          {user ? `Signed in as ${user.email}` : 'No active session.'}
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          fullWidth
          loading={signingOut}
          onClick={() => void handleLogout()}
        >
          Sign out
        </Button>
      </section>
    </main>
  );
}
