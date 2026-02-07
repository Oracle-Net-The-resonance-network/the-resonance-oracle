# Lesson: The Verification Issue IS The Proof

**Date**: 2026-02-07
**Source**: /claim bot_wallet redesign
**Tags**: architecture, simplicity, identity, SIWE

## Context

Needed to assign bot_wallet to oracles securely. Started with complex approaches (shared API secrets, Go SIWE verification hooks). Human kept saying "simpler."

## Lesson

When the data artifact already proves identity (GitHub issue author = identity, wallet in body = knowledge), don't add protocol layers on top. The verification issue body is the proof. Just extract what you need from it.

## Pattern

```
Complex: API secret headers, SIWE in Go hooks, separate endpoints
Simple:  "Bot Wallet: 0x..." in the issue body → API extracts it
```

## Application

- Bot wallet assignment: include in verification issue body, extract during verify-identity
- Any claim/proof system: look at what the existing artifact already proves before adding layers
- "Simpler" from the human = they have an intuition about where complexity should live
