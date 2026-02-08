---
query: "floodboy oracle blockchain data"
target: "the-resonance-oracle"
mode: deep
timestamp: 2026-02-08 12:21
---

# Trace: Floodboy Oracle Blockchain

**Target**: the-resonance-oracle (cross-repo)
**Mode**: deep (5 parallel agents)
**Time**: 2026-02-08 12:21 +07

## Identity

| Field | Value |
|-------|-------|
| Oracle Name | Floodboy |
| Oracle # | 50 in Nat's family |
| Theme | Flood + Chain |
| Birth Issue | `laris-co/floodboy-oracle#1` |
| Awakening | `Soul-Brews-Studio/oracle-v2#82` |
| Status | Linked (in Oracle Family Registry) |

## Repos Found

| Repo | Description |
|------|-------------|
| `laris-co/floodboy-oracle` | **Primary repo** — Flood monitoring + blockchain oracle |
| `laris-co/dustboy-chain-oracle` | Related — DustBoy Chain Oracle (air quality on blockchain) |
| `laris-co/esphome-fw` | Firmware — Floodboy radar sensor hardware |
| `laris-co/01-data-flow` | Data pipeline — floodboy_white runner |
| `laris-co/homelab` | Infrastructure — `floodboy-white4.alchemycat.org` server |

## GitHub Issues

### laris-co/floodboy-oracle
- **#1** (open) — Birth Props
- **#2** (open) — **bug: Blockchain status update cron calling wrong endpoint - 112K stuck submissions**

### Soul-Brews-Studio/oracle-v2
- **#82** (closed) — Floodboy Oracle Awakens — Flood Monitoring + Blockchain
- **#80** (closed) — New Oracle Spawning: Flood Boy

### laris-co/esphome-fw
- **#221** — plan: Enable USB CDC for Floodboy radar serial debugging
- **#220** — Context: Enable USB CDC for Floodboy radar serial debugging
- **#219** — Context: ESPHome Device Batching Strategy Analysis

### laris-co/01-data-flow
- **#19** — test: Verify brainstorming workflow with floodboy_white runner
- **#21** — test: Brainstorming workflow with optimized codex verification

## Infrastructure

- **Server**: `floodboy-white4.alchemycat.org` (WHITE home server)
- **DB schema**: `model_floodboy` (FloodBoy water sensors), `floodboydb` (FloodBoy DB)
- **Data**: InfluxDB exports → parquet files on NVMe (`/mnt/nvme1/influxdb2024/`)
- **Sync**: rsync from WHITE server to local `ψ/lab/dustboy-confidence-system/`

## Blockchain Data (Key Finding)

**Critical bug**: `laris-co/floodboy-oracle#2` reports:
- Blockchain status update cron is calling the **wrong endpoint**
- **112,000 stuck submissions** not being committed to chain
- This is the core blockchain integration issue for Floodboy

## Oracle Memory

- Oracle Family Registry lists Floodboy as #50 "Flood+Chain" — **Linked** status
- Session 2026-01-29 lesson: "Always verify GitHub CLI search results" (from Floodboy session)
- Related: DustBoy Chain Oracle (`oracle-v2#146`) — same pattern (sensor data → blockchain)

## Summary

**Floodboy Oracle** = flood monitoring sensors (ESPHome radar hardware) that push water level data to blockchain. The `laris-co/floodboy-oracle` repo is the main codebase. Key issue: **112K stuck blockchain submissions** due to a cron endpoint bug (`#2`). Related to DustBoy (air quality) and the broader pattern of IoT sensor data → blockchain oracles. Server infrastructure runs on `floodboy-white4.alchemycat.org`.

## Next Steps
- [ ] Fix blockchain cron endpoint bug (floodboy-oracle#2) — 112K submissions stuck
- [ ] Check if DustBoy Chain Oracle has same issue pattern
- [ ] Verify Floodboy birth issue claim on OracleNet
