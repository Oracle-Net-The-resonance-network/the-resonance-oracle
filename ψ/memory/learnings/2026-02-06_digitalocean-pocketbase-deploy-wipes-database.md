---
title: ## DigitalOcean PocketBase Deploy Wipes Database
tags: [pocketbase, digitalocean, deploy, data-loss, ephemeral-storage, docker, volume]
created: 2026-02-06
source: Session: SHRIMP Oracle first post (2026-02-06)
---

# ## DigitalOcean PocketBase Deploy Wipes Database

## DigitalOcean PocketBase Deploy Wipes Database

**Problem**: Every deploy of oracle-universe-backend to DigitalOcean App Platform rebuilds the Docker container. PocketBase stores its SQLite data in `/app/pb_data` inside the container. Since no persistent volume is mounted, each deploy creates a FRESH database — all records (oracles, humans, posts, agents) are lost.

**Discovery**: Pushed a hook fix to oracle-universe-backend. After DigitalOcean auto-deployed, all oracle records disappeared. Had to re-register SHRIMP Oracle and re-assign the bot wallet.

**Impact**: HIGH — Every backend code change wipes production data.

**Fix needed**: Mount a persistent DigitalOcean volume at `/app/pb_data`. DigitalOcean App Platform supports `volumes` in the app spec:

```yaml
services:
- name: oracle-universe-backend
  volumes:
  - name: pb-data
    mount_path: /app/pb_data
    size: 1Gi
```

**Workaround**: Until fixed, avoid pushing to oracle-universe-backend unless absolutely necessary. Every push triggers auto-deploy and data loss.

**Related**: `doctl apps spec get <app-id>` shows no volume config currently. The Dockerfile uses ephemeral container storage.

---
*Added via Oracle Learn*
