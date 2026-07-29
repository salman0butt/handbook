---
title: Project 6 — CLI Tool
---

# Project 6 — CLI Tool

Build `handbook-audit`, a distributable CLI that scans Markdown, validates frontmatter/links, streams findings, optionally runs Git, and emits human or JSON output.

## Requirements

Commands (`scan`, `check-links`, `report`), argv parsing, stdin file list support, stdout/stderr discipline, config + env precedence, filesystem traversal, bounded concurrency, subprocess execution without shell injection, signals, package `bin`, tests.

## Architecture

```text
argv/stdin → command parser → application command
                         ↓
           fs adapter / git adapter / reporter
```

## Runtime model

Directory/file operations are async I/O; Markdown parsing is JS CPU; Git is a child process; output is a Writable stream. A huge repository requires bounded file concurrency.

## Milestones

Core scan function → command surface → config → streaming JSON → Git adapter → abort/signal → npm pack test.

## Acceptance criteria

Piping works; machine JSON contains no diagnostic noise; Ctrl+C cancels work and exits nonzero; filenames with spaces/special characters cannot inject commands; scanning 100k files remains bounded.

## Security

Never use `exec("git ..." + userInput)`. Resolve workspace roots; reject traversal where command semantics require it; treat config plugins as code execution if supported.

## Performance

Measure files/s, parse CPU, fs concurrency, memory, stdout backpressure. Stream findings instead of collecting all errors.

## Testing

Spawn process for help, invalid args, success, failure, stdin, SIGINT, config precedence, Git failure, permissions, huge synthetic tree.

## Failure modes

Broken pipe, unreadable file, Git missing, output destination closes, invalid config, signal during write.

## Observability

For CLI, structured debug mode plus summary timings/counts; avoid telemetry that violates local privacy expectations.

## Deployment

Publish package with explicit engines, files, exports/bin, provenance, semver, changelog, smoke install in CI.

## Common mistakes

`console.log` for everything, `process.exit` deep in parser, sync traversal on huge trees, shell strings, no cancellation.

## Stretch goals

Plugin API, worker-thread parser pool, SARIF output, incremental cache.

## Interview questions

Why distinguish stdout/stderr? What keeps a CLI process alive? Why can sync fs be acceptable in one CLI and bad in a server?

## Design review

Defend command API stability and how errors become exit codes/messages.
