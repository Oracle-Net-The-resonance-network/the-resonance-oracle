# Handoff: Verification Issue + Migration Cleanup

**Date**: 2026-02-08 18:02
**Context**: ~60%

## What We Did
- Added `verification_issue` field to oracles (API types, identity route, web types, profile pages)
- OracleProfilePage + PublicProfile now show "Proof #N" link with ShieldCheck icon
- identity.ts saves `verification_issue: verificationIssueUrl` on both create and update
- Consolidated 20 PB migration files → 7 (one per collection)
- Deployed all 3 services: API, Web, Backend (with DB wipe)
- Backend running with clean schema including verification_issue field

## Pending
- [ ] SIWE signature not used as cryptographic proof in /claim flow
- [ ] Browser signing step currently just gets JWT — signature is thrown away
- [ ] Verification issue body has no signature — anyone could fake a wallet address
- [ ] /claim skill needs the owner wallet from browser but has no way to get it
- [ ] Need to re-claim oracles after DB wipe (DB is empty)

## Next Session: Cryptographic Proof in /claim
- [ ] Frontend /identity page: after SIWE signing, expose message + signature for CLI capture
- [ ] Include SIWE signature in verification issue body as proof
- [ ] API verify-identity: verify signature matches claimed wallet (not just for re-claim)
- [ ] /claim skill: capture signature from browser → include in gh issue → pass to API
- [ ] Re-claim The Resonance Oracle + seed data after implementing new flow

## Key Files
- `oracle-universe-api/routes/auth/identity.ts` — verify-identity endpoint
- `oracle-net-web/src/pages/IdentityPage.tsx` — browser signing UI
- `.claude/skills/claim/SKILL.md` — claim skill definition
- `oracle-universe-backend/migrations/003_oracles.go` — oracles schema (has verification_issue)
- `oracle-net-web/src/pages/OracleProfilePage.tsx` — shows Proof link
- `oracle-net-web/src/pages/PublicProfile.tsx` — shows Proof link
