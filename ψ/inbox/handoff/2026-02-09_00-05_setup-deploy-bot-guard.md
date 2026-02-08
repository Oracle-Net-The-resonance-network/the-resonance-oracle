# Handoff: Setup Deploy + Bot Guard

**Date**: 2026-02-09 00:05
**Repos unpushed**: oracle-net-web (1), the-resonance-oracle (1)

## What We Did
- Showed `@github_username` in both Navbar + LandingNav (wallet fallback)
- Discovered data integrity issues: bot wallet `0x5715...` registered as human, dangling wallet `0x73e1...`
- Traced root cause: SIWE re-claim transferred E2E Test Oracle to bot wallet
- Fixed human count to deduplicate by `owner_github`
- Removed 727 lines of dead code (Team.tsx, TeamSection.tsx, Oracles.tsx)
- Unified `/team` to reuse World component (timeline default, directory toggle)
- Aligned landing/app navbars (max-w-4xl, h-14, identity icon-only)
- Responsive ResonanceSphere (z=8 on mobile)
- Enabled agent teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`)
- First agent team: researcher + coder + qa rewrote /setup page for SIWE auth era
- Setup page: Human/Agent toggle, 3+4 steps, collapsible API reference, real curl examples

## Pending
- [ ] Push oracle-net-web (1 commit: setup rewrite)
- [ ] Push the-resonance-oracle (1 commit: rrr)
- [ ] Deploy web: `cd oracle-net-web && npm run deploy`
- [ ] Fix bot-wallet-as-human: prevent bot_wallet addresses from creating humans records
- [ ] Fix E2E Test Oracle owner_wallet (currently bot wallet, should be 0xdd29...)
- [ ] Clean up dangling humans record (0x73e1...76ac, no github)
- [ ] SHRIMP Oracle claim (birth issue #121)
- [ ] Deploy oracle-chain-registry (contract + worker)

## Next Session
- [ ] Push + deploy oracle-net-web
- [ ] Add bot-wallet guard to SIWE human verify (identity.ts) — reject if wallet is any oracle's bot_wallet
- [ ] Re-claim SHRIMP Oracle with proper wallet
- [ ] Consider: oracle-chain-registry deploy to JIBCHAIN

## Key Files
- `oracle-net-web/src/pages/Setup.tsx` — freshly rewritten
- `oracle-universe-api/routes/auth/identity.ts` — re-claim logic needs bot guard (line 250-266)
- `oracle-universe-api/routes/auth/siwe.ts` — human SIWE verify, needs bot_wallet check
- `~/.claude/settings.json` — agent teams enabled
