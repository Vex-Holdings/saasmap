# vcsource Skill — Design Spec

**Date:** 2026-08-13
**Status:** Implemented (2026-08-13). The delivered skill at `.claude/skills/vcsource/SKILL.md` includes post-smoke-test refinements not reflected below (possible-duplicate flagging instead of blanket name matching, browser-confirmed precheck failures, Greylock detail-page scrape mechanics, permanent skip for no-website companies) — the skill file is the source of truth.

## Purpose

A recurring project skill, `/vcsource`, that discovers companies from VC portfolio pages and adds the ones missing from the saasmap `Organizations` table, reusing the existing `/addcompany` pipeline for research, review, and insertion.

## Scope

- Skill definition only: `.claude/skills/vcsource/SKILL.md` plus one new data file. No app code changes.
- All portfolio companies are candidates — no sector filtering.
- Each run processes at most 25 companies; the backlog drains across repeated runs.

## Files

| File | Role |
|---|---|
| `.claude/skills/vcsource/SKILL.md` | New skill definition |
| `views/vcsource.md` | Source list (exists). One portfolio URL per line. Adding a VC = adding a line. |
| `views/vcsource-skiplist.md` | New persistent skip list. One line per company: `domain — reason — YYYY-MM-DD`. |
| `views/companiestoadd.md` | Existing addcompany queue; vcsource writes precheck survivors here. |

Current sources in `views/vcsource.md`:

- https://a16z.com/portfolio/?status=Active
- https://sequoiacap.com/our-companies/#all-panel
- https://greylock.com/portfolio/

## Run Flow

1. **Scrape.** For each URL in `views/vcsource.md`, load the page with browser automation (the lists are JavaScript-rendered, so plain WebFetch is unreliable). Extract every portfolio company's name and website domain. If a source yields suspiciously few companies (layout change, block), warn and continue with the other sources — never treat an empty scrape as "no new companies."
2. **Diff.** Query the DB once: `SELECT orgname, website FROM "Organizations"`. Normalize domains (strip protocol, `www.`, trailing slash) and keep companies whose domain is not in the DB and not on the skip list. Case-insensitive name match is the fallback for portfolio entries without a website link.
3. **Report.** Show the full missing list with per-source counts, then take the first 25 alphabetically by company name for this run (deterministic ordering so the backlog drains predictably).
4. **Precheck.** For each of the 25, WebFetch the company site.
   - **Pass:** site loads and shows no shutdown or acquisition signals.
   - **Fail:** site unreachable, redirects to an acquirer's domain, or shows a "we've joined X" / sunset notice. Failures go on the skip list with a reason (`site unreachable`, `acquired by X`, `shut down`). A transient outage recorded as unreachable can be un-skipped by deleting its line manually.
   - **Ambiguous** (loads but looks moribund): treat as pass; batch review is the human gate.
5. **Enqueue and hand off.** Write survivors to `views/companiestoadd.md`, then execute the `/addcompany` batch workflow exactly as documented in that skill: research each company (WebFetch + WebSearch), display all rows as a table, one batch confirmation (insert all / selective / cancel), insert one at a time via parameterized SQL, remove each queue line as it succeeds.
6. **Skip list update.** Companies rejected at batch review move from the queue to the skip list so they never resurface.
7. **Summary.** Report counts: scraped per source, already in DB, on skip list, failed precheck, inserted, and backlog remaining for the next run.

## Error Handling

- **DB unreachable:** stop before scraping — the diff is meaningless without the table contents.
- **One source fails to scrape:** warn, continue with the rest.
- **Precheck ambiguity:** pass it through; the batch-review confirmation is the safety net before any insert.

## Decisions Made

- **No sector filter** — every missing portfolio company is a candidate.
- **Cap of 25 per run** — keeps runs fast and reviewable; first run will leave a large backlog by design.
- **One batch confirmation** per run (addcompany batch mode), not per-company confirmation and not auto-insert.
- **Browser scraping** (Approach 1) over WebFetch-first or a committed scraper script — a complete list matters most for a diff-based skill, and a skip list keeps repeat runs cheap.
- **Reuse addcompany** via its queue file rather than duplicating insert logic — one pipeline owns the Organizations INSERT.

## Testing

No automated tests — this is a workflow skill, not code. First-run validation: compare scrape counts per source against the visible portfolio pages, and spot-check several diff results before confirming inserts.
