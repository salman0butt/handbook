---
title: JavaScript Engine Internals
description: Parsing, bytecode, JIT optimization, shapes, inline caches and deoptimization without folklore.
---

# JavaScript Engine Internals

ECMAScript defines observable semantics, not a required implementation pipeline. V8, SpiderMonkey and JavaScriptCore use different architectures that evolve continuously.

```mermaid
flowchart LR
  S["Source"] --> P["Parse / AST"]
  P --> B["Bytecode or baseline code"]
  B --> R["Runtime profiling"]
  R --> O["Optimized machine code"]
  O -->|assumption fails| D["Deoptimization"]
  D --> B
```

## Parsing and execution

Engines tokenize/parse source, validate grammar and produce internal representations. Many use an interpreter or baseline compiler for fast startup, collect type/shape feedback, then optimize hot paths. Ahead-of-time snapshots, caching and tiering strategies differ.

## Shapes and hidden classes

Engines often describe object layout using shapes/structures/hidden classes. Creating properties in consistent order can help property access become predictable. This is an optimization strategy, not a language rule.

```javascript
function createPoint(x, y) {
  return {x, y} // consistent layout
}
```

Do not contort domain code merely to preserve one engine’s current shape heuristic.

## Inline caches

A property access or call site can cache observed receiver shapes/targets. Monomorphic sites observe one form, polymorphic sites several, and highly variable sites may become megamorphic. Optimization names and thresholds are engine-specific.

## Arrays

Engines may represent packed integer, double, object and holey arrays differently. Sparse indexes and mixed element kinds can change representation. Choose arrays based on semantics; use TypedArray when a fixed binary numeric format is the actual contract.

## Deoptimization

Optimized code relies on guards. Unexpected types, shapes or dynamic features can invalidate assumptions and return execution to a lower tier. Deoptimization is normal adaptive behavior, not automatically a bug.

## Closures and stack frames

Captured bindings may move into heap-allocated contexts; non-captured locals may stay in optimized frames or registers. ECMAScript does not expose that placement.

## Practical optimization rules

1. Improve algorithms and I/O first.
2. Measure production-representative workloads.
3. Keep object models and value types understandable.
4. Avoid `eval`, excessive Proxy use and prototype mutation in hot paths.
5. Re-measure after runtime upgrades.

Microbenchmarks can be invalidated by dead-code elimination, warmup, GC, timer resolution and unrealistic data. Use engine tracing only after an application profile identifies a hot function.

## Primary references

- [V8 documentation](https://v8.dev/docs)
- [SpiderMonkey internals](https://firefox-source-docs.mozilla.org/js/)
- [JavaScriptCore overview](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html)
