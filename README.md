# Login App

Frontend for the login project (Jira project **MCPJ**). React + TypeScript on Vite,
styled with Tailwind CSS v4.

## Requirements

- Node **20 LTS** (pinned in `.nvmrc` - run `nvm use`)
- npm 10+

## Getting started

```bash
nvm use          # optional, picks up .nvmrc
npm install      # also installs the husky pre-commit hook
cp .env.example .env
npm run dev      # http://localhost:5173
```

The app redirects `/` to `/login`.

## Scripts

| Script                  | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server on port 5173                |
| `npm run build`         | Typecheck, then produce a production build in `dist/` |
| `npm run preview`       | Serve the production build locally                    |
| `npm run typecheck`     | `tsc --noEmit` over the project                       |
| `npm run lint`          | ESLint over the project                               |
| `npm run lint:fix`      | ESLint with `--fix`                                   |
| `npm run format`        | Prettier write                                        |
| `npm run format:check`  | Prettier check (used by CI)                           |
| `npm test`              | Unit and integration tests (Vitest)                   |
| `npm run test:watch`    | Vitest in watch mode                                  |
| `npm run test:coverage` | Tests with coverage; fails below 80% on features/auth |
| `npm run test:e2e`      | Playwright end-to-end suite against the mock backend  |

## Environment variables

Copy `.env.example` to `.env` and adjust. Vite only exposes variables prefixed
with `VITE_`.

| Variable                | Description                               | Example                     |
| ----------------------- | ----------------------------------------- | --------------------------- |
| `VITE_API_BASE_URL`     | Base URL of the authentication API        | `http://localhost:8080/api` |
| `VITE_ENABLE_API_MOCKS` | `true` starts the MSW mock backend in dev | `false`                     |

> **Never put secrets in a `VITE_` variable.** Everything prefixed with `VITE_` is
> inlined into the client bundle in plain text and is readable by anyone who loads
> the page. Secrets belong on the server only.

## Project structure

```
src/
  components/     reusable UI primitives (MCPJ-2)
  features/auth/  login logic, hooks, API client (MCPJ-3, MCPJ-4)
  lib/            http client and shared utilities (MCPJ-4)
  pages/          route-level screens
  styles/         design tokens and global CSS
  router.tsx      route table
  main.tsx        app entry point
```

## Design tokens

Tokens live in `src/styles/index.css` under Tailwind v4's `@theme` block
(`brand-*`, `ink-*`, `danger-*`, `success-*`, plus `rounded-card` and
`shadow-card`). Add new tokens there rather than hard-coding hex values in
components.

## Code quality

- **ESLint** (flat config, `eslint.config.js`) with `typescript-eslint`,
  `react-hooks` and `react-refresh`; `eslint-config-prettier` disables rules that
  would fight the formatter.
- **Prettier** for formatting (`.prettierrc`).
- **husky + lint-staged** run ESLint `--fix` and Prettier on staged files before
  every commit.

## Testing

| Layer       | Tooling                        | Location                                   |
| ----------- | ------------------------------ | ------------------------------------------ |
| Unit        | Vitest                         | `src/**/*.test.ts(x)`                      |
| Integration | Vitest + Testing Library + MSW | `src/features/auth/*.integration.test.tsx` |
| End-to-end  | Playwright + MSW               | `e2e/`                                     |

Integration tests render the real route table and the real `AuthProvider`, so the
guards and session restore are exercised rather than stubbed. The mock backend
lives in `src/mocks/` and is shared by the integration and E2E suites.

Coverage is gated at **80% statements on `src/features/auth/`**. Run
`npm run test:coverage` to check it.

### Working against the mock backend

Set `VITE_ENABLE_API_MOCKS=true` and run `npm run dev`, then sign in with
`user@example.com` / `password123`. `locked@`, `throttled@` and
`boom@example.com` trigger the 423, 429 and 500 paths.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md). `netlify.toml` and `vercel.json` carry the
SPA rewrite and the security headers (CSP, HSTS, `nosniff`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`). No environment has been provisioned
yet.

## CI

`.github/workflows/ci.yml` runs install -> lint -> format check -> typecheck ->
test with coverage -> build, plus a separate Playwright job.

**Automatic runs are currently disabled**: the workflow is `workflow_dispatch`
only, so nothing fires on pushes or pull requests. The original triggers are
preserved in a comment at the top of the file. Until they are restored, run
`npm run lint && npm run typecheck && npm test && npm run build` before pushing.

## Roadmap

| Ticket                                                   | Work                                       |
| -------------------------------------------------------- | ------------------------------------------ |
| [MCPJ-1](https://fodgroup42.atlassian.net/browse/MCPJ-1) | Scaffolding and tooling (this)             |
| [MCPJ-2](https://fodgroup42.atlassian.net/browse/MCPJ-2) | Login page UI and reusable form components |
| [MCPJ-3](https://fodgroup42.atlassian.net/browse/MCPJ-3) | Client-side validation and form state      |
| [MCPJ-4](https://fodgroup42.atlassian.net/browse/MCPJ-4) | Auth API integration and session handling  |
| [MCPJ-5](https://fodgroup42.atlassian.net/browse/MCPJ-5) | Protected routes, testing and deployment   |
