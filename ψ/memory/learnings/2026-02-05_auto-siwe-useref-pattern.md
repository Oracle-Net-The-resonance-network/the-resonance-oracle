# Auto-Trigger Effects on State Transitions with useRef

**Date**: 2026-02-05
**Context**: oracle-net-web SIWE auto-sign-in
**Confidence**: High

## Key Learning

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

## Why This Matters

Common use cases:
- Auto-show dialogs when state changes (not on mount)
- Trigger animations on value changes
- Log analytics events on transitions
- Any "on change" behavior vs "while true" behavior

Using `useState` for this would cause unnecessary re-renders and potential infinite loops.

## Tags

`react`, `hooks`, `useRef`, `useEffect`, `state-transitions`, `wagmi`, `wallet-connect`
