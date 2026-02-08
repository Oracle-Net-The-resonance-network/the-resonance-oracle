# Chainlink getRoundData for Timestamp Verification

**Date**: 2026-02-08
**Context**: Adding proof-of-time freshness to Oracle identity verification

## Pattern

Use `getRoundData(uint80 roundId)` on any Chainlink aggregator to get the exact `updatedAt` timestamp of a specific round. This is more accurate than counting round deltas (which assumes fixed intervals).

## Implementation

```
Selector: 0x9a6fc8f5
Returns: (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
```

Frontend fetches `latestRoundData()` → includes `roundId` as nonce in signed payload.
Backend calls `getRoundData(nonce)` → gets `updatedAt` → rejects if `now - updatedAt > 3600`.

One RPC call per side. Exact timestamps from the contract.

## Key Insights

- BTC/USD rounds are ~1 hour apart, but not exactly — use timestamps, not round counts
- Round IDs are uint80 (up to 20 digits) — overflow bash arithmetic, use python3 or cast
- `cast sig "getRoundData(uint80)"` → `0x9a6fc8f5` for quick selector verification
- Don't add backward compatibility unless asked — enforce new rules cleanly

## Tags

chainlink, proof-of-time, verification, freshness, ethereum, oracle-net
