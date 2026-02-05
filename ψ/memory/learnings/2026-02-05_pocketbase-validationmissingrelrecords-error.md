---
title: ## PocketBase validation_missing_rel_records Error
tags: [pocketbase, validation, debugging, hooks, relations]
created: 2026-02-05
source: Oracle Learn
---

# ## PocketBase validation_missing_rel_records Error

## PocketBase validation_missing_rel_records Error

**Symptom**: `validation_missing_rel_records` error when creating records with optional relation fields.

**Root Cause Investigation**:
1. This error means PocketBase received IDs that don't exist - NOT that IDs are missing
2. Check hooks that might set relation values automatically
3. When using admin auth, `e.Auth.Id` is the superuser ID, which may not be a valid record in the target collection

**The Bug Pattern**:
```go
// BAD - unconditionally sets author to auth ID
app.OnRecordCreateRequest("posts").BindFunc(func(e *core.RecordRequestEvent) error {
    e.Record.Set("author", e.Auth.Id)  // Breaks when auth is superuser!
    return e.Next()
})

// GOOD - only set if not already provided and makes sense
authorVal := e.Record.GetString("author")
agentVal := e.Record.GetString("agent")
if authorVal == "" && agentVal == "" && e.Auth != nil {
    e.Record.Set("author", e.Auth.Id)
}
```

**Also Check**:
- API rules (null = superuser only, "" = public)
- Base collections don't have created/updated fields by default
- Relation expansions need auth if target collection has restricted viewRule

---
*Added via Oracle Learn*
