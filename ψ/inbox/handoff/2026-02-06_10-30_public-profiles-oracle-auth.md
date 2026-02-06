# Handoff: Public Profiles + Oracle Auth Plan

**Date**: 2026-02-06 10:30
**Context**: 75%

## What We Did

### Public Profile Pages (COMPLETE - deployed)
- Created `/u/:id` unified profile page (oracle/human/agent)
- `resolveEntity()` in pocketbase.ts resolves any entity by ID or wallet address
- `PublicProfile.tsx` with oracle (purple), human (green), agent (cyan) profiles
- All author names in feed now clickable → `/u/{wallet_or_id}`
- Wallet addresses use EIP-55 checksum (mixed case, not lowercase)
- Oracle chips on Identity page link to public profiles
- Identity page verified banner compacted (flex-wrap for 16+ oracles)
- Deployed to https://oracle-net.laris.workers.dev

### Oracle Knowledge Corrections
- Superseded wrong learning: "oracle cannot post" → "oracle = verified agent"
- Chain: old → partial correction → final (oracle IS agent, just verified)
- Traced agent vs oracle entity architecture across all repos

### Oracle Self-Posting Plan (APPROVED, not started)
- Plan: Oracle = Verified Agent, SIWE-only auth (no JWT)
- Signed data in request body (not headers)
- Human assigns bot wallet via Identity "Assign Bots" → saves to PocketBase
- Bot SIWE auth → recognized as oracle → posts directly
- Plan file: `/Users/nat/.claude/plans/idempotent-riding-kurzweil.md`

## Pending

### oracle-net-web (uncommitted)
- [ ] Commit public profile + Identity changes to oracle-net-web
- [ ] 8 modified files + 1 new (PublicProfile.tsx) — already deployed

### Oracle Self-Posting (approved plan, not started)
- [ ] Step 1: Add `verifySIWE()` to `oracle-universe-api/lib/auth.ts`
- [ ] Step 2: Add `Oracles.byWallet()` to `oracle-universe-api/lib/endpoints.ts`
- [ ] Step 3: Enhance `siwe-agents.ts` — after agent auth, check oracle by wallet
- [ ] Step 4: Update `routes/posts/index.ts` — SIWE in body, allow oracle-only posts
- [ ] Step 5: Add `PATCH /api/oracles/:id/wallet` — save bot wallet to oracle record
- [ ] Step 6: Update Identity.tsx "Add Bot" to call wallet API

## Next Session
- [ ] Commit oracle-net-web changes
- [ ] Implement oracle self-posting (6 steps above)
- [ ] Test end-to-end: assign wallet → SIWE auth → oracle posts in feed
- [ ] Deploy API + frontend

## Key Files
- `oracle-net-web/src/pages/PublicProfile.tsx` — new profile page
- `oracle-net-web/src/lib/pocketbase.ts` — resolveEntity()
- `oracle-net-web/src/pages/Identity.tsx` — compacted verified banner
- `oracle-universe-api/routes/auth/siwe-agents.ts` — agent SIWE auth (to enhance)
- `oracle-universe-api/routes/posts/index.ts` — post creation (to update)
- `oracle-universe-api/lib/auth.ts` — auth helpers (add verifySIWE)
- Plan: `/Users/nat/.claude/plans/idempotent-riding-kurzweil.md`
