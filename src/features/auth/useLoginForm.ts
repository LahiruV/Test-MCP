import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authMessages } from './messages';
import { isLoginError } from './errors';
import { loginSchema } from './schema';
import type { LoginFormValues } from './schema';

/** Consecutive failures before the form locks. */
export const MAX_ATTEMPTS = 5;
/** How long the form stays locked, in seconds. */
export const COOLDOWN_SECONDS = 30;

type UseLoginFormOptions = {
  /**
   * Performs the sign-in. Reject to signal failure: a LoginError carries a
   * banner message plus optional per-field messages, any other error falls
   * back to the generic message.
   */
  onSubmit: (values: LoginFormValues) => Promise<void>;
};

export function useLoginForm({ onSubmit }: UseLoginFormOptions) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Nothing is validated until a field has been touched, then it
    // re-validates on every keystroke so errors clear as the user types.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', remember: false },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const failureCount = useRef(0);

  useEffect(() => {
    if (cooldownSeconds === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      const next = cooldownSeconds - 1;
      if (next === 0) {
        failureCount.current = 0;
      }
      setCooldownSeconds(next);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const isLocked = cooldownSeconds > 0;

  // handleSubmit runs the resolver first, focuses the first invalid field and
  // ignores re-entrant calls while a submission is in flight.
  const submit = form.handleSubmit(async (values) => {
    if (isLocked) {
      return;
    }

    setFormError(null);

    try {
      await onSubmit(values);
      failureCount.current = 0;
    } catch (error) {
      if (isLoginError(error)) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          form.setError(field as keyof LoginFormValues, { type: 'server', message });
        }
      }

      failureCount.current += 1;

      if (failureCount.current >= MAX_ATTEMPTS) {
        // UX only. Real throttling has to be enforced server-side - anyone can
        // bypass this by reloading the page or calling the API directly.
        setCooldownSeconds(COOLDOWN_SECONDS);
        return;
      }

      setFormError(error instanceof Error ? error.message : authMessages.form.generic);
    }
  });

  return {
    form,
    submit,
    /** Banner text, or null when there is nothing to show. */
    bannerMessage: isLocked ? authMessages.form.cooldown(cooldownSeconds) : formError,
    isLocked,
    cooldownSeconds,
  };
}
