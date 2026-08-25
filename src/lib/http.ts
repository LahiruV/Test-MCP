const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const TIMEOUT_MS = 10_000;

export type ApiFieldErrors = Record<string, string>;

/**
 * Every non-2xx response and every transport failure surfaces as an ApiError.
 * Transport failures (offline, DNS, timeout) use status 0.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: ApiFieldErrors;

  constructor(
    status: number,
    message: string,
    options: { code?: string; fieldErrors?: ApiFieldErrors } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  /** Internal: set while replaying a request so a refresh cannot recurse. */
  skipRefresh?: boolean;
};

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

/**
 * Called when a request is still 401 after a refresh attempt. AuthProvider
 * registers here so it can clear session state and send the user to /login.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json');
}

function toApiError(status: number, body: unknown): ApiError {
  if (body && typeof body === 'object') {
    const payload = body as { message?: unknown; code?: unknown; fieldErrors?: unknown };
    return new ApiError(
      status,
      typeof payload.message === 'string' ? payload.message : `Request failed (${status})`,
      {
        code: typeof payload.code === 'string' ? payload.code : undefined,
        fieldErrors:
          payload.fieldErrors && typeof payload.fieldErrors === 'object'
            ? (payload.fieldErrors as ApiFieldErrors)
            : undefined,
      },
    );
  }

  return new ApiError(
    status,
    typeof body === 'string' && body ? body : `Request failed (${status})`,
  );
}

/** Shared so concurrent 401s trigger a single refresh, not one each. */
let refreshInFlight: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  refreshInFlight ??= send<unknown>('/auth/refresh', { method: 'POST', skipRefresh: true })
    .then(() => undefined)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

async function send<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;
  const timeout = AbortSignal.timeout(TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      // Session cookies are httpOnly, so they only travel if we opt in.
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(0, 'The request timed out.');
    }
    throw new ApiError(0, 'Could not reach the server.');
  }

  if (response.ok) {
    const body = await readBody(response);

    // A misrouted endpoint hitting an SPA fallback answers 200 with HTML.
    // Accepting that would let a deploy or proxy mistake read as a valid
    // session, so anything that is not JSON is a failure.
    if (body !== null && !isJsonResponse(response)) {
      throw new ApiError(response.status, 'Unexpected response from the server.');
    }

    return body as T;
  }

  throw toApiError(response.status, await readBody(response));
}

/**
 * Performs a request, and on a 401 tries exactly one refresh before replaying
 * it. If the replay is still unauthorised the session is treated as gone.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await send<T>(path, options);
  } catch (error) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;
    if (!isUnauthorized || options.skipRefresh) {
      throw error;
    }

    try {
      await refreshSession();
    } catch {
      onUnauthorized?.();
      throw error;
    }

    try {
      return await send<T>(path, { ...options, skipRefresh: true });
    } catch (replayError) {
      if (replayError instanceof ApiError && replayError.status === 401) {
        onUnauthorized?.();
      }
      throw replayError;
    }
  }
}
