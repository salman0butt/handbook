---
title: Node.js API & Handbook Coverage
---

# Node.js API & Handbook Coverage

**Audit baseline:** Node.js 26 Current, Node.js 24 Active LTS, Node.js 22 Maintenance LTS; official Node API/release documentation rechecked on 30 July 2026.

## Legend

- ✅ complete
- 🟠 partial / supporting coverage intentionally concentrated in another chapter
- 🟡 planned
- ⚠️ deprecated / migration-only
- 🧪 experimental / version-sensitive
- ⛔ intentionally excluded from the stable core learning path

No stable **in-scope** area remains 🟡.

## Contract coverage

| Area | Status | Handbook coverage / decision |
|---|---:|---|
| core runtime / CLI / REPL | ✅ | intro, Start Here, Foundations, process/runtime chapters |
| process | ✅ | process lifecycle, argv/env/cwd, signals, exits, failures, stdio |
| globals / Web-compatible globals | ✅ | globalThis, Buffer, timers, URL, AbortController, structuredClone, fetch/Web APIs |
| CommonJS | ✅ | require, exports/module.exports, cache, cycles, migration |
| ECMAScript Modules | ✅ | package type, extensions, resolution, import.meta, TLA, interop |
| package exports/imports / package resolution | ✅ | package contracts, conditional exports, dual-package hazards |
| npm/package management | ✅ | package.json, lockfile, dependency types, workspaces, ci, publish, supply chain |
| async model / Promises | ✅ | callbacks, Promise combinators, await, cancellation, concurrency limits |
| event loop | ✅ | phases as mental model, microtasks, nextTick, fairness, blocking, lag |
| timers | ✅ | timeout/interval/immediate/nextTick/microtasks, ref/unref, drift |
| buffer / typed binary data | ✅ | Buffer/Uint8Array/ArrayBuffer, encodings, allocation, memory/security |
| streams | ✅ | Readable/Writable/Duplex/Transform, pipeline, backpressure, async iteration, Web Streams |
| filesystem | ✅ | fs/promises, handles, sync/async, atomic writes, races, watches, descriptors |
| path / file URLs | ✅ | POSIX/Windows, join/resolve, ESM paths, URL conversions, traversal |
| events | ✅ | EventEmitter/EventTarget, error event, listener lifecycle, architecture |
| HTTP | ✅ | server/request/response, headers/methods/status, streaming, keepalive, timeouts, shutdown |
| HTTPS / TLS | ✅ | certs, trust, SNI, ALPN, TLS termination/rotation |
| HTTP/2 | ✅ | sessions/streams, multiplexing, flow/lifecycle concepts |
| fetch / Request / Response / Headers | ✅ | modern Web API chapter with cancellation/streaming/runtime differences |
| net / TCP | ✅ | sockets, lifecycle, half-open, framing, backpressure, keepalive/timeouts |
| dgram / UDP | ✅ | datagrams, delivery/ordering limitations, failure model |
| DNS | ✅ | lookup vs resolve, OS resolver, IPv4/6, discovery/caching/failures |
| child_process | ✅ | spawn/exec/execFile/fork, stdio, IPC, signals, injection |
| worker_threads | ✅ | Worker, ports/channels, clone/transfer/share, pools, failure/cancel |
| cluster | ✅ | process scaling, when cluster fits vs external orchestration |
| memory / GC | ✅ | V8 heap, external memory, RSS, leaks, snapshots, OOM/tuning |
| V8 APIs / mental model | ✅ | conceptual V8 chapter + diagnostics; unstable internals not treated as contracts |
| errors | ✅ | custom errors, cause/AggregateError, async/process-level strategy |
| console / logging | ✅ | console/stdout/stderr plus production structured-logging architecture |
| environment files / configuration | ✅ | process.env, Node `.env` APIs/flags, layering, validation, secrets |
| runtime validation | ✅ | HTTP/env/JSON/queue/DB/API/file/CLI/IPC boundaries |
| crypto / Web Crypto concepts | ✅ | randomness, hashes/HMAC, encryption/signatures/KDF, key lifecycle, misuse |
| test runner | ✅ | stable `node:test`, assertions/mocks/timers/filter/reporters; experimental features labelled |
| TypeScript integration | ✅ | NodeNext, ESM/CJS, build/run, source maps, stable native type stripping limits |
| diagnostics / inspector / reports | ✅ | inspector, stack/source maps, reports, heap/CPU profiles, event-loop metrics |
| performance APIs/concepts | ✅ | perf measurement, event loop, GC/pools/backpressure/load tests/flamegraphs |
| observability | ✅ | logs/metrics/traces, OTel, IDs, percentiles, saturation, RED/USE |
| AsyncLocalStorage / async context | 🟠 | treated as an observability/context-propagation tool; exact low-level async-hook internals intentionally not a main programming model |
| async_hooks low-level APIs | 🟠 | diagnostics chapter warns about complexity/overhead; prefer supported higher-level context tooling |
| readline / TTY | ✅ | CLI chapter covers stdin/stdout/stderr, TTY, prompts and terminal behavior conceptually |
| REPL | ✅ | Foundations; operational use only, not a production architecture |
| os module | 🟠 | OS/kernel/platform/resource concepts throughout; individual convenience getters are reference-level APIs |
| util | 🟠 | promisify/env parsing and runtime utility concepts where relevant; not a method-by-method catalog |
| zlib | ✅ | compression represented in async I/O, streams, performance and projects |
| string_decoder | 🟠 | encoding/chunk-boundary concerns covered in buffers/streaming project; specialized API not taught exhaustively |
| vm | ⛔ | intentionally excluded as a security sandbox; specialized embedding API outside core backend path |
| domain module | ⚠️ | legacy/deprecated-style error-domain patterns are not recommended for new architecture |
| querystring | ⚠️ | legacy compatibility only; URLSearchParams taught for modern URL query semantics |
| punycode built-in | ⚠️ | deprecated/migration-only rather than recommended new code |
| diagnostics_channel | 🟠 | observability/diagnostics concepts covered; direct instrumentation API is advanced library/platform territory |
| native addons / Node-API | ✅ | ABI concept, C/C++, build/distribution, performance/security/portability |
| WebAssembly | ✅ | loading, memory, JS boundary, use cases, sandbox caveat, native comparison |
| WASI | 🧪 | version-sensitive/specialized; referenced only where permission/capability boundaries matter |
| experimental FFI / advanced native capability | 🧪 | not taught as stable; permission implications labelled |
| Permission Model | ✅ | stable current model, capabilities, threat model, limitations, OS/container layering |
| single executable / embedding/special packaging APIs | ⛔ | specialized distribution path outside the requested backend/platform curriculum |
| inspector permission / runtime hardening | ✅ | diagnostics + permissions security guidance |
| security | ✅ | injection, traversal, SSRF, prototype pollution, XSS/CSRF/CORS, secrets, TLS, supply chain, permission model |
| production engineering | ✅ | shutdown, resilience, operations, containers/K8s, CI/CD, incidents |
| databases / cache / queues / messaging | ✅ | framework-independent Node integration + Postgres/Mongo/Redis/jobs/events |
| distributed systems | ✅ | partial failure, consistency, retries/idempotency, time/order, sagas/workflows |
| architecture | ✅ | API/domain, modules, microservices, modular monolith, serverless, staff platform |
| migration/upgrades | ✅ | CJS→ESM, schema expand/contract, Node major/fleet governance |
| scaling / load testing | ✅ | replicas, pools, hot spots, WebSockets, workload models/capacity |
| projects | ✅ | 10 projects + production capstone |
| interview mastery | ✅ | progression, deep-dive answer models, 320-question bank, 15 mock rounds |

## Version-sensitive audit notes

- ✅ Production guidance targets supported LTS lines; Current is used for newest stable behavior checks.
- ✅ `node:test` core and MockTimers are taught as stable; 🧪 watch mode and built-in test coverage are labelled experimental for the audited v26.5 docs.
- ✅ Permission Model is taught as stable but **not a malicious-code sandbox**.
- ✅ Node TypeScript type stripping is taught as stable execution support that does **not** type-check or honor tsconfig transforms/paths.
- 🧪 ambiguous `.js` syntax detection is labelled release-candidate/version-sensitive; packages are told to set explicit `type`.
- ✅ stable `import.meta.dirname` / `import.meta.filename` are used only for supported current lines and the generic URL model remains documented.

## Audit rule

When Node releases a new major/LTS, recheck the release schedule plus API stability markers for modules, tests, permissions, TypeScript execution, module loading, Web APIs, diagnostics, deprecations, and security notes before changing handbook status.
