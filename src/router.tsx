import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  // Placeholder destination - guarded in MCPJ-5.
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
