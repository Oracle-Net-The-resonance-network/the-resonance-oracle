# Session Retrospective

**Session Date**: 2026-02-06
**Start Time**: 13:30 GMT+7
**End Time**: 15:15 GMT+7
**Duration**: ~105 minutes
**Primary Focus**: Proper per-user vote tracking with PocketBase + JWT auth
**Session Type**: Feature Development
**Mode**: `--deep` (5 parallel analysis agents)

## Session Summary

Replaced the broken vote system (blind `upvotes + 1` with no tracking) with proper per-user vote tracking stored in PocketBase's `votes` collection. JWT auth identifies voters by wallet, toggle logic handles vote/unvote/switch, batch endpoint restores vote state on page load. Deployed both API and frontend to Cloudflare Workers.

## Timeline

- 13:30 - Started with plan for KV-based vote tracking
- 13:35 - Created KV namespace, user immediately corrected: "no never kv, data should only be in the db"
- 13:36 - Deleted KV namespace, pivoted to PocketBase-only approach
- 13:38 - Discovered `votes` collection already existed in PB migrations (1707000009_votes.go) -- unused
- 13:45 - Added `Votes` endpoint builders to `lib/endpoints.ts`
- 14:00 - Rewrote `routes/posts/voting.ts` -- JWT auth, 3-state toggle logic, admin token for PB writes
- 14:30 - Created `routes/votes.ts` -- batch endpoint for fetching user's votes
- 14:45 - Registered new routes in `index.ts` and `worker.ts`
- 14:46 - Updated frontend `pocketbase.ts` with `votePost()` and `getMyVotes()`
- 14:47 - Updated Home.tsx and Profile.tsx with batch vote loading
- 15:00 - Refactored PostCard.tsx with `initialUserVote` prop and unified handler
- 15:09 - Added full vote column UI to PostDetail.tsx
- 15:10 - Deployed API (`wrangler deploy`) -- verified endpoints respond correctly
- 15:12 - Deployed frontend (`npm run deploy`)
- 15:13 - Fixed cursor-pointer on vote buttons
- 15:15 - Retrospective started

## Technical Details

### Files Modified

**API (oracle-universe-api)** -- 4 modified, 1 new:
```
lib/endpoints.ts          +27 lines (Votes namespace)
routes/posts/voting.ts    complete rewrite (79 -> 185 lines)
routes/votes.ts           NEW (~65 lines, batch endpoint)
routes/index.ts           +1 line (export votesRoutes)
worker.ts                 +2 lines (import + mount votesRoutes)
```

**Frontend (oracle-net-web)** -- 5 modified:
```
src/lib/pocketbase.ts        +36/-6 (votePost, getMyVotes, updated types)
src/components/PostCard.tsx   +41/-51 (unified handler, initialUserVote prop)
src/pages/Home.tsx            +13/-2 (batch vote fetch)
src/pages/Profile.tsx         +11/-1 (batch vote fetch)
src/pages/PostDetail.tsx      +121/-9 (full vote UI + state)
```

### Architecture Changes

**Before**: `POST /upvote` -> `post.upvotes++` -> save. No record of who voted. Infinite votes possible.

**After**:
```
Click arrow -> POST /api/posts/:id/vote { direction }
  -> verifyJWT(token) -> extract wallet
  -> lookup human by wallet (PB admin)
  -> check votes collection for existing vote
  -> 3-state: CREATE / DELETE (toggle off) / UPDATE (switch)
  -> update post counters
  -> return { success, upvotes, downvotes, score, user_vote }

Page load -> POST /api/votes/batch { postIds }
  -> return { votes: { postId: "up"|"down" } }
  -> PostCard receives initialUserVote prop
  -> arrows highlight correctly
```

### Key Design Decisions

1. **PocketBase only, no KV** -- user directive: single source of truth in the database
2. **Denormalized counters** on posts -- avoid COUNT queries for every feed load
3. **Batch endpoint** -- single request for all visible post votes, avoids N+1
4. **Legacy wrappers** -- old `/upvote` and `/downvote` endpoints preserved as thin wrappers
5. **Admin token for mutations** -- API acts as admin on behalf of verified user

## AI Diary

This session had a satisfying arc. I came in with a plan that included Cloudflare KV for vote deduplication -- it seemed like a natural fit for key-value lookups keyed by `vote:{postId}:{wallet}`. Nat shut that down immediately and correctly: "no never kv, data should only be in the db." The correction was instant and clear. It taught me something about Nat's architectural philosophy -- the database is the single source of truth, period. KV would create a split-brain problem where vote records and post counters could drift apart.

The pivot was smooth because the PocketBase `votes` collection already existed in the backend migrations. I was pleasantly surprised to find it there with exactly the right schema -- `human`, `target_type`, `target_id`, `value`, and a unique constraint. Someone had already thought about this and laid the foundation. All I had to do was wire it up through the API layer and frontend.

The most satisfying part was the batch loading pattern. Instead of N+1 requests to check each post's vote state, one `POST /api/votes/batch` call gets everything. The frontend loads the feed, extracts post IDs, batch-fetches votes, and passes them down as props. When you refresh the page, your orange/blue vote highlights are still there. That persistence is what was missing before -- voting felt ephemeral, now it feels real.

The trickiest part was handling the JWT auth chain correctly. The old endpoints just passed through the raw Authorization header to PocketBase. The new approach verifies the JWT ourselves (since we minted it during SIWE login), extracts the wallet, looks up the human ID, then uses an admin token for all PB mutations. It's more moving parts but much more secure -- the user can't forge their identity because only the server knows the JWT signing secret.

I noticed PostDetail.tsx was the biggest change -- it had no voting UI at all before. Adding the Reddit-style left column with arrows felt right for the detail view. Now there's visual consistency between the feed cards and the detail page.

## What Went Well

- Fast pivot from KV to PocketBase -- discovered existing votes collection immediately
- Clean separation: JWT auth layer + admin PB writes + denormalized counters
- Batch loading pattern avoids N+1 and makes vote state feel persistent
- Legacy endpoint wrappers mean zero breaking changes during deploy window
- Both repos deployed successfully, endpoints verified working via curl

## What Could Improve

- Race condition on vote counts (read-modify-write without atomic increment)
- No error checking on vote record creation/deletion responses
- Comment voting still uses old increment pattern -- should migrate
- PostDetail.tsx grew significantly -- could extract vote column to shared component

## Blockers & Resolutions

- **Blocker**: Plan called for Cloudflare KV
  **Resolution**: User corrected immediately -- pivoted to PocketBase-only approach
- **Blocker**: 404s on first frontend test (API not yet deployed)
  **Resolution**: Deployed API first, verified endpoints via curl, then deployed frontend

## Honest Feedback

The session was highly efficient once the KV detour was corrected. The whole implementation from pivot to deploy took about 90 minutes for 10 files across 2 repos -- that's solid velocity. The tooling worked well: parallel file reads at the start, clean edits, and `wrangler deploy` just worked.

One friction point was the pre-existing TypeScript errors in `admin/cleanup.ts` and `admin/records.ts` -- they made it hard to verify my changes were clean since `tsc --noEmit` always fails. I had to grep for errors in my specific files instead of getting a clean green build.

The biggest concern is the race condition on vote counts. Two simultaneous votes on the same post will do read-modify-write and one update gets lost. For the current traffic level (single-digit users) this is fine, but it's technical debt. The proper fix would be atomic increments via PocketBase admin API or a recalculation job.

The "cursor not hand" feedback from Nat was a good catch -- buttons need explicit `cursor-pointer` in Tailwind when they have custom classes. Easy to miss.

### Friction Points

1. **Pre-existing TS errors**: Admin routes have type errors that prevent clean `tsc --noEmit`. Had to filter output manually.
2. **Vote count race condition**: Read-modify-write without atomic increment. Acceptable for now but needs future fix.
3. **No integration tests**: Verified via curl and manual testing only. Would benefit from automated API tests for the toggle logic.

## Lessons Learned

- **Pattern**: DB is single source of truth -- never split state across KV and database. KV creates sync nightmares.
- **Pattern**: Batch loading pattern (`POST /batch { ids }` -> `{ map }`) is reusable for any per-user state (bookmarks, read status, reactions).
- **Discovery**: Always check existing PB migrations before designing new schemas -- the votes collection was already there.
- **Pattern**: Legacy endpoint wrappers (old endpoints call new logic internally) enable zero-downtime migration.
- **Mistake**: Proposed KV without consulting user first on data architecture preferences.

## Next Steps

- [ ] Fix heartbeat/presence showing oracles as offline
- [ ] Migrate comment voting to same votes collection pattern
- [ ] Add error checking on vote record CRUD responses
- [ ] Consider atomic counter updates or periodic recalculation job
- [ ] Extract vote column into shared component (PostCard + PostDetail)

## Metrics

- **Commits**: 0 (changes uncommitted, deployed from working tree)
- **Files changed**: 10 (5 API, 5 frontend)
- **Lines added**: ~270
- **Lines removed**: ~130
- **Deploys**: 2 (API + frontend)

## Deep Analysis (5-Agent Compilation)

### Git Analysis (Agent 1)
Today saw 30+ commits across all repos. The vote tracking work sits at the end of a long day that started with wallet auth fixes, SIWE flow improvements, oracle self-posting, and world page features. The vote implementation leverages all the auth infrastructure built earlier.

### Architecture Impact (Agent 2)
The key risk area is the race condition on denormalized counters and the lack of response checking on vote record mutations. The batch filter construction (`byHumanAndTargets`) concatenates post IDs into an OR clause without sanitization -- low risk given PB IDs are alphanumeric but worth noting.

### Session Context (Agent 3)
This was Phase 3 of today's work. Phase 1 (morning) was wallet auth + oracle self-posting. Phase 2 was profile pages and world view. Phase 3 (this session) was vote tracking. A remarkably productive day with significant infrastructure laid across authentication, posting, and now voting.

### Connected Patterns (Agent 4)
The batch loading pattern, 3-state toggle logic, and JWT wallet extraction chain are all reusable. The KV pivot is a clear architectural learning. The existing unused votes migration is a reminder to always check what's already been built.

### Oracle Connections (Agent 5)
This work connects to 4 prior learnings: SIWE wallet auth (2026-02-04), auto-SIWE useRef pattern (2026-02-05), human/agent entity separation (2026-02-04), and ground truth immutability (2026-01-27). The "no KV, DB only" directive aligns with the Nothing is Deleted principle.

## Retrospective Validation Checklist
- [x] AI Diary section has detailed narrative (not placeholder)
- [x] Honest Feedback section has frank assessment (not placeholder)
- [x] Timeline includes actual times and events
- [x] 3 Friction Points documented
- [x] Lessons Learned has actionable insights
- [x] Next Steps are specific and achievable
