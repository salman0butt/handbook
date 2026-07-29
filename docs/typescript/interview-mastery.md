---
title: 61 · Interview Mastery
---

# 61 · Interview Mastery

TypeScript interviews at senior level are rarely about remembering syntax. They test whether you can explain what the compiler knows, what it does not know, how a type relationship works, and how those choices affect production systems.

## Universal answer model

```text
define
  ↓
explain mechanism
  ↓
give example
  ↓
state trade-offs
  ↓
connect to production implication
```

Example: “What is `unknown`?”

**Define:** `unknown` is a top-like safe type that can represent any runtime value but cannot be used without proof.

**Mechanism:** unlike `any`, operations are blocked until control flow narrows the value.

**Example:** parse JSON as `unknown`, validate its shape, then construct a trusted domain type.

**Trade-off:** it creates friction at boundaries, but that friction forces evidence.

**Production implication:** it prevents unsafe external data from silently contaminating the typed core.

## Junior → senior progression

### Junior

Expected to explain:

- primitive/object types
- arrays/tuples
- unions
- basic narrowing
- functions
- `interface` vs `type` basics
- `any` vs `unknown`
- optional/null values
- simple generics

A junior answer should be syntactically correct and distinguish compile-time from runtime.

### Mid-level

Expected to reason about:

- generic constraints and inference
- `keyof`, indexed access, utility types
- discriminated unions
- overloads vs unions vs generics
- TSConfig strictness
- module resolution basics
- React/Node integration
- runtime validation
- async errors
- testing and linting

A mid-level answer should connect language features to maintainability and API design.

### Senior

Expected to reason about:

- assignability and structural compatibility
- variance
- literal widening
- inference failure
- conditional distribution
- `infer`
- public generic API ergonomics
- declaration/version compatibility
- monorepo/project references
- soundness limits
- compiler/editor performance
- migrations/upgrades
- security boundaries

A senior answer should state trade-offs and identify where static guarantees stop.

### Staff/Lead

Expected to reason about:

- organization-wide type/schema ownership
- generated vs handwritten contracts
- package boundaries
- public library evolution
- strictness governance
- TypeScript upgrade policy
- compiler/editor performance budgets
- API/event compatibility
- developer experience
- architecture fitness functions

A staff answer should describe policy, ownership, rollout, compatibility, and operational feedback loops across multiple teams.

## Type-system reasoning drills

### Drill: literal widening

```ts
let method = "GET"
```

Question: why is `method` usually `string` rather than `"GET"`?

Strong reasoning: `let` is mutable; the compiler anticipates future assignments, so it widens the initializer. If a later API needs the literal, use a const declaration, narrower annotation, `as const` where appropriate, or redesign the API to preserve inference.

### Drill: narrowing disappears

```ts
let value: string | undefined
if (value) {
  // later code/callback/assignment
}
```

Strong reasoning: control-flow facts can be invalidated by reassignment or uncertain mutation. Identify the exact flow edge. Copy a proven value to a `const` if needed rather than asserting.

### Drill: conditional distribution

```ts
type Box<T> = T extends unknown ? { value: T } : never
type X = Box<string | number>
```

Strong answer: a conditional over a naked type parameter distributes across union members, yielding `{value:string} | {value:number}`. Wrap the type parameter in a tuple on both sides to suppress distribution.

### Drill: generic inference failure

Ask:

```text
What evidence exists for each type parameter?
Which argument contributes candidates?
Which expected/contextual type contributes constraints?
Did a helper widen literals?
Are candidates conflicting?
Could a type parameter be removed or derived?
```

## Debugging exercises

### Error relationship template

For every compiler error, verbalize:

```text
actual type:
expected type:
failed relation:
first incompatible member:
why the compiler is correct or incomplete:
fix at model / implementation / boundary / config:
```

### Example

```ts
type Handler = (value: Animal) => void
const dogOnly = (value: Dog) => value.bark()
```

Expected senior explanation: under strict function parameter checking, `dogOnly` cannot generally be used where a handler may receive any `Animal`; a caller could pass a cat. The issue is parameter variance, not a missing cast.

## Library API design round

Given:

```ts
function request<T>(url: string): Promise<T>
```

Ask whether it is truly type safe.

Strong answer: no. `T` is caller-selected and runtime response data is not validated. A stronger API pairs an endpoint/schema/decoder with the response type so `T` follows from runtime validation rather than caller assertion.

Discuss:

- inference ergonomics
- error model
- module/package exports
- declarations
- semver of type changes
- consumer fixtures

## Compiler reasoning round

Know the conceptual pipeline:

```text
source → scanner → parser → AST → binder → symbols/scopes
       → checker → diagnostics → optional emit
```

Explain symbol vs type, contextual typing, control flow, and why editor language service workloads differ from batch compilation.

Do not claim private compiler implementation details are stable APIs. In TypeScript 7.0 specifically, distinguish the new native compiler/tooling generation from the old TypeScript 6 programmatic Compiler API.

## Architecture scenarios

### Scenario: shared backend/frontend types

Weak answer: “Always share them so they stay in sync.”

Strong answer: share only contracts whose semantics are intentionally identical. Public API DTOs should not automatically equal database/domain entities. Prefer authoritative runtime schemas/protocol definitions plus generated/derived clients where appropriate. Map when the layers have different responsibilities.

### Scenario: giant monorepo is slow

Investigation:

1. identify compiler vs lint vs bundler vs editor latency
2. inspect program file set and accidental inclusions
3. inspect package graph/deep imports
4. measure clean vs incremental
5. inspect declaration hotspots and giant recursive types
6. consider project references/ownership boundaries
7. compare compiler versions and TypeScript 7 migration state

### Scenario: external API “already has types”

Strong answer: declarations describe what the provider claims. Runtime network values remain untrusted. Validate critical boundaries, especially when contracts can drift independently.

## Migration scenarios

### 500k-line JavaScript application

Propose:

```text
allowJs
→ checkJs/JSDoc on selected modules
→ leaf conversion
→ typed adapters around external systems
→ runtime schemas
→ strictness tiers
→ any/suppression debt dashboard
→ package-by-package strict mode
```

Avoid a big-bang rename-and-cast migration.

### TypeScript 6 → 7

Discuss:

- official release/breaking/deprecation notes
- removed 6.0-deprecated behavior
- editor/CI compiler alignment
- native compiler performance baseline
- tooling that still relies on old programmatic Compiler API
- side-by-side compatibility strategy where required
- declaration and consumer tests

## Behavioral questions

Use concrete engineering evidence. Structure answers around:

```text
context
constraint/risk
reasoning
options considered
technical decision
validation
result
what you learned
```

Strong TypeScript behavioral stories include migrations, hard inference/debugging incidents, declaration compatibility, build performance, unsafe boundary fixes, architecture ownership, or developer-experience improvements.

## Staff/lead reasoning prompts

- How would you standardize strictness across 40 teams without blocking delivery?
- Who owns shared DTOs and schemas?
- What must be generated vs handwritten?
- How do you detect breaking type changes in an internal SDK?
- How do you keep editor latency under a defined budget?
- How do you migrate teams from unsafe `any` usage without creating cast spam?
- How do you version distributed event contracts?
- How do you canary a compiler upgrade?
- What does “type safe” mean at a network boundary?

## Interview scoring rubric

Score 0–4 per dimension:

| Dimension | 0 | 2 | 4 |
|---|---|---|---|
| correctness | incorrect | mostly correct | precise |
| mechanism | slogan | partial | compiler/runtime mechanism clear |
| example | none | basic | realistic and diagnostic |
| trade-offs | none | one-sided | balanced conditions |
| production | none | generic | concrete architecture/security/perf impact |
| communication | confusing | usable | structured and concise |

## Warning signs

- says TypeScript validates JSON
- uses `as` as the first debugging tool
- claims `interface` is always better than `type`
- confuses compile/transpile/type-check
- cannot explain `unknown` vs `any`
- treats Node/bundler/TypeScript module resolution as one layer
- thinks `private` is a runtime security boundary
- cannot distinguish DTO/domain/database models
- solves every API with conditional types
- ignores declaration compatibility for libraries
- recommends sharing every type across frontend/backend
- assumes successful compilation proves authorization/security

## Final preparation checklist

You should be able to answer, from mechanism rather than memory:

- Why did this literal widen?
- Why did narrowing disappear?
- Why did this conditional distribute?
- How does `infer` capture a type?
- Why is this callback assignable or not?
- Why did inference fail?
- Union, overload, or generic?
- Should this type derive from a runtime schema?
- Should these layers share this type?
- Why can this compile and still fail at runtime?
- What safety did TypeScript actually provide?
- Where is structural typing intentionally permissive?
- Why is the editor/compiler slow?
- How do project references change build architecture?
- How do you evolve a public generic API?
- How do you migrate and govern TypeScript across many teams?