import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-4">
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <Link className="text-brand-600 underline" to="/login">
        Back to sign in
      </Link>
    </main>
  );
}
