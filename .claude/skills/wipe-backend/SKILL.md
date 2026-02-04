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

## Environment (via direnv)

All config is in `.envrc` (gitignored). Run `direnv allow` after cd into repo.

```bash
# .envrc contains:
export DO_APP_ID="..."
export DO_APP_NAME="..."
export DO_APP_URL="..."
export PB_ADMIN_EMAIL="..."
export PB_ADMIN_PASSWORD="..."
```

Use `$DO_APP_ID`, `$PB_ADMIN_PASSWORD`, etc. in commands below.

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
  cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend && go run main.go superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD"

Show output:
  ∿ Backend wiped and restarted
    - pb_data/ removed
    - Migrations re-applied
    - Admin created: $PB_ADMIN_EMAIL
    - Health: API is healthy
    - Admin UI: http://localhost:8090/_/

## PRODUCTION WIPE (--production flag)

Step 2: Trigger deployment - Run: doctl apps create-deployment $DO_APP_ID

Step 3: IMMEDIATELY watch build logs - Run: doctl apps logs $DO_APP_ID --type build --follow --tail 20

Step 4: Check status - Run: doctl apps list-deployments $DO_APP_ID --format ID,Phase,Progress | head -3

Step 5: When deployed, get app URL - Run: doctl apps get $DO_APP_ID --format DefaultIngress

Step 6: Verify health - Run: curl -s $DO_APP_URL/api/health

Step 7: Create admin via tmux (allows Claude to run commands in DO console):

```bash
# Start tmux session with DO console
tmux new-session -d -s do-console "doctl apps console $DO_APP_ID oracle-universe-backend"

# Wait for console to connect
sleep 5

# Send superuser command (uses $PB_ADMIN_PASSWORD from direnv)
tmux send-keys -t do-console "./oracle-universe superuser upsert $PB_ADMIN_EMAIL \"$PB_ADMIN_PASSWORD\"" Enter

# Wait for command to complete
sleep 3

# Capture output
tmux capture-pane -t do-console -p

# Kill session
tmux kill-session -t do-console
```

Show output:
  ∿ Production backend wiped
    - Deployment complete
    - Admin created: $PB_ADMIN_EMAIL
    - Health: API is healthy
    - Admin UI: $DO_APP_URL/_/

## Troubleshooting

Build logs: doctl apps logs $DO_APP_ID --type build | tail -50
Runtime logs: doctl apps logs $DO_APP_ID --type run | tail -50
Deploy logs: doctl apps logs $DO_APP_ID --type deploy | tail -50

## Credentials

Local: oracle-universe-backend/.env (gitignored)
Production: DO App env vars
All config via `.envrc` + `direnv allow`

ARGUMENTS: $ARGUMENTS
