/**
 * Every user-facing auth string lives here so copy changes are one edit and
 * the file can be swapped for an i18n catalogue later.
 */
export const authMessages = {
  email: {
    required: 'Enter your email address',
    invalid: 'Enter a valid email address',
  },
  password: {
    required: 'Enter your password',
    tooShort: 'Password must be at least 8 characters',
  },
  form: {
    generic: 'Something went wrong. Please try again.',
    invalidCredentials: 'Email or password is incorrect',
    cooldown: (seconds: number) =>
      `Too many failed attempts. Try again in ${seconds} second${seconds === 1 ? '' : 's'}.`,
    notImplemented: 'Sign-in is not wired up yet - the API integration lands in MCPJ-4.',
  },
} as const;
