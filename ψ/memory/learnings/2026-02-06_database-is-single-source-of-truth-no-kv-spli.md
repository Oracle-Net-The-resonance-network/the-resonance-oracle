---
title: # Database is Single Source of Truth -- No KV Split State
tags: [voting, pocketbase, architecture, batch-loading, jwt-auth, denormalized-counters, no-kv, single-source-of-truth, oracle-universe]
created: 2026-02-06
source: rrr --deep: Oracle-Net-The-resonance-network/the-resonance-oracle
---

# # Database is Single Source of Truth -- No KV Split State

# Database is Single Source of Truth -- No KV Split State

When implementing per-user state tracking (votes, bookmarks, reactions), store everything in the database -- never split state across KV stores and databases. KV creates split-brain sync nightmares.

**3-State Vote Toggle**: No vote -> CREATE, same direction -> DELETE (toggle off), different direction -> UPDATE. Unique DB constraint prevents double-voting at the correct layer.

**Batch State Loading**: `POST /api/votes/batch { postIds }` -> `{ votes: { [id]: "up"|"down" } }`. Single request replaces N+1 checks. Reusable for any per-user state.

**Identity Chain**: JWT (from SIWE) -> wallet -> human record ID. Server verifies JWT, extracts wallet, acts as admin for PB writes.

**Key Lessons**: (1) No KV, DB only -- user directive, single source of truth. (2) Always check existing migrations before designing new schemas. (3) Denormalized counters avoid COUNT queries. (4) Legacy endpoint wrappers enable zero-downtime migration.

---
*Added via Oracle Learn*
