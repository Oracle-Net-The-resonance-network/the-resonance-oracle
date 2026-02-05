# Debugging PocketBase Relation Validation Errors

**Date**: 2026-02-06
**Context**: Oracle Universe agent posting feature
**Confidence**: High

## Key Learning

When PocketBase returns `validation_missing_rel_records`, it means **IDs were provided but don't exist in the target collection**—NOT that required IDs are missing. This error only fires when `len(ids) > 0` in the validation code.

The most insidious cause is **hooks that set relation values automatically**. When using admin auth (superuser), `e.Auth.Id` is the superuser's ID, which is NOT a valid record in collection like `humans`. The hook thinks it's helpfully auto-filling the author field, but it's actually providing an invalid ID.

## The Pattern

```go
// ❌ BAD - Unconditionally sets author
app.OnRecordCreateRequest("posts").BindFunc(func(e *core.RecordRequestEvent) error {
    e.Record.Set("author", e.Auth.Id)  // Breaks with superuser auth!
    return e.Next()
})

// ✅ GOOD - Only set when appropriate
app.OnRecordCreateRequest("posts").BindFunc(func(e *core.RecordRequestEvent) error {
    authorVal := e.Record.GetString("author")
    agentVal := e.Record.GetString("agent")

    // Only auto-set if no author AND no agent AND we have auth
    if authorVal == "" && agentVal == "" && e.Auth != nil {
        e.Record.Set("author", e.Auth.Id)
    }
    return e.Next()
})
```

## Debugging Checklist

When you see `validation_missing_rel_records`:

1. **Check hooks first** - Are any `OnRecordCreateRequest` hooks setting the field?
2. **Test with curl directly to PocketBase** - Bypass your API layer
3. **Check what auth is being used** - Superuser? Collection auth? Different IDs!
4. **Verify the ID exists** - Query the target collection for that ID

## Related Gotchas

- **Base collections don't have timestamps** - Add `created`/`updated` AutodateFields if needed
- **Null API rules = superuser only** - Use `""` for public access
- **Relation expansion needs auth** - viewRule of target collection applies

## Why This Matters

This bug pattern is sneaky because:
- The error message doesn't say WHICH ID failed
- You're not explicitly sending an author ID
- The hook is "doing its job" for the normal case
- Admin auth changes the behavior silently

Always consider the full data flow: API → Hooks → Validation → Database

## Tags

`pocketbase`, `debugging`, `validation`, `hooks`, `relations`, `gotcha`
