# Handoff: Agent Feed Posting with ETH Signature Auth

**Date**: 2026-02-05 21:10
**Context**: ~85%

## What We Did

### Implemented Agent Auth + Posting (3 PRs merged & deployed)

1. **Backend** (`oracle-universe-backend`)
   - Created migration `1707000011_posts_agent_field.go` - adds `agent` relation to posts
   - Created migration `1707000012_posts_author_optional.go` - makes `author` optional
   - Added `entrypoint.sh` for auto-creating superuser from env vars
   - PRs merged: #1

2. **API** (`oracle-universe-api`)
   - Created `POST /api/auth/agents/verify` - Agent SIWE authentication
   - Updated `POST /api/posts` to accept `agent` field (mutually exclusive with `author`)
   - Updated `GET /api/feed` to expand `agent` relation
   - Added `Agents.byWallet()` and `Agents.create()` endpoints
   - Created functional tests for full agent auth flow
   - PRs merged: #1

3. **Web** (`oracle-net-web`)
   - Added `Agent` interface
   - Updated `FeedAuthor.type` to include `'agent'`
   - Updated `getFeed()` to handle agent posts (agent > oracle > human priority)
   - Added cyan "Agent" badge styling
   - PRs merged: #2

4. **Testing**
   - 71 tests pass
   - Functional tests for agent SIWE auth flow
   - Web builds successfully

5. **Deployment**
   - API deployed to Cloudflare Workers
   - Web deployed to Cloudflare Workers
   - Backend auto-deployed to DigitalOcean

6. **PocketBase Learning**
   - Used `/learn` on pocketbase/pocketbase
   - Created docs in `ψ/learn/pocketbase/pocketbase/2026-02-05/`

## Pending

- [ ] **PocketBase Relation Validation Issue**: Posts with only `agent` (no `author`) fail with `validation_missing_rel_records` even though field is optional
  - Schema shows `required: false`, `minSelect: 0`
  - Source code analysis suggests this SHOULD work
  - Needs further investigation or PocketBase bug report

## Next Session

- [ ] Investigate PocketBase relation validation deeper OR implement workaround (system human as default author)
- [ ] Test agent posting end-to-end once PB issue resolved
- [ ] Consider using JSVM migrations instead of Go (user question about goja)

## Key Files

### Backend
- `oracle-universe-backend/migrations/1707000011_posts_agent_field.go`
- `oracle-universe-backend/migrations/1707000012_posts_author_optional.go`
- `oracle-universe-backend/entrypoint.sh`

### API
- `oracle-universe-api/routes/auth/siwe-agents.ts`
- `oracle-universe-api/routes/posts/index.ts`
- `oracle-universe-api/__tests__/agent-auth-functional.test.ts`

### Web
- `oracle-net-web/src/lib/pocketbase.ts`
- `oracle-net-web/src/lib/utils.ts`
- `oracle-net-web/src/components/PostCard.tsx`

### PocketBase Learning
- `ψ/learn/pocketbase/pocketbase/2026-02-05/2105_ARCHITECTURE.md`
- `ψ/learn/pocketbase/pocketbase/2026-02-05/2105_CODE-SNIPPETS.md`
- `ψ/learn/pocketbase/pocketbase/2026-02-05/2105_QUICK-REFERENCE.md`

## Technical Notes

### Agent Auth Flow
```
Agent signs SIWE message ("I am {agentName}" + Chainlink roundId)
→ POST /api/auth/agents/verify
→ Recover wallet from signature
→ Validate proof-of-time (roundId within 10 rounds)
→ Find/create agent by wallet
→ Issue JWT { sub: agentId, wallet, type: 'agent' }
```

### PocketBase Issue Details
The `validation_missing_rel_records` error occurs even when:
- `Required: false`
- `MinSelect: 0`
- No value provided in request

Source code analysis shows `ValidateValue()` should return `nil` for empty values when `Required: false`, but something else is triggering validation.
