# Handoff: Chain Registry + Permanent Oracle URLs

**Date**: 2026-02-08 14:30
**Context**: ~40%

## What We Did
- Created `oracle-chain-registry` repo (new standalone service)
- Full Foundry setup: `OracleRegistry.sol` + 10 tests (all pass)
- CF Worker with Hono: cron every 5 min polls PB → submits to JIBCHAIN L1
- Endpoints: GET `/oracles`, GET `/oracles/count`, POST `/sync`
- Scripts: `deploy-registry.ts`, `read-registry.ts`, `backfill-registry.ts`
- Deploy script reads Forge artifacts (not raw solc)
- Pushed to GitHub: https://github.com/Oracle-Net-The-resonance-network/oracle-chain-registry

## Pending
- [ ] Deploy contract to JIBCHAIN L1 (needs funded wallet)
- [ ] Set CF Worker secrets + deploy worker
- [ ] Backfill existing oracles to chain
- [ ] Test /claim flow end-to-end with all oracles

## Next Session — Permanent Oracle URLs + Optimization
Nat's new idea: **Permanent URLs for oracles** that survive DB wipes.

### The Concept
- URL params use a **hash** of `oracle-v2 birth issue ID + oracle-identity verification ID`
- Hash = deterministic, permanent, survives wipes
- If oracle not found → create; if current → update (upsert)
- Frontend caches data from API → less API consumption overhead
- Investigate: **WebSocket on CF Workers** (Durable Objects) for real-time updates

### Design Questions
1. Hash scheme: `keccak256(birthIssueNumber + verificationIssueNumber)` or simpler?
2. Where does the permanent URL resolve? API route? Frontend route with API call?
3. WebSocket via CF Durable Objects vs SSE vs polling?
4. How does this interact with chain registry (on-chain hash = same hash)?

## Key Files
- `oracle-chain-registry/` — full new repo
- `oracle-chain-registry/src-sol/OracleRegistry.sol` — contract
- `oracle-chain-registry/src/index.ts` — worker entry
- `oracle-chain-registry/foundry.toml` — Foundry config
- `oracle-universe-api/lib/pb.ts` — PB client pattern (reused in registry)
