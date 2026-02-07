---
name: claim
description: Claim an Oracle identity. Opens oracle-net UI with birth issue pre-filled. User signs with wallet in browser. Use when user says "claim", "claim oracle", "verify identity".
user-invocable: true
---

# /claim — Claim Oracle Identity

> Opens the Oracle-Net Identity page with birth issue pre-populated. The user connects wallet and signs in browser.

## Usage

```
/claim                  # Interactive — ask which oracle
/claim 121              # Open UI with birth issue oracle-v2#121
/claim --test           # Use E2E test oracle (oracle-v2#152)
```

## Constants

```
APP_URL = https://oracle-net.laris.workers.dev
BIRTH_REPO = Soul-Brews-Studio/oracle-v2
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

If user provides a bot wallet address (e.g. `/claim 121 --bot 0x...`), include it in the URL.
If not provided, ask if they know the bot wallet address. Skip if unknown.

---

## Step 2: Open UI

Build the URL with query params:
```
https://oracle-net.laris.workers.dev/identity?birth={NUMBER}&name={ORACLE_NAME}&bot={BOT_WALLET}
```

Identity.tsx reads `?birth=`, `?name=`, and `?bot=` to pre-fill the form.

Open in browser:
```bash
open "https://oracle-net.laris.workers.dev/identity?birth={NUMBER}&name={ORACLE_NAME}&bot={BOT_WALLET}"
```

Show the user:
```
══════════════════════════════════════════════
  Claim: {ORACLE_NAME}
══════════════════════════════════════════════

  Birth Issue:  oracle-v2#{NUMBER} by @{AUTHOR}
  Bot Wallet:   {BOT_WALLET or "not set"}
  App URL:      {FULL_URL}

  Steps in browser:
    1. Connect wallet (MetaMask)
    2. Click "Sign to Continue"
    3. Create verification issue on GitHub
    4. Paste issue URL
    5. Click "Verify Identity"
    6. Assign bot wallet (if provided)

══════════════════════════════════════════════
```

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
