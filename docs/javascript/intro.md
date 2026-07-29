---
title: JavaScript Developer Handbook
description: Complete JavaScript handbook from ECMAScript fundamentals to browser engineering, language internals, architecture, projects, and interview mastery.
slug: /javascript
---

# JavaScript Developer Handbook

**Status: Complete content path — validation and publication evidence are tracked in the final audit.**

This handbook teaches JavaScript as a layered system, not as a collection of syntax tricks.

```text
application JavaScript
        ↓
ECMAScript language (ECMA-262)
        ↓
JavaScript engine (V8 / SpiderMonkey / JavaScriptCore / others)
        ↓
host environment
   ├─ browser Web APIs: DOM, fetch, timers, storage, workers
   └─ Node.js APIs: fs, process, streams, HTTP, worker_threads
        ↓
OS / browser / runtime
```

A central rule throughout the handbook is that **DOM, `fetch`, `setTimeout`, `console`, `localStorage`, and Node APIs are not ECMAScript language features**. ECMAScript defines the core language and standard library; hosts add environment-specific capabilities.

## Start here

- [00 — Start Here](./00-start-here.md)
- [Version baseline](./version-baseline.md)
- [01 — Fundamentals](./01-fundamentals.md)
- [02 — Variables and declarations](./02-variables-and-declarations.md)
- [03 — Types](./03-types.md)
- [04 — Coercion](./04-coercion.md)
- [09 — Functions](./09-functions.md)
- [10 — Function internals and closures](./10-function-internals.md)
- [11 — `this`](./11-this.md)
- [16 — Prototypes](./16-prototypes.md)
- [17 — Classes](./17-classes.md)

## Deep JavaScript

Continue through the numbered chapters for built-ins, iteration, async JavaScript, modules, browser APIs, security, performance, language internals, architecture, and the specification-reading path.

## Build and prepare

- [Projects and capstone](./projects/index.md)
- [Interview mastery](./interview-mastery/index.md)
- [350-question bank](./interview-question-bank/index.md)
- [15 mock interview rounds](./mock-interview-practice/index.md)
- [API coverage contract](./reference/api-coverage.md)
- [Final completeness audit](./reference/final-completeness-audit.md)

## Status vocabulary

| Mark | Meaning |
|---|---|
| ✅ | Standardized and broadly usable |
| ◐ | Standardized, but implementation availability still needs checking |
| 🆕 | Finished Stage 4 / in the living specification, possibly newer than the annual snapshot |
| 🧪 | Stage 3 proposal — not production-standard JavaScript |
| ⚠️ | Legacy, Annex B, discouraged, or compatibility-only |
| ⛔ | Obsolete, deprecated, or non-standard |

The published annual baseline used here is **ECMAScript 2026 / ECMA-262 17th edition (June 2026)**. The living TC39 specification can contain additional finished Stage-4 work after that snapshot, so version-sensitive chapters record both standard status and runtime availability.
