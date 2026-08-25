import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';

/**
 * Living documentation for the UI primitives - every component in every state,
 * on one page. Stands in for Storybook so we don't carry that dependency yet.
 * Reachable at /kitchen-sink.
 */
export function KitchenSinkPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">UI primitives</h1>
        <p className="mt-1 text-sm text-ink-500">Every component state in one place.</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink-900">Input</h2>
        <Input label="Email address" placeholder="you@example.com" type="email" />
        <Input
          label="With hint"
          hint="We never share your address."
          placeholder="you@example.com"
        />
        <Input label="With error" error="Enter a valid email address" defaultValue="not-an-email" />
        <Input label="Disabled" disabled defaultValue="locked@example.com" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink-900">PasswordInput</h2>
        <PasswordInput label="Password" defaultValue="hunter2hunter2" />
        <PasswordInput label="With error" error="Password must be at least 8 characters" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink-900">Checkbox</h2>
        <Checkbox label="Remember me" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Disabled" disabled />
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <h2 className="w-full text-lg font-semibold text-ink-900">Button</h2>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Secondary disabled
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink-900">Alert</h2>
        <Alert variant="error">Email or password is incorrect.</Alert>
        <Alert variant="error" title="Too many attempts">
          Wait 30 seconds before trying again.
        </Alert>
        <Alert variant="success">Your password has been updated.</Alert>
      </section>
    </main>
  );
}
