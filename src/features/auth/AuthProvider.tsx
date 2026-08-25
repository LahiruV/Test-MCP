import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { setUnauthorizedHandler } from '../../lib/http';
import { AuthContext } from './auth-context';
import * as authApi from './api';
import { toLoginError } from './api';
import type { LoginFormValues } from './schema';
import type { AuthStatus, AuthUser } from './types';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Restore the session on mount. The cookie is httpOnly, so asking the server
  // is the only way to know whether we are signed in.
  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setStatus('anonymous');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // A request that is still 401 after a refresh means the session is gone.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus('anonymous');
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (values: LoginFormValues): Promise<AuthUser> => {
    try {
      const currentUser = await authApi.login(values);
      setUser(currentUser);
      setStatus('authenticated');
      return currentUser;
    } catch (error) {
      setUser(null);
      setStatus('anonymous');
      throw toLoginError(error);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      // Drop local state even if the server call failed - staying "signed in"
      // in the UI after the user asked to leave is the worse outcome.
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
