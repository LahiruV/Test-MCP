import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../mocks/server';
import { ApiError, request } from './http';

const BASE = 'http://localhost/api';

describe('request', () => {
  it('returns a parsed JSON body', async () => {
    server.use(mswHttp.get(`${BASE}/thing`, () => HttpResponse.json({ id: 'a' })));

    await expect(request('/thing')).resolves.toEqual({ id: 'a' });
  });

  it('rejects an HTML body served with 200', async () => {
    // What an SPA fallback returns when an API path is misrouted. Treating it
    // as a valid payload would make the app believe it has a session.
    server.use(
      mswHttp.get(
        `${BASE}/thing`,
        () =>
          new HttpResponse('<!doctype html><html></html>', {
            headers: { 'content-type': 'text/html' },
          }),
      ),
    );

    await expect(request('/thing')).rejects.toBeInstanceOf(ApiError);
  });

  it('accepts an empty 204 body', async () => {
    server.use(mswHttp.post(`${BASE}/thing`, () => new HttpResponse(null, { status: 204 })));

    await expect(request('/thing', { method: 'POST' })).resolves.toBeNull();
  });

  it('surfaces the status, code and field errors from an error response', async () => {
    server.use(
      mswHttp.post(`${BASE}/thing`, () =>
        HttpResponse.json(
          { message: 'Bad input', code: 'VALIDATION', fieldErrors: { email: 'Taken' } },
          { status: 422 },
        ),
      ),
    );

    const error = await request('/thing', { method: 'POST' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      message: 'Bad input',
      code: 'VALIDATION',
      fieldErrors: { email: 'Taken' },
    });
  });

  it('reports a transport failure as status 0', async () => {
    server.use(mswHttp.get(`${BASE}/thing`, () => HttpResponse.error()));

    const error = (await request('/thing').catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(0);
    expect(error.isNetworkError).toBe(true);
  });

  it('refreshes once and replays the request after a 401', async () => {
    let signedIn = false;
    let attempts = 0;

    server.use(
      mswHttp.get(`${BASE}/thing`, () => {
        attempts += 1;
        return signedIn ? HttpResponse.json({ ok: true }) : new HttpResponse(null, { status: 401 });
      }),
      mswHttp.post(`${BASE}/auth/refresh`, () => {
        signedIn = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await expect(request('/thing')).resolves.toEqual({ ok: true });
    expect(attempts).toBe(2);
  });

  it('gives up when the refresh itself fails', async () => {
    server.use(
      mswHttp.get(`${BASE}/thing`, () => new HttpResponse(null, { status: 401 })),
      mswHttp.post(`${BASE}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
    );

    const error = (await request('/thing').catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(401);
  });
});
