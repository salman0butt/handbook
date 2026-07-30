---
title: JavaScript Interview Mastery
description: Mechanism-first frameworks for answering JavaScript interviews from fundamentals to staff architecture.
sidebar_position: 31
id: overview
---

# JavaScript Interview Mastery

The goal is to answer from **mechanisms and boundaries**, not trivia.

## Answer framework

For language questions:

```text
1. classify: syntax / runtime semantics / host API / engine implementation
2. state the governing rule
3. walk the evaluation order
4. show the observable result
5. name the edge case or trade-off
```

For production questions:

```text
symptom → evidence → hypothesis → smallest experiment → fix → regression guard
```

For architecture questions:

```text
requirements → ownership → boundaries → data flow → failure modes
             → security/performance constraints → evolution strategy
```

## High-value mental models

### Scope, hoisting and TDZ
Declarations are instantiated before ordinary execution, but different binding kinds initialize differently. `let`/`const` bindings exist in the lexical environment before initialization and are inaccessible in the TDZ; saying they are “not hoisted” hides the mechanism.

### Closures
A closure retains access to reachable **bindings**, not a frozen copy of values. Use this to explain loops, callbacks, private state, memoization, and memory retention.

### `this`
For ordinary functions, reason from the call form/reference and strictness. `obj.m()` can supply `obj` as receiver; extracting `const f = obj.m; f()` changes the call site. Arrow functions do not create their own `this`.

### Prototypes and classes
Objects delegate property lookup through `[[Prototype]]`. Class syntax organizes constructor/prototype behavior plus fields/private elements; it does not replace prototypes.

### Coercion and equality
Do not memorize odd outputs. Trace abstract conversions: object-to-primitive, numeric/string conversion, then the specific equality/relational algorithm. Distinguish Strict Equality, SameValue, and SameValueZero.

### Promises, async/await and event loop
Promises model eventual settlement and schedule reactions as Jobs. Browsers integrate those Jobs with a host event loop/microtask queue; timers and rendering are host concerns. `await` suspends the async function and resumes via Promise machinery.

### Modules
ESM has a statically analyzable graph, live bindings, strict semantics, instantiation before evaluation, and well-defined cycle behavior. Imports are not ordinary copied variables.

### Memory and performance
ECMAScript specifies reachability-relevant semantics, not a concrete stack/heap layout or JIT. Treat hidden classes, inline caches, tiering, and deoptimization as engine mental models. Measure first.

### DOM / fetch / timers
These are Web APIs supplied by the browser host. Explain the host boundary explicitly; it prevents category errors in interviews.

### Security
Identify trust boundaries and dangerous sinks. XSS is fundamentally about attacker-controlled data reaching an executable/HTML interpretation sink. CORS is not an authorization system, and client-side validation is not a security boundary.

## Senior scenario drills

1. **Stale search results:** use request identity and/or `AbortController`; only the active request may commit state.
2. **Slow UI with fast network:** profile main-thread scripting/layout/paint before blaming fetch.
3. **Memory grows after navigation:** inspect retained listeners, timers, observer subscriptions, caches, detached DOM, and closures.
4. **Cyclic ESM crash:** distinguish a legal cycle from reading an imported binding before its exporting module initialized it.
5. **Library API evolution:** stabilize semantics and error/cancellation contracts, not internal module layout.
6. **Cross-realm `instanceof`:** prefer brand/structural checks appropriate to the API; constructors differ across realms.
7. **Retry storm:** bound retries, use jitter/backoff, classify retryability, and respect idempotency/cancellation.

## Staff-level interview posture

Staff answers include organizational consequences: target-browser policy, dependency governance, security review, performance budgets, observability, migration seams, and ownership. Avoid “always use X” rules; state the condition under which a trade-off changes.

## Related study chapters

Use the numbered chapters 01–97 as the source of truth, especially 10 closures, 11 `this`, 16 prototypes, 32–35 async, 36 modules, 62 browser security, 63–71 internals/engines, 72–77 performance/debugging, 78–91 architecture, and 96–97 specification/case studies.
