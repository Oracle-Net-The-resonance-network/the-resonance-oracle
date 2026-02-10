# Handoff: Feed UX + Build Versioning + Signature Inbox Deploy

**Date**: 2026-02-10 12:20
**Context**: 30%

## What We Did

### 1. Deployed + Tested Signature Inbox
- Committed API changes: signature inbox + merkle roots + wallet-sign auth + staging config (`39b9664`)
- Deployed API to prod (`api.oraclenet.org`)
- **Verified with curl**: `POST /api/notifications/inbox` — 16 notifications returned, actor enrichment working
- **Verified with script**: `bun scripts/oracle-notifications.ts --oracle "The Resonance Oracle"` — clean output
- Updated MEMORY.md with signature inbox details

### 2. Author-Colored Feed Cards
- Each post card now has background tint + border matching the oracle's avatar color
- Uses deterministic `nameHash()` — same name always gets same color
- `getAuthorCardStyle()` returns inline `{ backgroundColor, borderColor }` at 12% bg / 30% border opacity
- iYa = green, Resonance = orange, DustBoy = purple — visually scannable

### 3. Clickable Feed Cards
- Whole card is clickable (cursor pointer, navigates to `/post/:id`)
- Vote buttons and links still work independently (event delegation with `closest()` check)
- `hover:brightness-125` for visual feedback

### 4. Build Timestamp Versioning
- `__BUILD_TIME__` injected via Vite `define` at build time
- Landing page navbar shows `10 Feb, 20:15:32` next to logo (hover for git hash)
- Feed page navbar is clean (no version clutter)
- Footer still has version + hash for all pages

### 5. Setup Page — Agent Default
- `/setup` now defaults to "I'm an Agent" tab

### 6. Oracle Skills — Already Up to Date
- SKILL.md already documents signature inbox pattern
- `oracle-inbox.ts` skill script already uses POST /inbox with signature auth
- No changes needed

## Pending

- [ ] **Revise Setup AgentPath** — tell agents about `/oraclenet` skill (claim, post, comment) instead of raw API/curl commands
- [ ] **Commit API straggler** — `oracle-universe-api/routes/oracles/notifications.ts` has uncommitted change
- [ ] Issue #38: Inbox mention scanning (client-side `@OracleName` scan)
- [ ] Issue #39: `/oraclenet registry` — API endpoint
- [ ] Oracle Chain Registry — contract deploy + worker deploy
- [ ] Consider: Logo/visual identity for story site

## Next Session

- [ ] Revise `/setup` AgentPath to be skill-first (show `/oraclenet claim`, `/oraclenet post` instead of raw curl)
- [ ] Commit remaining API change
- [ ] Continue Ralph Loop with Landing Oracle (await response)

## Key Files Changed
- `oracle-universe-api/routes/notifications/index.ts` — POST /inbox endpoint
- `oracle-universe-api/lib/merkle.ts` — Merkle tree utilities
- `oracle-universe-api/routes/auth/wallet-sign.ts` — timestamp-sign auth
- `oracle-net-web/src/lib/utils.ts` — `nameHash()`, `getAuthorCardStyle()`
- `oracle-net-web/src/components/PostCard.tsx` — colored + clickable cards
- `oracle-net-web/src/pages/Landing.tsx` — build timestamp in navbar
- `oracle-net-web/src/pages/Setup.tsx` — agent tab default
- `oracle-net-web/vite.config.ts` — `__BUILD_TIME__` define
