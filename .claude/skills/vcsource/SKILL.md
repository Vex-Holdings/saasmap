---
name: vcsource
description: Use when the user asks to run vcsource, check VC portfolio sites for new companies, or sync the Organizations table with the portfolio pages listed in views/vcsource.md. Trigger phrases include "run vcsource", "vcsource", "check the VC sources", "any new portfolio companies", or any saasmap-context request to discover companies from a16z/Sequoia/Greylock portfolio pages and add missing ones to the database.
---

# vcsource

## Overview

Recurring discovery workflow. Scrapes the VC portfolio pages listed in `views/vcsource.md`, finds companies missing from the `Organizations` table, prechecks that they are still active and independent, then feeds up to 25 survivors per run through the `/addcompany` batch workflow. Companies that fail precheck or get rejected at review go on a permanent skip list so later runs ignore them.

## Files

- `views/vcsource.md` — source list, one portfolio URL per line. Adding a VC = adding a line.
- `views/vcsource-skiplist.md` — permanent skip list: `domain — reason — YYYY-MM-DD` per line. When parsing, split on the first and last ` — `; everything between is the reason.
- `views/companiestoadd.md` — the addcompany queue; this skill writes precheck survivors there.

## Workflow

### 1. Load state

- Read `views/vcsource.md` for source URLs (lines starting with `http`).
- Read `views/vcsource-skiplist.md`; collect skipped domains and names.
- Query existing organizations (run from project root; stop the whole run if this fails — the diff is meaningless without it):

```bash
node -e "
require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
(async () => {
  await c.connect();
  const r = await c.query('SELECT orgname, website FROM \"Organizations\" ORDER BY orgname');
  console.log(JSON.stringify(r.rows));
  await c.end();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

### 2. Scrape each source

The portfolio lists are JavaScript-rendered — use browser automation (Claude in Chrome / Playwright tools), NOT plain WebFetch. For each source URL: open the page in a new tab, let it fully render (these pages lazy-load; scroll to the bottom until the company count stops growing), and extract every portfolio company's **name** and **website domain** (from the card's outbound link where present; otherwise name only).

Per-source notes:
- a16z (`a16z.com/portfolio/?status=Active`): already filtered to Active; expect hundreds of entries.
- Sequoia (`sequoiacap.com/our-companies/#all-panel`): use the "all" panel; expect hundreds.
- Greylock (`greylock.com/portfolio/`): grid of cards; expect 100+.

**Sanity check:** if a source yields fewer than 20 companies, assume the scrape failed (layout change, block, partial render). Warn the user, report the count, and continue with the other sources and discard that source's partial results — never treat an empty or tiny scrape as "no new companies."

### 3. Diff

Normalize every domain (scraped and DB `website` values) before comparing: lowercase, strip protocol, `www.`, path, and trailing slash — compare bare hostnames (e.g. `https://www.Foo.com/about` → `foo.com`).

A scraped company is **missing** when:
- its domain is not among normalized DB `website` domains (primary signal), AND
- its domain is not on the skip list, AND
- its name has no case-insensitive match in DB `orgname` (secondary signal, checked for every entry — guards against DB rows with an empty `website`).

Companies whose portfolio card has no website link and whose name doesn't match: try a quick WebSearch for their site. If still no domain, append them to `views/vcsource-skiplist.md` as `<name> — no website found — YYYY-MM-DD` (name in place of domain) so they don't resurface next run, and mention them once in the run summary.

### 4. Report and select

Show the user the full missing list with per-source counts. Then select the first **25** alphabetically by company name for this run — deterministic ordering so the backlog drains predictably across runs.

### 5. Precheck

For each selected company, WebFetch its website:

- **Pass:** site loads and shows no shutdown or acquisition signals.
- **Fail:** site unreachable, redirects to a different company's domain (acquirer), or shows a "we've joined X" / sunset / shutdown notice. A redirect that is just a rebrand of the same company (not an acquirer) is a pass.
- **Ambiguous** (loads but looks stale or moribund): pass it through — the batch review below is the human gate.

WebFetch is unreliable on JS-heavy sites, so before recording a `site unreachable` failure, confirm it in the browser session already open from the scrape step; if the site loads there, treat it as a pass instead. Append each confirmed failure to `views/vcsource-skiplist.md` as `domain — reason — YYYY-MM-DD` (reasons: `site unreachable`, `acquired by <name>`, `shut down`). Tell the user which companies failed and why.

### 6. Enqueue and hand off to addcompany

Append the precheck survivors' websites (one URL per line) to `views/companiestoadd.md`, then invoke the `addcompany` skill (via the Skill tool) and follow its documented batch workflow there rather than relying on any summary of it here.

### 7. Record rejections

Any company the user rejects at batch review: remove it from `views/companiestoadd.md` AND append it to the skip list as `domain — rejected at review — YYYY-MM-DD` so it never resurfaces.

### 8. Summarize

End the run with counts: scraped per source, already in DB, on skip list, no-website skipped, failed precheck, inserted, and backlog remaining (missing minus processed) for the next run.

## Common Mistakes

- **Using WebFetch to scrape the portfolio pages.** They render client-side; WebFetch returns partial or empty lists and the diff silently misses companies. Always use browser automation.
- **Trusting a tiny scrape.** A source returning 3 companies means the scrape broke, not that the portfolio shrank. Warn and skip that source.
- **Comparing raw URLs.** `https://www.foo.com/` vs `foo.com` must match — normalize to bare hostnames on both sides.
- **Forgetting the skip list.** Precheck failures and review rejections must be appended, or every future run re-processes them.
- **Processing more than 25.** The cap keeps runs reviewable; the backlog is drained across runs by design.
- **Re-implementing the insert.** The INSERT belongs to `/addcompany` — enqueue and follow that skill; don't duplicate its SQL here.
