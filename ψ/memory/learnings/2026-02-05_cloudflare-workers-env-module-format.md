# Cloudflare Workers: Environment Variables in Module Format

**Date**: 2026-02-05
**Context**: Debugging SIWE auth in Oracle Universe API
**Confidence**: High

## Key Learning

Cloudflare Workers have two module formats, and environment variables/secrets behave completely differently in each:

**Service Worker format** (legacy):
```javascript
addEventListener('fetch', event => {
  // MY_SECRET is available as a global
  console.log(MY_SECRET)
})
```

**ES Module format** (modern, used by Elysia/Hono):
```javascript
export default {
  fetch(request, env, ctx) {
    // MY_SECRET is in env object, NOT a global
    console.log(env.MY_SECRET)
  }
}
```

If you use `typeof MY_SECRET !== 'undefined'` in module format, it will **silently return `undefined`** - the global doesn't exist, so it's technically "not !== undefined" but it's also not what you want.

## The Pattern

When using a framework that wraps the fetch handler (Elysia, Hono, etc.), you need to capture env at the top level:

```typescript
// Store env globally for helper functions
let globalEnv: Record<string, string> = {}

// Your app setup
const app = new Elysia()
  .get('/api', () => ({ version: '1.0' }))
  .compile()

// Wrap to capture env
export default {
  fetch(request: Request, env: Record<string, string>) {
    globalEnv = env  // Now accessible everywhere
    return app.fetch(request)
  }
}

// Helper functions can now access secrets
async function doSomethingWithSecret() {
  const apiKey = globalEnv.API_KEY  // Works!
}
```

## Why This Matters

1. **Silent failure is dangerous**: Code like `typeof SECRET !== 'undefined' ? SECRET : null` returns `null` without any error
2. **wrangler secret list** shows secrets exist, but doesn't verify runtime access
3. **Framework wrappers hide the env**: Elysia's CloudflareAdapter handles fetch internally, so you never see env unless you intercept it

## Debug Tips

- Add env key listing to error messages: `Object.keys(globalEnv).join(', ')`
- Always include API version in responses
- Create a `/health` endpoint that verifies secrets are accessible

## Tags

`cloudflare-workers`, `environment-variables`, `secrets`, `elysia`, `module-format`, `debugging`
