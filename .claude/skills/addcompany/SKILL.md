---
name: addcompany
description: Use when the user asks to add companies to the saasmap Organizations table, references views/companiestoadd.md, or pastes a company URL in the saasmap repo with intent to insert it into the database. Trigger phrases include "add company", "add this company", "insert into Organizations", "process companiestoadd", or any saasmap-context request that points at a list of company URLs to be added to Postgres.
---

# addcompany

## Overview

Workflow for adding companies to the saasmap Postgres `Organizations` table from a queue file at `views/companiestoadd.md`. Researches each company, shows the user the row that will be inserted, waits for confirmation, runs the SQL, then removes the company from the queue.

## When to Use

- User asks to "add companies" or "process companiestoadd.md" inside the saasmap repo
- User pastes a company URL in saasmap context and asks to add it to the DB
- User references the Organizations table and a list of companies to insert

Do NOT use when:
- Working outside the saasmap repo (no Organizations table)
- User wants a research brief without inserting (use `startup-profile` instead)
- User wants to add People, Roles, Sectors, Investors, etc. — this skill only handles Organizations

## Target Schema

Table: `Organizations` (quoted; Sequelize uses PascalCase). Columns to populate:

| Column | Type | Notes |
|---|---|---|
| orgname | string | Display name (e.g. "Aaru", not "aaru.com") |
| description | string | One-sentence description of what the company does |
| location | string | HQ as "City, State" or "City, Country" |
| website | string | Full URL with `https://` |
| cblink | string | Crunchbase URL: `https://www.crunchbase.com/organization/<slug>` |
| twitter | string | Full X/Twitter URL |
| linkedin | string | Full LinkedIn company URL |
| founded | string | Year only, as a string (e.g. "2024") |
| createdAt | timestamp | `NOW()` |
| updatedAt | timestamp | `NOW()` |

`id` is auto-incremented — do not set it.

## Workflow

1. **Read the queue** — `views/companiestoadd.md`. Each non-empty line is one company (URL or domain).
2. **For each entry, research:**
   - `WebFetch` the company website for: name, description, twitter, linkedin, location, founded year
   - `WebSearch` for Crunchbase slug and any missing fields (founders, founding year, HQ)
   - If a field is genuinely unknown after both, use empty string `''` — never invent values
3. **Display the row** as a markdown table so the user can review.
4. **Show the SQL** that will run (parameterized, but display it readable).
5. **Ask the user to confirm** before inserting. Do not auto-insert.
6. **On confirmation, run the INSERT** via the snippet below.
7. **Remove the inserted line** from `views/companiestoadd.md` so it doesn't get added twice. If the file ends up empty, leave it empty (don't delete).
8. **Report the new row id** returned by `RETURNING id, orgname`.

## SQL

```sql
INSERT INTO "Organizations"
  (orgname, description, location, website, cblink, twitter, linkedin, founded, "createdAt", "updatedAt")
VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW(), NOW())
RETURNING id, orgname;
```

## Running the insert

Run from the saasmap project root. Uses the project's existing `pg` and `dotenv` deps; `DATABASE_URL` lives in `.env`. SSL is required (Railway public proxy).

```bash
node -e "
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
(async () => {
  await c.connect();
  const r = await c.query(\`
    INSERT INTO \"Organizations\"
      (orgname, description, location, website, cblink, twitter, linkedin, founded, \"createdAt\", \"updatedAt\")
    VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8, NOW(), NOW())
    RETURNING id, orgname;
  \`, [
    'ORGNAME',
    'DESCRIPTION',
    'LOCATION',
    'WEBSITE',
    'CBLINK',
    'TWITTER',
    'LINKEDIN',
    'FOUNDED'
  ]);
  console.log('Inserted:', r.rows[0]);
  await c.end();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

## Batch mode

If the queue has multiple companies, research and display all rows first, then ask once: insert all, insert selectively, or cancel. Insert one at a time (separate `node -e` invocations) so a single bad row doesn't block the rest, and remove each line from the queue as it succeeds.

## Common Mistakes

- **Setting `orgname` to the domain** (e.g. "aaru.com" instead of "Aaru"). Always use the display name from the site.
- **Inventing data** when WebFetch returns "not specified." Use empty string instead — better a blank field than a wrong one.
- **Skipping confirmation.** Always show the row and SQL and wait for the user's go-ahead before inserting.
- **Forgetting to clear the queue line** after a successful insert — the next run will duplicate it.
- **Omitting SSL config** on the `pg` Client. Local connection to Railway public Postgres URL requires `ssl: { rejectUnauthorized: false }`.
- **Quoting the table name wrong.** `"Organizations"` with double quotes — Sequelize created it PascalCase.
