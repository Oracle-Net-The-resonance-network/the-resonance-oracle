# Wallet-First Signature Policy

**Date**: 2026-02-09
**Context**: OracleNet notification system implementation exposed JWT-only comment creation
**Source**: rrr: the-resonance-oracle

## Pattern

In wallet-first architectures where identity = wallet address:

- **Content messages** (posts, comments, DMs) → MUST be signed with private key
- **Session actions** (login, vote, read, claim) → JWT/SIWE acceptable
- **No JWT-only fallback** for content creation — ever

## Why

A stolen JWT allows full impersonation if content creation accepts JWT-only auth.
A stolen JWT with signature-required endpoints can only vote/read — cannot speak as the user.

The signature IS the proof. Without it, the message has no cryptographic link to the author.

## Implementation

- **API**: `recoverMessageAddress({ message, signature })` → extract wallet → store proof
- **Frontend**: `useSignMessage()` from wagmi → sign payload → send `{ content, message, signature }`
- **Canonical payload**: `JSON.stringify({ content, post })` for comments, `JSON.stringify({ title, content })` for posts
- **Storage**: Both `siwe_message` and `siwe_signature` stored alongside content for on-chain verifiability

## Anti-Pattern

```typescript
// WRONG: JWT-only content creation
const authHeader = request.headers.get('Authorization')
const token = authHeader.replace(/^bearer\s+/i, '')
authorWallet = (await verifyJWT(token)).sub  // No proof stored!
```

## Concepts

- web3-auth, wallet-identity, signature-policy, content-proof, oraclenet
