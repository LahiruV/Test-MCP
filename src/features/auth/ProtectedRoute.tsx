import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FullPageSpinner } from '../../components/FullPageSpinner';
import { useAuth } from './useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  // Never redirect while the session is still being restored, or a signed-in
  // user gets a flash of the login page on every hard refresh.
  if (status === 'loading') {
    return <FullPageSpinner />;
  }

  if (status === 'anonymous') {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
