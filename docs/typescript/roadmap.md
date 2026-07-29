---
title: Learning Roadmap
---

# Learning roadmap

The curriculum is organized as a progression rather than a syntax index.

```text
00 Start Here
   ↓
01–10 language foundations + proof-oriented safety
   ↓
11–25 generics, type manipulation, inference, compatibility, API design
   ↓
26–39 modules, config, declarations, libraries, runtimes, React/Node
   ↓
40–49 architecture, domain modeling, type-level work, compiler reasoning, debugging
   ↓
50–59 testing, linting, builds, security, production, migration, senior/staff design
   ↓
60 projects
   ↓
61 interview mastery
   ↓
62 300+ question bank
   ↓
63 mock interview practice
   ↓
Reference + coverage + final audit
```

## How to study each concept

For important features, ask the same engineering questions:

1. **What is it?** State the type-system feature precisely.
2. **Why does it exist?** Identify the JavaScript problem or API-design problem it models.
3. **How does the compiler reason?** Follow inference, contextual typing, control flow, constraints, and assignability.
4. **What happens at runtime?** Determine whether anything is emitted and which guarantees disappear.
5. **What is the safe boundary?** Identify where external data must become `unknown` and be validated.
6. **What are the failure modes?** Look for widening, stale narrowing, `any` propagation, variance, assertion misuse, module mismatch, or inaccurate declarations.
7. **What is the production implication?** Consider API evolution, build cost, debugging, observability, security, and team ownership.

## Recommended passes

**Beginner pass:** intro → foundations → primitives → objects → interfaces/types → unions → narrowing → functions → special types → assertions → literals.

**Application developer pass:** generics → key/type operators → mapped/conditional/template types → utilities → nullability → arrays/tuples → modules → TSConfig → runtime validation → async → React/Node/API integration.

**Senior pass:** structural compatibility → variance → inference → declaration/library authoring → architecture/domain modeling → soundness → performance/debugging/testing/security → migrations/upgrades.

**Staff/library pass:** compiler mental models → type-level programming restraint → public API compatibility → monorepo governance → staff architecture → projects → interview/system-design drills.

## Answer framework for interviews and design reviews

```text
define
  ↓
explain mechanism
  ↓
give a concrete example
  ↓
state trade-offs
  ↓
connect to production implications
```

Avoid memorized slogans such as “interfaces are always better” or “TypeScript makes JavaScript type safe.” The handbook repeatedly replaces slogans with conditions, mechanisms, and boundary reasoning.