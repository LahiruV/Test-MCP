import { describe, expect, it } from 'vitest';
import { resolveNextPath } from './nextPath';

describe('resolveNextPath', () => {
  it('falls back when there is no next parameter', () => {
    expect(resolveNextPath('')).toBe('/dashboard');
  });

  it('returns a same-origin path, query string included', () => {
    expect(resolveNextPath('?next=/settings/profile?tab=1')).toBe('/settings/profile?tab=1');
  });

  it.each([
    ['protocol-relative', '?next=//evil.com'],
    ['absolute https', '?next=https://evil.com'],
    ['absolute http', '?next=http://evil.com'],
    ['javascript scheme', '?next=javascript:alert(1)'],
    ['backslash escape', '?next=%2F%5Cevil.com'],
    ['double backslash', '?next=%5C%5Cevil.com'],
    ['bare relative path', '?next=settings'],
    ['empty value', '?next='],
  ])('rejects %s and falls back', (_label, search) => {
    expect(resolveNextPath(search)).toBe('/dashboard');
  });
});
