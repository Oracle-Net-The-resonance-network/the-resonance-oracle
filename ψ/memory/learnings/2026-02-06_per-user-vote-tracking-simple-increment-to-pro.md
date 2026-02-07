---
title: ## Per-User Vote Tracking: Simple Increment to Proper System
tags: [voting, per-user-tracking, pocketbase, batch-loading, cloudflare-workers, jwt-auth, denormalized-counters, toggle-logic, oracle-universe]
created: 2026-02-06
source: Session Retrospective: Vote Tracking Implementation (2026-02-06)
---

# ## Per-User Vote Tracking: Simple Increment to Proper System

## Per-User Vote Tracking: Simple Increment to Proper System

### Context
Oracle Universe initially used simple increment/decrement for votes — anyone could vote infinitely, no tracking of who voted.

### The Pivot: No KV, DB Only
When considering Cloudflare KV for vote deduplication, user directive was clear: **"no never kv, data should only be in the db"**. This is an important architectural principle: the database is the single source of truth. Don't split state across KV stores and databases — it creates sync nightmares.

### Architecture Implemented

**Schema** (PocketBase `votes` collection — migration `1707000009_votes.go`):
```
votes { human, target_type, target_id, value }
UNIQUE INDEX on (human, target_type, target_id)
```

**Toggle Logic** (3-state):
1. No existing vote → CREATE vote record
2. Same direction clicked → DELETE vote record (toggle off)
3. Different direction → UPDATE existing vote value

**Denormalized Counters**: Posts keep `upvotes`, `downvotes`, `score` fields that get updated on each vote action. This avoids expensive COUNT queries on every page load.

### Key Patterns

1. **Batch Vote Loading** (`POST /api/votes/batch`):
   - Frontend sends array of post IDs on page load
   - API returns `{ votes: { postId: "up"|"down" } }` map
   - Avoids N+1 queries — single request for all visible posts
   - Max 100 posts per request (rate limiting)

2. **JWT Wallet Extraction for Vote Identity**:
   - `verifyJWT(token)` → extract `wallet` → look up `human` ID via PB admin auth
   - Wallet is the identity anchor, human record is the DB anchor
   - Same pattern reusable for any per-user action

3. **Frontend State Flow**:
   - `initialUserVote` prop on PostCard (from batch load)
   - `useEffect` syncs prop to local state
   - Optimistic UI: update local counters immediately from API response
   - `onVoteUpdate` callback propagates changes to parent for list-level state

4. **Legacy Endpoint Compatibility**:
   - Old `/api/posts/:id/upvote` and `/api/posts/:id/downvote` kept as thin wrappers
   - New unified `/api/posts/:id/vote` with `{ direction: "up"|"down" }` body
   - No breaking changes for existing consumers

### Reusable Solutions

- **Centralized endpoint builders** (`lib/endpoints.ts` — `Votes.byHumanAndTarget()`, `Votes.byHumanAndTargets()`): URL construction with filter composition. Pattern applies to any PB collection query.
- **`handleVote()` shared function**: Core vote logic factored out, reused by new + legacy endpoints.
- **Batch vote pattern**: POST with `{ postIds: [...] }` → returns vote map. Reusable for comments, any voteable entity.

### Remaining Gap
Comment voting (`comments/voting.ts`) still uses old simple increment — no per-user tracking yet. Should be migrated to same votes collection pattern.

### Mistakes/Pivots
1. **KV temptation**: Initial instinct to use Cloudflare KV for fast lookups. Correct answer: keep everything in the DB. KV would create a split-brain problem.
2. **votes collection already existed**: Migration `1707000009_votes.go` was written early but never wired up. The schema was ready — just needed the API routes. Lesson: check existing migrations before designing new schemas.
3. **Math.max(0, count - 1)**: Defensive floor on counter decrements to prevent negative vote counts from race conditions or data inconsistencies.

---
*Added via Oracle Learn*
