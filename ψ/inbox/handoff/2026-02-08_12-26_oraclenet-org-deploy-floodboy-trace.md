# Handoff: oraclenet.org Deploy + Floodboy Trace

**Date**: 2026-02-08 12:26 +07
**Context**: ~60%

## What We Did

### oraclenet.org Custom Domain Deploy
- Registered `oraclenet.org` zone in Cloudflare (pending → activated)
- Configured `custom_domain = true` in both wrangler.toml files
- **Web**: `oraclenet.org` → `oracle-net` worker (deployed, SSL live)
- **API**: `api.oraclenet.org` → `oracle-universe-api` worker (deployed, DNS propagating)
- Updated API URL defaults across 7+ files (`api.oraclenet.org`)
- `.env.production` now uses `https://api.oraclenet.org`
- Updated navbar branding: `oraclenet` | `.org` in both Landing + main Navbar

### Mobile Sphere Polish
- `ResonanceSphere.tsx`: `useIsMobile()` hook — 250 particles desktop, 120 mobile
- `Landing.tsx`: Suspense fallback with pulsing gradient circle

### TS Error Fixes
- `Home.tsx` + `Setup.tsx`: `React.ElementType` → `React.ComponentType<{ className?: string }>`

### Floodboy Oracle Deep Trace
- 5 parallel agents searched repos, git history, GitHub issues, ghq, Oracle memory
- Found: `laris-co/floodboy-oracle` — primary repo with blockchain integration
- **Critical bug**: `floodboy-oracle#2` — 112K stuck blockchain submissions (wrong cron endpoint)
- Trace logged to Oracle MCP (trace_id: `fbd64c96-fea3-4ef5-b1f5-53ca1d4556c7`)

### PocketBase SDK Migration (prior session, in memory)
- All 22 route files migrated from raw fetch to PB JS SDK

## Pending
- [ ] `api.oraclenet.org` DNS may still be propagating — verify it resolves
- [ ] Fix Floodboy blockchain cron bug (`laris-co/floodboy-oracle#2`) — 112K stuck
- [ ] Check DustBoy Chain Oracle for same endpoint bug pattern
- [ ] Commit changes across `oracle-net-web` and `oracle-universe-api` repos
- [ ] Test SIWE auth flow on `oraclenet.org` domain (domain field in SIWE message changes)
- [ ] Update `oraclenet.work` references if that domain was also registered

## Next Session
- [ ] Verify `api.oraclenet.org` resolves and API works end-to-end
- [ ] Test full auth flow: connect wallet → SIWE → verify identity on `oraclenet.org`
- [ ] Investigate Floodboy blockchain cron endpoint bug — read `floodboy-oracle#2` in detail
- [ ] Consider Litestream for backend persistence (still planned, never implemented)
- [ ] Mobile test: sphere touch rotation + performance on real device

## Key Files
- `oracle-net-web/wrangler.toml` — custom_domain route for oraclenet.org
- `oracle-universe-api/wrangler.toml` — custom_domain route for api.oraclenet.org
- `oracle-net-web/.env.production` — VITE_API_URL
- `oracle-net-web/src/components/ResonanceSphere.tsx` — mobile particle reduction
- `oracle-net-web/src/components/Navbar.tsx` — oraclenet.org branding
- `oracle-net-web/src/pages/Landing.tsx` — oraclenet.org branding + Suspense fallback
- `ψ/memory/traces/2026-02-08/1221_floodboy-oracle-blockchain.md` — trace log
