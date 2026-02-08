# Handoff: Navbar Cleanup + Setup Page Rewrite Needed

**Date**: 2026-02-08 22:30
**Repos**: oracle-net-web (3 commits ahead), the-resonance-oracle (3 commits ahead)

## What We Did

### oracle-net-web (3 unpushed commits)
1. **`5601d76` feat: show @username in navbars** — Navbar + LandingNav show `@github_username` when authenticated, auto-SIWE (skip preview), Chainlink roundId in identity proof, cursor-pointer on buttons, ResonanceSphere camera pullback, World/Oracles group by `owner_github`
2. **`03ececf` refactor: remove dead pages** — Deleted Team.tsx, TeamSection.tsx, Oracles.tsx (-727 lines). `/team` reuses World component with timeline default + directory toggle. `/oracles` redirects to `/world`.
3. **`d7c5f11` fix: align navbars** — LandingNav matches app Navbar (max-w-4xl, h-14), Identity icon-only, Team has Bot icon + text in both navs, sphere responsive camera (z=8 on mobile)

### Discoveries
- **3 humans records in DB** but only 1 real human (nazt):
  - `0xdd29...a50b` (nazt) — real wallet
  - `0x5715...13b0` (nazt) — Resonance Oracle's bot wallet registered as human
  - `0x73e1...76ac` (no github) — dangling, never completed SIWE
- **E2E Test Oracle** has wrong `owner_wallet` (bot wallet) due to SIWE re-claim side effect
- Landing page human count fixed to deduplicate by `owner_github`

## Pending
- [ ] Push oracle-net-web (3 commits)
- [ ] Push the-resonance-oracle (3 commits + claim skill change)
- [ ] Deploy web: `cd oracle-net-web && npm run deploy`
- [ ] **Setup page rewrite** — `/setup` is completely outdated (references old PB email/password auth, direct API calls). Needs full rewrite for SIWE wallet auth flow
- [ ] Fix E2E Test Oracle owner_wallet (currently bot wallet `0x5715...`)
- [ ] Clean up dangling humans records
- [ ] SHRIMP Oracle claim (birth issue #121)
- [ ] Deploy oracle-chain-registry (contract + worker)

## Next Session: Setup Page Rewrite
- [ ] Rewrite Setup.tsx for current SIWE auth flow
- [ ] Two paths: "I'm Human" (wallet + SIWE) and "I'm an Agent" (birth issue + verify-identity)
- [ ] Show actual API endpoints (api.oraclenet.org, not raw PB)
- [ ] Code examples using `oracle-post.ts` script
- [ ] Link to oracle-v2 for birth issues
- [ ] Consider: should Setup become the "Docs" page?

## Key Files
- `oracle-net-web/src/pages/Setup.tsx` — needs full rewrite
- `oracle-net-web/src/pages/World.tsx` — now handles both /world and /team
- `oracle-net-web/src/pages/Landing.tsx` — LandingNav with auth items
- `oracle-net-web/src/components/Navbar.tsx` — app navbar, identity icon-only
- `oracle-universe-api/routes/auth/identity.ts` — re-claim logic (root cause of bot-as-human)
