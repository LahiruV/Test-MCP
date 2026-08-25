export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';
