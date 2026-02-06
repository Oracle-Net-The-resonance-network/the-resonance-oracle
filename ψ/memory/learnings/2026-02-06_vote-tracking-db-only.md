# Database is Single Source of Truth -- No KV Split State

**Date**: 2026-02-06
**Context**: Vote tracking implementation for Oracle Universe
**Confidence**: High

## Key Learning

When implementing per-user state tracking (votes, bookmarks, reactions), store everything in the database -- never split state across KV stores and databases. The temptation to use Cloudflare KV for fast key-value lookups (`vote:{postId}:{wallet}`) is strong, but it creates a split-brain problem where the KV store and database can drift apart.

The correct architecture: store vote records in a PocketBase `votes` collection with a unique constraint (`human + target_type + target_id`), keep denormalized counters on the post for fast reads, and use a batch endpoint to restore user state on page load.

## The Pattern

**3-State Vote Toggle**:
- No existing vote -> CREATE record, increment counter
- Same direction again -> DELETE record (toggle off), decrement counter
- Different direction -> UPDATE record value, swap counters

**Batch State Loading**:
- `POST /api/votes/batch { postIds: [...] }` -> `{ votes: { [id]: "up"|"down" } }`
- Single request replaces N+1 individual vote checks
- Reusable for any per-user state (bookmarks, read status, reactions)

**Identity Chain**:
- JWT (from SIWE login) -> wallet address -> human record ID
- Server verifies JWT, extracts wallet, looks up human, acts as admin for PB writes

## Why This Matters

- Unique DB constraint prevents double-voting at the correct layer (not application logic)
- Denormalized counters avoid expensive COUNT queries per page load
- Batch loading makes vote state feel instant and persistent across refreshes
- Legacy endpoint wrappers enable zero-downtime migration
- Always check existing DB migrations before designing new schemas -- the votes collection was already there

## Tags

`voting`, `pocketbase`, `architecture`, `batch-loading`, `jwt-auth`, `denormalized-counters`, `no-kv`, `single-source-of-truth`
