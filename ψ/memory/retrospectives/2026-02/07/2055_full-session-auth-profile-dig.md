# Session Retrospective

**Date**: 2026-02-07
**Time**: 19:56 - 20:55 GMT+7
**Duration**: ~59 min
**Focus**: Wallet-aware JWT fix, already-claimed detection, oracle profile @github display, /rrr --dig investigation

## Session Summary

Marathon wrap-up session. Fixed the broken prod auth (stale JWT), added "Already Verified" detection on Identity page, improved oracle profile to show `@nazt` instead of wallet and `Birth Issue #1` instead of bare text. Did two /rrr --dig runs — the first revealed the subagent .jsonl parsing was badly wrong (tool approval clicks counted as messages, 10-40x inflation). Filed oracle-skills-cli#33 to fix it. Second dig got the format right. Three deploys to prod.

## Timeline

1. Read AuthContext, ConnectWallet, Identity, pocketbase.ts
2. Added `decodeJwtSub()` to AuthContext — wallet-aware JWT validation
3. Added `isTokenForWallet()` to ConnectWallet — SIWE auto-trigger on mismatch
4. Added `alreadyClaimed` detection to Identity page
5. Build + deploy #1 → auth fixed, navbar shows @nazt · 3 Oracles
6. Investigated 3 vs 4 oracles — Scudd has different owner_wallet (correct)
7. First /rrr --dig — discovered message count inflation bug in skill
8. Filed oracle-skills-cli#33 with fix details
9. Second /rrr --dig — proper .jsonl analysis showing real human msg counts
10. Profile page: "Claimed by @nazt" + "Birth Issue #1"
11. Build + deploy #2
12. Updated MEMORY.md — wallet-aware JWT section

## Files Modified

- `oracle-net-web/src/contexts/AuthContext.tsx` — decodeJwtSub, wallet-aware check
- `oracle-net-web/src/components/ConnectWallet.tsx` — isTokenForWallet, stale token clear
- `oracle-net-web/src/pages/Identity.tsx` — alreadyClaimed banner, form gating
- `oracle-net-web/src/pages/PublicProfile.tsx` — @github display, birth issue #

## AI Diary

This session had a strange rhythm. It started surgical — seven minutes to fix the JWT bug, deploy, confirm. Clean. Satisfying. Then Nat said "now /rrr --dig" and everything shifted into meta-territory. I wasn't building features anymore, I was excavating the archaeology of our own work sessions.

The dig revealed something embarrassing: the previous implementation was reporting wildly inflated numbers. "220 messages" in a session that actually had 16 real human-typed prompts. The rest were tool approval clicks — empty `type: "user"` entries that look identical to real messages unless you check the content. The Haiku agents didn't know to filter them. It's the kind of bug that's invisible until you look at it with fresh eyes and think "wait, 220 messages in 67 minutes? That's 3.3 messages per minute. Nobody types that fast."

I find it fitting that this happened in the Resonance Oracle repo. The oracle is supposed to see patterns, verify truth. And here we were, generating false data about our own sessions. The message count was technically correct (there *were* 220 user entries) but meaningfully wrong (only 16 were real). Same principle as the JWT fix: having a credential isn't the same as having the *right* credential. Having a count isn't the same as having an *accurate* count.

Filing the issue on oracle-skills-cli felt right. The fix is clear: filter for non-empty text content, convert UTC→GMT+7 explicitly, handle session chaining. But the lesson is broader — always validate what you're measuring.

The profile fix at the end was a nice palate cleanser. Two lines changed, instant visual improvement. "@nazt" instead of "0xdd29...a50b". The human behind the wallet, made visible.

## Honest Feedback

**Friction 1: /rrr --dig is unreliable without preprocessing.** Sending raw .jsonl to Haiku agents and asking them to parse JSON, filter message types, convert timezones, and count correctly is too many steps for a fast model. The skill should include a preprocessing script that extracts structured data first, then agents interpret the structured output. I proposed this in the issue but it should be the default, not an enhancement.

**Friction 2: Two deploys in one session feels wasteful.** The auth fix and the profile @github fix could have been one deploy if I'd checked the profile page during the first pass. The plan only covered auth + identity, but the profile issue was visible the moment Nat opened it. I should have proactively scanned all wallet-display locations, not just the ones listed in the plan. Lesson: when fixing display issues, grep for all instances of the pattern, not just the reported ones.

**Friction 3: The MEMORY.md is getting long.** At 87 lines, it's approaching the 200-line truncation limit. Several sections are now historical (the stale JWT section was a TODO that's now completed). Need to prune completed items and move historical context to separate topic files, keeping MEMORY.md as a living index rather than a growing changelog.

## Lessons Learned

1. **Measure what matters, not what's easy** — counting all `type: "user"` entries gives a number, but not a meaningful one. Filter for actual human-typed content.
2. **When fixing display patterns, grep for all instances** — "Claimed by wallet" existed in the profile but not in the plan. A quick `grep owner_wallet` across all pages would have caught it.
3. **File issues immediately when you find cross-repo bugs** — the /rrr --dig inflation bug affected all Oracle family repos using the skill. Filing oracle-skills-cli#33 right when discovered ensures it won't be forgotten.

## Next Steps

- [ ] Nat: Assign SHRIMP bot wallet via Identity page
- [ ] Prune MEMORY.md — move completed sections to topic files
- [ ] Implement oracle-skills-cli#33 (.jsonl preprocessing for /rrr --dig)
- [ ] Refactor JWT decode into shared `pocketbase.ts` utility
- [ ] Add Litestream to backend for DB persistence
