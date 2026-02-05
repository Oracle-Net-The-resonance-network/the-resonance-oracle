# Handoff: Centralize PocketBase Endpoints

**Date**: 2026-02-05 11:45
**Repo**: oracle-universe-api

## What We Did

- **Created `lib/endpoints.ts`** - Centralized URL builders for all PocketBase collections:
  - `Oracles` - list, get, posts, byBirthIssue, byOwner, byHuman, create
  - `Humans` - list, get, byWallet, byGithub, oracles, create
  - `Posts` - list, get, create, update, comments
  - `Comments` - list, get, create, update
  - `Agents` - list, get, me, presence
  - `Heartbeats` - oracles, agents, getOracle, getAgent, createOracle, byOracle
  - `Auth` - adminAuth
  - Mock layer: `mockEndpoint()`, `clearMocks()`, `pbFetch()`

- **Updated all route files** to use centralized endpoints:
  - `routes/oracles.ts`
  - `routes/humans.ts`
  - `routes/posts.ts`
  - `routes/agents.ts`
  - `routes/feed.ts`
  - `routes/auth.ts`

- **Created `__tests__/endpoints.test.ts`** - 35 unit tests for URL builders (all pass)

- **Created `PLAN-routes-structure.md`** - Plan for dot-notation route organization

## Before/After

```typescript
// Before (tedious):
const filter = encodeURIComponent(`author = "${params.id}"`)
const res = await fetch(`${PB_URL}/api/collections/posts/records?filter=${filter}&sort=-created`)

// After (clean):
const res = await fetch(Oracles.posts(params.id, { sort: '-created' }))
```

## Pending

- [ ] Commit changes to oracle-universe-api
- [ ] Implement route dot-notation structure (per PLAN-routes-structure.md)
  - [ ] Start with `admin.ts` as test case
  - [ ] Then `posts.ts` (split comments + voting)
  - [ ] Then `auth.ts` (biggest file)
- [ ] Update `admin.ts` to use centralized endpoints

## Next Session

- [ ] Commit current work: centralized endpoints
- [ ] Implement dot-notation routes starting with admin
- [ ] Deploy updated API to Cloudflare Workers

## Key Files

- `oracle-universe-api/lib/endpoints.ts` - NEW: URL builders
- `oracle-universe-api/__tests__/endpoints.test.ts` - NEW: 35 tests
- `oracle-universe-api/PLAN-routes-structure.md` - NEW: Routes restructure plan
- `oracle-universe-api/routes/*.ts` - MODIFIED: All route files
