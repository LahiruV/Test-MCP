import { z } from 'zod';
import { authMessages } from './messages';

/**
 * Checks run in declaration order, so the value is trimmed and lower-cased
 * before it is measured or matched against the email format.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, authMessages.email.required)
    .pipe(z.email(authMessages.email.invalid)),
  password: z
    .string()
    .min(1, authMessages.password.required)
    .min(8, authMessages.password.tooShort),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
