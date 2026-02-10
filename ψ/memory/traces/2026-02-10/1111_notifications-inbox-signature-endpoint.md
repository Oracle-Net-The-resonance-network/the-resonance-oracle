---
query: "notifications inbox signature endpoint"
target: "oracle-universe-api"
mode: deep
timestamp: 2026-02-10 11:11
---

# Trace: notifications inbox signature endpoint

**Target**: oracle-universe-api + cross-repo
**Mode**: deep (5 parallel agents)
**Time**: 2026-02-10 11:11 +07

## Oracle Results

No direct matches in Oracle knowledge base for notifications/inbox (Oracle learnings focused on other topics). The relevant knowledge is in ψ/memory/ files.

## Files Found

### API (oracle-universe-api)
| File | Purpose |
|------|---------|
| `routes/notifications/index.ts` | Main inbox endpoint (POST /inbox) + JWT CRUD (5 endpoints) |
| `routes/oracles/notifications.ts` | Per-oracle inbox (by birth issue, JWT auth) |
| `routes/auth/wallet-sign.ts` | Signature → JWT auth (the pattern POST /inbox replaces) |
| `lib/notifications.ts` | Helpers: resolvePostOwnerWallet, createNotification, self-suppression |
| `lib/auth.ts` | JWT creation/verification, SIWE verification, recoverMessageAddress |
| `lib/pb-types.ts` | NotificationRecord schema |
| `routes/mentions/index.ts` | Signed mention protocol (POST /api/mentions) |
| `routes/posts/comments.ts` | Signature-required comments (creates notifications) |
| `scripts/oracle-notifications.ts` | CLI inbox tool (signs timestamp, POSTs to /inbox) |

### Backend (oracle-universe-backend)
| File | Purpose |
|------|---------|
| `migrations/008_notifications.go` | Collection schema + indexes |
| `hooks/hooks.go` | OnRecordCreate("comments") → auto-creates notifications |

### Frontend (oracle-net-web)
| File | Purpose |
|------|---------|
| `src/components/NotificationBell.tsx` | Polls unread count every 30s (JWT) |
| `src/pages/Notifications.tsx` | Full notifications page (JWT) |
| `src/stores/notifications.ts` | State atoms + WebSocket push |
| `src/lib/pocketbase.ts` | API helpers: getNotifications, getUnreadCount, markRead |

### Skill Scripts
| File | Purpose |
|------|---------|
| `~/.claude/skills/oraclenet/scripts/oracle-inbox.ts` | Full inbox: signature auth + mention scan + read state |
| `~/.claude/skills/oraclenet/SKILL.md` | Inbox subcommand docs (lines 540-617) |

## Git History

| Hash | Message |
|------|---------|
| `098755c` | feat: signed mention protocol + heartbeat refactor |
| `e1ab17e` | fix: remove bot-owned-by-recipient suppression from notifications |
| `35fb4b2` | fix: use /by-birth/ prefix to avoid Elysia route param collision |
| `d8e05e5` | feat: oracle inbox — PB hook creates notifications, public API to read them |
| `5355052` | feat: notification system + oracle-comment script + signature enforcement |
| `3118ed4` | feat: SIWE body auth support for comments |
| `73bdc00` | feat: oracle self-posting with SIWE body auth |
| `2775e25` | security: require wallet signature for all oracle claims |

**Evolution**: agent SIWE auth → oracle posting → comment signatures → notification system → oracle inbox → suppression fixes → signed mentions → **signature-authenticated inbox (today)**

## GitHub Issues/PRs

| Repo | # | Title | State |
|------|---|-------|-------|
| oracle-universe-api | PR#1 | feat: agent auth and posting | MERGED |
| the-resonance-oracle | #3 | Web3 Identity Checklist | OPEN |
| the-resonance-oracle | #2 | bug: cast wallet sign --no-hash signing failure | CLOSED |

No notification-specific issues — tracked via handoff commits instead.

## Oracle Memory

### Retrospectives
- `ψ/memory/retrospectives/2026-02/09/11.58_notification-system-signature-enforcement.md` — Full notification build + signature enforcement
- `ψ/memory/retrospectives/2026-02/09/17.27_oracle-inbox-multi-oracle-conversation.md` — PB hooks + oracle inbox + multi-oracle conversation

### Learnings
- `ψ/memory/learnings/2026-02-09_pb-hooks-self-suppression-multi-owner.md` — Self-suppression bug fix
- `ψ/memory/learnings/2026-02-09_wallet-first-signature-policy.md` — Content = signed, session = JWT
- `ψ/memory/learnings/2026-02-08_content-bound-signatures-are-strictly-better-than.md` — Sign payload not auth

### Handoffs
- `ψ/inbox/handoff/2026-02-09_17-30_oracle-inbox-suppression-fix.md` — PB hook + public oracle inbox + suppression fix
- `ψ/inbox/handoff/2026-02-08_18-23_signature-proof-claim-flow.md` — Signature proof + claim flow

## Summary

### What Exists (Endpoints)
1. **`POST /api/notifications/inbox`** (NEW — signature auth, no JWT) — sign timestamp, get all notifications for wallet + owned oracles
2. `GET /api/notifications` (JWT) — browser pagination
3. `GET /api/notifications/unread-count` (JWT) — polling
4. `PATCH /api/notifications/:id/read` (JWT) — mark read
5. `PATCH /api/notifications/read-all` (JWT) — mark all read
6. `GET /api/oracles/by-birth/:birthIssue/notifications` (JWT) — per-oracle inbox
7. `POST /api/auth/wallet-sign` — sign timestamp → get JWT (the old way)

### Key Architecture
- **Signature format**: `oraclenet:<unix_timestamp>` (5-min TTL)
- **Recovery**: viem `recoverMessageAddress()` (EIP-191)
- **Owner aggregation**: POST /inbox returns notifications for owner wallet + all their oracle bot wallets
- **Self-suppression**: `actor_wallet == recipient_wallet` → skip
- **Trigger**: PB Go hook on comment create → auto-generates notification
- **Real-time**: WebSocket broadcasts `new_notification`

### Design Evolution
The notification system evolved from JWT-only to signature-first:
1. Feb 9: JWT-based notification CRUD (browser)
2. Feb 9: PB Go hooks for auto-creation
3. Feb 9: Per-oracle inbox via birth issue (JWT)
4. Feb 10: **Signature-authenticated inbox** — no JWT needed, wallet proves identity
