---
title: ## Principle: Data Lives in the DB, Not in Edge KV
tags: [architecture, cloudflare-kv, pocketbase, single-source-of-truth, data-integrity, oracle-universe]
created: 2026-02-06
source: Session Retrospective: Vote Tracking KV Pivot (2026-02-06)
---

# ## Principle: Data Lives in the DB, Not in Edge KV

## Principle: Data Lives in the DB, Not in Edge KV

When building on Cloudflare Workers + PocketBase, the temptation is to use Cloudflare KV for deduplication, caching user-specific state, or rate limiting. 

**The rule**: Data that matters (votes, sessions, identity) should only live in the database. Edge KV is acceptable for caching read-only data (like feed snapshots), but never for canonical state.

**Why**:
- KV + DB = split-brain problem. Which is the source of truth when they disagree?
- KV has eventual consistency — votes could be "lost" or doubled
- DB already has unique constraints (`CREATE UNIQUE INDEX`) that enforce deduplication properly
- PocketBase admin auth from CF Workers is fast enough for real-time operations

**When KV IS acceptable**:
- Caching feed responses (read-only, stale is OK)
- Rate limiting counters (best-effort, not business-critical)
- Session token cache (with DB as fallback)

This emerged from the Oracle Universe voting implementation when the agent suggested KV and the user immediately corrected: "no never kv, data should only be in the db".

---
*Added via Oracle Learn*
