import type { LoginFormValues } from './schema';

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

/**
 * Thrown by a login submit handler when the server rejected specific fields.
 * The message is shown in the form-level banner; fieldErrors are mapped back
 * onto the matching inputs. MCPJ-4 raises this from the API client.
 */
export class LoginError extends Error {
  readonly fieldErrors: LoginFieldErrors;

  constructor(message: string, fieldErrors: LoginFieldErrors = {}) {
    super(message);
    this.name = 'LoginError';
    this.fieldErrors = fieldErrors;
  }
}

export function isLoginError(error: unknown): error is LoginError {
  return error instanceof LoginError;
}
