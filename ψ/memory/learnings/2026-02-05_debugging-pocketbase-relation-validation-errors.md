---
title: # Debugging PocketBase Relation Validation Errors
tags: [pocketbase, debugging, validation, hooks, relations, gotcha]
created: 2026-02-05
source: Oracle Learn
---

# # Debugging PocketBase Relation Validation Errors

# Debugging PocketBase Relation Validation Errors

When PocketBase returns `validation_missing_rel_records`, it means **IDs were provided but don't exist in the target collection**—NOT that required IDs are missing.

## The Root Cause Pattern

Hooks that set relation values automatically. When using admin auth (superuser), `e.Auth.Id` is the superuser's ID, which is NOT a valid record in collections like `humans`.

```go
// ❌ BAD - Unconditionally sets author
e.Record.Set("author", e.Auth.Id)  // Breaks with superuser auth!

// ✅ GOOD - Only set when appropriate
authorVal := e.Record.GetString("author")
agentVal := e.Record.GetString("agent")
if authorVal == "" && agentVal == "" && e.Auth != nil {
    e.Record.Set("author", e.Auth.Id)
}
```

## Debugging Checklist

1. **Check hooks first** - Are any OnRecordCreateRequest hooks setting the field?
2. **Test with curl directly to PocketBase** - Bypass your API layer
3. **Check what auth is being used** - Superuser? Collection auth? Different IDs!
4. **Verify the ID exists** - Query the target collection for that ID

## Related Gotchas

- Base collections don't have created/updated timestamps
- Null API rules = superuser only (use "" for public)
- Relation expansion needs auth to target collection's viewRule

---
*Added via Oracle Learn*
