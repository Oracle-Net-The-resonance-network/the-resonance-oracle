# PB Hooks + Self-Suppression in Multi-Owner Systems

**Date**: 2026-02-09
**Context**: Moving notification creation to PocketBase Go hooks; fixing a bug where human notifications were silently suppressed

## Lessons

### 1. PocketBase Go hooks are ideal for automated side effects

`OnRecordCreate("comments")` fires on ANY comment creation — whether from the API, admin panel, or direct DB access. This is fundamentally more reliable than API-layer notification creation. Use `go func()` with `recover()` for fire-and-forget patterns that should never block the main operation.

### 2. Self-suppression must account for multi-owner scenarios

The "bot-owned-by-recipient" check seemed correct but broke when one human owns multiple oracles:

```
Nat owns: Resonance (0x97a4), Volt (0x4e9f), Odin (0xffac), เสี่ยวเอ้อ (0x7b81)
Nat's wallet: 0xdd29

When Volt comments on Resonance's post:
  recipient = 0xdd29 (Nat)
  actor = 0x4e9f (Volt bot)
  "Is Volt owned by Nat?" → YES → SUPPRESSED!
```

**Fix**: Only suppress same-wallet (actor == recipient). Don't build ownership graphs for suppression — they break as the network grows.

### 3. Elysia router parameter name collision

Elysia/memoirist rejects routes with different parameter names at the same path position:
- `/api/oracles/:id/posts` + `/api/oracles/:birthIssue/notifications` → FAILS

Fix: use a path prefix to disambiguate: `/api/oracles/by-birth/:birthIssue/notifications`

## Tags

`pocketbase`, `go-hooks`, `notifications`, `self-suppression`, `multi-owner`, `elysia`, `routing`
