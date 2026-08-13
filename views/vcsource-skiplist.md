# vcsource skip list

Companies vcsource will never re-process. One line per company:
`domain — reason — YYYY-MM-DD`

Reasons: `site unreachable`, `acquired by <name>`, `shut down`, `rejected at review`, `no website found`.
Entries with reason `no website found` use the company name in place of the domain.
Skips are permanent by design (including `no website found`); to retry a company
(e.g. a transient outage, or a stealth company that later launched a site), delete its line.

