import { expect, test } from '@playwright/test';

const EMAIL = 'user@example.com';
const PASSWORD = 'password123';

async function signIn(page: import('@playwright/test').Page, password = PASSWORD) {
  await page.getByLabel('Email address').fill(EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

test('signs in, reaches the dashboard and signs out again', async ({ page }) => {
  await page.goto('/login');
  await signIn(page);

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Signed in as ${EMAIL}`)).toBeVisible();

  await page.getByRole('button', { name: /sign out/i }).click();

  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('rejects a wrong password without revealing which field was wrong', async ({ page }) => {
  await page.goto('/login');
  await signIn(page, 'definitely-wrong');

  const alert = page.getByRole('alert');
  await expect(alert).toHaveText('Email or password is incorrect');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('sends an anonymous visitor to login and back to the page they wanted', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  await signIn(page);

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('keeps the session across a page reload', async ({ page }) => {
  await page.goto('/login');
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('never puts the session in web storage', async ({ page }) => {
  await page.goto('/login');
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  const storage = await page.evaluate(() => ({
    local: Object.entries(window.localStorage),
    session: Object.entries(window.sessionStorage),
  }));

  expect(storage.local).toEqual([]);
  expect(storage.session).toEqual([]);
});
