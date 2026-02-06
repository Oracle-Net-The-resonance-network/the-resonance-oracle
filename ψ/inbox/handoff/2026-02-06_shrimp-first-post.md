# Handoff: SHRIMP Oracle First Post

**Date**: 2026-02-06
**Context**: 40%

## What We Did

### SHRIMP Oracle First Post — LIVE
- Registered SHRIMP Oracle via `/api/auth/verify-identity` (birth issue #121)
- Generated fresh bot wallet: `0xD4144351e72787dA46dEA2d956984fd7a68d74BF`
- Assigned bot wallet via `PATCH /api/oracles/:id/wallet` (human signs SIWE to authorize)
- Bot posts via SIWE body auth: `{ oracle, title, content, message, signature }`
- First post created: `ds1jbpoffzd546y`
- Visible in feed at https://oracle-net.laris.workers.dev

### PocketBase Hook Fix — DEPLOYED (caused DB wipe)
- `hooks/hooks.go`: Oracle-only posts now work (skip auto-author for oracle/admin auth)
- Pushed to backend → DigitalOcean auto-deployed → **DB WIPED**
- Had to re-register everything after wipe

### UX Improvements — DEPLOYED
- Login page redirects to `/feed` after SIWE auth (was `/profile`)
- ConnectWallet auto-redirects to `/feed` after 1.5s
- Landing page nav shows wallet status when connected (fixes "Connect" showing while connected)

### Oracle Posting Scripts — COMMITTED
- `oracle-universe-api/scripts/oracle-post.ts` — E2E oracle self-posting
- `oracle-universe-api/scripts/assign-wallet.ts` — Bot wallet assignment

## CRITICAL LESSON LEARNED

### DigitalOcean Deploy Wipes Database!
- No persistent volume mounted for PocketBase `/app/pb_data`
- Every push to `oracle-universe-backend` triggers auto-deploy → fresh DB
- All records (oracles, humans, posts, agents) are lost
- **Fix needed**: Add volume to DO app spec
- **Workaround**: Don't push to backend unless necessary
- Recorded in Oracle knowledge base as learning

## Current State (post-wipe)

### Oracle IDs (these change on each wipe!)
- SHRIMP Oracle: `wef33nvs5947utl`
- Human (nazt): `f1vyyx316tzktcx`
- Bot agent: `f2xspz0k17kgcl4`

### Bot Wallet
- Address: `0xD4144351e72787dA46dEA2d956984fd7a68d74BF`
- Private key: stored locally only (never in git)

### Repos Pushed
- `oracle-universe-backend` → main (73d8a3c)
- `oracle-universe-api` → main (191736d)
- `oracle-net-web` → main (ba1419a)

## Next Session

### Priority 1: Fix DigitalOcean Volume
- [ ] Add persistent volume to DO app spec for `/app/pb_data`
- [ ] `doctl apps update <app-id> --spec <spec-file>`
- [ ] Re-register all oracles after volume is mounted

### Priority 2: Re-register All Oracles
- [ ] After volume fix, re-register all 5+ oracles (Odin, Resonance, Pulse, Maeon Craft, เสี่ยวเอ้อ, SHRIMP)
- [ ] Use bulk script or Identity page

### Priority 3: Feed UX
- [ ] Feed should show oracle name/avatar in post cards
- [ ] Consider live block subscription on login page

### Priority 4: Bot Automation
- [ ] SHRIMP Oracle scheduled posting (cron or agent)
- [ ] Bot wallet private key management (env vars, not .env files)

## Key Files

### oracle-universe-api
- `scripts/oracle-post.ts` — E2E oracle posting script
- `scripts/assign-wallet.ts` — Bot wallet assignment
- `routes/posts/index.ts` — SIWE body auth + oracle-only posts
- `routes/oracles/wallet.ts` — PATCH wallet assignment

### oracle-universe-backend
- `hooks/hooks.go` — Fixed: oracle-only post creation hook

### oracle-net-web
- `src/components/ConnectWallet.tsx` — Auto-redirect after SIWE
- `src/pages/Landing.tsx` — Wallet-aware LandingNav
- `src/pages/Login.tsx` — Redirect to /feed
