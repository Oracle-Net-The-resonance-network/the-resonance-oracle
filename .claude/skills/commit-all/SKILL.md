---
name: commit-all
description: Commit and push all Oracle-Net repos. Use when user says "commit all", "push all", "ship all", "commit incubate".
---

# /commit-all - Ship All Oracle-Net Repos

Check all incubated repos for changes, summarize, commit and push.

## Usage

/commit-all              - Check, summarize, commit & push all
/commit-all --dry-run    - Show what would be committed (no push)

## Repos (Incubated)

```bash
API=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api
WEB=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web
UNIVERSE=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web
BACKEND=~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend
ORACLE=~/Code/github.com/Oracle-Net-The-resonance-network/the-resonance-oracle
```

## Step 0: Timestamp

Run: date "+🕐 %H:%M %Z (%A %d %B %Y)"

## Step 1: Check All Repos (parallel)

Run 5 parallel Bash calls to check each repo:

```bash
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api && git status --porcelain && git log origin/main..HEAD --oneline
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web && git status --porcelain && git log origin/main..HEAD --oneline
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-web && git status --porcelain && git log origin/main..HEAD --oneline
cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-backend && git status --porcelain && git log origin/main..HEAD --oneline
cd ~/Code/github.com/Oracle-Net-The-resonance-network/the-resonance-oracle && git status --porcelain && git log origin/main..HEAD --oneline
```

## Step 2: Show Summary

Display which repos have:
- Uncommitted changes (from git status --porcelain)
- Unpushed commits (from git log origin/main..HEAD)

Format:
```
∿ Oracle-Net Status
  - oracle-universe-api    [clean/dirty] [X unpushed]
  - oracle-net-web         [clean/dirty] [X unpushed]
  - oracle-universe-web    [clean/dirty] [X unpushed]
  - oracle-universe-backend [clean/dirty] [X unpushed]
  - the-resonance-oracle   [clean/dirty] [X unpushed]
```

## Step 3: Commit Dirty Repos

For each repo with uncommitted changes:
1. Show `git diff --stat`
2. Ask user for commit message OR auto-generate based on changes
3. Run `git add -A && git commit -m "message"`

## Step 4: Push All (parallel)

Use parallel Task subagents to push all repos with unpushed commits:

```
Task 1 (Bash): cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-universe-api && git push
Task 2 (Bash): cd ~/Code/github.com/Oracle-Net-The-resonance-network/oracle-net-web && git push
... etc
```

## Step 5: Show Final Summary

```
∿ Oracle-Net shipped
  - oracle-universe-api    → pushed ✓
  - oracle-net-web         → pushed ✓
  - oracle-universe-web    → pushed ✓
  - oracle-universe-backend → pushed ✓
  - the-resonance-oracle   → pushed ✓
```

## Commit Message Format

Use Oracle style:
```
∿ Brief description

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

ARGUMENTS: $ARGUMENTS
