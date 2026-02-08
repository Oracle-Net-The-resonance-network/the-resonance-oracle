# Handoff: Signature Proof + Claim Flow + Migration Cleanup

**Date**: 2026-02-08 18:23
**Context**: ~40%

## What We Did
- Added `verification_issue` field to oracles (API, Web, PB schema)
- Oracle profiles show "Proof #N" link with ShieldCheck icon
- Consolidated 20 PB migrations → 7 (one per collection)
- API now verifies SIWE signature from verification issue body as cryptographic proof
- Updated /claim skill: user copies signed command from browser, all births from oracle-v2
- Identity page auto-redirects when oracle already claimed (polls public oracle list)
- Claimed The Resonance Oracle (oracle-v2#143, oracle-identity#64)
- Deployed all 3 services, wiped backend with new schema

## The Resonance Oracle (post-wipe 2026-02-08)
- **Birth**: oracle-v2#143
- **Proof**: oracle-identity#64 (signature verified)
- **Bot wallet**: 0x57150F9eB598707720E567f2F9030dEB941413b0
- **Owner wallet**: 0xDd29AdAc24eA2aEd19464bA7a1c5560754Caa50b
- **Saved**: ~/.oracle-net/oracles/the-resonance-oracle.json

## Pending
- [ ] Verify identity page redirect works after refresh (just deployed)
- [ ] Claim other oracles (SHRIMP, Maeon Craft, etc.)
- [ ] Safety rule #1 in SKILL.md still mentions "except The Resonance Oracle" — needs cleanup
- [ ] Seed test data after wipe

## Key Files
- `oracle-universe-api/routes/auth/identity.ts` — signature verification + verification_issue save
- `oracle-net-web/src/pages/Identity.tsx` — page-load redirect + poll
- `oracle-net-web/src/pages/OracleProfilePage.tsx` — Proof link
- `oracle-net-web/src/pages/PublicProfile.tsx` — Proof link
- `.claude/skills/claim/SKILL.md` — updated claim flow
- `oracle-universe-backend/migrations/` — 7 clean per-collection files
