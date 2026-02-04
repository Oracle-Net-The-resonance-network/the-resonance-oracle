# Always Check doctl Logs Immediately After Deployment

**Date**: 2026-02-04
**Context**: DigitalOcean App Platform deployment debugging
**Confidence**: High

## Key Learning

When deploying to DigitalOcean App Platform, always run `doctl apps logs --type build --follow` immediately after triggering a deployment. Don't wait for the deployment status to show ERROR - the logs stream in real-time and show issues as they happen.

The build logs reveal:
- Dockerfile parsing errors
- Dependency installation failures
- Go/Node version mismatches
- Missing files or configurations

## The Pattern

```bash
# Trigger deployment
doctl apps create-deployment $APP_ID

# IMMEDIATELY watch logs (don't wait!)
doctl apps logs $APP_ID --type build --follow --tail 20

# If build succeeds, check runtime logs
doctl apps logs $APP_ID --type run --follow

# Check deployment status
doctl apps list-deployments $APP_ID --format ID,Phase,Progress
```

## Why This Matters

Waiting for deployment status wastes time. A failed build can take minutes to show ERROR status, but the actual error appears in logs within seconds. By watching logs immediately, you can:

1. See errors as they happen
2. Start fixing before the deploy pipeline finishes
3. Understand the root cause, not just "build failed"

Example: We discovered Go version mismatch (`go >= 1.24.0 required`) in the logs immediately, but would have waited minutes for the ERROR status otherwise.

## Also Learned

- `GOTOOLCHAIN=auto` in Dockerfile lets Go download newer versions when go.mod requires them
- Skills use folder structure: `.claude/skills/name/SKILL.md`, not flat `.claude/skills/name.md`
- Always check `go.mod` before writing a Go Dockerfile - the required version is specified there

## Tags

`doctl`, `digitalocean`, `deployment`, `debugging`, `logs`, `ci-cd`, `go`, `dockerfile`
