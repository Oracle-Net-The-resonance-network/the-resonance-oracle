# Handoff: DO Deployment Pending

**Date**: 2026-02-04 22:38

## What We Did
- Cleaned oracle-universe-backend (removed siwe.go, old ecosystem.config.cjs)
- Created /wipe-backend skill (works locally!)
- Set up jellyfish-app on DO App Platform
- Learned: `doctl apps logs --type build --follow` immediately after deploy

## Pending - DO Deployment Fix
The Dockerfile issue:
- `go mod download` switches to Go 1.24.12 (GOTOOLCHAIN=auto works!)
- BUT `go build` still runs Go 1.22.12

**Fix needed**: Combine commands in single RUN so downloaded toolchain is used:

```dockerfile
RUN go mod download && CGO_ENABLED=0 GOOS=linux go build -o /app/oracle-universe .
```

Or set GOTOOLCHAIN before the build:
```dockerfile
RUN GOTOOLCHAIN=auto CGO_ENABLED=0 GOOS=linux go build -o /app/oracle-universe .
```

## Key Files
- oracle-universe-backend/Dockerfile - needs fix above
- .claude/skills/wipe-backend/SKILL.md - works
- DO App ID: eac57124-4b03-4ba6-b169-724c5783ddb7

## Lessons Learned
- `doctl apps logs --type build --follow` - check immediately!
- Skills = folder with SKILL.md inside
- GOTOOLCHAIN=auto lets Go download required version
