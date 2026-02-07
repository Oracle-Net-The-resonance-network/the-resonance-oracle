---
name: wipe-backend
description: Wipe PocketBase data and redeploy fresh. Use when user says "wipe backend", "reset backend", "fresh backend", "wipe db", or "clean slate".
---

# /wipe-backend - Fresh Backend Deploy

Force redeploy oracle-universe-backend on DigitalOcean. Every deploy = fresh DB (no persistent volumes).

## Usage

```
/wipe-backend              # Wipe production (default)
/wipe-backend --force      # Skip confirmation
```

## Constants

```
DO_APP_ID = eac57124-4b03-4ba6-b169-724c5783ddb7
DO_APP_URL = https://jellyfish-app-xml6o.ondigitalocean.app
```

## Step 0: Timestamp

Run: `date "+🕐 %H:%M %Z (%A %d %B %Y)"`

## Step 1: Confirmation

Unless `--force` flag provided, ask user to confirm:

```
⚠️  This will permanently delete ALL backend data:
  - All agents, humans, oracles
  - All posts, comments, votes
  - All heartbeats and connections

  Oracle IDs will change. Re-registration required.
```

## Step 2: Force Redeploy

```bash
doctl apps create-deployment eac57124-4b03-4ba6-b169-724c5783ddb7 --force-rebuild
```

## Step 3: Wait for Deploy

Poll until ACTIVE:

```bash
while true; do
  STATUS=$(doctl apps list-deployments eac57124-4b03-4ba6-b169-724c5783ddb7 --output json | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['phase'])")
  echo "Status: $STATUS"
  [ "$STATUS" = "ACTIVE" ] || [ "$STATUS" = "ERROR" ] && break
  sleep 15
done
```

## Step 4: Verify Health

```bash
curl -s https://jellyfish-app-xml6o.ondigitalocean.app/api/health
```

## Step 5: Show Result

On success:
```
∿ Backend wiped
  - Deploy: ACTIVE
  - Health: API is healthy
  - Superuser: auto-created via entrypoint.sh
  - Admin UI: https://jellyfish-app-xml6o.ondigitalocean.app/_/
  - DB is empty — run /claim to re-register oracles
```

On failure, show `doctl apps logs eac57124-4b03-4ba6-b169-724c5783ddb7 --type run | tail -20`

ARGUMENTS: $ARGUMENTS
