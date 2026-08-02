---
title: Debugging JavaScript
description: Reproduction, breakpoints, async stacks, network and production incident diagnosis.
slug: /javascript/debugging/debugging-javascript
---

# Debugging JavaScript

Debugging is a controlled search for the first point where actual state diverges from expected state.

## Reproduction workflow

1. State the expected and actual behavior.
2. Reduce to the smallest reliable reproduction.
3. Record runtime, input, timing and environment.
4. Form one falsifiable hypothesis.
5. Instrument or pause at the boundary that distinguishes it.
6. Fix the root cause and add a regression test.

Binary-search debugging narrows a long pipeline or commit range by checking a midpoint. Do not change several variables at once.

## Browser tools

Use source breakpoints, conditional breakpoints, logpoints and DOM breakpoints. Step over for the next statement, into for the called function and out to finish the current frame. Inspect Call Stack, Scope, Watch and closure bindings.

Network tools reveal request headers, status, timing, redirects, caching and response bodies. Preserve privacy when capturing production traffic. Source maps map built assets to authored code; protect source-map access when source or paths are sensitive.

## Async and event-loop bugs

Enable async stack traces, label operations with correlation IDs, and log state transitions rather than arbitrary strings. For races, record start, cancellation, settlement and commit order.

```javascript
const requestId = crypto.randomUUID()
logger.info('profile.load.started', {requestId, userId})
```

Inspect whether stale work was aborted and whether a late response overwrote newer state.

## Performance and memory

Use a performance trace to identify long tasks, forced layout, excessive event handlers and network waterfalls. Use heap snapshots and allocation timelines for leaks. Retaining paths are stronger evidence than raw object counts.

## Node and VS Code

Node supports the inspector protocol (`--inspect`, `--inspect-brk`) and diagnostic reports/profiles. VS Code launch configurations should pin the runtime, working directory, environment and source-map behavior. Never expose a debug port publicly without strong isolation.

## Production debugging

Start with impact and recent changes. Correlate errors, logs, metrics and traces. Add temporary high-cardinality detail carefully, redact secrets, and roll back when the safest mitigation is clearer than an online fix. Preserve an incident timeline and turn the discovered invariant into automated monitoring or tests.

## Logging strategy

Use structured events with stable names, severity, correlation and relevant dimensions. Avoid logging tokens, passwords, full payment data or unbounded user content. Sampling must not hide rare critical failures.

## Primary references

- [Chrome DevTools JavaScript debugging](https://developer.chrome.com/docs/devtools/javascript/)
- [Node.js debugging](https://nodejs.org/en/learn/getting-started/debugging)
