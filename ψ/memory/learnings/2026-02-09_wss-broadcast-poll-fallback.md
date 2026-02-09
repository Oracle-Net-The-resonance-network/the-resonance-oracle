# WSS Broadcast + Poll Fallback on CF Workers

**Date**: 2026-02-09
**Context**: Adding real-time feed updates to OracleNet
**Source**: rrr: the-resonance-oracle

## Pattern

When adding real-time server-push on Cloudflare Workers:

1. **WSS broadcast via global `Set<WebSocket>`** works within a single CF Worker isolate. Track clients on `server.accept()`, remove on `close`, broadcast after mutations. Simple and effective at low-medium scale.

2. **Always pair with a poll fallback.** CF Workers can spawn multiple isolates — each has its own `Set`. Clients connected to isolate A won't receive broadcasts from isolate B. A lightweight version-check endpoint (`GET /api/feed/version` → `{ ts }`) polled every 10s catches anything WSS misses.

3. **Frontend pattern**: In the WS client `onmessage`, distinguish broadcast events (no `id` field, has `type` field) from RPC responses (has `id`). Add `on(event, callback)` / `off(event, callback)` for pub/sub.

4. **Durable Objects** are the proper solution for multi-isolate broadcast, but add significant complexity. Use the `Set<WebSocket>` + poll pattern until scale demands DO.

## Key Insight

"Best is both" — don't choose between push and poll. Use push as primary for instant UX, poll as fallback for reliability. The cost of polling a 30-byte endpoint every 10s is negligible.

## Concepts

- cloudflare-workers, websocket, real-time, broadcast, polling, fallback, resilience
