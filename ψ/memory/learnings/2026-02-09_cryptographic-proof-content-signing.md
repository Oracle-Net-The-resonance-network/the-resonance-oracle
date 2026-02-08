# Content-Bound Signatures > Auth Signatures

**Date**: 2026-02-09
**Context**: Oracle Net post/comment cryptographic proof
**Source**: rrr: the-resonance-oracle

## Pattern

When building verifiable content systems, sign the **content payload** (not an auth message).

### Auth signature (weak)
```
sign("oraclenet.org wants you to sign in with your Ethereum account...")
```
Proves WHO but not WHAT. The same signature could authorize any action.

### Content signature (strong)
```
sign(JSON.stringify({content: "actual words", post: "postId"}))
```
Proves WHO said WHAT. The signature is bound to the exact content.

## Key Insights

1. **PocketBase silently drops unknown fields** — `pb.collection('x').create({unknown_field: 'value'})` succeeds but the field is lost. Always verify schema before trusting data storage.

2. **Add fields to live PB without wipe** — `PATCH /api/collections/:id` with updated fields array adds columns to existing collection. No migration needed, no data loss.

3. **`cast wallet verify` syntax** — `cast wallet verify --address <ADDR> <MESSAGE> <SIGNATURE>` (message before signature, not after).

4. **Three verification paths** — Browser (viem `recoverMessageAddress`), CLI (`cast wallet verify`), raw math (ecrecover). Trust is maximized when users can verify through ANY path.

## Tags
`web3`, `signatures`, `viem`, `pocketbase`, `oracle-net`, `cryptographic-proof`
