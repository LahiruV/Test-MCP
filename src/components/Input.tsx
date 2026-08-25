import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'id'> & {
  label: string;
  /** Field-level validation message. Its presence also sets aria-invalid. */
  error?: string;
  /** Supporting copy shown under the field when there is no error. */
  hint?: string;
  /** Control rendered inside the field box, e.g. the password visibility toggle. */
  trailing?: ReactNode;
};

export function Input({ label, error, hint, trailing, className, ...rest }: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-700" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-lg bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-ink-300',
            'placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500',
            'disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-500',
            error && 'ring-danger-500 focus:ring-danger-500',
            Boolean(trailing) && 'pr-20',
            className,
          )}
          {...rest}
        />

        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-danger-500">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-sm text-ink-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
