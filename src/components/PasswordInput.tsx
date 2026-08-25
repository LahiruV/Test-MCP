import { useState } from 'react';
import { Input } from './Input';
import type { InputProps } from './Input';

type PasswordInputProps = Omit<InputProps, 'type' | 'trailing'>;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          // The accessible name states the action; aria-pressed states the current mode.
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}
