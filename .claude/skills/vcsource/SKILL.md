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

The rendered portfolio lists are JavaScript-driven, so plain WebFetch on the listing URL silently returns partial data — never diff from it. Follow the per-source fast paths below first (as of 2026-08 all three work with plain `curl` + parsing, no browser). If a fast path breaks (site redesign), fall back to browser automation (Claude in Chrome / Playwright tools): open the page in a new tab, let it fully render (these pages lazy-load; scroll to the bottom until the company count stops growing), extract every portfolio company's **name** and **website domain** (from the card's outbound link where present; otherwise name only), and update the per-source note with what you learned.

Per-source notes:
- a16z (`a16z.com/portfolio/?status=Active`, structure as of 2026-08): no DOM scraping needed — the full portfolio dataset (~855 entries with `title` and `web` fields) is embedded in the initial page HTML as `a16z_portfolio_companies = [...]`, so plain `curl` + parsing works; in a browser it's also available as `window.a16z_portfolio_companies`. "Active" = entries where `display_exit_info_on_a16z_website` is false (~657). The `?status=Active` URL param only affects client-side rendering, not the embedded array. Expect hundreds of entries.
- Sequoia (`sequoiacap.com/our-companies/`, structure as of 2026-08-19, migrated from WordPress to Framer that month — the old `/wp-json/wp/v2/company` API now 404s): the listing HTML only contains ~21 featured companies — don't scrape it. Instead, `curl` the listing page and pull the Framer search-index URLs from it (`framerusercontent.com/sites/<siteId>/searchIndex-*.json`); download one index (~11MB JSON keyed by page path). Keys starting with `/companies/` are the portfolio (~422). Name = the entry's `title` minus a trailing " | Sequoia Capital"; website = the first domain-shaped token in the entry's `p` array (single token, contains a dot, no spaces; skip anything matching sequoiacap.com). Entries with no such token are defunct — treat as name-only. Expect hundreds of entries.
- Greylock (`greylock.com/portfolio/`, structure as of 2026-08): the listing is server-rendered, so plain `curl` works — company rows are anchors to `/portfolio/<slug>/` whose `img[alt]` is the company name (strip a trailing " logo", collapse whitespace, ignore the `greymatter` slug). The listing page has NO external company links — websites live on each `/portfolio/<slug>/` detail page in a `<script type="application/ld+json">` Organization block; filter for the block whose `@id` contains `/portfolio/` (each page has two Organization blocks; the other one returns greylock.com for every company). Fetching the ~158 detail pages with modest concurrency (e.g. 8-way `fetch` in node) takes under a minute. Expect ~150+ entries; defunct companies (e.g. Houseparty, Neeva) have no URL — treat as name-only.

**Sanity check:** if a source yields fewer than 20 companies, assume the scrape failed (layout change, block, partial render). Warn the user, report the count, and continue with the other sources and discard that source's partial results — never treat an empty or tiny scrape as "no new companies."

### 3. Diff

Normalize every domain (scraped and DB `website` values) before comparing: lowercase, strip protocol, `www.`, path, and trailing slash — compare bare hostnames (e.g. `https://www.Foo.com/about` → `foo.com`). Some company URLs are subdomains (e.g. `about.roblox.com`) — when a bare-hostname comparison misses, also compare registrable domains (`roblox.com`) before declaring a company missing.

For entries **with a domain**, domain match is the primary and only automatic exclusion signal:
- its domain is among normalized DB `website` domains → not missing.
- its domain is on the skip list → not missing.
- otherwise it's missing — even if its name case-insensitively matches a DB `orgname`, since a name match with a different domain can be a distinct company (e.g. Greylock's "Ava" at `meetava.com` vs. an unrelated DB "Ava" at `ava.me`). In that case include it in the missing list flagged as "possible duplicate of \<DB org\>" so the human decides at review — silent exclusion is worse than a duplicate caught there.

For entries **without a domain**, keep name-based handling: if the name is already on the skip list, skip it; a case-insensitive match in DB `orgname` excludes it as not missing; otherwise try a quick WebSearch for their site. If WebSearch finds a domain, route the entry back through the with-domain branch above. If still no domain, append them to `views/vcsource-skiplist.md` as `<name> — no website found — YYYY-MM-DD` (name in place of domain) so they don't resurface next run, and mention them once in the run summary.

### 4. Report and select

Show the user the full missing list with per-source counts. Then select the first **25** alphabetically by company name for this run — deterministic ordering so the backlog drains predictably across runs.

### 5. Precheck

For each selected company, WebFetch its website:

- **Pass:** site loads, shows no shutdown or acquisition signals, and the company is not publicly traded.
- **Fail:** site unreachable, redirects to a different company's domain (acquirer), shows a "we've joined X" / sunset / shutdown notice, or the company is publicly listed on a stock exchange (IPO'd — check for a ticker via WebSearch when the company looks large or mature). A redirect that is just a rebrand of the same company (not an acquirer) is a pass.
- **Ambiguous** (loads but looks stale or moribund): pass it through — the batch review below is the human gate.

WebFetch is unreliable on JS-heavy sites, so before recording a `site unreachable` failure, confirm it in the browser session already open from the scrape step; if the site loads there, treat it as a pass instead. Append each confirmed failure to `views/vcsource-skiplist.md` as `domain — reason — YYYY-MM-DD` (reasons: `site unreachable`, `acquired by <name>`, `shut down`, `publicly listed`). Tell the user which companies failed and why.

### 6. Enqueue and hand off to addcompany

Append the precheck survivors' websites (one URL per line) to `views/companiestoadd.md`, then invoke the `addcompany` skill (via the Skill tool) and follow its documented batch workflow there rather than relying on any summary of it here.

If a survivor's canonical URL differs from the domain the VC site listed (rebrand redirect, e.g. blues.io → blues.com), enqueue the canonical URL AND append the scraped domain to the skip list as `<scraped domain> — duplicate of <canonical domain> — YYYY-MM-DD` — otherwise the next run re-flags the old domain as missing.

### 7. Record rejections

Any company the user rejects at batch review: remove it from `views/companiestoadd.md` AND append it to the skip list as `domain — rejected at review — YYYY-MM-DD` so it never resurfaces.

### 8. Summarize

End the run with counts: scraped per source, already in DB, on skip list, no-website skipped, failed precheck, inserted, and backlog remaining (missing minus processed) for the next run.

## Common Mistakes

- **Using WebFetch to scrape the portfolio pages.** They render client-side; WebFetch returns partial or empty lists and the diff silently misses companies. Use the per-source fast paths, or browser automation as the fallback.
- **Trusting a tiny scrape.** A source returning 3 companies means the scrape broke, not that the portfolio shrank. Warn and skip that source.
- **Comparing raw URLs.** `https://www.foo.com/` vs `foo.com` must match — normalize to bare hostnames on both sides.
- **Forgetting the skip list.** Precheck failures and review rejections must be appended, or every future run re-processes them.
- **Processing more than 25.** The cap keeps runs reviewable; the backlog is drained across runs by design.
- **Re-implementing the insert.** The INSERT belongs to `/addcompany` — enqueue and follow that skill; don't duplicate its SQL here.
