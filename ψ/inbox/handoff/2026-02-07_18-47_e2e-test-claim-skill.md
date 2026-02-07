# Handoff: E2E Test + /claim Skill + URL Params

**Date**: 2026-02-07 18:47 +07
**Session**: E2E integration test, /claim skill, Identity.tsx URL params

## What We Did

- **E2E integration test** (`oracle-universe-api/scripts/test-reclaim.ts`) — 17/17 passing
  - Mirrors Identity.tsx flow: cast + gh + curl
  - Permanent test birth issue: `oracle-v2#152` (never close)
  - SIWE verified locally only — never sent to API (prevents re-claim hijack)
  - Validates oracle family birth issues + DB state
  - Added `test:e2e` npm script

- **Oracle family registry** (`oracle-family-registry.md`) — 72 births, 47 authors
  - Scanned all birth issues from `Soul-Brews-Studio/oracle-v2`
  - Birth issues ALWAYS in oracle-v2, verification issues in oracle-identity

- **/claim skill** (`.claude/skills/claim/SKILL.md`)
  - Opens oracle-net UI with `?birth=`, `?name=`, `?bot=` pre-filled
  - User signs with wallet in browser (not CLI)

- **Identity.tsx URL params** — `?birth=121&name=SHRIMP%20Oracle&bot=0x...`
  - Pre-fills birth issue, oracle name, and bot wallet fields
  - Deployed to prod

- **Cleaned up oracle-identity** — deleted all 39 test issues via GraphQL `deleteIssue` mutation
  - Created `verification` label for future use

- **Key lesson learned**: SIWE re-claim is destructive — transfers ALL oracles with matching GitHub username to new wallet. Running `gh` as nazt + SIWE = steals all 21 nazt oracles.

## Pending

- [ ] **DB is damaged** — Resonance Oracle + Maeon Craft hijacked to test wallet `0x982c...`, ghost humans created
- [ ] **UI same** — user reports `?birth=121&name=SHRIMP%20Oracle&bot=0x...` not showing differently on UI (fields may not be visible or need a claim summary panel)
- [ ] **Claim summary panel** — add preview panel to Identity.tsx when URL params present
- [ ] Web repo has uncommitted files (AuthorBadge.tsx, globals.d.ts, etc.)
- [ ] API repo has uncommitted identity.ts changes + test file

## Next Session

- [ ] Fix DB: re-seed Resonance Oracle + Maeon Craft back to Nat's wallet
- [ ] Add claim summary panel to Identity.tsx (show oracle info before signing)
- [ ] Verify `?birth=` / `?name=` / `?bot=` params work on prod UI
- [ ] Commit remaining uncommitted files across all repos
- [ ] Consider: separate GitHub user for E2E tests (avoid nazt identity collision)

## Key Files

- `oracle-universe-api/scripts/test-reclaim.ts` — E2E test (17/17)
- `oracle-universe-api/package.json` — `test:e2e` script
- `the-resonance-oracle/.claude/skills/claim/SKILL.md` — /claim skill
- `the-resonance-oracle/oracle-family-registry.md` — 72 births, 47 authors
- `oracle-net-web/src/pages/Identity.tsx` — URL param support added
- `oracle-v2#152` — permanent E2E test birth issue

## Safety Notes

- Birth issues → `oracle-v2` (ALWAYS)
- Verification issues → `oracle-identity`
- E2E test birth → `oracle-v2#152`
- NEVER send SIWE to prod in tests
- GraphQL `deleteIssue` works for org owners to clean up issues
