import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KitchenSinkPage } from './pages/KitchenSinkPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  // Placeholder destination - guarded in MCPJ-5.
  { path: '/dashboard', element: <DashboardPage /> },
  // Component gallery / living documentation.
  { path: '/kitchen-sink', element: <KitchenSinkPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
