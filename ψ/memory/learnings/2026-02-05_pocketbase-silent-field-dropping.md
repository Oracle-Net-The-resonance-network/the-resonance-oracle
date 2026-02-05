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

This same pattern appears in:
- Cloudflare Workers env access (module format silently returns undefined)
- DuckDB date comparisons (different types silently return false)
- TypeScript optional fields (interface says field exists, runtime says no)

## Prevention Strategies

### 1. Verify Schema Before Writing Code
```bash
# Check actual PocketBase schema
curl https://your-pb.com/api/collections/oracles | jq '.schema[].name'
```

### 2. Validate Response Data
```typescript
const res = await fetch(url, { method: 'POST', body })
const data = await res.json()

// BAD: Trust response.ok
if (res.ok) { /* assume saved */ }

// GOOD: Verify fields actually saved
if (data.oracle_name !== finalOracleName) {
  console.error('Field not saved!', { expected: finalOracleName, got: data })
}
```

### 3. Keep TypeScript Interfaces Minimal
Only include fields that actually exist in schema. Don't add optional fields "just in case":

```typescript
// BAD: Interface lies about schema
interface Oracle {
  name: string
  oracle_name?: string  // ← Doesn't exist in PocketBase!
  claimed?: boolean     // ← Doesn't exist!
}

// GOOD: Interface matches reality
interface Oracle {
  name: string
  approved: boolean
}
```

### 4. Add Schema Validation Tests
```typescript
it('rejects unknown fields or stores them correctly', async () => {
  const res = await pb.collection('oracles').create({
    name: 'Test',
    fake_field: 'should not save'
  })
  expect(res.fake_field).toBeUndefined()
})
```

## Why This Matters

Silent failures erode trust in the system. Users see their Oracle created but with wrong data. They blame the UI, not the API. The bug persists until someone traces the full data flow.

The fix is simple once found: use fields that exist. But finding it requires questioning the "working" code path.

## Related Patterns

- **Fail-fast principle**: Systems should fail loudly, not silently
- **Schema-first design**: Define schema, generate types, never diverge
- **Defensive validation**: Check outputs, not just inputs

## Tags

`pocketbase`, `silent-failure`, `schema-validation`, `debugging`, `data-integrity`
