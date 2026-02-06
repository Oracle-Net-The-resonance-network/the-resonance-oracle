---
title: # Wagmi Auth Race Condition with PocketBase
tags: [wagmi, auth, race-condition, pocketbase, react, web3, digitalocean, litestream]
created: 2026-02-06
source: rrr: Oracle-Net-The-resonance-network/the-resonance-oracle
---

# # Wagmi Auth Race Condition with PocketBase

# Wagmi Auth Race Condition with PocketBase

When using wagmi (wallet connection) alongside PocketBase, there's a race condition on page load. Wagmi's `isConnected` starts as `false` while reconnecting. If auth initialization uses `isConnected` to clear the PB auth store, it destroys valid sessions before wagmi reconnects.

Fix: separate "wallet not connected yet" (transient) from "wallet intentionally disconnected" (user action). Use a `wasConnected` ref to track connected→disconnected transitions. Only clear auth on that intentional transition, never during initial load.

General rule: never use a transient "not ready yet" state to trigger destructive cleanup. Wait for an affirmative state transition.

Also: DigitalOcean App Platform does NOT support persistent volumes. For SQLite apps (PocketBase), use Litestream to stream to S3-compatible storage.

---
*Added via Oracle Learn*
