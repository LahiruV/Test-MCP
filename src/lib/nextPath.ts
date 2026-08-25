const FALLBACK = '/dashboard';

/**
 * Reads the post-login destination from a query string.
 *
 * Only path-absolute, same-origin targets are accepted. "//evil.com",
 * "https://evil.com" and "/\evil.com" are all browser-navigable to another
 * origin, so anything but a single leading slash falls back.
 */
export function resolveNextPath(search: string, fallback: string = FALLBACK): string {
  const next = new URLSearchParams(search).get('next');

  if (!next || !next.startsWith('/')) {
    return fallback;
  }

  const second = next[1];
  if (second === '/' || second === '\\') {
    return fallback;
  }

  return next;
}
