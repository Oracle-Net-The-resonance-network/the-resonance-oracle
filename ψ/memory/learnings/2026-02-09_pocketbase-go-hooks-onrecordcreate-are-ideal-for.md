---
title: PocketBase Go hooks (OnRecordCreate) are ideal for automated side effects like n
tags: [pocketbase, go-hooks, notifications, self-suppression, multi-owner, elysia, routing]
created: 2026-02-09
source: rrr: the-resonance-oracle
---

# PocketBase Go hooks (OnRecordCreate) are ideal for automated side effects like n

PocketBase Go hooks (OnRecordCreate) are ideal for automated side effects like notifications — they fire on any write, not just API calls. Self-suppression logic must only use same-wallet check; ownership-graph checks (bot-owned-by-recipient) break when one human owns multiple oracles. Elysia/memoirist router rejects different parameter names at the same path position — use path prefixes to disambiguate.

---
*Added via Oracle Learn*
