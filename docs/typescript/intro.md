---
title: TypeScript Handbook
description: A production-focused TypeScript 7 handbook from JavaScript foundations to staff-level architecture and type-system reasoning.
slug: /typescript/intro
---

# TypeScript Developer Handbook

This handbook teaches TypeScript as an engineering system, not as a list of syntax features. It starts from JavaScript, builds a precise mental model of static checking and runtime behavior, then moves through inference, assignability, narrowing, generics, module systems, declaration authoring, architecture, production operations, migrations, performance, testing, compiler reasoning, and interview mastery.

> **Baseline:** ✅ TypeScript 7.0 is the stable baseline for this handbook. TypeScript 7 was released on July 8, 2026. Where 7.0 differs from TypeScript 6.x, the difference is called out explicitly. Experimental, preview, beta, RC, nightly, legacy, or migration-only behavior is labelled rather than taught as stable.

## The core mental model

```text
JavaScript runtime
    executes values and effects
              │
              ▼
TypeScript static type system
    models relationships between values
              │
              ▼
TypeScript compiler / checker
    parses, binds, infers, checks, diagnoses
              │
              ▼
optional JavaScript / declaration emit
```

TypeScript does **not** replace JavaScript. JavaScript remains the runtime language. Most TypeScript types disappear before code executes.

```ts
type User = { id: number }

const user = JSON.parse(input) as User
```

The assertion above does not validate the JSON. It only tells the checker to trust the programmer. A safe boundary looks like this instead:

```text
untrusted runtime value
        ↓
      unknown
        ↓
runtime validation
        ↓
trusted domain type
```

This distinction appears throughout the handbook because it explains many production bugs: a program can be perfectly type-correct and still fail at runtime when its assumptions about external values are false.

## What you will become able to reason about

By the end, you should be able to explain why a literal widened, why narrowing disappeared, why a conditional type distributed, how `infer` works, why a callback is assignable, why generic inference failed, when to choose a union vs overload vs generic, when to derive types from runtime schemas, whether frontend and backend should share a type, why code compiles but fails at runtime, where TypeScript is intentionally unsound, why an editor is slow, how project references change large-repo builds, and how to evolve a public generic API without destroying inference ergonomics.

## Layer map

| Layer | Responsibility | Typical failure |
|---|---|---|
| JavaScript runtime | values, objects, prototypes, promises, I/O | runtime exception or incorrect behavior |
| TypeScript type system | static relationships between possible values | assignability, inference, narrowing error |
| TypeScript compiler | parse/check/emit/configuration | diagnostics, resolution or emit issue |
| Language service / editor | completions, hovers, refactors, incremental diagnostics | stale/mismatched editor state |
| Node.js / browser | actual runtime module and platform semantics | import/runtime/API mismatch |
| bundler/framework | transform, graph, chunking, environment rules | code works in checker but fails after build |

## Status legend

- ✅ stable and recommended where appropriate
- ⚠️ deprecated, legacy, or migration-only
- 🧪 experimental or version-sensitive
- ⛔ intentionally excluded from stable guidance

## Learning path

```text
JavaScript developer
        ↓
TypeScript beginner
        ↓
productive application developer
        ↓
advanced TypeScript developer
        ↓
senior TypeScript engineer
        ↓
library/framework author
        ↓
staff-level architecture and type-system reasoning
        ↓
production + interview mastery
```

Use the handbook sequentially for learning, or jump directly to TSConfig, modules, runtime validation, architecture, debugging, compiler reasoning, projects, or interviews when using it as a professional reference.