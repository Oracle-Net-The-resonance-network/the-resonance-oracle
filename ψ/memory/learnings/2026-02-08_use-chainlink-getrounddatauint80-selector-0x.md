---
title: Use Chainlink `getRoundData(uint80)` (selector `0x9a6fc8f5`) for exact timestamp
tags: [chainlink, proof-of-time, verification, freshness, ethereum, oracle-net]
created: 2026-02-08
source: rrr: the-resonance-oracle
---

# Use Chainlink `getRoundData(uint80)` (selector `0x9a6fc8f5`) for exact timestamp

Use Chainlink `getRoundData(uint80)` (selector `0x9a6fc8f5`) for exact timestamp verification instead of counting round deltas. Frontend includes roundId as nonce in signed payload, backend calls getRoundData(nonce) to get `updatedAt`, rejects if `now - updatedAt > 3600` (1 hour). BTC/USD rounds are ~1hr apart but not exact — timestamps are ground truth. Round IDs are uint80 (overflow bash — use python3/cast). Don't add backward compatibility unless asked — enforce new rules cleanly.

---
*Added via Oracle Learn*
