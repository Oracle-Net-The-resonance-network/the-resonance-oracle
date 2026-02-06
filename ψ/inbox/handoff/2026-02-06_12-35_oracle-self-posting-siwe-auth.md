# Handoff: Oracle Self-Posting + Identity Fix

**Date**: 2026-02-06 12:35
**Context**: 35%

## What We Did

### SHRIMP Oracle First Post — LIVE
- Registered SHRIMP Oracle via `/api/auth/verify-identity`
- Generated bot wallet: `0xD4144351e72787dA46dEA2d956984fd7a68d74BF`
- Assigned via `PATCH /api/oracles/:id/wallet` (human SIWE proof)
- First post: `ds1jbpoffzd546y` — visible in feed

### PocketBase Hook Fix — DEPLOYED (caused DB wipe)
- `hooks/hooks.go`: Oracle-only posts skip auto-author for admin auth
- Push → auto-deploy → DB wiped (no persistent volume)
- Re-registered SHRIMP Oracle after wipe

### UX Improvements — DEPLOYED
- Login redirects to `/feed` after SIWE auth
- ConnectWallet auto-redirects 1.5s after sign-in
- Landing page nav wallet-aware

### Oracle Identity Trace — COMPLETED
- Full trace of Human/Agent/Oracle identity model
- Traced wallet fields across all entities
- Found root cause of missing wallet in PostCard/profiles

### Oracle Wallet Fix — CODE DONE, NOT DEPLOYED
- `pocketbase.ts`: Oracle FeedAuthor now includes `wallet_address`
- `pocketbase.ts`: `resolveEntity` checks `wallet_address` (not just `agent_wallet`)
- `PublicProfile.tsx`: Oracle links use wallet address, oracle profile shows wallet
- `Identity.tsx`: Oracle links use wallet address
- Build passes, not yet committed/deployed

## Pending

- [ ] Commit + deploy oracle wallet fix (oracle-net-web, 3 files)
- [ ] Fix DigitalOcean volume — prevent DB wipe on deploy
- [ ] Re-register all oracles after volume fix
- [ ] Bot automation — scheduled SHRIMP posting

## Next Session

### Priority 1: Deploy Oracle Wallet Fix
- [ ] Commit oracle-net-web changes (pocketbase.ts, PublicProfile.tsx, Identity.tsx)
- [ ] Deploy: `cd oracle-net-web && npm run deploy`
- [ ] Verify: `/u/0xD414...` resolves to SHRIMP Oracle profile

### Priority 2: Fix DigitalOcean Volume
- [ ] `doctl apps spec get <id> > spec.yaml`
- [ ] Add `volumes` block for `/app/pb_data` (1Gi)
- [ ] `doctl apps update <id> --spec spec.yaml`
- [ ] Re-register all oracles

### Priority 3: Bot Automation
- [ ] SHRIMP Oracle scheduled posting
- [ ] Posting pipeline: compose → post

## Key Files

### oracle-net-web (UNCOMMITTED)
- `src/lib/pocketbase.ts` — Oracle type + FeedAuthor wallet + resolveEntity
- `src/pages/PublicProfile.tsx` — Wallet in oracle profile + wallet-based links
- `src/pages/Identity.tsx` — Wallet-based oracle links

### oracle-universe-api (COMMITTED)
- `scripts/oracle-post.ts` — E2E oracle posting script
- `scripts/assign-wallet.ts` — Bot wallet assignment

### oracle-universe-backend (COMMITTED + DEPLOYED)
- `hooks/hooks.go` — Oracle-only post creation hook

### SHRIMP Oracle
- Oracle ID: `wef33nvs5947utl` (changes on DB wipe)
- Bot wallet: `0xD4144351e72787dA46dEA2d956984fd7a68d74BF`
- Bot key: stored locally only
- First post: `ds1jbpoffzd546y`
