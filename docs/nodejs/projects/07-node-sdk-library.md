---
title: Project 7 — Node.js SDK / Library
---

# Project 7 — Node.js SDK / Library

Build a typed API client package consumable by Node ESM and CommonJS users with stable exports, declarations, source maps, retries/timeouts, tests, semver, and publishing policy.

## Requirements

Public client, request/response types, runtime response validation, `AbortSignal`, retry policy, errors with `cause`, package `exports`, CJS/ESM strategy, declarations, tests against supported Node lines, packed-artifact test, npm provenance.

## Architecture

```text
public API
 ↓
request builder → fetch transport
 ↓
runtime response validation
 ↓
SDK domain result/errors
```

## Runtime model

Consumers may load through ESM/CJS resolution with different tooling. Your build output and `exports` map define what runtime file actually executes.

## Milestones

ESM core → CJS compatibility decision → types/declarations → abort/deadline → errors → package exports → consumer matrix → publish dry run.

## Acceptance criteria

`import` and supported `require` usage work exactly as documented; no dual-package duplicate singleton hazard; declarations resolve; source maps produce useful stacks; `npm pack` contains only intended files; Node 22/24/26 matrix passes if promised.

## Security

Do not log tokens; validate URLs/options; prevent retrying unsafe writes by default; use TLS verification; publish only from protected CI.

## Performance

Reuse HTTP connections through runtime client behavior, stream large bodies where API permits, avoid clone/serialization work in middleware chains.

## Testing

Local fake HTTP server, abort, timeout, retry-after/transient errors, malformed response, ESM consumer, CJS consumer, TypeScript compile consumer, package install from tarball.

## Failure modes

Export path mismatch, `default` interop mismatch, declaration path mismatch, consumer bundler issue, duplicated state, breaking error shape.

## Observability

Expose hooks/callbacks or interoperable trace context without forcing one logging vendor.

## Deployment

Semver, changelog, deprecation window, provenance, signed/protected release workflow.

## Common mistakes

Publishing raw TS to `node_modules`, deep imports, environment-specific globals, unbounded automatic retries, changing error classes in patch release.

## Stretch goals

Conditional browser export, OpenTelemetry instrumentation hook, generated API layer behind stable hand-written facade.

## Interview questions

How do package `exports` affect consumers? What is the dual package hazard? Why is TypeScript declaration compatibility an API concern?

## Design review

Describe one change that requires a major version even if runtime implementation seems backward compatible.
