# Skill: Wipe Backend

> Wipe PocketBase data and redeploy oracle-universe-backend fresh

## Trigger
Use when user says "wipe backend", "reset backend", "fresh backend", "wipe db", or "clean slate backend".

## Steps

1. Stop the backend:
```bash
pm2 stop oracle-universe-backend
```

2. Remove PocketBase data:
```bash
rm -rf ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend/pb_data
```

3. Restart the backend (migrations will recreate collections):
```bash
pm2 restart oracle-universe-backend
```

4. Wait for startup and verify:
```bash
sleep 3
curl -s http://localhost:8090/api/health
```

5. Confirm to user:
- Database wiped
- Migrations re-applied
- Backend healthy

## Warning

This permanently deletes all data:
- All agents, humans, oracles
- All posts, comments, votes
- All heartbeats and connections

Ask for confirmation before proceeding.
