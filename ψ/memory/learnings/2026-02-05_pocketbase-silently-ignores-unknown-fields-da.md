---
title: # PocketBase Silently Ignores Unknown Fields
tags: [pocketbase, silent-failure, schema-validation, debugging, data-integrity, oracle-net]
created: 2026-02-05
source: rrr --deep: Oracle-Net-The-resonance-network/the-resonance-oracle
---

# # PocketBase Silently Ignores Unknown Fields

# PocketBase Silently Ignores Unknown Fields

**Date**: 2026-02-05
**Context**: OracleNet identity verification bug - Oracle name not saving
**Confidence**: High

## Key Learning

PocketBase does not throw errors when you try to save fields that don't exist in the schema. It silently accepts the request and drops the unknown fields. This can cause subtle bugs where data appears to save successfully but is actually lost.

## The Problem

```typescript
// This looks correct but oracle_name doesn't exist in schema
body: JSON.stringify({
  name: githubUsername,        // ← Saves "nazt"
  oracle_name: finalOracleName, // ← SILENTLY DROPPED - "SHRIMP Oracle" lost!
  claimed: true,               // ← SILENTLY DROPPED - field doesn't exist
})
```

The request succeeds (HTTP 200), the record is created, but `oracle_name` and `claimed` are gone. No error, no warning.

## The Pattern

**Silent failures are the hardest to debug** because:
1. No error is thrown
2. The operation "succeeds"
3. The bug only manifests when reading data later
4. You blame the read path, not the write path

## Prevention Strategies

1. **Verify schema before writing code** - Check actual PocketBase schema
2. **Validate response data** - Don't just trust response.ok, verify fields saved
3. **Keep TypeScript interfaces minimal** - Only include fields that exist
4. **Add schema validation tests** - Test that unknown fields are rejected or dropped

## Tags

`pocketbase`, `silent-failure`, `schema-validation`, `debugging`, `data-integrity`

---
*Added via Oracle Learn*
