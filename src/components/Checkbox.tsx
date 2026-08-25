import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../lib/cn';

type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'id' | 'type'> & {
  label: string;
};

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className={cn('size-4 rounded border-ink-300 text-brand-600 accent-brand-600', className)}
        {...rest}
      />
      <label className="text-sm text-ink-700 select-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
