# Handoff: /claim Skill + Wallet-First IDs + Owner GitHub

**Date**: 2026-02-07 19:53 +07
**Session**: DB fix, claim summary panel, /claim CLI flow, wallet-first IDs, owner_github enrichment

## What We Did

- **Fixed DB** — Restored hijacked oracles (Resonance + Maeon Craft) to Nat's wallet, deleted 9 ghost humans + 3 junk test oracles
- **Claim summary panel** — Identity.tsx shows orange banner when `?birth=&name=&bot=` URL params present (before and after wallet connect)
- **Updated /claim skill** — CLI-first hybrid flow: browser for MetaMask signing, Claude runs `gh issue create` + `curl verify-identity`
- **Claimed SHRIMP Oracle** — Full CLI claim: `gh issue create` → `curl POST /api/auth/verify-identity` → success
- **Wallet-first IDs everywhere** — Removed PB record IDs from API responses, frontend uses wallet addresses
  - API verify-identity returns `human.wallet` + `oracle.birth_issue` (not PB IDs)
  - Frontend: `Human.wallet_address` required, profile URL fallbacks use `owner_wallet`
  - World.tsx presence map fixed (was mixing `name` and `id` keys)
- **Owner GitHub enrichment** — `/api/oracles` now returns `owner_github` for each oracle (in-memory wallet→github map)
  - World page shows `@nazt` instead of `0xdd29...` in directory groups + timeline cards
- **Stale JWT fix** — AuthContext clears invalid tokens so SIWE can re-trigger on reconnect
- **Committed + deployed** all 3 repos (web, API, main)

## DB State (post-session)

```
Oracles (4):
  The Resonance Oracle | owner=0xdd29adac... | bot=0x0a8AB2b4... | birth=#1
  Scudd Oracle         | owner=0x73e1f758... | bot=none          | birth=#56
  Maeon Craft Oracle   | owner=0xdd29adac... | bot=none          | birth=#114
  SHRIMP Oracle        | owner=0xdd29adac... | bot=none          | birth=#121

Humans (2):
  @jodunk | 0x73e1f758...
  @nazt   | 0xdd29adac... (current wallet)
```

**Note**: Nat's wallet changed from `0xdd29a0e5...` to `0xdd29adac...` during this session. Old human record deleted, oracles transferred.

## Pending

- [ ] **Prod auth not working** — Production `oracle-net.laris.workers.dev` navbar shows only wallet, not `@nazt · 4 Oracles`. Stale JWT fix deployed but needs verification (user may need to disconnect + reconnect in browser)
- [ ] **Identity page claim detection** — When visiting `/identity?birth=121` and SHRIMP is already claimed, should show "Already verified" not the claim form
- [ ] **SHRIMP Oracle bot wallet** — Not assigned yet. Need to assign `0x0a8AB2b4fBc6429B33AEF35F5566CE5550A26B9F` via Identity page "Assign Bots" section
- [ ] **Heartbeat uses PB IDs** — `oracle_heartbeats` PB collection still keyed by PB oracle record ID (requires schema change to fix)
- [ ] **ConnectWallet SIWE auto-trigger** — The `!getToken()` check prevents re-auth when switching wallets. May need wallet-aware token validation

## Next Session

- [ ] Verify prod auth works after stale JWT fix (disconnect + reconnect)
- [ ] Add "Already claimed" state to Identity.tsx when URL params match owned oracle
- [ ] Assign SHRIMP bot wallet
- [ ] Consider: wallet-aware JWT validation (decode JWT sub, compare to connected wallet)

## Key Files

- `oracle-net-web/src/pages/Identity.tsx` — Claim summary panel, URL params
- `oracle-net-web/src/contexts/AuthContext.tsx` — Stale JWT clearing
- `oracle-net-web/src/pages/World.tsx` — owner_github display, presence map fix
- `oracle-net-web/src/components/ConnectWallet.tsx` — SIWE auto-trigger logic
- `oracle-universe-api/routes/oracles/list.ts` — owner_github enrichment
- `oracle-universe-api/routes/auth/identity.ts` — wallet-first response
- `the-resonance-oracle/.claude/skills/claim/SKILL.md` — CLI-first claim flow

## Lesson Learned

**Wallet changes break auth chain**: When a user signs with a different wallet than their original, a new human record is created. Old oracles stay on the old wallet. Must transfer oracles AND delete old human to consolidate identity. The verify-identity SIWE re-claim handles this automatically, but CLI-only claims (without SIWE) don't trigger it.
