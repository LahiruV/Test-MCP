import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type AlertProps = {
  variant?: 'error' | 'success';
  title?: string;
  children: ReactNode;
  className?: string;
};

const VARIANTS = {
  error: 'bg-danger-100 text-danger-500 ring-danger-500/20',
  success: 'bg-success-500/10 text-success-500 ring-success-500/20',
} as const;

/**
 * role="alert" makes assistive tech announce the message as soon as it renders,
 * which is what we want for a failed sign-in attempt.
 */
export function Alert({ variant = 'error', title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-lg px-3 py-2.5 text-sm ring-1', VARIANTS[variant], className)}
    >
      {title && <p className="font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
