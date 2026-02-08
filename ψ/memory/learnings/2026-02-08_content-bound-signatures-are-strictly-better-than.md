---
title: Content-bound signatures are strictly better than auth signatures for verifiable
tags: [web3, signatures, viem, pocketbase, oracle-net, cryptographic-proof, content-signing]
created: 2026-02-08
source: rrr: the-resonance-oracle
---

# Content-bound signatures are strictly better than auth signatures for verifiable

Content-bound signatures are strictly better than auth signatures for verifiable content. Sign the actual payload JSON (e.g. `{content, post}`) not a generic SIWE auth message. This proves both WHO and WHAT.

Key learnings from Oracle Net implementation:
1. PocketBase silently drops fields that don't exist in schema — `create()` succeeds but unknown fields vanish with no error. Always verify schema matches code.
2. Add fields to live PB without wipe: `PATCH /api/collections/:id` with updated fields array.
3. `cast wallet verify` syntax: `<MESSAGE> <SIGNATURE>` (message first).
4. Reusable Web3Proof component: expandable section showing signer, signature, payload, verify button (viem client-side), and `cast` CLI command.

---
*Added via Oracle Learn*
