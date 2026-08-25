import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetMockSession } from '../mocks/handlers';
import { server } from '../mocks/server';

// onUnhandledRequest: 'error' means a test that hits an unmocked endpoint
// fails loudly instead of quietly reaching the network.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockSession();
});

afterAll(() => server.close());
