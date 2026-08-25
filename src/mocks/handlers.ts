import { HttpResponse, http } from 'msw';
import type { AuthUser } from '../features/auth/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * Credentials the mock backend accepts, plus addresses that force each
 * failure path so the UI can be exercised without a real server.
 */
export const MOCK_CREDENTIALS = {
  email: 'user@example.com',
  password: 'password123',
};

const LOCKED_EMAIL = 'locked@example.com';
const SERVER_ERROR_EMAIL = 'boom@example.com';
const THROTTLED_EMAIL = 'throttled@example.com';

const MOCK_USER: AuthUser = {
  id: 'usr_1',
  email: MOCK_CREDENTIALS.email,
  name: 'Test User',
};

const SESSION_COOKIE = 'mock_session';

/**
 * Stands in for the httpOnly session cookie a real backend would set. It has
 * to be a real cookie rather than a module variable, or the mock session would
 * not survive a page reload and could not represent session restore.
 */
function isSignedIn(): boolean {
  return document.cookie.includes(`${SESSION_COOKIE}=1`);
}

function setSignedIn(value: boolean): void {
  document.cookie = value
    ? `${SESSION_COOKIE}=1; path=/; SameSite=Lax`
    : `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function resetMockSession(): void {
  setSignedIn(false);
}

type LoginBody = {
  email?: string;
  password?: string;
};

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();

    if (email === SERVER_ERROR_EMAIL) {
      return HttpResponse.json({ message: 'Internal error' }, { status: 500 });
    }

    if (email === LOCKED_EMAIL) {
      return HttpResponse.json({ code: 'ACCOUNT_LOCKED' }, { status: 423 });
    }

    if (email === THROTTLED_EMAIL) {
      return HttpResponse.json({ code: 'TOO_MANY_REQUESTS' }, { status: 429 });
    }

    if (email !== MOCK_CREDENTIALS.email || body.password !== MOCK_CREDENTIALS.password) {
      return HttpResponse.json({ code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    setSignedIn(true);
    return HttpResponse.json(MOCK_USER);
  }),

  http.get(`${BASE_URL}/auth/me`, () =>
    isSignedIn() ? HttpResponse.json(MOCK_USER) : new HttpResponse(null, { status: 401 }),
  ),

  http.post(`${BASE_URL}/auth/refresh`, () =>
    isSignedIn()
      ? new HttpResponse(null, { status: 204 })
      : new HttpResponse(null, { status: 401 }),
  ),

  http.post(`${BASE_URL}/auth/logout`, () => {
    setSignedIn(false);
    return new HttpResponse(null, { status: 204 });
  }),
];
