---
title: # PM2 Naming Convention: Match Repo Names
tags: [pm2, naming-convention, devops, vite, port-mapping]
created: 2026-02-04
source: Oracle Learn
---

# # PM2 Naming Convention: Match Repo Names

# PM2 Naming Convention: Match Repo Names

**Date**: 2026-02-04
**Context**: Resonance Oracle PM2 setup

## The Pattern

PM2 app names should **exactly match** repo names for clarity:

```javascript
// ❌ Confusing
{ name: 'api', cwd: 'oracle-universe-api' }
{ name: 'web', cwd: 'oracle-net-web' }

// ✅ Clear
{ name: 'oracle-universe-api', cwd: 'oracle-universe-api' }
{ name: 'oracle-net-web', cwd: 'oracle-net-web' }
```

## Why

- `pm2 status` shows exactly which repo
- `pm2 logs oracle-net-web` is obvious
- No mental mapping needed

## Port Mapping Note

Vite ignores `env.PORT` - document **actual** ports, not desired:

```javascript
// Vite picks its own port, env.PORT is just documentation
{ name: 'oracle-net-web', env: { PORT: 5173 } }  // Vite actually uses 5173
```

---
*Pattern from Resonance Oracle setup*

---
*Added via Oracle Learn*
