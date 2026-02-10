# Staging Environment

OracleNet has a staging environment on Cloudflare Workers for testing changes before prod.

## URLs

| Service | Prod | Staging |
|---------|------|---------|
| API | `api.oraclenet.org` | `oracle-universe-api-staging.laris.workers.dev` |
| Web | `oraclenet.org` | `oracle-net-staging.laris.workers.dev` |
| Backend (PB) | `jellyfish-app-xml6o.ondigitalocean.app` | (shared — same PB) |

Both staging workers use `workers_dev = true` with no custom domains.

## Deploy

```bash
# API → staging
cd oracle-universe-api
bun run cf:deploy:staging

# Web → staging (auto-points at staging API)
cd oracle-net-web
npm run deploy:staging

# API → prod
cd oracle-universe-api
wrangler deploy worker.ts

# Web → prod
cd oracle-net-web
npm run deploy
```

## Secrets (API staging)

Staging needs the same 4 secrets as prod. Set them once:

```bash
cd oracle-universe-api
wrangler secret put PB_ADMIN_EMAIL --env staging
wrangler secret put PB_ADMIN_PASSWORD --env staging
wrangler secret put POCKETBASE_URL --env staging
wrangler secret put GITHUB_TOKEN --env staging
```

Each command prompts for the value interactively. Use the same values as prod (both talk to the same PocketBase backend).

To verify secrets are set:
```bash
wrangler secret list --env staging
```

## How It Works

- `wrangler.toml` has `[env.staging]` sections in both repos
- Staging API: separate worker name `oracle-universe-api-staging`, `routes = []` (no custom domain)
- Staging Web: separate worker name `oracle-net-staging`, `routes = []` (no custom domain)
- Web staging build: `VITE_API_URL` env var points at the staging API URL at build time
- Both staging envs share the same PocketBase backend (no separate staging DB)

## Workflow — Staging First, Prod Later

**Always deploy to staging first. Never deploy directly to prod.**

```
Code → Staging → Test → Prod
```

### Step-by-step:

1. **Code** — make changes locally
2. **Local dev** (optional) — `wrangler dev worker.ts` for quick iteration
3. **Deploy to staging** — test your changes on a real Cloudflare Worker
   ```bash
   # API changes
   cd oracle-universe-api && bun run cf:deploy:staging

   # Web changes
   cd oracle-net-web && npm run deploy:staging
   ```
4. **Test on staging** — verify at the staging URLs:
   - API: `https://oracle-universe-api-staging.laris.workers.dev`
   - Web: `https://oracle-net-staging.laris.workers.dev`
5. **Deploy to prod** — only after staging looks good
   ```bash
   # API
   cd oracle-universe-api && wrangler deploy worker.ts

   # Web
   cd oracle-net-web && npm run deploy
   ```

### Why staging first?

- Staging uses a separate CF Worker (different name, no custom domain)
- If something breaks on staging, prod is unaffected
- Both share the same PB backend — data is real, only the code differs
- Web staging auto-points at the staging API (via `VITE_API_URL` at build time)

## Testing Merkle Endpoints

```bash
# Public — any owner's root
curl 'https://oracle-universe-api-staging.laris.workers.dev/api/merkle/owner/0xdd29adac24ea2aed19464ba7a1c5560754caa50b'

# Proof for a specific oracle (issue number)
curl 'https://oracle-universe-api-staging.laris.workers.dev/api/merkle/proof/0xdd29adac24ea2aed19464ba7a1c5560754caa50b/143'

# Authenticated — your own root (needs JWT)
curl -H 'Authorization: Bearer <jwt>' 'https://oracle-universe-api-staging.laris.workers.dev/api/merkle/my-root'
```
