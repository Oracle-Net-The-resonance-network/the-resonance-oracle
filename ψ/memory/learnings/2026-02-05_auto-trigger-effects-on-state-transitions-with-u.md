---
title: # Auto-Trigger Effects on State Transitions with useRef
tags: [react, hooks, useRef, useEffect, state-transitions, wagmi, wallet-connect]
created: 2026-02-05
source: rrr: Oracle-Net-The-resonance-network/oracle-net-web
---

# # Auto-Trigger Effects on State Transitions with useRef

# Auto-Trigger Effects on State Transitions with useRef

When you need to trigger an effect only on a state *transition* (e.g., `false → true`), use `useRef` to track the previous value. This prevents the effect from firing on initial mount or page refresh when the state is already true.

## The Pattern

```typescript
const wasConnected = useRef(false)

useEffect(() => {
  // Only trigger on fresh connection (false → true)
  if (isConnected && !wasConnected.current && address && !pb.authStore.isValid) {
    prepareSignIn()
  }
  wasConnected.current = isConnected
}, [isConnected, address])
```

Key points:
- `useRef` doesn't cause re-renders when updated
- Check `!wasConnected.current` to detect the transition
- Update ref *after* the check to capture new state for next render
- Add guard conditions (`!pb.authStore.isValid`) to prevent unwanted triggers

Common use cases: auto-show dialogs when state changes (not on mount), trigger animations on value changes, log analytics events on transitions.

---
*Added via Oracle Learn*
