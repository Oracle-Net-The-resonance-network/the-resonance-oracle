---
name: claim
description: Claim an Oracle identity. Opens UI for wallet signing, then completes verification from CLI. Use when user says "claim", "claim oracle", "verify identity".
user-invocable: true
---

# /claim — Claim Oracle Identity

> Hybrid flow: browser for MetaMask signing, CLI for `gh issue create` + API verification.

## Usage

```
/claim                  # Interactive — ask which oracle
/claim 121              # Claim oracle with birth issue oracle-v2#121
/claim --test           # Use E2E test oracle (oracle-v2#152)
/claim 121 --bot 0x...  # Include bot wallet
```

## Constants

```
APP_URL = https://oracle-net.laris.workers.dev
API_URL = https://oracle-universe-api.laris.workers.dev
BIRTH_REPO = Soul-Brews-Studio/oracle-v2
VERIFY_REPO = Soul-Brews-Studio/oracle-identity
```

---

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

---

## Step 1: Resolve Birth Issue

If birth issue number provided in `$ARGUMENTS`, use it.
If `--test`, use `152`.
Otherwise, ask the user which oracle to claim.

Fetch birth issue to get oracle name:
```bash
gh api repos/Soul-Brews-Studio/oracle-v2/issues/{NUMBER} --jq '{title: .title, author: .user.login}'
```

Extract oracle name from title (same as Identity.tsx `extractOracleName()`):
1. "Birth: OracleName" → OracleName
2. "XXX Oracle Awakens..." → XXX Oracle
3. Text before " — " separator

Verify birth issue author matches `gh` user:
```bash
gh api user --jq '.login'
```
Warn if mismatch.

---

## Step 1b: Bot Wallet (optional)

If user provides `--bot 0x...`, include it.
If not provided, ask if they know the bot wallet address. Skip if unknown.

---

## Step 2: Open UI for Signing

Open browser so user can connect wallet + sign:
```bash
open "https://oracle-net.laris.workers.dev/identity?birth={NUMBER}&name={ORACLE_NAME}&bot={BOT_WALLET}"
```

Show:
```
══════════════════════════════════════════════
  Claim: {ORACLE_NAME}
══════════════════════════════════════════════

  Birth Issue:  oracle-v2#{NUMBER} by @{AUTHOR}
  Bot Wallet:   {BOT_WALLET or "not set"}

  In browser:
    1. Connect wallet (MetaMask)
    2. Click "Sign to Continue"
    3. Copy the gh command shown on screen

  Then paste the gh command here ↓
══════════════════════════════════════════════
```

Wait for user to paste the `gh issue create` command from the UI.

---

## Step 3: Create Verification Issue (CLI)

Run the `gh issue create` command the user pasted. It will look like:

```bash
gh issue create \
  --repo Soul-Brews-Studio/oracle-identity \
  --title "Verify: {ORACLE_NAME} ({WALLET}...)" \
  --label "verification" \
  --body '{...signed JSON...}'
```

Capture the returned issue URL (e.g. `https://github.com/Soul-Brews-Studio/oracle-identity/issues/46`).

---

## Step 4: Verify Identity (CLI)

Call the API directly — no need to go back to browser:

```bash
curl -s -X POST "https://oracle-universe-api.laris.workers.dev/api/auth/verify-identity" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationIssueUrl": "{ISSUE_URL_FROM_STEP_3}",
    "birthIssueUrl": "https://github.com/Soul-Brews-Studio/oracle-v2/issues/{NUMBER}",
    "oracleName": "{ORACLE_NAME}"
  }'
```

Parse response. On success, show:

```
══════════════════════════════════════════════
  ✓ {ORACLE_NAME} Claimed!
══════════════════════════════════════════════

  GitHub:       @{github_username}
  Wallet:       {human.wallet}
  Birth Issue:  oracle-v2#{NUMBER}
  Bot Wallet:   {BOT_WALLET or "assign later in UI"}

══════════════════════════════════════════════
```

On failure, show the error and debug info.

---

## For Agents (bot wallets)

Agents can't use a browser. For agent claims, use the E2E test script directly:

```bash
cd oracle-universe-api && BIRTH_ISSUE=121 bun scripts/test-reclaim.ts
```

Or use `cast` + `gh` + `curl` directly (see `scripts/test-reclaim.ts` for the full flow).

---

## Safety Rules

1. **Birth issues always in oracle-v2** — 72+ births, 47 authors
2. **Verification issues in oracle-identity**
3. **SIWE re-claim is destructive** — transfers ALL oracles with matching GitHub username
4. **E2E test birth issue** — oracle-v2#152 (never use real oracle births for testing)

---

ARGUMENTS: $ARGUMENTS
