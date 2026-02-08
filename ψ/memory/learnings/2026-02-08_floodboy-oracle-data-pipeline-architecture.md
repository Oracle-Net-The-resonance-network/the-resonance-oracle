---
title: ## Floodboy Oracle — Data Pipeline Architecture
tags: [floodboy, iot, blockchain, jibchain, cloudflare-workers, d1, sensor-data, data-pipeline, oracle-architecture]
created: 2026-02-08
source: Deep exploration of laris-co/00_mz_forwarder service codebase
---

# ## Floodboy Oracle — Data Pipeline Architecture

## Floodboy Oracle — Data Pipeline Architecture

### What Is It?
IoT flood monitoring system: physical water level sensors → MQTT → Telegraf → Cloudflare Workers → D1 → JIBCHAIN L1 blockchain.

### Key Paths
- **Identity repo**: `laris-co/floodboy-oracle` (CLAUDE.md, philosophy, issues)
- **Service repo**: `laris-co/00_mz_forwarder/03-services/proxy-http-honojs/` (Hono.js on CF Workers)
- **Contracts repo**: `LarisLabs/web3-iot-factory` (CatLabSensorStore, CatLabFactory)
- **Worker name**: `dustboy-health` at `dustboy-health.laris.workers.dev`

### Pipeline Flow
```
Sensors (ESPHome 4G, ±2mm radar)
  → MQTT broker
  → Telegraf (5-min windowing)
  → POST /telegraf (Hono.js endpoint)
  → D1 (telegraf_raw table)
  → Cron every minute:
    1. submit-to-blockchain (50 records/batch, dedupe by sensor nickname)
    2. update-submission-status (poll tx receipts)
    3. update-batch-status (confirm batch summaries)
    4. cleanup-confirmed (archive to telegrafDebugArchive)
  → JIBCHAIN L1 (Chain ID 8899)
  → 100 FloodBoy store contracts (one per sensor)
```

### Blockchain Details
- **Chain**: JIBCHAIN L1, Chain ID 8899, RPC `https://rpc-l1.jibchain.net`
- **Signer**: `0xcB0e58b011924e049ce4b4D62298Edf43dFF0BDd`
- **Contracts**: FloodBoy001-100, each with `storeWithTimestamp(int256[10], uint256)`
- **Gas**: ~300K per tx, viem.js wallet client

### D1 Schema (5 tables)
1. `telegrafRaw` — raw sensor JSON from Telegraf
2. `blockchainSubmissions` — individual tx tracking (hash, status, nonce)
3. `blockchainSummary` — batch-level tracking (submitted/confirmed counts)
4. `blockchainSkippedSubmissions` — zero-water-depth skips with reasons
5. `telegrafDebugArchive` — confirmed records moved here (nothing deleted)

### Data Scaling (float → int for blockchain)
- `battery_voltage` × 100
- `installation_height` × 10,000
- `water_depth` × 10,000
- Zero water depth → skip (sensor not submerged)

### Key Design Patterns
1. **Explicit nonce management** — tracks nonce in D1, increments per-tx, handles gaps
2. **Deduplication by nickname** — within each batch, keep only latest reading per sensor
3. **Skip zero-value sensors** — saves gas, records skip reason in D1
4. **Nothing deleted** — confirmed records archived to debug table, not dropped
5. **Batch summaries** — aggregate tracking reduces D1 storage by 98% vs individual records

### Known Issues (as of 2026-02-08)
- **Issue #2**: Cron was calling wrong endpoint for status updates (fixed: `a8c3f85c`)
- **Issue #3**: Batch summaries never confirmed (fixed: `a74c3819`, not yet deployed)
- **112K stuck submissions**: Result of Issue #2, will self-heal after deploy
- **170K stuck batch summaries**: Result of Issue #3, will self-heal after deploy
- All fixes pending: 3 commits ahead of origin/main, need push + `wrangler deploy`

### Active State
- ~5 active sensors currently reporting
- Pipeline is live and processing new data
- Cron runs every minute on CF Workers scheduled triggers

### Learn Documents
- Architecture: `ψ/learn/laris-co/floodboy-oracle/2026-02-08/1232_ARCHITECTURE.md`
- Code snippets: `ψ/learn/laris-co/floodboy-oracle/2026-02-08/1232_CODE-SNIPPETS.md`

---
*Added via Oracle Learn*
