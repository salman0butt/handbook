---
title: 92–97 — ECMAScript History, 2026, TC39, Legacy JavaScript & Specification Reasoning
---

# 92–97 — ECMAScript History, 2026, TC39, Legacy JavaScript & Specification Reasoning

## 92 — ECMAScript History

JavaScript was created in 1995 and standardized as ECMAScript so multiple implementations could converge on common language behavior.

### ES1–ES3

The first editions standardized the core language used by early browsers: functions, objects, prototypes, arrays, strings, numbers, regular expressions, statements, and dynamic behavior. ES3 (1999) became the long-lived baseline for classic web JavaScript.

### ES4: reserved, not published

“ECMAScript 4” was an ambitious design effort, but ECMA-262 Edition 4 was never published. Some ideas influenced later language evolution, but do not describe a mythical stable ES4 runtime.

### ES5 / ES5.1

ES5 modernized the language with strict mode, JSON APIs, property descriptors, `Object.create`, array iteration helpers such as `map`/`filter`/`reduce`, and other improvements that made disciplined application/library code easier.

Older code often uses constructor/prototype functions, IIFEs, callback patterns, manual inheritance, and global namespaces because modern modules/classes/Promises did not yet exist or were not broadly available.

### ES2015 / ES6

ES2015 was the largest modernizing release: lexical `let`/`const`, classes, arrow functions, template literals, destructuring, default/rest parameters, spread, Promises, modules, Symbols, Map/Set, iterators/generators, Proxy/Reflect, typed-array standardization work, and more.

It replaced many ecosystem conventions with language-level facilities, but not always one-for-one: classes did not remove prototypes, modules did not make every bundler concern part of ECMAScript, and arrows did not replace ordinary functions.

### Annual model: ES2016 onward

TC39 moved to smaller yearly editions. Important milestones include:

- **ES2016** — exponentiation operator, `Array.prototype.includes`.
- **ES2017** — async functions, `Object.values`/`entries`, string padding, shared-memory/Atomics work.
- **ES2018** — object rest/spread, async iteration, Promise `finally`, major RegExp additions.
- **ES2019** — `flat`/`flatMap`, `Object.fromEntries`, optional catch binding, stable sort requirements, trim aliases.
- **ES2020** — BigInt, dynamic import, optional chaining, nullish coalescing, `Promise.allSettled`, `globalThis`, module namespace refinements.
- **ES2021** — logical assignment, numeric separators, `Promise.any`/`AggregateError`, `replaceAll`, WeakRef/FinalizationRegistry.
- **ES2022** — class fields/private/static initialization, top-level await, `Error.cause`, `.at`, RegExp indices.
- **ES2023** — change-array-by-copy (`toSorted`, `toReversed`, `toSpliced`, `with`), `findLast`/`findLastIndex`, related standard refinements.
- **ES2024** — current features from that annual snapshot including modern Promise/ArrayBuffer/string/RegExp refinements; consult the edition rather than memorized blog lists.
- **ES2025** — iterator helpers, Set operations, import attributes and other completed work captured by that annual edition.
- **ES2026** — 17th edition; see the dedicated chapter below for the authoritative current snapshot.

The precise feature list belongs to each normative annual specification; history is most useful when it explains why old patterns exist and which modern facilities replace them.

---

## 93 — ECMAScript 2026

**Authoritative baseline:** ECMA-262 17th edition, June 2026.

The 2026 edition is the published snapshot this handbook targets. Do not build a “2026 features” list from memory or marketing pages; use the edition's change history and merged Stage-4 proposals as the source of truth.

Meaningful current-baseline APIs/syntax that this handbook explicitly covers include modern Promise capabilities such as `Promise.try`, finished resource-management facilities, current iterator/collection improvements, current module/import-attribute semantics, current RegExp/binary-data changes, and specification refinements merged before the 17th-edition snapshot.

Because many notable APIs landed over adjacent yearly editions, “available in 2026 JavaScript” is different from “introduced by ES2026.” The API coverage table labels stable APIs without pretending every one was first added in 2026.

### How to audit the edition

1. Open the ECMA-262 17th-edition normative HTML.
2. Inspect the introduction/change history and clauses for built-ins/syntax.
3. Cross-check TC39 finished proposals that were merged for the snapshot.
4. Verify MDN compatibility for target browsers/runtimes.
5. Separate ECMA-402 (`Intl`) and host Web APIs from ECMA-262.

### Availability warning

Even if syntax/API is in ECMA-262 2026, older evergreen browsers, enterprise versions, embedded WebViews, runtimes, or build tools may lack it. Production target policy always wins over “latest standard.”

---

## 94 — TC39 and the Future of JavaScript

TC39 is Ecma's technical committee responsible for evolving ECMAScript. Proposals progress through maturity stages.

```text
idea
 ↓
Stage 0 — strawperson / incubation entry
 ↓
Stage 1 — proposal: problem/shape worth exploring
 ↓
Stage 2 — draft: likely overall direction, more design work remains
 ↓
Stage 2.7 — current process checkpoint: specification largely complete enough for implementation/testing advancement, while remaining criteria precede Stage 3
 ↓
Stage 3 — candidate: specification complete enough for implementation feedback/test validation
 ↓
Stage 4 — finished: acceptance criteria met; eligible for inclusion/merge into ECMAScript
 ↓
annual ECMA-262 snapshot
```

Stage definitions evolve over time, so consult the current TC39 process document.

### Status policy in this handbook

- ✅ Published/current-standard material can be taught as JavaScript.
- 🆕 Stage 4 is finished language work; label compatibility if newer than the annual edition or not broadly shipped.
- 🧪 Stage 3 is a proposal, not production-standard JavaScript.
- Stage 0–2.7 must never be presented as established language behavior.

### Current proposal table

Proposal inventories change at TC39 meetings. The maintained source of truth is the official TC39 proposals repository/site. At the July 2026 check, examples in Stage 3 included proposals such as Source Phase Imports, Dynamic Code Brand Checks, Deferring Module Evaluation, Import Text, iterator chunking, Iterator Includes, and Iterator Join; these are intentionally **not** taught here as stable ECMAScript.

| Example | Status at final research check | Handbook policy |
|---|---|---|
| Temporal | Stage 4 | Standardized/finished; compatibility note required |
| Source Phase Imports | Stage 3 | Proposal only |
| Dynamic Code Brand Checks | Stage 3 | Proposal only |
| Import Text | Stage 3 | Proposal only |
| Iterator chunking | Stage 3 | Proposal only |
| Iterator Includes / Join | Stage 3 | Proposal only |

Always re-check before relying on this table because stage advancement is time-sensitive.

---

## 95 — Legacy and Annex B JavaScript

The web must preserve old content, so ECMAScript contains compatibility behavior that should not guide new design.

### Sloppy mode

Classic scripts can run without strict mode, enabling legacy behavior such as global-`this` substitution and accidental global assignment in cases strict mode rejects. New module code is strict automatically.

### `with`

```js
// legacy / forbidden in strict mode
with (object) {
  // ambiguous identifier resolution
}
```

`with` makes static name resolution, optimization, auditing, and tooling difficult. Never use it in modern code.

### `arguments.callee`

Legacy self-reference mechanism; forbidden/restricted in strict mode. Use named functions.

### Annex B

Annex B contains web-legacy compatibility features/semantics, including historical interactions around block-level function declarations and legacy web behavior. Its presence explains why old browser code can behave differently from clean strict/module code.

### Legacy globals and RegExp behavior

Browsers expose many historical global properties and RegExp legacy behaviors for compatibility. Avoid relying on implicit element-id globals or legacy static RegExp capture properties. Use explicit DOM selection and match results.

### Prototype patterns

Before classes/modules, patterns such as constructor functions, manual prototype assignment, IIFEs, and revealing-module objects were common. Understand them to maintain old code; do not mechanically rewrite working legacy code without tests and compatibility analysis.

---

## 96 — Specification Reading

ECMA-262 becomes approachable when you know its vocabulary.

### Normative vs informative

Normative clauses/algorithms define required language behavior. Notes/examples often explain intent but are not independently normative requirements. Annex status matters; host-defined/implementation-defined permissions must be read carefully.

### Grammar

Lexical grammar defines tokens; syntactic grammar defines program structure. Grammar parameters and lookahead restrictions explain syntax that cannot be derived from simple precedence charts.

### Algorithms

Specification algorithms are pseudocode over spec types/operations. They use assertions, numbered steps, abrupt completion propagation, internal slots, and abstract operations.

### Internal slots

Notation like `[[Prototype]]`, `[[Call]]`, `[[Construct]]`, `[[PromiseState]]` represents internal state/behavior not directly accessed as normal JS properties.

### Records

Records are specification data structures, not JavaScript objects. Examples include Environment Records, Reference Records, Completion Records, Job callback records, iterator records, and module records.

### Completion Records

Evaluation produces normal or abrupt completions (`return`, `throw`, break/continue-style control). The `?`/`!` shorthand in algorithms propagates or asserts completion outcomes.

### Execution contexts, realms, agents, Jobs

- execution contexts track running evaluation,
- realms group intrinsics/global environment,
- agents model independent execution + shared-memory relationships,
- Jobs model queued ECMAScript work such as Promise reactions.

### Syntax-directed operations / early errors

Some operations are attached to grammar productions, such as static semantics and early-error checks. They explain why syntax can parse into a production and still be rejected before runtime evaluation.

### Host hooks

Names beginning with `Host...` identify behavior supplied by the embedding. This is where ECMA-262 connects to browser/Node module loading, job integration, rejection tracking, time, and other host responsibilities.

### Walkthrough: `typeof null`

`null` is the Null primitive type, but `typeof null` returns the historical string `'object'` because the `typeof` operator's algorithm explicitly does so for compatibility. The result is not evidence that null is an Object language value.

### Walkthrough: detached method

1. Parse `obj.method()` as a call whose callee is a property-access expression.
2. Property access evaluates to a Reference Record with base `obj`.
3. Call evaluation derives the `this` value from that reference.
4. `const fn = obj.method` performs GetValue and stores only the function value.
5. Later `fn()` has a different reference shape, so ordinary plain-call `this` rules apply.

### Walkthrough: Promise handler ordering

1. Promise settlement triggers reaction jobs according to Promise algorithms.
2. Those jobs are enqueued through host integration.
3. Browser HTML event-loop microtask checkpoints run them after current synchronous script/task completion and before later tasks according to host rules.
4. Therefore the final ordering requires both ECMA-262 and host-spec reasoning.

---

## 97 — Language Semantics Case Studies

### `typeof null`

```js
typeof null; // 'object'
```

Null is still a primitive. The operator returns the legacy string by specification for web compatibility.

### `[] == false`

```text
[] == false
→ false ToNumber → 0
→ [] ToPrimitive → ''
→ '' ToNumber → 0
→ 0 == 0
→ true
```

### `NaN !== NaN`

Strict equality says NaN is not equal to any Number value, including itself. SameValue (`Object.is`) treats NaN as same as NaN.

### `0 === -0` vs `Object.is`

Strict equality treats signed zeros equal; SameValue distinguishes them.

### `var x = 1; let y = 2` in a browser classic script

The global environment has both object-backed and declarative components. Classic top-level `var x` can create/update a global-object property; `let y` creates a global lexical binding that is not `globalThis.y`. Modules have different top-level semantics.

### Closures in loops

`for (let i...)` creates per-iteration lexical binding behavior; `var i` uses one function/global binding. Closures capture access to bindings, not snapshots produced magically by arrow functions.

### Class TDZ

Class declarations are lexical and remain uninitialized until class evaluation reaches initialization, so accessing the class binding too early throws.

### Detached methods

Property-call reference carries the receiver; extracting the function loses that call-site base. See Reference Records.

### Promise ordering

Promise reactions become Jobs and run after current synchronous work through host microtask/job integration. Timers belong to later host tasks.

### Object property ordering

Own-key ordering distinguishes array-index keys, other string keys, then symbol keys under standardized ordering algorithms. Do not confuse this with `Map` semantics or assume every external serialization preserves intent identically.

### Prototype lookup

A missing own property causes ordinary lookup through `[[Prototype]]` until found or `null`. An inherited accessor can run with the original receiver.

### Sparse arrays

A hole means an indexed property is absent; it is not an own property containing `undefined`. Array algorithms differ in whether/how they visit holes.

### Module cycles

Modules instantiate the graph and create live bindings before all evaluations complete. A cyclic dependency may reach an imported binding before its exporting module initialized that binding, producing a `ReferenceError` rather than an `undefined` snapshot.

## Final mental model

```text
source
 ↓ grammar + early errors
execution context
 ↓ reference/environment resolution
abstract operations + object internal methods
 ↓
ECMAScript Jobs / observable language effects
 ↓ host hooks
browser / Node / other runtime APIs + scheduling
 ↓
application behavior
```

That layered model is the core skill behind advanced JavaScript reasoning.
