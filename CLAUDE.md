# SaaS Map — Project Notes

## Architecture

- **Framework**: Express 4 with Mustache templates
- **Database**: PostgreSQL via `pg` (raw queries, no ORM)
- **Auth**: Session-based (`express-session`)
- **Templates**: `.mustache` files in `views/`, partials in `views/partials/`
- **Entry point**: `app.js`
- **Routes**: `routes/index.js` (public), `routes/users.js` (auth-protected, ~50 handlers)
- **Middleware**: `middlewares/authorization.js`, `middlewares/getallusers.js`
- **Static assets**: `css/` served at `/css`
- **Environment**: `.env` file loaded via `dotenv`; secrets (`SESSION_SECRET`, DB credentials) are in env vars

## Change Log

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
