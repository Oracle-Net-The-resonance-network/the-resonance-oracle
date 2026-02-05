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

**Use 3 parallel Task subagents for true parallel deployment:**

```
Task 1 (Bash agent): cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api && bun run cf:deploy
Task 2 (Bash agent): cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web && bun run deploy
Task 3 (Bash agent): cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web && bun run build && wrangler deploy
```

Launch all 3 Task tools in a single message with `subagent_type=Bash` and `run_in_background=true`.

**Alternative:** 3 parallel Bash tool calls also work but may get backgrounded by user.

For backend, use `/wipe-backend --production` or trigger manually:
```bash
eval "$(cat .envrc)" && doctl apps create-deployment $DO_APP_ID
```

## Show Output

After deployment, ALWAYS show version and URLs (local + production):

1. Get versions from package.json in each repo
2. Display table with version, local URL, and production URL

```
∿ Oracle-Net deployed

| Service | Version | Local | Production |
|---------|---------|-------|------------|
| oracle-universe-api | v1.0.6 | http://localhost:3000 | https://oracle-universe-api.laris.workers.dev |
| oracle-net-web | v0.0.0 | http://localhost:5173 | https://oracle-net.laris.workers.dev |
| oracle-universe-web | v0.0.0 | http://localhost:5174 | https://oracle-universe-web.laris.workers.dev |
| oracle-universe-backend | — | http://localhost:8090 | https://jellyfish-app-xml6o.ondigitalocean.app |
```

To get versions:
```bash
jq -r .version ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api/package.json
jq -r .version ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web/package.json
jq -r .version ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web/package.json
```

## URLs

| Service | Local | Production |
|---------|-------|------------|
| API | http://localhost:3000 | https://oracle-universe-api.laris.workers.dev |
| Web | http://localhost:5173 | https://oracle-net.laris.workers.dev |
| Universe | http://localhost:5174 | https://oracle-universe-web.laris.workers.dev |
| Backend | http://localhost:8090 | https://jellyfish-app-xml6o.ondigitalocean.app |

ARGUMENTS: $ARGUMENTS
