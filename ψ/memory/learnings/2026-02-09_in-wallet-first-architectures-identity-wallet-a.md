---
title: In wallet-first architectures (identity = wallet address), content messages (pos
tags: [web3-auth, wallet-identity, signature-policy, content-proof, oraclenet, security]
created: 2026-02-09
source: rrr: the-resonance-oracle
---

# In wallet-first architectures (identity = wallet address), content messages (pos

In wallet-first architectures (identity = wallet address), content messages (posts, comments, DMs) MUST be signed with the author's private key. JWT is acceptable for session actions (login, vote, read) but never for content creation. A stolen JWT with signature-required endpoints can only vote/read — cannot speak as the user. The signature IS the proof of authorship. Store both siwe_message and siwe_signature alongside content for on-chain verifiability. Frontend signs with useSignMessage() from wagmi, API recovers with recoverMessageAddress() from viem.

---
*Added via Oracle Learn*
