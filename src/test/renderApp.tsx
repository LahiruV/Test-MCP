import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthProvider';
import { routes } from '../router';

/**
 * Renders the real route table and the real AuthProvider, so tests exercise
 * the guards and session restore rather than a stand-in.
 */
export function renderApp(initialPath = '/login') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}
