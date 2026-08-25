import { createContext } from 'react';
import type { LoginFormValues } from './schema';
import type { AuthStatus, AuthUser } from './types';

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  /** Rejects with a LoginError the form can render. */
  login: (values: LoginFormValues) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
