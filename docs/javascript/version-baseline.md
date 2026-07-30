---
title: Version Baseline
description: ECMAScript 2026 annual snapshot, living-spec Stage-4 additions, Temporal and compatibility baseline checked 30 July 2026.
sidebar_position: 2
id: version-baseline
---

# Version Baseline

**Checked:** 30 July 2026 (Asia/Karachi)

## Published annual baseline

✅ **ECMAScript 2026 = ECMA-262 17th edition**, approved by Ecma International on **30 June 2026**.

Headline ES2026 language additions:

| Addition | Snapshot status | Practical note |
| --- | --- | --- |
| `Math.sumPrecise(iterable)` | ✅ ES2026 | More accurate summation of Numbers with varying magnitudes |
| `Iterator.concat(...iterables)` | ✅ ES2026 | Lazy sequencing of iterables |
| `Array.fromAsync(source, mapFn?)` | ✅ ES2026 | Build an Array from async/sync iterable or array-like async sources |
| `Error.isError(value)` | ✅ ES2026 | Realm-safe Error brand check |
| `Map.prototype.getOrInsert` / `getOrInsertComputed` | ✅ ES2026 | Retrieve-or-insert without duplicate lookup logic |
| `WeakMap.prototype.getOrInsert` / `getOrInsertComputed` | ✅ ES2026 | Weak-key equivalent |
| `Uint8Array.fromBase64` / `fromHex` | ✅ ES2026 | Decode text into bytes |
| `Uint8Array.prototype.setFromBase64` / `setFromHex` | ✅ ES2026 | Decode into an existing byte array |
| `Uint8Array.prototype.toBase64` / `toHex` | ✅ ES2026 | Encode bytes as text |
| `JSON.parse` reviver source context | ✅ ES2026 | Primitive reviver calls can receive source text context |
| `JSON.rawJSON` / `JSON.isRawJSON` | ✅ ES2026 | Controlled raw primitive JSON serialization |

Do not invent this list from proposal memory: it is derived from the 2026 ECMA-262 snapshot.

## Living specification after the 2026 snapshot

The living TC39 document at `tc39.es/ecma262/` is titled **ECMAScript 2027 Language Specification** as of this check. It consists of the latest annual snapshot plus finished Stage-4 proposals integrated for the next yearly snapshot.

Current post-snapshot finished work includes:

- 🆕 **Explicit Resource Management** — `using`, `await using`, `DisposableStack`, `AsyncDisposableStack`, `SuppressedError`, `Symbol.dispose`, `Symbol.asyncDispose`.
- 🆕 **`Atomics.pause`**.
- 🆕 **Joint Iteration** — `Iterator.zip` and `Iterator.zipKeyed`.
- 🆕 **Temporal** has reached Stage 4. Its proposal repository says it will be merged into ECMA-262/ECMA-402; implementation availability remains uneven.

Decorators are **not Stage 4** at this baseline; do not teach proposal decorators as standard JavaScript.

## Temporal compatibility snapshot

The TC39 Temporal proposal reports:

- Firefox: shipped in Firefox 139 (27 May 2025)
- Chrome/V8: shipped in Chrome 144 (13 January 2026)
- Node.js: shipped in Node 26 (5 May 2026)
- Safari/JavaScriptCore: no shipped version listed in the Stage-4 repository status at this check

That is why this handbook labels Temporal **finished Stage 4 with target checks required**, not “available everywhere”.

## ECMA-402

The published annual companion baseline is **ECMA-402 13th edition / ECMAScript 2026 Internationalization API**. The living ECMA-402 draft is already the 2027/14th-edition draft.

## Compatibility rule

```text
standardized
    ≠ implemented in every engine
    ≠ enabled in every deployed runtime
    ≠ syntax a transpiler can safely polyfill
```

For production code, define supported runtime/browser targets and verify syntax, built-ins, and host APIs separately.
