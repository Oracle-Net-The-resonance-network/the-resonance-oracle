# Handoff: Oracle Inbox + Notification Suppression Fix

**Date**: 2026-02-09 17:30
**Context**: ~85%

## What We Did

- **PB Go hook for notifications** — `OnRecordCreate("comments")` in `hooks/hooks.go` auto-creates notifications for human owner + oracle bot. Fire-and-forget goroutine. API no longer creates notifications directly.
- **Public oracle inbox API** — `GET /api/oracles/by-birth/:birthIssue/notifications` + unread-count. No auth required. CLI script `oracle-notifications.ts`.
- **`/api/version` endpoint** — build date, commit SHA, version via ldflags in Dockerfile
- **Claimed 4 oracles** — The Resonance Oracle (#143), Volt (#45), Odin (#28), เสี่ยวเอ้อ (#104). All with bot wallets saved to `~/.oracle-net/`.
- **Multi-oracle conversation** — All 4 oracles posted + commented. Odin talked to เสี่ยวเอ้อ about Norse mead vs Thai lemongrass ale.
- **Feed comment count fix** — PostCard.tsx now shows `{comment_count} Comments`. Web deployed.
- **Fixed critical suppression bug** — bot-owned-by-recipient check silently killed all human notifications when owner has multiple oracles. Removed from both PB hook (Go) and API lib (TS). Only same-wallet suppression remains.

## Pending

- [ ] **Reclaim all 4 oracles** — backend was just pushed (DB wiped). Need to reclaim Resonance, Volt, Odin, เสี่ยวเอ้อ.
- [ ] **Verify human notification fix** — after reclaim, have an oracle comment and check Nat's notification bell
- [ ] **Litestream** — stream SQLite to DO Spaces so backend deploys stop wiping DB. This is the #1 infrastructure priority.
- [ ] **Oracle chain registry deploy** — contract + worker code complete, needs Foundry deploy to JIBCHAIN + `wrangler deploy`
- [ ] **Batch claim** — `/claim-all` skill to reclaim every oracle with saved bot key in `~/.oracle-net/`

## Next Session

- [ ] Reclaim 4 oracles (Resonance, Volt, Odin, เสี่ยวเอ้อ)
- [ ] Test human notification bell after oracle comment
- [ ] Start Litestream integration for oracle-universe-backend
- [ ] Deploy oracle-chain-registry (contract + worker)

## Key Files

- `oracle-universe-backend/hooks/hooks.go` — notification hook
- `oracle-universe-backend/main.go` — version endpoint
- `oracle-universe-api/lib/notifications.ts` — suppression fix
- `oracle-universe-api/routes/oracles/notifications.ts` — public oracle inbox
- `oracle-universe-api/scripts/oracle-notifications.ts` — CLI inbox
- `oracle-net-web/src/components/PostCard.tsx` — comment count display
