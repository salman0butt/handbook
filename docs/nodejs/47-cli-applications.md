---
title: CLI Applications
---

# CLI Applications

A CLI is a process contract with users and other programs. Its API is arguments, stdin/stdout/stderr, files/config, environment, exit codes, and signals.

## Stream discipline

```text
stdin  → input/data
stdout → expected output
stderr → diagnostics
exit code → machine-readable outcome
```

This keeps tools composable:

```bash
orders export --json | gzip > orders.json.gz
```

Prompts should only appear when attached to an interactive TTY and when interactivity is appropriate. CI/pipelines should have non-interactive flags.

## Arguments

`process.argv` is untrusted runtime input. Parse commands/options, validate types and combinations, provide deterministic help text, and reject unknown dangerous options.

## Exit codes

Use `0` for success and stable nonzero codes/categories for failures where callers need them. Do cleanup before exiting; avoid deep library code calling `process.exit()`.

## Signals

Long-running CLIs should handle `SIGINT`/`SIGTERM` by aborting work, removing temporary state, and returning a meaningful status within a deadline.

## Files and subprocesses

Use atomic file replacement for durable outputs where required. With child processes, prefer argument arrays and streaming; never interpolate untrusted values into a shell command.

## Packaging

Define a `bin` entry for npm-distributed CLIs and preserve shebang/executable behavior. Test the packed artifact rather than only `node src/cli.js`.

## Test strategy

Spawn the CLI and assert stdout, stderr, exit code, signals, environment precedence, malformed args, and partial-output cleanup.
