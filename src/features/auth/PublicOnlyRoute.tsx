import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FullPageSpinner } from '../../components/FullPageSpinner';
import { resolveNextPath } from '../../lib/nextPath';
import { useAuth } from './useAuth';

type PublicOnlyRouteProps = {
  children: ReactNode;
};

/** Keeps an already-signed-in user off /login. */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <FullPageSpinner />;
  }

  if (status === 'authenticated') {
    return <Navigate to={resolveNextPath(location.search)} replace />;
  }

  return children;
}
