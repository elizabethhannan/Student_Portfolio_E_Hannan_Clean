# Threat Model

## Project Overview

This project is a pnpm workspace monorepo with three notable artifacts: a production static site (`artifacts/static-site`), a small production Express API (`artifacts/api-server`), and a dev-only mockup sandbox (`artifacts/mockup-sandbox`). The backend uses Express 5 with pino request logging, Zod-derived response schemas, and a PostgreSQL/Drizzle database package in `lib/db`. The current documented and implemented production API surface is limited to `GET /api/healthz`. The production site is primarily static HTML pages and assets with inline JavaScript for UI behavior; although a React app exists under `artifacts/static-site/src`, it does not appear to be wired into the current production HTML entrypoints.

Production scan scope for this review:
- `artifacts/api-server/**`
- `artifacts/static-site/**`
- `lib/db/**`
- `lib/api-client-react/**`
- `lib/api-spec/**` and `lib/api-zod/**` only where they influence runtime behavior

Out of scope unless production reachability is demonstrated:
- `artifacts/mockup-sandbox/**` (development-only sandbox)
- `scripts/**` (utility scripts)
- `attached_assets/**` (staging/reference assets, not deployed application code)

Assumptions carried into this threat model:
- The mockup sandbox is never deployed to production.
- `NODE_ENV` is `production` in production deployments.
- Replit terminates TLS for deployed traffic.

## Assets

- **Published site content and reputation** — the static pages, PDFs, videos, and linked research/project materials in `artifacts/static-site/public`. Defacement or script injection would directly impact visitors and trust.
- **Application availability** — the public static site and the `/api/healthz` endpoint must remain available; the app currently has a very small server-side surface, so reliability and safe handling of public requests still matter.
- **Database connectivity and future data plane** — `lib/db` initializes a PostgreSQL pool from `DATABASE_URL`. Even though the current server routes do not expose database-backed features, compromise of this layer would expose any present or future stored data.
- **Secrets and configuration** — `DATABASE_URL`, runtime port configuration, and any future bearer tokens attached by `lib/api-client-react/src/custom-fetch.ts` must not leak to clients or logs.
- **Logs and operational metadata** — request logs from pino should not expose cookies, authorization headers, or other sensitive request metadata.

## Trust Boundaries

- **Browser to static site boundary** — all visitor-controlled interaction with `index.html`, `publications.html`, and `contact.html` is untrusted. Any DOM sink that consumes attacker-controlled values can become an XSS vector.
- **Browser to API boundary** — requests to `/api/*` originate from untrusted clients. The server must validate inputs and avoid expanding the current public API surface without explicit authorization and abuse controls.
- **API to database boundary** — `artifacts/api-server` can import `lib/db`, which has direct database access via `DATABASE_URL`. Any future query path must prevent injection and enforce access control before touching the database.
- **Build/runtime config boundary** — environment variables and build-time generated code (`lib/api-spec`, `lib/api-zod`, `lib/api-client-react`) are trusted inputs only if they remain server-side or are deliberately exposed; secrets must never cross into client bundles.
- **Production vs dev-only boundary** — `artifacts/mockup-sandbox` and utility scripts are not considered production-reachable unless deployment configuration changes. Findings limited to those areas should not be reported as production vulnerabilities.

## Scan Anchors

- Production server entry points: `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/**`
- Effective production frontend entry points: `artifacts/static-site/index.html`, `artifacts/static-site/publications.html`, `artifacts/static-site/contact.html`
- Source code worth checking if the frontend architecture changes: `artifacts/static-site/src/main.tsx`, `artifacts/static-site/src/App.tsx`, `lib/api-client-react/src/custom-fetch.ts`
- Highest-risk runtime code areas: DOM-writing inline scripts in the static HTML pages, global Express middleware in `artifacts/api-server/src/app.ts`, token/base URL handling in `lib/api-client-react/src/custom-fetch.ts`, and DB initialization in `lib/db/src/index.ts`
- Public surfaces: all static pages and assets, `GET /api/healthz`
- Authenticated/admin surfaces: none currently implemented in production code
- Dev-only areas usually to ignore: `artifacts/mockup-sandbox/**`, `scripts/**`, `attached_assets/**`

## Threat Categories

### Tampering

The browser and API inputs are untrusted. The project currently uses inline JavaScript and several `innerHTML` assignments in static HTML pages; these are only safe so long as they remain fed exclusively by hard-coded content, not URL parameters, form fields, postMessage data, or network responses. Any future API expansion must validate request bodies and server-side business rules rather than trusting the client.

Required guarantees:
- DOM-writing code in production pages MUST NOT interpolate attacker-controlled data into HTML or script sinks.
- Any future server routes MUST validate request inputs before use.
- Any future data mutations MUST be authorized and enforced server-side.

### Information Disclosure

The main disclosure risks are leaking secrets or internal data through client bundles, logs, error messages, or static assets. `lib/db` depends on `DATABASE_URL`, and `lib/api-client-react` can attach bearer tokens to requests; those values must never be exposed in public pages. Pino logging currently redacts authorization and cookie headers, which is the right direction and should remain intact.

Required guarantees:
- Secrets such as `DATABASE_URL` and bearer tokens MUST remain server-side and MUST NOT be embedded into frontend code or published assets.
- Logs MUST redact authorization and cookie data.
- Public assets MUST be treated as world-readable and must not include unintended sensitive material.

### Denial of Service

The production server is minimal today, but all public routes remain internet-facing. Unbounded request sizes, expensive future routes, or lack of timeouts on future third-party calls could create easy abuse paths. The static site also embeds large media assets, so production changes should avoid turning public pages into resource-amplification points.

Required guarantees:
- Public API endpoints MUST remain cheap, bounded, and safe for unauthenticated access.
- Future expensive routes, uploads, or external fetches MUST include size, timeout, and abuse controls.
- Static pages SHOULD avoid loading unnecessary heavyweight assets automatically.

### Elevation of Privilege

There is no current authenticated or admin surface, but the server and fetch client are already structured in a way that could grow into one. The key future risks are missing authorization on new routes, permissive CORS combined with credentialed APIs, and SQL or command injection if the backend begins consuming attacker-controlled input.

Required guarantees:
- Any future authenticated route MUST enforce authorization server-side.
- Database access MUST use safe ORM/query patterns and MUST NOT concatenate untrusted input into SQL.
- CORS policy MUST be reviewed before introducing credentialed or sensitive cross-origin endpoints.

### Spoofing

The current production application does not implement login, sessions, or privileged service-to-service callbacks. If authentication is later introduced, token verification and server-side enforcement become critical because the existing frontend fetch helper already supports bearer token attachment.

Required guarantees:
- If authentication is added later, protected endpoints MUST require valid server-verified credentials.
- Tokens or session artifacts MUST be stored and transmitted in a way that does not expose them to unrelated origins or logs.
