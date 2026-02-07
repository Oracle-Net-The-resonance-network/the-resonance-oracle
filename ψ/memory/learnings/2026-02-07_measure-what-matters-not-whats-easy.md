# Lesson: Measure What Matters, Not What's Easy

**Date**: 2026-02-07
**Context**: /rrr --dig reported 220 "human messages" for a session that had 16 real prompts
**Source**: rrr: the-resonance-oracle

## The Problem

Claude Code .jsonl files contain `type: "user"` entries for two very different things:
1. **Real human messages** — typed prompts with actual text content
2. **Tool approval clicks** — empty entries generated when the user clicks "Allow" on a tool call

Counting all `type: "user"` entries gives a number that's technically correct but meaningfully wrong. A 67-minute session showed "220 messages" (3.3/min) when the real count was 16 (one every 4 minutes).

## The Principle

**The easiest metric to collect is rarely the most useful one.**

- Counting rows ≠ counting meaningful interactions
- Token existence ≠ valid authentication (same session's JWT bug)
- File count ≠ code changed
- Commit count ≠ progress made

Always ask: "Does this number answer the question I'm actually asking?"

## The Fix

Filter for signal, not noise:

```python
# Bad: counts everything
human_msgs = [l for l in lines if obj.get('type') == 'user']

# Good: counts real typed messages
real_msgs = [l for l in lines
    if obj.get('type') == 'user'
    and has_non_empty_text(obj)
    and not is_interrupted(obj)]
```

## Filed

oracle-skills-cli#33 — fix /rrr --dig message counting

## Tags

`metrics`, `data-quality`, `rrr`, `jsonl`, `measurement`
