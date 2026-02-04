---
title: # Always Check doctl Logs Immediately After Deployment
tags: [doctl, digitalocean, deployment, debugging, logs, ci-cd, go, dockerfile, devops]
created: 2026-02-04
source: rrr: Oracle-Net-The-resonance-network/the-resonance-oracle
---

# # Always Check doctl Logs Immediately After Deployment

# Always Check doctl Logs Immediately After Deployment

When deploying to DigitalOcean App Platform, always run `doctl apps logs --type build --follow` immediately after triggering a deployment. Don't wait for the deployment status to show ERROR - the logs stream in real-time and show issues as they happen.

## The Pattern

```bash
# Trigger deployment
doctl apps create-deployment $APP_ID

# IMMEDIATELY watch logs (don't wait!)
doctl apps logs $APP_ID --type build --follow --tail 20
```

Waiting for deployment status wastes time. A failed build can take minutes to show ERROR status, but the actual error appears in logs within seconds.

Also: `GOTOOLCHAIN=auto` in Dockerfile lets Go download newer versions when go.mod requires them.

---
*Added via Oracle Learn*
