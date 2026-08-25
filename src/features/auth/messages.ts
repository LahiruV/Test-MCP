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
    // Deliberately vague: never reveal whether the account exists.
    invalidCredentials: 'Email or password is incorrect',
    accountLocked: 'This account is locked. Contact support to unlock it.',
    tooManyRequests: 'Too many attempts. Wait a moment and try again.',
    cooldown: (seconds: number) =>
      `Too many failed attempts. Try again in ${seconds} second${seconds === 1 ? '' : 's'}.`,
  },
} as const;
