/**
 * Starts the mock backend when VITE_ENABLE_API_MOCKS is "true" in development.
 * The import is dynamic so msw never reaches the production bundle.
 */
export async function startMocks(): Promise<void> {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_API_MOCKS !== 'true') {
    return;
  }

  const { worker } = await import('./browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
