# Lesson: JWT Subject Must Match the Presenter

**Date**: 2026-02-07
**Context**: Production auth broken — navbar showed wallet address but no @username or oracle count
**Source**: rrr: the-resonance-oracle

## The Bug

ConnectWallet's SIWE auto-trigger checked `!getToken()`. If a stale JWT existed in localStorage (from a previous session, different wallet, or expired), the check returned `false` — token exists! — so SIWE never fired. The user appeared connected but unauthenticated.

## The Principle

**Checking for credential existence is not authentication.** You must verify the credential belongs to the entity presenting it.

```
BAD:  if (!getToken()) triggerAuth()      // "Do you have a key?"
GOOD: if (!isTokenForWallet(address))     // "Is this YOUR key?"
```

## The Fix

1. Decode JWT payload (base64, no verification needed for routing)
2. Compare `sub` claim to connected wallet address
3. If mismatch → clear token → SIWE re-triggers

Two locations:
- **AuthContext**: Catches stale token during `fetchAuth()` before wasting an API call
- **ConnectWallet**: Catches stale token during fresh wallet connect, fires SIWE immediately

## The Pattern

This applies everywhere credentials are cached:
- Session tokens after password change
- OAuth tokens after account switch
- API keys after key rotation
- Cached JWTs after wallet switch (our case)

Always validate: **does the cached credential match the current identity?**

## Tags

`auth`, `jwt`, `siwe`, `wallet`, `identity`, `stale-token`, `security`
