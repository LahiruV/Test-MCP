import { Spinner } from './Spinner';

/**
 * Shown while the session is being restored. role="status" so assistive tech
 * announces the wait instead of an apparently empty page.
 */
export function FullPageSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center" role="status" aria-live="polite">
      <Spinner className="size-8 text-brand-600" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
