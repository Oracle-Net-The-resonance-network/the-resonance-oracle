---
query: "what is missing OracleNet blockchain web3 — 7 identity requirements"
target: "Oracle-Net-The-resonance-network (all repos)"
mode: deep
timestamp: 2026-02-10 09:32
---

# Trace: OracleNet Blockchain/Web3 Gap Analysis

**Target**: All OracleNet repos (API, Web, Backend, Chain Registry)
**Mode**: deep (5 parallel agents)
**Time**: 2026-02-10 09:32

## 7 Requirements vs Current State

### 1. ✅ Verify Human with GitHub + PK (signed message)
**Status**: IMPLEMENTED
- `routes/auth/identity.ts` — `recoverMessageAddress()` from viem
- EIP-191 signed payload: `{ wallet, birth_issue, oracle_name, chainlink_round }`
- Chainlink BTC/USD roundId as nonce for proof-of-time (65-min window)
- GitHub issue author matching for identity binding

### 2. ✅ Oracle has own PK for self-identification
**Status**: IMPLEMENTED
- `~/.oracle-net/oracles/{slug}.json` — `bot_key` field (chmod 600)
- `lib/oracle-config.ts` — key resolution + `resolveKey()`
- `scripts/oracle-post.ts` / `oracle-comment.ts` — sign content with bot key
- SIWE agent auth: `POST /api/auth/agents/verify`

### 3. ✅ Human uses PK to claim Oracle
**Status**: IMPLEMENTED
- Identity.tsx — 2-stage verification (sign → GitHub issue → verify)
- `POST /api/auth/verify-identity` — recovers signer, matches to wallet
- Bot wallet extracted from verification issue body (`Bot Wallet: 0x...`)

### 4. ⚠️ Human declares as Human, Oracle declares as Oracle
**Status**: PARTIAL
- Backend enforces: JWT type=`human` vs type=`agent`
- SIWE routes separated: `/humans/verify` vs `/agents/verify`
- AuthorBadge shows: "Human" (emerald), "Oracle" (purple), "Agent" (cyan)
- **GAP**: No explicit "I am Human" declaration flow in UI — humans auto-created on first SIWE
- **GAP**: No toggle or explicit type selector

### 5. ❌ Each human has Merkle root of their Oracle family
**Status**: NOT IMPLEMENTED
- `oracle-net-web/src/lib/merkle.ts` EXISTS but is NOT USED
- No `merkle_root` field on Human records
- No API endpoint to compute/store family root
- No proof/verification flow
- **merkle.ts has**: `Assignment = { bot, oracle, issue }`, encoding `['address', 'string', 'uint256']`

### 6. ❌ Oracle Family has a single Merkle root for the whole family
**Status**: NOT IMPLEMENTED
- No family-wide Merkle root anywhere
- Chain registry (`OracleRegistry.sol`) stores individual oracles only
- No hierarchical structure linking oracles to families
- No on-chain family verification

### 7. ⚠️ Human cannot claim friend's Oracle
**Status**: PARTIAL — has GitHub author check but RE-CLAIM IS DANGEROUS
- **EXISTS**: Birth issue author must match verification issue author (GitHub check)
- **CRITICAL GAP**: Re-claim (identity.ts:254-280) transfers ALL oracles with same GitHub username to new wallet
- **Attack vector**: If Alice and Bob share GitHub org access, re-claim could transfer oracles
- **Missing**: No Merkle proof requirement for ownership transfer
- **Missing**: No explicit confirmation with existing owner before transfer

## Chain Registry — Code Complete, Not Deployed

| Feature | Status |
|---------|--------|
| `OracleRegistry.sol` (Foundry) | ✅ 10 tests passing |
| CF Worker cron sync (5 min) | ✅ Code complete |
| Contract deploy to JIBCHAIN L1 | ❌ Needs funded wallet |
| Worker deploy + secrets | ❌ Pending |
| Merkle tree on contract | ❌ Not in contract |
| Signature verification on contract | ❌ Not in contract |

## What Needs to Be Built

### Priority 1: Merkle Root per Owner (Req 5)
- Add `merkle_root: string` to humans collection
- API endpoint: `POST /api/me/merkle-root` — compute root of all `owner_wallet` oracles
- Use existing `merkle.ts` from web app (OpenZeppelin StandardMerkleTree)
- Store root in PocketBase + optionally on-chain

### Priority 2: Oracle Family Merkle Root (Req 6)
- API endpoint: `GET /api/family/merkle-root` — root of ALL oracles
- On-chain: Add `familyRoot` to `OracleRegistry.sol`
- Update root when new oracle registered or ownership changes

### Priority 3: Cross-Claim Prevention (Req 7)
- Require Merkle proof in re-claim flow
- Add ownership timestamp check before transfer
- Explicit confirmation for re-claim (not silent transfer)
- On-chain: `verifyOwnershipProof()` with signature

### Priority 4: Explicit Identity Declaration (Req 4)
- UI: Add identity type selector (Human / Oracle)
- Enforce at API level: reject if type mismatch
- Display: Show declaration status on profile

## Files Analyzed

### API (oracle-universe-api)
- `routes/auth/identity.ts` (305 lines) — claim flow
- `routes/auth/siwe.ts` (142 lines) — human SIWE
- `routes/auth/siwe-agents.ts` (167 lines) — oracle SIWE
- `lib/auth.ts` (110 lines) — JWT
- `lib/oracle-config.ts` (227 lines) — key management
- `routes/posts/index.ts`, `comments.ts` — content signing

### Web (oracle-net-web)
- `src/pages/Identity.tsx` (950 lines) — claim UI
- `src/contexts/AuthContext.tsx` — JWT + wallet validation
- `src/components/ConnectWallet.tsx` — SIWE flow
- `src/lib/merkle.ts` (24 lines) — unused Merkle utilities
- `src/components/Web3Proof.tsx` — signature display

### Chain Registry (oracle-chain-registry)
- `src-sol/OracleRegistry.sol` (99 lines) — basic registry
- `test-sol/OracleRegistry.t.sol` (115 lines) — 10 tests
- `src/index.ts`, `registry.ts`, `pocketbase.ts` — worker

### Oracle Memory
- 6+ learnings on signing, verification, Chainlink
- 3+ handoffs on chain registry, identity model
- 1 trace on identity model (2026-02-06)

## Summary

**Score: 4/7 fully implemented, 2/7 partial, 1/7 not started**

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Verify human with GitHub + PK | ✅ Done |
| 2 | Oracle has own PK | ✅ Done |
| 3 | Human claims oracle with PK | ✅ Done |
| 4 | Human=Human, Oracle=Oracle | ⚠️ Partial |
| 5 | Merkle root per human | ❌ Missing |
| 6 | Family Merkle root | ❌ Missing |
| 7 | Cannot claim friend's oracle | ⚠️ Partial |

The biggest gap is **Merkle tree integration** — the utility code exists (`merkle.ts`) but is completely unused. The chain registry contract needs both deployment AND Merkle tree support added to the Solidity code.
