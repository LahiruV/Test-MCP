import { describe, expect, it } from 'vitest';
import { ApiError } from '../../lib/http';
import { toLoginError } from './api';
import { authMessages } from './messages';

describe('toLoginError', () => {
  it('keeps a 401 vague so it cannot be used to enumerate accounts', () => {
    const error = toLoginError(new ApiError(401, 'No user with that email'));

    expect(error.message).toBe(authMessages.form.invalidCredentials);
    expect(error.message).not.toContain('email');
    expect(error.fieldErrors).toEqual({});
  });

  it('maps a locked account', () => {
    expect(toLoginError(new ApiError(423, '')).message).toBe(authMessages.form.accountLocked);
  });

  it('maps a throttled response', () => {
    expect(toLoginError(new ApiError(429, '')).message).toBe(authMessages.form.tooManyRequests);
  });

  it('falls back to the generic message on a server error', () => {
    expect(toLoginError(new ApiError(500, 'Stack trace leaked here')).message).toBe(
      authMessages.form.generic,
    );
  });

  it('falls back to the generic message for a network failure', () => {
    expect(toLoginError(new ApiError(0, 'Could not reach the server.')).message).toBe(
      authMessages.form.generic,
    );
  });

  it('falls back to the generic message for a non-API error', () => {
    expect(toLoginError(new TypeError('boom')).message).toBe(authMessages.form.generic);
  });

  it('passes through validation field errors, ignoring unknown fields', () => {
    const error = toLoginError(
      new ApiError(422, 'Check the highlighted fields', {
        fieldErrors: { email: 'Already registered', captcha: 'Missing' },
      }),
    );

    expect(error.message).toBe('Check the highlighted fields');
    expect(error.fieldErrors).toEqual({ email: 'Already registered' });
  });
});
