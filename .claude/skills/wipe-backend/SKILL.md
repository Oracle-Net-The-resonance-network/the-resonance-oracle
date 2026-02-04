---
name: wipe-backend
description: Wipe PocketBase data and redeploy fresh. Use when user says "wipe backend", "reset backend", "fresh backend", "wipe db", or "clean slate".
---

# /wipe-backend - Fresh Backend Deploy

Wipe oracle-universe-backend PocketBase data and restart with clean database.

## Usage

/wipe-backend              - Local wipe (interactive)
/wipe-backend --force      - Local wipe (skip confirmation)
/wipe-backend --production - Wipe production (DigitalOcean)

## Constants

DO_APP_ID: eac57124-4b03-4ba6-b169-724c5783ddb7
DO_APP_NAME: jellyfish-app

## Step 0: Timestamp

Run: date "+🕐 %H:%M %Z (%A %d %B %Y)"

## Step 1: Confirmation

Unless --force flag provided, ask user to confirm:

WARNING: This will permanently delete ALL backend data:
- All agents, humans, oracles
- All posts, comments, votes
- All heartbeats and connections

Type "yes" to proceed.

## LOCAL WIPE (default)

Step 2: Run: pm2 stop oracle-universe-backend

Step 3: Run: rm -rf ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend/pb_data

Step 4: Run: pm2 restart oracle-universe-backend

Step 5: Run: sleep 3 && curl -s http://localhost:8090/api/health

Step 6: Create admin - run:
  cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend && go run main.go superuser upsert "admin@oraclenet.dev" "wWaMYE8Uw71Hqlr5KDOx"

Show output:
  ∿ Backend wiped and restarted
    - pb_data/ removed
    - Migrations re-applied
    - Admin created: admin@oraclenet.dev
    - Health: API is healthy
    - Admin UI: http://localhost:8090/_/

## PRODUCTION WIPE (--production flag)

Step 2: Trigger deployment - Run: doctl apps create-deployment eac57124-4b03-4ba6-b169-724c5783ddb7

Step 3: IMMEDIATELY watch build logs - Run: doctl apps logs eac57124-4b03-4ba6-b169-724c5783ddb7 --type build --follow --tail 20

Step 4: Check status - Run: doctl apps list-deployments eac57124-4b03-4ba6-b169-724c5783ddb7 --format ID,Phase,Progress | head -3

Step 5: When deployed, get app URL - Run: doctl apps get eac57124-4b03-4ba6-b169-724c5783ddb7 --format DefaultIngress

Step 6: Verify health - Run: curl -s [URL]/api/health

Show output:
  ∿ Production backend redeploying
    - Deployment triggered
    - Admin: admin@oraclenet.dev

## Troubleshooting

Build logs: doctl apps logs eac57124-4b03-4ba6-b169-724c5783ddb7 --type build | tail -50
Runtime logs: doctl apps logs eac57124-4b03-4ba6-b169-724c5783ddb7 --type run | tail -50
Deploy logs: doctl apps logs eac57124-4b03-4ba6-b169-724c5783ddb7 --type deploy | tail -50

## Credentials

Local: oracle-universe-backend/.env (gitignored)
Production: DO App env vars
PB_ADMIN_EMAIL=admin@oraclenet.dev

ARGUMENTS: $ARGUMENTS
