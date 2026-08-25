import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Sign in</Button>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('is busy and disabled while loading', () => {
    render(<Button loading>Sign in</Button>);

    const button = screen.getByRole('button', { name: 'Sign in' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('is not busy when idle', () => {
    render(<Button>Sign in</Button>);

    const button = screen.getByRole('button', { name: 'Sign in' });
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).toBeEnabled();
  });
});
