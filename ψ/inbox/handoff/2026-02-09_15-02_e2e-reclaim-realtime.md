# Handoff: E2E Tests, Oracle Re-Registration, Real-Time Feed Fix, Re-Claim UI

**Date**: 2026-02-09 15:02
**Context**: 30%

## What We Did

- **E2E tests passed**: `test-reclaim.ts` (25/25) and `test-claim-e2e.ts` (17/17) — fixed `/api/posts` → `/api/feed` endpoint bug in test
- **Fixed error case mismatch**: `test-reclaim.ts` line 174 "Invalid GitHub issue URLs" → singular to match API
- **Re-registered oracle family**: SHRIMP Re-Awakens (#150), Moment of Truth (#108), Odin (#28) — used bot keys since no access to Nat's private key. Created `/tmp/re-register-oracle.ts` utility
- **Fixed real-time feed polling**: Removed `if (oracleWs.connected) return` guard — CF Workers isolates don't share WSS state, so poll must always run. Added version seeding in `startFeedPoll()` to avoid redundant initial fetch
- **Identity page re-claim support**: Removed auto-redirect when oracle already exists. Added amber "Re-Verify" banner with current owner vs connected wallet comparison. Changed button text to "Sign to Re-Claim" / "Re-Verify Identity" when re-claiming
- **Deployed**: API + Web (3 deploys total)

## Known Issue

- The re-verify banner and button text only show when the oracle is in the user's `oracles` list (from auth context). If `owner_wallet` doesn't match the connected wallet, the oracle isn't in the list, so it shows as a fresh claim. This is acceptable — the form works either way.

## Pending

- [ ] **Re-claim oracles to Nat's wallet**: SHRIMP, Moment of Truth, Odin still have `owner_wallet = bot_wallet`. Need Nat to do ONE browser re-claim with MetaMask (`0xdd29...`) to trigger SIWE re-claim → transfers all 3
- [ ] **Oracle re-verify banner**: Fetch ALL oracles (not just user's) to check if birth issue already exists, so re-verify banner shows even when owner_wallet doesn't match
- [ ] **Commit API + Web changes**: Both repos have uncommitted work from this session
- [ ] **Clean up E2E test posts**: 2 test posts left in feed from E2E runs
- [ ] **Oracle Chain Registry deploy**: Contract + worker still pending (Foundry + Hono)

## Next Session

- [ ] Nat re-claims via browser → all oracles get correct `owner_wallet`
- [ ] Fix re-verify banner to query all oracles (not just auth context)
- [ ] Commit all uncommitted changes across API + Web repos
- [ ] Test real-time feed polling (verify 10s poll catches new posts)
- [ ] Consider: transfer-ownership API endpoint for post-wipe automation

## Key Files

### API (oracle-universe-api) — uncommitted
- `scripts/test-claim-e2e.ts` — NEW: full /claim E2E test
- `scripts/test-reclaim.ts` — fixed error case 7b
- `lib/ws-clients.ts` — NEW: WSS broadcast helper
- `routes/feed/feed.ts` — feed version endpoint
- `routes/posts/index.ts` — broadcast after post create
- `routes/posts/comments.ts` — broadcast after comment
- `worker.ts` — WS client wiring

### Web (oracle-net-web) — uncommitted
- `src/pages/Identity.tsx` — re-claim support (no redirect, re-verify banner, button text)
- `src/stores/feed.ts` — NEW: feed store with always-poll fix
- `src/stores/votes.ts`, `src/stores/notifications.ts` — NEW: nanostores
- `src/lib/ws-client.ts` — event listeners for broadcast
- `src/pages/Home.tsx` — feed poll start/stop
- `src/components/NotificationBell.tsx` — WSS subscribe for bell
