# Deployment

The app is a static SPA: `npm run build` emits `dist/`, which any static host
can serve. Two things must be configured wherever it lands.

## 1. SPA rewrite

Every unknown path must serve `index.html`, or a hard refresh on `/dashboard`
(or a pasted link to it) returns 404 instead of the app.

## 2. Security headers

| Header                      | Value                                          | Why                                                  |
| --------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `Content-Security-Policy`   | see below                                      | Limits what the page may load and connect to         |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS on later visits                         |
| `X-Content-Type-Options`    | `nosniff`                                      | Stops MIME sniffing                                  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Keeps paths out of cross-origin referrers            |
| `X-Frame-Options`           | `DENY`                                         | Clickjacking, for agents predating `frame-ancestors` |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Drops capabilities the app never uses                |

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self';
frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
```

> `style-src` needs `'unsafe-inline'` because Vite inlines a small style block.
> **`connect-src 'self'` must be widened to the API origin** as soon as
> `VITE_API_BASE_URL` points somewhere other than the site's own origin, or every
> auth request is blocked.

## Provided configuration

| Host            | File           | Status                                                                                                           |
| --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| Netlify         | `netlify.toml` | Build command, publish dir, SPA rewrite, headers, cache rules                                                    |
| Vercel          | `vercel.json`  | Same, in Vercel's schema                                                                                         |
| S3 + CloudFront | not provided   | Needs a CloudFront Function or response-headers policy for the headers, plus a 404-to-`index.html` error mapping |

Only one is needed — pick the host, delete the other file.

## Environment variables

Set per environment in the host's dashboard:

| Variable                | Notes                                                       |
| ----------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL`     | The API origin for that environment                         |
| `VITE_ENABLE_API_MOCKS` | Leave unset or `false`. It only has an effect in dev builds |

Never put a secret in a `VITE_` variable — they are inlined into the client
bundle in plain text.

## Not yet done

No environment has been provisioned, so the following remain open:

- Creating the staging site and connecting the repository.
- Enabling preview deploys for pull requests.
- Verifying the headers on a live response (`curl -I https://<staging-url>`).
- Running the E2E suite against staging, and a Lighthouse pass (target: 90+ on
  Performance and Accessibility).

The E2E suite runs against the MSW mock backend by default. To point it at a
deployed environment, set `baseURL` in `playwright.config.ts` and drop the
`webServer` block.
