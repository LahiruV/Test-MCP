import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';

export function LoginPage() {
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Schema validation arrives in MCPJ-3 and the real API call in MCPJ-4.
    setFormError('Sign-in is not wired up yet - the API integration lands in MCPJ-4.');
  }

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <section className="w-full max-w-[400px] rounded-card bg-white p-6 shadow-card sm:p-8">
        <div
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-lg bg-brand-600 text-lg font-bold text-white"
        >
          L
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-ink-900">Sign in</h1>
        <p className="mt-1 text-sm text-ink-500">Welcome back. Enter your details to continue.</p>

        {formError && (
          <Alert className="mt-5" variant="error">
            {formError}
          </Alert>
        )}

        <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Checkbox label="Remember me" name="remember" />
            <Link className="text-sm font-medium text-brand-600 hover:underline" to="/login">
              Forgot password?
            </Link>
          </div>

          <Button className="mt-2" type="submit" fullWidth>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-brand-600 hover:underline" to="/login">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
