# Wagmi Auth Race Condition with PocketBase

**Date**: 2026-02-06
**Context**: oracle-net-web AuthContext — wagmi + PocketBase dual auth
**Confidence**: High

## Key Learning

When using wagmi (wallet connection) alongside a separate auth system (PocketBase), there's a dangerous race condition on page load. Wagmi's `isConnected` starts as `false` while it asynchronously reconnects to the previously-connected wallet. If your auth initialization logic uses `isConnected` to decide whether to clear the secondary auth store, it will destroy valid sessions before wagmi has a chance to reconnect.

The fix: separate "wallet not connected yet" (transient state during reconnection) from "wallet intentionally disconnected" (user action). Use a ref (`wasConnected`) to track the transition from connected → disconnected, and only clear auth on that intentional transition — never during the initial load ambiguity.

## The Pattern

```tsx
// BAD: Clears PB auth while wagmi is still reconnecting
if (pb.authStore.isValid && isConnected) {
  // fetch user data...
} else {
  if (!isConnected && pb.authStore.isValid) {
    pb.authStore.clear()  // DESTROYS SESSION on page load!
  }
}

// GOOD: Only clear on intentional disconnect
const wasConnected = useRef(false)

// In fetchAuth:
if (pb.authStore.isValid && isConnected) {
  // fetch user data...
} else if (pb.authStore.isValid && !isConnected) {
  // Wagmi may still be reconnecting — don't clear, just wait
}

// Separate effect for intentional disconnect:
useEffect(() => {
  if (wasConnected.current && !isConnected) {
    pb.authStore.clear()  // Only when going connected → disconnected
  }
  wasConnected.current = isConnected
}, [isConnected])
```

## Why This Matters

This pattern applies to any dual-auth system where one provider initializes asynchronously. The general rule: **never use a transient "not ready yet" state to trigger destructive cleanup**. Wait for an affirmative signal (the state transition) rather than reacting to the absence of readiness.

## Also Learned

- DigitalOcean App Platform does NOT support persistent volumes. Instances are ephemeral. For SQLite-based apps (PocketBase), use Litestream to stream to S3-compatible storage.
- `checksumAddress(entity.wallet_address) || entity.id` is a good universal pattern for profile URL resolution with fallback.

## Tags

`wagmi`, `auth`, `race-condition`, `pocketbase`, `react`, `web3`, `digitalocean`, `litestream`
