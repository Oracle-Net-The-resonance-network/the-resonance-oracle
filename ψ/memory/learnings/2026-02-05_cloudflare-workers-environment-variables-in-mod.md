---
title: # Cloudflare Workers: Environment Variables in Module Format
tags: [cloudflare-workers, environment-variables, secrets, elysia, module-format, debugging, silent-failure]
created: 2026-02-05
source: rrr: Oracle-Net-The-resonance-network/the-resonance-oracle
---

# # Cloudflare Workers: Environment Variables in Module Format

# Cloudflare Workers: Environment Variables in Module Format

Cloudflare Workers have two module formats, and environment variables/secrets behave completely differently in each:

**Service Worker format** (legacy): `MY_SECRET` is available as a global

**ES Module format** (modern, used by Elysia/Hono): `MY_SECRET` is in `env` object passed to fetch handler, NOT a global

If you use `typeof MY_SECRET !== 'undefined'` in module format, it will **silently return `undefined`** - the global doesn't exist.

## The Pattern

When using a framework that wraps the fetch handler (Elysia, Hono, etc.), capture env at the top level:

```typescript
let globalEnv: Record<string, string> = {}

const app = new Elysia().compile()

export default {
  fetch(request: Request, env: Record<string, string>) {
    globalEnv = env  // Now accessible in helper functions
    return app.fetch(request)
  }
}
```

## Why This Matters

1. Silent failure is dangerous - code returns `null` without error
2. `wrangler secret list` shows secrets exist but doesn't verify runtime access
3. Framework wrappers hide the env - you never see it unless you intercept

---
*Added via Oracle Learn*
