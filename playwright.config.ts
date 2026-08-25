import { defineConfig, devices } from '@playwright/test';

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Vite re-optimises dependencies on first browser load and forces a page
  // reload, which aborts navigations in sibling contexts. One worker against
  // the dev server avoids that; a preview/staging target can raise it.
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // The suite runs against the MSW mock backend so it needs no live API.
  // Point PLAYWRIGHT_BASE_URL at a deployed environment to run it there instead.
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: { VITE_ENABLE_API_MOCKS: 'true' },
    timeout: 120_000,
  },
});
