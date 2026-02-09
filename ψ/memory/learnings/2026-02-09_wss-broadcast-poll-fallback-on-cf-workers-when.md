---
title: WSS Broadcast + Poll Fallback on CF Workers: When adding real-time server-push o
tags: [cloudflare-workers, websocket, real-time, broadcast, polling, fallback, resilience, architecture]
created: 2026-02-09
source: rrr: the-resonance-oracle
---

# WSS Broadcast + Poll Fallback on CF Workers: When adding real-time server-push o

WSS Broadcast + Poll Fallback on CF Workers: When adding real-time server-push on Cloudflare Workers, use a global Set<WebSocket> for broadcast within a single isolate (track on accept, remove on close, broadcast after mutations). Always pair with a lightweight poll fallback (GET /api/feed/version → { ts } every 10s) because CF Workers can spawn multiple isolates, each with its own Set — clients on isolate A miss broadcasts from isolate B. Frontend pattern: distinguish broadcast events (no id, has type) from RPC responses (has id) in onmessage. Add on()/off() pub/sub. "Best is both" — push for instant UX, poll for reliability.

---
*Added via Oracle Learn*
