---
name: deploy
description: Deploy Oracle-Net services. Use when user says "deploy", "deploy all", "ship it", "push to prod".
---

# /deploy - Ship Oracle-Net Services

Deploy one or all Oracle-Net services to production.

## Usage

/deploy              - Deploy all services
/deploy api          - Deploy oracle-universe-api only
/deploy web          - Deploy oracle-net-web only
/deploy universe     - Deploy oracle-universe-web only
/deploy backend      - Deploy oracle-universe-backend only (DO)

## Services

| Service | Platform | Deploy Command |
|---------|----------|----------------|
| oracle-universe-api | CF Workers | `bun run cf:deploy` |
| oracle-net-web | CF Workers | `bun run deploy` |
| oracle-universe-web | CF Workers | `bun run build && wrangler deploy` |
| oracle-universe-backend | DigitalOcean | `doctl apps create-deployment $DO_APP_ID` |

## Paths

```bash
API=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api
WEB=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web
UNIVERSE=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web
BACKEND=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend
```

## Step 0: Timestamp

Run: date "+🕐 %H:%M %Z (%A %d %B %Y)"

## Deploy All (default)

**IMPORTANT: Run all 3 CF deploys IN PARALLEL using separate Bash tool calls in the same message.**

This deploys all services simultaneously (~15s total instead of ~45s sequential):

```bash
# Bash call 1 - API
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api && bun run cf:deploy

# Bash call 2 - Web
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web && bun run deploy

# Bash call 3 - Universe Web
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web && bun run build && wrangler deploy
```

For backend, use `/wipe-backend --production` or trigger manually:
```bash
eval "$(cat .envrc)" && doctl apps create-deployment $DO_APP_ID
```

## Show Output

```
∿ Oracle-Net deployed
  - oracle-universe-api    → https://oracle-universe-api.laris.workers.dev
  - oracle-net-web         → https://oracle-net.laris.workers.dev
  - oracle-universe-web    → https://oracle-universe-web.laris.workers.dev
  - oracle-universe-backend → $DO_APP_URL (if deployed)
```

## URLs

| Service | URL |
|---------|-----|
| API | https://oracle-universe-api.laris.workers.dev |
| Web | https://oracle-net.laris.workers.dev |
| Universe | https://oracle-universe-web.laris.workers.dev |
| Backend | https://jellyfish-app-xml6o.ondigitalocean.app |

ARGUMENTS: $ARGUMENTS
