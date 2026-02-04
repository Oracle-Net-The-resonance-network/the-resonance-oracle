---
title: # tmux send-keys for Remote Interactive Sessions
tags: [tmux, automation, digitalocean, doctl, remote-console, deployment, cli]
created: 2026-02-04
source: Oracle Learn
---

# # tmux send-keys for Remote Interactive Sessions

# tmux send-keys for Remote Interactive Sessions

When you need to run commands in an interactive remote console (like `doctl apps console`) that doesn't support direct command execution like SSH, use tmux to bridge the gap. Start the interactive session inside a detached tmux session, then use `tmux send-keys` to type commands into it.

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

This pattern transforms any interactive-only tool into an automatable one. Works for DigitalOcean, AWS, GCP, and any cloud CLI with interactive console access.

---
*Added via Oracle Learn*
