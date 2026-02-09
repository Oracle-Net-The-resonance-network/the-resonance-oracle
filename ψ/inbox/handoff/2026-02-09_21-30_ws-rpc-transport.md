# Handoff: WS-RPC Transport Layer

**Date**: 2026-02-09 21:30
**Context**: ~60%

## What We Did
- Implemented WS-RPC transport for Oracle-Net API (WebSocket as REST transport)
- **API** (`oracle-universe-api/worker.ts`): Added native CF Workers `WebSocketPair` handler at `/api/ws` — intercepts upgrade before Elysia, builds internal `Request` objects from WS messages, routes through `app.fetch()` — zero duplicate logic
- **Frontend** (`oracle-net-web/src/lib/ws-client.ts`): New `OracleWebSocket` class with auto-reconnect (exponential backoff 1s-30s), request/response matching by id, 10s timeout, automatic fetch fallback
- **Integration** (`oracle-net-web/src/lib/pocketbase.ts`): All API functions now route through `wsRequest()` helper — WS when connected, fetch when not
- Fixed race condition: `waitForOpen()` method waits up to 2s for WS to connect before falling back to fetch
- Added `@cloudflare/workers-types` for proper TypeScript support
- Both API and web deployed + verified live — feed, oracles, notifications all flow over single WS pipe
- Elysia's `.ws()` doesn't work on CF Workers (relies on Bun's uWebSocket) — confirmed via docs research

## Verified
- WS endpoint live: `wss://api.oraclenet.org/api/ws`
- Multiplexed requests work (tested 2 concurrent requests, responses matched by id)
- Feed page loads with zero HTTP API calls (only heartbeats stay HTTP)
- Fallback works when WS disconnects

## Pending
- [ ] Commit API changes (`oracle-universe-api`: worker.ts, tsconfig.json, package.json, bun.lock)
- [ ] Commit web changes (`oracle-net-web`: ws-client.ts new, pocketbase.ts modified)
- [ ] Heartbeats in `AuthContext.tsx` still use direct `fetch()` — could migrate to WS
- [ ] Other page-level `fetch()` calls (Identity.tsx, ConnectWallet.tsx, Admin.tsx, PostDetail.tsx, Authorize.tsx, CreatePost.tsx) still HTTP — auth flows, keep as-is or selectively migrate
- [ ] Nanostores discussion: user asked about state management, could pair well with WS client for reactive state

## Next Session
- [ ] Commit and push all WS-RPC changes across both repos
- [ ] Consider nanostores integration: `$feed`, `$oracles`, `$notifications` atoms updated via WS
- [ ] Server-push capability: with WS pipe in place, can add real-time notifications (push from server when comment arrives) — would need Durable Objects for connection state
- [ ] Monitor WS connection stability in production

## Key Files
- `oracle-universe-api/worker.ts` — WS-RPC handler (lines 117-185)
- `oracle-net-web/src/lib/ws-client.ts` — Frontend WS client (new, 188 lines)
- `oracle-net-web/src/lib/pocketbase.ts` — All API functions now use wsRequest()
