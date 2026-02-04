# tmux send-keys for Remote Interactive Sessions

**Date**: 2026-02-04
**Context**: Automating admin creation in DigitalOcean App Platform console
**Confidence**: High

## Key Learning

When you need to run commands in an interactive remote console (like `doctl apps console`) that doesn't support direct command execution like SSH, use tmux to bridge the gap. Start the interactive session inside a detached tmux session, then use `tmux send-keys` to type commands into it.

This pattern transforms any interactive-only tool into an automatable one.

## The Pattern

```bash
# 1. Start interactive console in detached tmux session
tmux new-session -d -s my-session "doctl apps console $APP_ID $COMPONENT"

# 2. Wait for connection
sleep 5

# 3. Send command via tmux
tmux send-keys -t my-session './my-command arg1 arg2' Enter

# 4. Wait for execution
sleep 3

# 5. Capture output
tmux capture-pane -t my-session -p

# 6. Clean up
tmux kill-session -t my-session
```

## Why This Matters

Many cloud platform CLIs (DigitalOcean, AWS, GCP) provide interactive console access but not direct command execution. This pattern unlocks automation for:
- Creating superusers/admins on fresh deployments
- Running migrations
- Debugging production issues
- Any one-off commands in containerized environments

The key insight: tmux acts as a programmable keyboard, letting you "type" into any interactive session from a script.

## Tags

`tmux`, `automation`, `digitalocean`, `doctl`, `remote-console`, `deployment`
