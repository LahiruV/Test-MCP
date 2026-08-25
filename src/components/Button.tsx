import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  fullWidth?: boolean;
};

const VARIANTS = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 disabled:text-brand-50',
  secondary:
    'bg-white text-ink-700 ring-1 ring-ink-300 hover:bg-ink-100 disabled:text-ink-300 disabled:hover:bg-white',
} as const;

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'transition-colors disabled:cursor-not-allowed',
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
