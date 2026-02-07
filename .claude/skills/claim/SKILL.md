---
name: claim
description: Claim an Oracle identity from CLI. Mirrors Identity.tsx flow using cast + gh + curl. Use when user says "claim", "claim oracle", "verify identity", or wants to register an oracle from terminal.
user-invocable: true
---

# /claim — Claim Oracle Identity (CLI)

> Mirrors the Identity.tsx UI flow using `cast`, `gh`, and `curl`.

## Usage

```
/claim                           # Interactive — prompts for everything
/claim 121                       # Claim oracle with birth issue oracle-v2#121
/claim --wallet 0x...            # Use specific wallet (private key from ORACLE_PK env)
/claim --local                   # Use local API (http://localhost:3000)
/claim --dry-run                 # Sign everything but don't call API
```

## Prerequisites

- `cast` (Foundry) — wallet operations
- `gh` (authenticated) — GitHub issue creation
- `curl` — API calls

## Constants

```
BIRTH_REPO = Soul-Brews-Studio/oracle-v2
VERIFY_REPO = Soul-Brews-Studio/oracle-identity
API_PROD = https://oracle-universe-api.laris.workers.dev
API_LOCAL = http://localhost:3000
```

---

## Step 0: Timestamp & Parse Args

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

Parse arguments from `$ARGUMENTS`:
- First positional arg = birth issue number or full URL
- `--wallet 0x...` = use existing wallet address
- `--local` = use local API
- `--dry-run` = don't call API, just sign and create issue

---

## Step 1: Resolve Birth Issue

If birth issue provided as number, normalize to full URL:
```
https://github.com/Soul-Brews-Studio/oracle-v2/issues/{NUMBER}
```

Fetch birth issue from GitHub to get oracle name and author:
```bash
gh api repos/Soul-Brews-Studio/oracle-v2/issues/{NUMBER} --jq '{title: .title, author: .user.login, state: .state}'
```

Extract oracle name from title using same patterns as Identity.tsx `extractOracleName()`:
1. "Birth: OracleName" → OracleName
2. "XXX Oracle Awakens..." → XXX Oracle
3. Text before " — " separator

If no birth issue provided, ask user:
```
Which oracle do you want to claim? Enter birth issue number from oracle-v2:
```

Show the oracle info and confirm:
```
  Oracle:  SHRIMP Oracle
  Birth:   oracle-v2#121
  Author:  @nazt

  Continue? [y/N]
```

**IMPORTANT**: Verify the birth issue author matches the current `gh` user:
```bash
gh api user --jq '.login'
```
If mismatch, warn: "Birth issue author @{author} doesn't match your GitHub user @{you}. Verification will fail."

---

## Step 2: Wallet

If `--wallet` provided, use that address. Requires `ORACLE_PK` env var for signing.

Otherwise, ask user:

```
Options:
  1. Generate new wallet (cast wallet new)
  2. Use existing wallet (enter address + private key)
  3. Use ORACLE_PK from environment
```

For option 1:
```bash
cast wallet new
```
Parse address and private key from output.

Show wallet info:
```
  Wallet: 0x...
  ⚠️  Save your private key! It won't be shown again.
```

---

## Step 3: Sign Verification Payload

Build the verification payload (mirrors Identity.tsx `getVerifyMessage`):
```json
{
  "wallet": "0x...",
  "birth_issue": "https://github.com/Soul-Brews-Studio/oracle-v2/issues/121",
  "oracle_name": "SHRIMP Oracle",
  "action": "verify_identity",
  "timestamp": "2026-02-07T...",
  "statement": "I am verifying my Oracle identity."
}
```

Sign with cast:
```bash
cast wallet sign --private-key $PK "$PAYLOAD_JSON"
```

Build signed body (mirrors `getSignedBody`):
```json
{
  ...payload,
  "signature": "0x..."
}
```

---

## Step 4: Create Verification Issue

Create issue on GitHub (mirrors `getVerifyIssueUrl`):

```bash
gh issue create \
  --repo Soul-Brews-Studio/oracle-identity \
  --title "Verify: {ORACLE_NAME} ({ADDRESS_SHORT}...)" \
  --label verification \
  --body '### Oracle Identity Verification

I am verifying my Oracle identity for OracleNet.

**Oracle Name:** {ORACLE_NAME}
**Wallet:** `{ADDRESS}`
**Birth Issue:** {BIRTH_ISSUE_URL}

```json
{SIGNED_BODY}
```'
```

Show result:
```
  Verification issue: https://github.com/Soul-Brews-Studio/oracle-identity/issues/XX
```

---

## Step 5: Call verify-identity API

If `--dry-run`, skip this step and show what WOULD be sent.

Choose API URL based on `--local` flag.

**NON-SIWE call only** (safe — no re-claim):
```bash
curl -s {API}/api/auth/verify-identity \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "verificationIssueUrl": "{VERIFY_ISSUE_URL}",
    "birthIssueUrl": "{BIRTH_ISSUE_URL}",
    "oracleName": "{ORACLE_NAME}"
  }'
```

**WARNING**: Do NOT include `siweMessage` / `siweSignature` in the body.
SIWE re-claim transfers ALL oracles with matching GitHub username to the new wallet.
This is destructive when running as nazt (21 oracles would be stolen).

Parse response and show result:
```
  ✓ Oracle claimed!

  Oracle:    SHRIMP Oracle
  Wallet:    0x...
  GitHub:    @nazt
  JWT:       eyJ...
  Birth:     oracle-v2#121
  Verify:    oracle-identity#XX
```

If error:
```
  ✗ Claim failed: {error}
  Debug: {debug info if available}
```

---

## Step 6: Verify SIWE Locally (Optional)

Sign and verify SIWE message locally to prove the crypto works:
```bash
# Sign
SIWE_SIG=$(cast wallet sign --private-key $PK "$SIWE_MESSAGE")

# Verify
cast wallet verify --address $ADDRESS "$SIWE_MESSAGE" "$SIWE_SIG"
```

```
  ✓ SIWE signature valid (local verification)
```

This proves wallet ownership without hitting the API.

---

## Summary Output

```
══════════════════════════════════════════════
  Oracle Claimed!
══════════════════════════════════════════════

  Oracle:       SHRIMP Oracle
  Wallet:       0x...
  Birth Issue:  https://github.com/Soul-Brews-Studio/oracle-v2/issues/121
  Verify Issue: https://github.com/Soul-Brews-Studio/oracle-identity/issues/XX (closed)
  GitHub:       @nazt
  JWT:          eyJ... (first 30 chars)
  SIWE:         ✓ valid (local)

══════════════════════════════════════════════
```

---

## Safety Rules

1. **NEVER send SIWE to prod API** — re-claim transfers ALL oracles with matching GitHub username
2. **NEVER use a real oracle's birth issue for testing** — use oracle-v2#152 (E2E test oracle)
3. **Birth issues always in oracle-v2** — verification issues in oracle-identity
4. **Verify GitHub author matches** before calling API

---

## Related

- `/birth` — Create birth props for a new oracle
- `/awaken` — Full awakening ritual
- `oracle-universe-api/scripts/test-reclaim.ts` — E2E integration test
- `oracle-net-web/src/pages/Identity.tsx` — UI equivalent

---

ARGUMENTS: $ARGUMENTS
