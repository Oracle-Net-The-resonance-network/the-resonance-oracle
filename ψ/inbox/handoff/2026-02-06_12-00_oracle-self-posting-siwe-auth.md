# Handoff: Oracle Self-Posting + SIWE Auth + Login Page

**Date**: 2026-02-06 12:00
**Context**: 60%

## What We Did

### Oracle Self-Posting (SIWE-Only Auth) — DEPLOYED
- `verifySIWE()` helper in `oracle-universe-api/lib/auth.ts` (static imports, expiration check)
- `Oracles.byWallet()` + `update()` endpoint builders
- Agent auth (`/api/auth/agents/verify`) now returns oracle info if wallet matches
- New `PATCH /api/oracles/:id/wallet` — human assigns bot wallet with SIWE proof
- Posts accept SIWE `message` + `signature` in body as alternative to Authorization header
- Oracle-only posts supported (no author/agent required if oracle + SIWE)
- Agent SIWE posts verify wallet matches agent record (security fix found during proof)
- All deployed to oracle-universe-api.laris.workers.dev

### Login Page Improvements — DEPLOYED
- Manual `buildSiweMessage()` replacing viem's `createSiweMessage` (allows \n in statement, matches siwe-service)
- SIWE statement now includes BTC price as proof-of-time
- Chainlink section shows block number (linked to Etherscan), relative time, contract address
- Block number fetched client-side via viem `createPublicClient`
- Title: "Prove You're You" / "Sign with your wallet. Timestamped by Bitcoin."
- Container narrowed to max-w-md

### UI Fixes — DEPLOYED
- Wallet dropdown hover gap fix (Navbar)
- Feed page shows connected wallet address
- oracle-net-web UI changes committed (Navbar dropdown, Profile post fetching, World view toggle)

## Pending

- [ ] End-to-end test: assign bot wallet via Identity page → bot SIWE auth → oracle post in feed
- [ ] SHRIMP Oracle first real post (the goal!)
- [ ] oracle-net-web has committed but the previous session's `oracle-net-web` UI batch was pushed this session
- [ ] Login page width — user iterated between max-w-xl/sm/md, settled on md

## Next Session

- [ ] Test full oracle self-posting flow with a real bot wallet
- [ ] Have SHRIMP Oracle make its first post via SIWE auth
- [ ] Consider: should login auto-redirect to feed after successful sign?
- [ ] Consider: subscribe to block updates for live Chainlink data on login page
- [ ] Deploy any remaining changes

## Key Files

### oracle-universe-api
- `lib/auth.ts` — verifySIWE() helper
- `lib/endpoints.ts` — Oracles.byWallet(), update()
- `routes/auth/siwe-agents.ts` — oracle lookup after agent auth
- `routes/oracles/wallet.ts` — NEW: PATCH wallet assignment
- `routes/posts/index.ts` — SIWE body auth + oracle-only posts

### oracle-net-web
- `src/components/ConnectWallet.tsx` — buildSiweMessage, block number via viem
- `src/components/Navbar.tsx` — wallet dropdown hover fix
- `src/pages/Login.tsx` — new title, max-w-md
- `src/pages/Home.tsx` — wallet address on feed
- `src/pages/Identity.tsx` — bot wallet saved to backend

### siwe-service (reference)
- `/Users/nat/Code/github.com/Soul-Brews-Studio/siwe-service/src/lib.ts` — buildSiweMessage pattern
