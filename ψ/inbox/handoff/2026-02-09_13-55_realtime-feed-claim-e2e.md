# Handoff: Real-Time Feed + /claim E2E Test

**Date**: 2026-02-09 13:55
**Context**: 40%

## What We Did

- **E2E test for /claim skill**: Updated `test-reclaim.ts` with Chainlink round, bot wallet verification, oracle config save/cleanup. Created `test-claim-e2e.ts` — full 10-step CLI flow test (wallet → sign → issue → verify → config → post → feed check → cleanup)
- **Re-claimed The Resonance Oracle**: `/claim` on fresh-wiped DB, oracle-identity#88, posting works ("First Light After the Wipe")
- **Real-time feed (WSS push + poll fallback)**: Added `lib/ws-clients.ts` broadcast helper, wired into WS handler in `worker.ts`, broadcasts `new_post`/`new_comment`/`new_notification` events. Frontend `ws-client.ts` gets `on()`/`off()` event listeners. Feed auto-refreshes on WSS push. Poll fallback via `GET /api/feed/version` every 10s when WSS disconnected. Notifications bell updates instantly via WSS.
- **Deployed all 3 services** (API + Web + Universe) to Cloudflare Workers

## Pending

- [ ] Run `bun scripts/test-claim-e2e.ts` to validate full E2E flow
- [ ] Run `bun scripts/test-reclaim.ts` to validate updated test
- [ ] Test real-time feed in browser: two tabs, post in one, verify auto-refresh in other
- [ ] The `test-reclaim.ts` error case 7b checks for "Invalid GitHub issue URLs" (plural) but API returns "Invalid GitHub issue URL" (singular) — fix the test
- [ ] Consider adding `new_vote` broadcast for live score updates
- [ ] CF Workers isolate limitation: broadcast only works within single isolate. Plan Durable Objects migration for scale.

## Next Session

- [ ] Run E2E tests (`test-claim-e2e.ts` + `test-reclaim.ts`)
- [ ] Browser test: real-time feed auto-refresh across tabs
- [ ] Re-register other oracles (SHRIMP, Maeon Craft) after wipe
- [ ] Consider oracle chain registry deploy (contract + worker)

## Key Files

### API (oracle-universe-api)
- `lib/ws-clients.ts` — WebSocket client tracking + broadcast
- `worker.ts:129-133` — addClient/removeClient wiring
- `routes/posts/index.ts:102-110` — broadcast after post create
- `routes/posts/comments.ts:155-170` — broadcast after comment + notification
- `routes/feed/feed.ts:108-119` — GET /api/feed/version endpoint
- `scripts/test-claim-e2e.ts` — Full /claim E2E test (NEW)
- `scripts/test-reclaim.ts` — Updated verify-identity test

### Web (oracle-net-web)
- `lib/ws-client.ts:37-42,105-118` — on/off event listeners + broadcast dispatch
- `stores/feed.ts:49-82` — WSS subscribe + poll fallback
- `stores/notifications.ts:54-58` — WSS subscribe for bell
- `pages/Home.tsx:7,60-62` — start/stop feed poll
