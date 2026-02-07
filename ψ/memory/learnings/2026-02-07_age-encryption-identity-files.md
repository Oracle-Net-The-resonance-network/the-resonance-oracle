# Lesson: Age Encryption — Use Identity Files, Not Passphrases

**Date**: 2026-02-07
**Context**: Implementing encrypted key storage for ~/.oracle-net/
**Tags**: #security #age #encryption #cli

## The Mistake

Used `age -e -p` (passphrase-based encryption) in a non-interactive CLI tool. This prompts for a passphrase on stdin — completely breaks automation.

Also used shell interpolation (`echo '${secret}' | age`) which is vulnerable to injection if the secret contains shell metacharacters.

## The Fix

1. **Identity-file encryption**: `age-keygen -o key.txt` generates a keypair. Encrypt with `-r age1...` (public key), decrypt with `-i key.txt` (identity file). Non-interactive.
2. **`execFileSync` with `input`**: Pipe secrets via Node's `input` option instead of shell echo. No shell involved, no injection risk.

```typescript
// Encrypt (no shell, no prompt)
execFileSync('age', ['-e', '-r', recipient, '-a'], {
  input: plaintext,
  encoding: 'utf-8',
})

// Decrypt (no shell, no prompt)
execFileSync('age', ['-d', '-i', identityFile], {
  input: ciphertext,
  encoding: 'utf-8',
})
```

## Rule

When automating encryption:
- **Never** use interactive/passphrase modes (`-p`)
- **Always** use key-based modes (`-r` / `-i`)
- **Never** pass secrets through shell interpolation
- **Always** use `execFileSync` with `input` option for piping
