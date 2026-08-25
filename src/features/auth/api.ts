import { ApiError, request } from '../../lib/http';
import { LoginError } from './errors';
import { authMessages } from './messages';
import type { LoginFieldErrors } from './errors';
import type { AuthUser } from './types';

type LoginCredentials = {
  email: string;
  password: string;
  remember: boolean;
};

export function login(credentials: LoginCredentials): Promise<AuthUser> {
  return request<AuthUser>('/auth/login', { method: 'POST', body: credentials });
}

export function logout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST' });
}

export function refresh(): Promise<void> {
  return request<void>('/auth/refresh', { method: 'POST' });
}

/**
 * Current session. skipRefresh is set because this call is what establishes
 * whether a session exists at all - a 401 here is the expected anonymous case,
 * not something to retry.
 */
export function me(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', { skipRefresh: true });
}

const LOGIN_FIELDS = new Set(['email', 'password']);

function pickFieldErrors(errors: Record<string, string> | undefined): LoginFieldErrors {
  if (!errors) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => LOGIN_FIELDS.has(field)),
  ) as LoginFieldErrors;
}

/**
 * Turns a transport-level failure into the message the form should show.
 * A 401 deliberately says neither which field was wrong nor whether the
 * account exists.
 */
export function toLoginError(error: unknown): LoginError {
  if (!(error instanceof ApiError)) {
    return new LoginError(authMessages.form.generic);
  }

  const fieldErrors = pickFieldErrors(error.fieldErrors);

  switch (error.status) {
    case 400:
    case 422:
      return new LoginError(error.message || authMessages.form.generic, fieldErrors);
    case 401:
      return new LoginError(authMessages.form.invalidCredentials);
    case 423:
      return new LoginError(authMessages.form.accountLocked);
    case 429:
      return new LoginError(authMessages.form.tooManyRequests);
    default:
      return new LoginError(authMessages.form.generic);
  }
}
