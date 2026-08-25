import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { authMessages } from '../features/auth/messages';
import { useLoginForm } from '../features/auth/useLoginForm';

/**
 * Placeholder sign-in call. MCPJ-4 replaces this with POST /auth/login.
 */
async function submitLogin(): Promise<void> {
  throw new Error(authMessages.form.notImplemented);
}

export function LoginPage() {
  const { form, submit, bannerMessage, isLocked } = useLoginForm({ onSubmit: submitLogin });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

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

        {bannerMessage && (
          <Alert className="mt-5" variant="error">
            {bannerMessage}
          </Alert>
        )}

        <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={submit}>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Checkbox label="Remember me" {...register('remember')} />
            <Link className="text-sm font-medium text-brand-600 hover:underline" to="/login">
              Forgot password?
            </Link>
          </div>

          {/*
            Deliberately enabled while the form is invalid: pressing it runs
            validation and moves focus to the first error, which is how a
            keyboard or screen reader user discovers what is missing.
          */}
          <Button
            className="mt-2"
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting || isLocked}
          >
            {isSubmitting ? 'Signing in' : 'Sign in'}
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
