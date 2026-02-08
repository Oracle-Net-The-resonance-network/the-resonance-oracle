# Agent Teams Work Best for Sequential Pipelines

**Date**: 2026-02-08
**Context**: First agent team usage — rewriting /setup page with researcher + coder + qa

## Pattern

When work has clear sequential dependencies (research → implement → verify), agent teams with task blocking (`addBlockedBy`) produce clean results with minimal coordination overhead.

## What Worked

- **Researcher** read 6 source files, produced 300-line content reference in ~5 min
- **Coder** consumed the reference, wrote 339 lines of clean TSX in ~10 min
- **QA** ran 5 checks (structure, URLs, typecheck, live API, routing) in ~3 min
- Total wall-clock: ~25 min for a page rewrite that would take 40+ min solo
- Zero merge conflicts because each agent owned a distinct phase

## What Didn't Work

- Shutdown is clunky — idle agents don't always process shutdown requests immediately
- QA needed a second shutdown request after going idle
- TeamDelete fails if any agent is still "active" even when functionally done

## Key Insight

Agent teams shine when agents have **non-overlapping file ownership** and **clear input/output contracts**. The researcher's output file (`/tmp/setup-content.md`) was the contract between research and implementation. Without that artifact, the coder would have needed to re-read all the same files.

## Anti-Pattern

Don't use teams for tasks where agents need to edit the same file — that causes overwrites. Sequential pipelines with file-level ownership avoid this entirely.

## Tags

`agent-teams`, `workflow`, `coordination`, `sequential-pipeline`
