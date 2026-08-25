import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the field', () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('marks the field invalid and describes it with the error text', () => {
    render(<Input label="Email address" error="Enter a valid email address" />);

    const field = screen.getByLabelText('Email address');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Enter a valid email address');
  });

  it('is neither invalid nor described when there is no error', () => {
    render(<Input label="Email address" />);

    const field = screen.getByLabelText('Email address');
    expect(field).not.toHaveAttribute('aria-invalid');
    expect(field).not.toHaveAttribute('aria-describedby');
  });

  it('shows the hint when there is no error', () => {
    render(<Input label="Email address" hint="We never share your address." />);
    expect(screen.getByLabelText('Email address')).toHaveAccessibleDescription(
      'We never share your address.',
    );
  });
});
