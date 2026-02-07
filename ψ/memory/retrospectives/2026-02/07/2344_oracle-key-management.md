# Session Retrospective

**Session Date**: 2026-02-07
**Time**: ~23:15 - 23:44 GMT+7
**Duration**: ~30 min
**Focus**: Oracle Key Management (~/.oracle-net/)
**Type**: Feature

## Session Summary

Implemented persistent local key management for Oracle-Net — a `~/.oracle-net/` config directory that stores oracle identities, bot wallets, and private keys so they survive across sessions. Before this, bot keys were shown once during `/claim` and had to be manually passed via `BOT_PRIVATE_KEY` env var every time. With 5+ oracles, that was unmanageable.

## Timeline

1. Read existing `oracle-post.ts`, `claim/skill.md`, and lib files for context
2. Created `oracle-universe-api/lib/oracle-config.ts` — full config reader/writer library
3. Updated `oracle-post.ts` — added `--oracle "name"` flag, key auto-resolution chain
4. Updated `/claim` skill — Step 4 now saves to `~/.oracle-net/` after verify
5. Seeded all 5 current oracles with public data from live API
6. Added age encryption support — initially broken (`age -e -p` is interactive)
7. Fixed age to use identity-file-based encryption (`age-keygen` + `age -e -r`)
8. Installed age via brew, tested full encrypt/decrypt cycle
9. Changed to save both `bot_key` + `bot_key_encrypted` (user preference)
10. Updated `/claim` skill to use `saveOracle()` library call instead of raw bash

## Files Modified

- **NEW**: `oracle-universe-api/lib/oracle-config.ts` — Config library (slugify, list, get, save, encrypt/decrypt)
- **MODIFIED**: `oracle-universe-api/scripts/oracle-post.ts` — `--oracle` flag, `resolveKey()` integration
- **MODIFIED**: `.claude/skills/claim/skill.md` — Step 4 saves via library, Step 5 shows `--oracle` usage
- **NEW**: `~/.oracle-net/config.json` — Global config (default_oracle, encryption setting)
- **NEW**: `~/.oracle-net/oracles/*.json` — 5 oracle files seeded with public data
- **NEW**: `~/.oracle-net/age-key.txt` — Age identity (auto-generated during test)

## AI Diary

This session had a satisfying arc — from "keys are ephemeral and painful" to "keys live in a proper home." The architecture felt natural: one JSON file per oracle, slugified names, a global config for defaults. The library came together quickly because the shape was clear from the plan.

The age encryption journey was the interesting part. I initially wrote `age -e -p` which prompts for a passphrase interactively — completely broken for CLI automation. The user caught it with just one word: "age." That was enough to make me realize I needed to actually install it and test. The fix was identity-file-based encryption: `age-keygen` generates a key pair at `~/.oracle-net/age-key.txt`, encrypt with the public key, decrypt with the identity file. No interactive prompts.

Then the shell injection issue — I was doing `echo '${key}' | age -e` which passes through the shell. Switched to `execFileSync` which pipes via stdin directly. Cleaner and safer.

The user's "save both" preference was a good call. Belt and suspenders — plaintext for convenience (file is already chmod 600), encrypted backup for if you ever need to move the file somewhere less trusted. Simple `delete toSave.bot_key` removal was all it took.

The smoke tests all passing on first try felt good. `listOracles()` finding 5, partial match on "shrimp" finding "SHRIMP Oracle Re-Awakens", birth issue lookup working. The encrypt→save→read→decrypt cycle returning the exact original key. These are the moments that make the work feel solid.

## Honest Feedback

**Friction 1: Age encryption was half-baked on first pass.** I wrote `age -e -p` without thinking about whether it's interactive. For a CLI tool that runs non-interactively, passphrase-based encryption is a non-starter. Should have thought through the UX before writing code — "how will this actually be invoked?" The user had to prompt me to actually install and test it.

**Friction 2: Bot keys are null in all seeded files.** The 5 oracle configs were seeded with public data from the API, but the private keys were generated in previous `/claim` sessions and aren't available. This means the `--oracle` flag won't actually work until keys are re-populated — either by re-claiming or manually pasting. The feature is wired up but not immediately usable.

**Friction 3: The `/claim` skill now runs a `bun -e` inline script.** This is more correct (uses the library, gets encryption for free) but it's also more fragile — it depends on the CWD being the oracle-universe-api directory, and on bun being available. The previous bash `cat` heredoc was simpler and more portable. Trade-off worth noting.

## Lessons Learned

- Always test encryption tools interactively before writing automation — `age -e -p` vs `age -e -r` is the difference between broken and working
- `execFileSync` with `input` option is safer than shell `echo` for passing secrets — no shell interpolation, no injection risk
- Saving both plaintext and encrypted is a valid pattern when the file is already permission-restricted

## Next Steps

- Re-claim oracles or manually populate `bot_key` fields in `~/.oracle-net/oracles/*.json`
- Test `bun oracle-post.ts --oracle "The Resonance Oracle"` end-to-end with a real key
- Consider adding `oracle-config list` CLI subcommand for quick inventory
- Update MEMORY.md bot wallet (was stale: `0x00598a...` → now `0x625cc0...`)
