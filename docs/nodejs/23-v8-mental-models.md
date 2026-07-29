---
title: V8 Mental Models
---

# V8 Mental Models

V8 is the JavaScript engine used by Node. It parses source, executes JavaScript, manages JavaScript memory, and may optimize hot code. The exact optimizer pipeline changes; production code should target language/runtime contracts rather than private internals.

## Conceptual execution

```text
source
  ↓ parse
syntax / bytecode-like execution machinery
  ↓ observe runtime behavior
possible optimization of hot paths
  ↓
deoptimization when assumptions stop holding
```

Shapes/hidden classes and inline-cache concepts help explain why stable object layouts can be efficient, but they are not reasons to write unreadable code based on a blog post about one V8 version.

## Performance priorities

1. choose the right algorithm/data structure;
2. avoid unnecessary I/O and serialization;
3. control concurrency and allocation;
4. profile real workloads;
5. optimize proven hotspots;
6. re-measure.

## GC

Garbage collection pauses/work can affect latency. Excessive temporary object creation, huge retained graphs, and memory pressure can raise GC cost. Avoid “GC tuning” before proving GC is a limiting factor.

## Flags

Node exposes V8/runtime flags for diagnostics and tuning. Flags can change between versions and may have global consequences. Document every non-default production flag, owner, reason, benchmark, and rollback condition.

**Rule:** use V8 knowledge to form hypotheses; use profiles and metrics to decide.
