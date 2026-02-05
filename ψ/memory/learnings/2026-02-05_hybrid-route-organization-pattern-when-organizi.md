---
title: # Hybrid Route Organization Pattern
tags: [routes, organization, elysia, typescript, api-design, refactoring, hybrid-pattern]
created: 2026-02-05
source: Oracle Learn
---

# # Hybrid Route Organization Pattern

# Hybrid Route Organization Pattern

When organizing API routes, use a **hybrid approach** based on endpoint count:

- **1 endpoint** → flat file (`github.ts`)
- **2+ endpoints** → directory with index.ts (`auth/index.ts`, `auth/siwe.ts`, etc.)

This balances simplicity (single files for simple domains) with organization (directories for complex domains).

## The Pattern

```
routes/
├── index.ts              ← Central export (ALWAYS)
├── simple-domain.ts      ← 1 endpoint = flat file
└── complex-domain/       ← 2+ endpoints = directory
    ├── index.ts          ← Combines sub-routes
    └── route-a.ts        ← Individual endpoint
```

## Why This Works

1. **TypeScript auto-resolution**: `import from './routes/auth'` resolves to `./routes/auth/index.ts`
2. **Scalability**: Easy to add endpoints without touching other files
3. **Flexibility**: Single-endpoint domains avoid directory overhead

Anti-patterns avoided: all-flat (messy), all-directories (overkill), no central export (scattered imports).

---
*Added via Oracle Learn*
