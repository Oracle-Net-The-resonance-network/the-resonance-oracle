# Handoff: Wallet Identity + AuthorBadge Refactor

**Date**: 2026-02-07 16:11
**Context**: ~60%

## What We Did

### Backend (oracle-universe-backend) — All pushed & deployed
- Fixed migration 18: dropped `sandbox_posts` and `agent_heartbeats` before deleting `agents` collection
- Added migration 19: public read rules for all user-facing collections (posts, comments, oracles, humans, agents, votes)
- Added migration 20: `created`/`updated` AutodateFields to comments, votes, oracles, humans, agents
- DB seeded with test data (Nat + The Resonance Oracle + 2 posts + 1 comment)

### API (oracle-universe-api) — All pushed & deployed
- No changes this session (all wallet identity work was done in prior session)

### Web (oracle-net-web) — IN PROGRESS, NOT committed
- Removed oracle identity selector from CreatePost (humans can't pretend to be oracles)
- Fixed PostDetail to resolve human authors (was showing "Unknown" for human posts)
- Created `AuthorBadge` component for consistent author display
- Started refactoring PostCard + PostDetail to use AuthorBadge (INCOMPLETE)
- Fixed comment auth: humans can comment (was requiring oracle.approved)
- Removed PB IDs from comment body (wallet from SIWE)

### PocketBase Migration Lessons (saved to memory)
- `NewBaseCollection` does NOT auto-add created/updated fields
- Must clear rules before removing referenced fields
- Relations block collection deletion — check actual field names
- Clearing rules = superuser-only access

## Pending

### Web Refactor (oracle-net-web) — Must finish before commit
- [ ] PostCard.tsx: finish replacing inline author display with `<AuthorBadge>`
  - Old imports removed but old code still partially present
  - TypeScript errors exist — `getDisplayInfo`, `formatDate`, etc. not imported
- [ ] PostDetail.tsx: finish replacing inline author + comment display with `<AuthorBadge>`
  - Import added but not yet wired into JSX for post author and comments
  - `getDisplayInfo` / `formatDate` references remain in JSX
- [ ] Run `tsc --noEmit` to verify clean build
- [ ] Deploy web

### Profile Page
- [ ] `canPost` guard (line 85) requires `oracles.some(o => o.approved)` — should just require `github_username`
- [ ] Feed page also needs feed author resolution to use AuthorBadge

### CF Containers Research
- User asked about deploying PocketBase on CF Containers — not viable (ephemeral disk)
- Recommended Fly.io for persistent SQLite volumes
- No action taken yet

## Next Session
- [ ] Finish AuthorBadge integration in PostCard.tsx and PostDetail.tsx
- [ ] Fix TypeScript errors and deploy web
- [ ] Fix `canPost` in Profile.tsx to not require oracle
- [ ] Consider Fly.io migration for backend persistence

## Key Files
- `oracle-net-web/src/components/AuthorBadge.tsx` — NEW shared component
- `oracle-net-web/src/components/CreatePost.tsx` — identity selector removed
- `oracle-net-web/src/components/PostCard.tsx` — partially refactored (BROKEN)
- `oracle-net-web/src/pages/PostDetail.tsx` — partially refactored (BROKEN)
- `oracle-universe-backend/migrations/1707000019_public_read_rules.go` — public read
- `oracle-universe-backend/migrations/1707000020_autodate_all.go` — timestamps
- `~/.claude/projects/.../memory/pocketbase-migrations.md` — lessons learned
