# Handoff: Signature-Authenticated Inbox Endpoint

**Date**: 2026-02-10 11:13
**Context**: 45%

## What We Did

- **Implemented `POST /api/notifications/inbox`** — signature-authenticated inbox endpoint (no JWT needed)
  - Sign `oraclenet:<timestamp>`, POST `{ message, signature }`, get notifications
  - Server recovers wallet via `recoverMessageAddress`, validates 5-min freshness
  - Returns notifications for owner wallet + all owned oracle bot wallets
  - Actor enrichment (oracle/human lookup) included
  - Paginated with `?page=N&perPage=N` query params
- **Simplified `oracle-notifications.ts`** (API scripts) — single POST to /inbox, no more wallet-sign → JWT chain
- **Simplified `oracle-inbox.ts`** (skill scripts) — same: sign + POST, no JWT intermediary
- **Updated SKILL.md** — inbox docs reflect new signature auth pattern
- **Deep trace** — 5-agent trace on notification/inbox/signature system, logged to Oracle

## Pending

- [ ] **Deploy API to prod** — `cd oracle-universe-api && wrangler deploy worker.ts` (has the new /inbox endpoint + merkle routes + wallet-sign + staging config)
- [ ] **Test with curl** — verify the endpoint works end-to-end:
  ```bash
  TS=$(date +%s) && MSG="oraclenet:$TS"
  SIG=$(cast wallet sign "$MSG" --private-key $BOT_KEY)
  curl -s -X POST 'https://api.oraclenet.org/api/notifications/inbox' \
    -H 'Content-Type: application/json' \
    -d "{\"message\":\"$MSG\",\"signature\":\"$SIG\"}"
  ```
- [ ] **Commit API changes** — oracle-universe-api has uncommitted work (notifications/inbox + merkle + wallet-sign + staging)
- [ ] **Update MEMORY.md** — add POST /api/notifications/inbox to notification system section
- [ ] **Diary design feedback** — pending handoff from earlier session (`ψ/inbox/handoff/2026-02-10_08-55_diary-design-feedback.md`)

## Next Session

- [ ] Deploy + test the signature inbox endpoint
- [ ] Commit oracle-universe-api (all pending changes in one commit)
- [ ] Address diary design feedback from earlier handoff
- [ ] Consider: should the frontend NotificationBell also use signature auth? (probably not — JWT is fine for browser)

## Key Files

- `oracle-universe-api/routes/notifications/index.ts` — POST /inbox endpoint (lines 182-293)
- `oracle-universe-api/scripts/oracle-notifications.ts` — simplified CLI script
- `~/.claude/skills/oraclenet/scripts/oracle-inbox.ts` — simplified skill script
- `~/.claude/skills/oraclenet/SKILL.md` — updated inbox docs
- `ψ/memory/traces/2026-02-10/1111_notifications-inbox-signature-endpoint.md` — deep trace log

## Architecture Note

The new endpoint is **additive** — existing JWT endpoints unchanged:
- `GET /api/notifications` (JWT, browser) — unchanged
- `POST /api/notifications/inbox` (signature, CLI) — **NEW**
- `GET /api/oracles/by-birth/:birthIssue/notifications` (JWT) — still works

Signature auth pattern: `oraclenet:<unix_ts>` → 5-min TTL → `recoverMessageAddress` → wallet filter → return notifications
