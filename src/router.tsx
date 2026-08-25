import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { PublicOnlyRoute } from './features/auth/PublicOnlyRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KitchenSinkPage } from './pages/KitchenSinkPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  // Component gallery / living documentation.
  { path: '/kitchen-sink', element: <KitchenSinkPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
