# SaaS Map — Project Notes

## Architecture

- **Framework**: Express 4 with Mustache templates
- **Database**: PostgreSQL via `pg` (raw queries, no ORM)
- **Auth**: Session-based (`express-session` + `connect-pg-simple` for Postgres-backed session store)
- **Templates**: `.mustache` files in `views/`, partials in `views/partials/`
- **Entry point**: `app.js`
- **Routes**: `routes/index.js` (public), `routes/users.js` (auth-protected, ~50 handlers)
- **Middleware**: `middlewares/authorization.js`, `middlewares/getallusers.js`
- **Static assets**: `css/` served at `/css`
- **Environment**: `.env` file loaded via `dotenv` (development only); secrets (`SESSION_SECRET`, DB credentials) are in env vars
- **Deployment**: Railway (project: `triumphant-love`, service: `saasmap`). Postgres plugin provides `DATABASE_URL`. `SESSION_SECRET` set as a service variable.

## Change Log

### 2026-02-12 — Clean up Railway deploy warnings

**Problem**: Two noisy warnings in Railway deploy logs:
1. `npm warn config production Use --omit=dev instead.` — npm deprecation triggered by `NODE_ENV=production` during build
2. `[dotenv@17.3.1] injecting env (0) from .env` — dotenv logs even when no `.env` file exists

**Solution**:
- Added `Procfile` (`web: node app.js`) so Railway runs node directly instead of `npm start`
- Added `nixpacks.toml` to override install command with `npm ci --omit=dev --loglevel=error`, suppressing the deprecation warning from the Nixpacks build
- Wrapped `dotenv` require in `app.js` with `NODE_ENV !== 'production'` guard — skips dotenv on Railway, loads `.env` locally as before

**Files changed**: `app.js`, `Procfile` (new), `nixpacks.toml` (new)

### 2026-02-12 — Add Postgres session store
**Commit**: `bfe0ef5`

**Problem**: `express-session` used the default `MemoryStore`, which doesn't persist across restarts and logs a production warning on Railway.

**Solution**:
- Installed `connect-pg-simple` — stores sessions in Postgres
- Added `pgSession` store to session config in `app.js` using `DATABASE_URL`
- `createTableIfMissing: true` auto-creates the `session` table on first run

**Files changed**: `app.js`, `package.json`, `package-lock.json`

### 2026-02-12 — Fix Railway deployment
**Problem**: App crashed on Railway due to missing `start` script and missing environment variables (`DATABASE_URL`, `SESSION_SECRET`). Sequelize threw `ERR_INVALID_ARG_TYPE` because `DATABASE_URL` was undefined.

**Solution**:
- Added `"start": "node app.js"` to `package.json` scripts (commit `ec18ec6`)
- Added Postgres plugin to Railway project
- Set `DATABASE_URL` on saasmap service (referencing `${{Postgres.DATABASE_URL}}`)
- Set `SESSION_SECRET` on saasmap service

### 2026-02-12 — Add helmet, rate limiting, and configurable port
**Commit**: `ec18ec6`

**Problem**: Railway runs `npm start` by default, but `package.json` had no `start` script, causing deploys to crash immediately.

**Solution**:
- Added `"start": "node app.js"` to `package.json` scripts

**Files changed**: `package.json`

### 2026-02-12 — Add helmet, rate limiting, and configurable port
**Commit**: `1e2426e`

**Solution**:
- Installed `helmet` — adds security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, CSP, etc.)
- Added `app.use(helmet())` in `app.js` early in the middleware chain, after favicon
- Installed `express-rate-limit` — protects auth endpoints against brute-force attacks
- Created `authLimiter` (20 requests per 15-minute window) applied to `POST /login` and `POST /register` in `routes/index.js`
- Changed hardcoded `PORT = 3000` to `process.env.PORT || 3000` in `app.js`

**Files changed**: `app.js`, `routes/index.js`, `package.json`, `package-lock.json`

### 2026-02-12 — Global error handling
**Commit**: `4353a66` — "add global error handling for async route handlers"

**Problem**: All ~52 async route handlers had no try/catch. In Express 4, unhandled promise rejections silently fail — requests hang and errors are swallowed.

**Solution**:
- Installed `express-async-errors` (patches Express so rejected promises auto-forward to `next(err)`)
- Added `require('express-async-errors')` in `app.js` before routes load
- Added global error-handling middleware after all route registrations (`app.js:44-47`)
- Created `views/error.mustache` template for 500 error pages

**Files changed**: `app.js`, `package.json`, `package-lock.json`, `views/error.mustache`

### 2026-02-12 — Move secrets to environment variables
**Commit**: `10f86bb`

### 2026-02-12 — Add .gitignore
**Commit**: `1f3716b`

### 2026-02-12 — Fix dependency vulnerabilities
**Commit**: `109ded5`

### 2026-02-12 — Fix SQL injection vulnerabilities
**Commit**: `243fcfc` — Parameterized raw queries to prevent SQL injection.

### Earlier — Add video games button
**Commit**: `f4cadb9`
