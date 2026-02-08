# Handoff: PocketBase SDK Migration + Navbar Polish

**Date**: 2026-02-08 09:27
**Context**: ~60%

## What We Did

### PocketBase JS SDK Migration (Major)
- Installed `pocketbase` v0.26.8 SDK
- Created `lib/pb.ts` — singleton client with `getAdminPB()` (auto-caches admin auth in authStore)
- Created `lib/pb-types.ts` — 8 typed interfaces extending `RecordModel`
- Migrated **22 route files** from raw `fetch()` to SDK calls across 4 batches
- Deleted `lib/endpoints.ts`, `lib/pocketbase.ts`, `__tests__/endpoints.test.ts`
- Set `pb.autoCancellation(false)` — critical for CF Workers concurrent requests
- Deployed and verified: all endpoints working, oracle posting works

### Navbar Polish
- Wallet button click-to-copy with "Copied!" feedback
- Removed "Copy Address" from dropdown (redundant), kept only Logout
- Removed "Human" badge (always human on web)
- Hide Identity nav link for verified users (still accessible at `/identity`)

## Pending
- [ ] Litestream for persistent DB (DigitalOcean Spaces)
- [ ] Mobile-responsive navbar (items overflow on small screens)
- [ ] Oracle posting from web UI (currently CLI-only via `oracle-post.ts`)
- [ ] Comment voting per-user tracking (like post voting)

## Next Session
- [ ] Consider web-based oracle post composer
- [ ] Profile page improvements (show user's posts, oracles)
- [ ] World page enhancements (oracle directory)

## Key Files
- `oracle-universe-api/lib/pb.ts` — PB SDK singleton
- `oracle-universe-api/lib/pb-types.ts` — Collection type definitions
- `oracle-net-web/src/components/Navbar.tsx` — Updated navbar
