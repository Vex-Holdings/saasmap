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
- **Deployment**: Railway (project: `triumphant-love`, service: `saasmap`). Postgres plugin provides `DATABASE_URL`. `SESSION_SECRET` set as a service variable. Production URL: https://saasmap-production.up.railway.app. Deploy status is posted to GitHub (commit status `triumphant-love - saasmap` and the Deployments API), so deploys can be verified via `gh api` without the Railway CLI.

## Change Log

### 2026-08-13 — Add vcsource skill
**Problem**: Adding companies from VC portfolio sites was manual — no repeatable way to discover which a16z/Sequoia/Greylock portfolio companies are missing from the Organizations table.

**Solution**:
- Added `.claude/skills/vcsource/SKILL.md` — recurring `/vcsource` workflow: browser-scrape the portfolio pages in `views/vcsource.md`, diff against `Organizations` by normalized domain, precheck up to 25 missing companies per run (site alive + still independent + not publicly listed), enqueue survivors to `views/companiestoadd.md`, and hand off to the `/addcompany` batch workflow for research, review, and insert.
- Added `views/vcsource-skiplist.md` — permanent skip list (`domain — reason — date`) for precheck failures and review rejections.
- Design spec: `docs/superpowers/specs/2026-08-13-vcsource-design.md`

**Files changed**: `.claude/skills/vcsource/SKILL.md` (new), `views/vcsource-skiplist.md` (new), `docs/superpowers/specs/2026-08-13-vcsource-design.md` (new), `docs/superpowers/plans/2026-08-13-vcsource.md` (new), `CLAUDE.md`

### 2026-08-10 — Fix 11 Dependabot vulnerabilities
**Commit**: `dfe63b9`

**Problem**: GitHub flagged 11 vulnerabilities (5 high, 5 moderate, 1 low) in runtime dependencies: express/qs/body-parser/path-to-regexp, sequelize (SQL injection via JSON column cast), lodash, express-rate-limit (IPv6 rate-limit bypass), ip-address, dottie, and uuid.

**Solution**:
- `npm audit fix` updated everything semver-compatibly (express 4.22.2, sequelize 6.37.8, express-rate-limit 8.6.2, etc.)
- The last alert (uuid < 11.1.1) is pinned by sequelize v6, and npm's only auto-fix was downgrading sequelize to v3. Added an npm `overrides` entry forcing `uuid ^11.1.1` instead — sequelize only uses uuid's `v1`/`v4` exports, unchanged in uuid 11. If a future sequelize upgrade requires a different uuid, this override may need revisiting.
- Verified: `npm audit` clean, app boots, `/` and `/login` return 200, Dependabot shows 0 open alerts.

**Files changed**: `package.json`, `package-lock.json`

### 2026-02-17 — Add SSL config for Sequelize

**Problem**: Connecting to Railway Postgres via the public URL (`DATABASE_PUBLIC_URL`) from local development failed because Sequelize wasn't configured for SSL. The internal Railway URL (`postgres.railway.internal`) doesn't require SSL, but the public proxy URL does.

**Solution**:
- Added `dialectOptions.ssl` (`require: true`, `rejectUnauthorized: false`) to the `development` environment in `config/config.json`

**Files changed**: `config/config.json`

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
