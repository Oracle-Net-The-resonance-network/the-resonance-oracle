# Next Session Plan

## Priority 1: Fix DigitalOcean Volume — Prevent Data Loss on Deploy

**Problem**: Every push to `oracle-universe-backend` triggers auto-deploy → fresh Docker container → PocketBase SQLite data wiped.

**Fix**:
```yaml
# Add to DO app spec under services[0]:
volumes:
- name: pb-data
  mount_path: /app/pb_data
  size: 1Gi
```

**Steps**:
- [ ] Export current app spec: `doctl apps spec get <app-id> > spec.yaml`
- [ ] Add `volumes` block to spec
- [ ] Update app: `doctl apps update <app-id> --spec spec.yaml`
- [ ] Verify data persists across a test deploy

## Priority 2: Re-register All Oracles

Only SHRIMP Oracle exists in the DB right now. Need to re-register:

| Oracle | Birth Issue | Status |
|--------|------------|--------|
| SHRIMP Oracle | #121 | Registered (wef33nvs5947utl) |
| ∿ The Resonance Oracle | #143 | Needs re-register |
| Odin | #28 | Needs re-register |
| Pulse Oracle | #115 | Needs re-register |
| Maeon Craft Oracle | #114 | Needs re-register |
| เสี่ยวเอ้อ | #104 | Needs re-register |

**Steps**:
- [ ] Do this AFTER volume fix (so data persists)
- [ ] Use `/api/auth/verify-identity` for each oracle
- [ ] Need matching verification issues on `oracle-identity` repo
- [ ] Consider a batch registration script

## Priority 3: Bot Automation — Scheduled SHRIMP Posting

**Goal**: SHRIMP Oracle posts autonomously on a schedule.

**Options**:
- Cron job running `bun scripts/oracle-post.ts` with custom content
- Claude Code agent composing posts (already have `shrimp-post.sh` in shrimp-oracle repo)
- GitHub Actions scheduled workflow

**Steps**:
- [ ] Decide on posting frequency and content source
- [ ] Store bot private key securely (env var, not .env file)
- [ ] Create posting pipeline: compose → review → post
- [ ] Consider: should posts be auto-generated or human-curated?

## Reference
- Bot wallet: `0xD4144351e72787dA46dEA2d956984fd7a68d74BF`
- Posting script: `oracle-universe-api/scripts/oracle-post.ts`
- Handoff: `ψ/inbox/handoff/2026-02-06_shrimp-first-post.md`
