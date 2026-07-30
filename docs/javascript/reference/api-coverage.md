---
title: JavaScript API Coverage
description: Coverage contract for ECMA-262, ECMA-402, syntax, built-ins, modern standardized APIs, and compatibility-sensitive finished proposals.
sidebar_position: 40
id: api-coverage
---

# JavaScript API Coverage

**Audit date:** 30 July 2026. **Published baseline:** ECMA-262 17th edition / ECMAScript 2026. The living draft already targets ECMAScript 2027 and contains finished Stage-4 work after the annual snapshot.

Status legend: ✅ annual-standard / broadly usable; ✅* standardized but target support must be checked; 🆕 Stage 4 after ES2026 snapshot; 🧪 proposal below Stage 4; ⚠️ legacy/Annex B.

## Fundamental objects

| Feature/API | Status | Handbook chapter | Depth | Compatibility note |
| --- | --- | --- | --- | --- |
| Object | ✅ | 13–16 | deep | core |
| Function | ✅ | 09–12 | deep | core |
| Boolean | ✅ | 03–05 | deep | core |
| Symbol + well-known symbols | ✅ | 25 | deep | core |
| globalThis | ✅ | 02, 67 | medium | modern baseline |

## Errors

| API | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Error, cause | ✅ | 31, 86 | deep |
| AggregateError | ✅ | 31 | medium |
| EvalError | ✅ | 31 | reference/legacy relevance |
| RangeError | ✅ | 31 | medium |
| ReferenceError | ✅ | 31 | medium |
| SyntaxError | ✅ | 31, 69 | medium |
| TypeError | ✅ | 31 | medium |
| URIError | ✅ | 31, 57 | reference |
| Error.isError | ✅ ES2026 | 31, 93 | modern API |
| SuppressedError | 🆕 Stage 4 post-ES2026 | 37 | compatibility-sensitive |

## Numbers, dates and math

| API | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Number | ✅ | 20 | deep |
| BigInt | ✅ | 21 | deep |
| Math | ✅ | 20 | broad |
| Math.sumPrecise | ✅ ES2026 | 20, 93 | modern API; older targets need detection/polyfill strategy |
| Date | ✅ | 22 | deep |
| Temporal | 🆕 Stage 4 post-ES2026 | 23, 94 | limited runtime/browser availability as of audit |

## Text processing

| API | Status | Chapter | Depth |
| --- | --- | --- | --- |
| String | ✅ | 19 | deep incl. Unicode |
| RegExp | ✅ | 24 | deep incl. Unicode, lookaround, indices, ReDoS |
| RegExp.escape | ✅ ES2025 | 24 | modern |
| inline regexp modifiers | ✅ ES2025 | 24 | modern |

## Indexed and binary collections

| API | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Array + methods | ✅ | 18 | exhaustive mutating/copying coverage |
| Array.fromAsync | ✅ ES2026 | 18, 35, 93 | modern |
| ArrayBuffer / SharedArrayBuffer | ✅ | 29–30 | deep |
| DataView | ✅ | 29 | deep |
| TypedArray families | ✅ | 29 | deep |
| Float16Array / float16 DataView / Math.f16round | ✅ ES2025 | 29 | modern |
| Uint8Array base64/hex conversion APIs | ✅ ES2026 | 29, 93 | modern; target-check older runtimes |
| Atomics | ✅ | 30 | deep |
| Atomics.waitAsync | ✅ ES2024 | 30 | modern |
| Atomics.pause | 🆕 Stage 4 post-ES2026 | 30, 94 | target-check |

## Keyed and weak collections

| API | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Map | ✅ | 26 | deep |
| Set | ✅ | 26 | deep |
| WeakMap | ✅ | 26 | deep |
| WeakSet | ✅ | 26 | deep |
| Set composition methods | ✅ ES2025 | 26 | modern |
| Map/WeakMap get-or-insert helpers | ✅ ES2026 | 26, 93 | modern |
| WeakRef | ✅ | 41 | deep cautions |
| FinalizationRegistry | ✅ | 41 | deep cautions |

## Control abstraction and iteration

| API / syntax | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Promise | ✅ | 32–34 | deep |
| Promise.withResolvers | ✅ ES2024 | 32 | modern |
| Promise.try | ✅ ES2025 | 32 | modern |
| Iterator global/helpers | ✅ ES2025 | 27 | deep |
| Iterator.concat | ✅ ES2026 | 27, 93 | modern |
| Generator / yield / yield* | ✅ | 28 | deep |
| async iterators / async generators / for-await-of | ✅ | 35 | deep |
| joint iteration helpers | 🆕 Stage 4 post-ES2026 | 27, 94 | compatibility-sensitive |

## Reflection, metaprogramming and resource management

| API / syntax | Status | Chapter | Depth |
| --- | --- | --- | --- |
| Proxy | ✅ | 38 | deep incl. invariants |
| Reflect | ✅ | 39 | complete API |
| descriptors / prototype reflection | ✅ | 14, 16, 40 | deep |
| `using`, `await using` | 🆕 Stage 4 post-ES2026 | 37 | compatibility-sensitive |
| Symbol.dispose / Symbol.asyncDispose | 🆕 Stage 4 post-ES2026 | 25, 37 | compatibility-sensitive |
| DisposableStack / AsyncDisposableStack | 🆕 Stage 4 post-ES2026 | 37 | compatibility-sensitive |
| decorators | 🧪 Stage 2.7 as of May 2026 | 40, 94 | do not teach as stable |

## Structured data and globals

JSON coverage includes `parse`, `stringify`, replacer, reviver, cycles/limitations, BigInt strategy, security/prototype concerns, ES2026 reviver source context, and `JSON.rawJSON`. URI encoding globals are covered with URL APIs; numeric parsing/finite/NaN globals are covered with Numbers; `eval` is covered as legacy/security-sensitive.

## Statements and declarations audit

Covered: block, `var`, `let`, `const`, function declarations, class declarations, `if/else`, `switch`, `for`, `for...in`, `for...of`, `while`, `do...while`, `break`, `continue`, labels, `return`, `throw`, `try/catch/finally`, `debugger`, `with` as legacy, `import`/`export`, async/generator declarations, and resource-management syntax with status labels.

## Expressions and operators audit

Covered: primary/literal expressions, property access, calls, `new`, optional chaining, tagged templates, class/function/arrow expressions, `await`, `yield`, spread/rest by grammar role, destructuring, arithmetic, exponentiation, comparison, equality, logical/nullish, assignment/logical assignment, bitwise, conditional, comma, `typeof`, `void`, `delete`, `in`, `instanceof`, precedence/associativity and evaluation order.

## ECMA-402 coverage

Intl, Locale, Collator, DateTimeFormat, NumberFormat, RelativeTimeFormat, ListFormat, PluralRules, DisplayNames, Segmenter, DurationFormat where supported/current, locale negotiation, Unicode extensions, calendars, numbering systems and time zones are covered in chapter 47. ECMA-402 ownership is explicitly separate from ECMA-262.

## Browser-host coverage

DOM, EventTarget/events, forms/constraint validation, fetch/Request/Response/Headers/AbortController, URL/URLSearchParams, storage, timers, queueMicrotask, requestAnimationFrame, Web Workers, structured clone, CORS/CSP/Trusted Types and browser security are chapters 51–62 and are labelled Web/host APIs rather than ECMAScript.

## No unexplained stable gaps

Stable core features discovered in the ECMA-262/MDN reference audit are either taught in a numbered chapter or classified on this page. Compatibility-sensitive post-snapshot Stage-4 work is not silently promoted to “available everywhere.”
