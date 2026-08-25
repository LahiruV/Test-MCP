import { describe, expect, it } from 'vitest';
import { loginSchema } from './schema';

const valid = { email: 'user@example.com', password: 'password123', remember: false };

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('trims and lower-cases the email', () => {
    const result = loginSchema.parse({ ...valid, email: '  User@Example.COM  ' });
    expect(result.email).toBe('user@example.com');
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Enter a valid email address');
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({ ...valid, password: 'short' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Password must be at least 8 characters');
  });

  it('reports both fields when the form is empty', () => {
    const result = loginSchema.safeParse({ email: '', password: '', remember: false });
    expect(result.success).toBe(false);
    const fields = new Set(result.error?.issues.map((issue) => issue.path[0]));
    expect(fields).toEqual(new Set(['email', 'password']));
  });
});
