# Lesson: Confirm Aesthetic Values Before Deploying

**Date**: 2026-02-08
**Context**: ResonanceSphere camera z-position change
**Source**: rrr

## Pattern

When making visual/aesthetic changes (colors, sizes, positions, camera angles), the exact values are a matter of taste. Plans suggest values with rationale, but the user may prefer something different.

## Rule

For aesthetic changes:
1. Present the proposed value and rationale
2. Ask the user to confirm or suggest alternatives
3. Only deploy after confirmation

Don't deploy the plan's value and then change it — that wastes a deploy cycle and briefly puts the wrong version live.

## Tags

- aesthetic, deploy, confirmation, three.js, camera
