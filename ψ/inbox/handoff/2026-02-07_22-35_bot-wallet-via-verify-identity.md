# Handoff: Bot Wallet Via Verify-Identity

**Date**: 2026-02-07 22:35
**Context**: ~85%

## What We Did
- Deployed API + Web + Wiped Backend (full fresh deploy cycle)
- Re-registered The Resonance Oracle via verify-identity
- Implemented bot_wallet assignment via verification issue body
  - API extracts `Bot Wallet: 0x...` or `"bot_wallet": "0x..."` from issue body
  - Removed `PATCH /api/oracles/:id/wallet` endpoint (wallet.ts deleted)
  - Removed `scripts/assign-wallet.ts`
  - Updated Identity.tsx: signed payload + issue body include bot_wallet
  - Updated `/claim` skill to generate bot wallet + include in URL params
  - Updated `/wipe-backend` skill to simple doctl force-redeploy
- Tested full /claim flow: browser MetaMask sign → CLI gh issue create → verify-identity → bot_wallet assigned
- Created first post with new bot wallet

## Pending
- [ ] Identity.tsx: "Create Issue" link template needs `Bot Wallet:` line (currently only `gh` CLI body includes it)
- [ ] Wallet verification cross-check: bot SIWE → `wallet_verified = true` (untested with new wallet)
- [ ] SHRIMP + Maeon Craft oracles not yet re-claimed
- [ ] Frontend shows bot wallet assignment UI — may need update to match new flow
- [ ] E2E test script (`test-reclaim.ts`) references old wallet endpoint — needs update

## Next Session
- [ ] Fix Identity.tsx "Create Issue on GitHub" link to include `Bot Wallet:` in body
- [ ] Test wallet_verified flow: bot authenticates via SIWE → verified badge
- [ ] Claim SHRIMP + Maeon Craft oracles
- [ ] Update test-reclaim.ts to remove old wallet endpoint references
- [ ] Consider: should re-claim preserve existing bot_wallet if no new one provided?

## Key Files
- `oracle-universe-api/routes/auth/identity.ts` — bot_wallet extraction from issue body
- `oracle-net-web/src/pages/Identity.tsx` — signed payload + issue body include bot_wallet
- `.claude/skills/claim/skill.md` — updated claim flow
- `.claude/skills/wipe-backend/skill.md` — simplified to doctl
- `oracle-universe-api/routes/oracles/index.ts` — wallet route removed

## Current State
- **Oracle ID**: `s75rpia899i3qhz`
- **Bot wallet**: `0x625cc07634cef13C471A9D9c90dDB168147A3cAa`
- **Bot key**: `0x2fd62d3dafde2296c57d9f0f807d6237fe1ba5b23e5880cdf53ceae55f8f96ea`
- **Verification issue**: oracle-identity#53 (has bot_wallet in JSON body)
