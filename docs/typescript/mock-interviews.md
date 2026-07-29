---
title: 63 · Mock Interview Practice
---

# 63 · Mock Interview Practice

Each round includes timing, interviewer script, questions, follow-ups, scoring, strong-answer signals, and warning signs. Score each major question 0–4 for correctness, mechanism, example, trade-offs, production reasoning, and communication.

## Shared scoring

```text
0 = incorrect / no mechanism
1 = partially correct but unsafe/confused
2 = correct basic answer
3 = correct + trade-offs + useful example
4 = precise mechanism + production implications + strong communication
```

Strong candidates distinguish **JavaScript runtime**, **TypeScript static system**, **compiler**, **language service**, **Node/browser**, and **bundler/framework** instead of treating “TypeScript” as one magical layer.

---

## 1 · 20-minute TypeScript screen

### Timing

- 0–2 min: setup
- 2–7 min: fundamentals
- 7–12 min: narrowing/functions
- 12–17 min: generics/runtime safety
- 17–20 min: candidate questions + score

### Interviewer script

“Explain your reasoning aloud. I care more about the mechanism and trade-offs than exact syntax.”

### Questions

1. `any` vs `unknown`?
2. `foo?: string` vs `foo: string | undefined`?
3. How does a discriminated union narrow?
4. What does `identity<T>(x:T):T` express?
5. Is `JSON.parse(text) as User` safe?

### Follow-ups

- What changes with `exactOptionalPropertyTypes`?
- How would you validate runtime input?
- When does `never` appear naturally?

### Strong-answer signals

Mentions compile-time/runtime distinction, control-flow proof, generic relationships, and runtime validation.

### Warning signs

Claims TypeScript validates JSON; uses `any` as “unknown data”; cannot explain why a union needs narrowing.

---

## 2 · 45-minute mid-level round

### Timing

- 0–5: background/project context
- 5–15: generics/type manipulation
- 15–25: modules/TSConfig
- 25–35: runtime validation/async/testing
- 35–43: debugging exercise
- 43–45: wrap-up

### Questions

1. Implement `getProperty<T,K extends keyof T>` and explain `T[K]`.
2. Annotation vs assertion vs `satisfies`?
3. When use overload vs union vs generic?
4. `nodenext` vs `bundler` module resolution?
5. Why might `paths` work in editor but fail at runtime?
6. Runtime tests vs type tests?

### Debugging exercise

Give a callback variance error and ask the candidate to state actual type, expected type, and failed relationship before changing code.

### Strong-answer signals

Can trace inference, recognizes runtime resolver mismatch, uses `unknown` at network boundary, discusses type-aware linting/testing.

### Warning signs

Fixes module issues by randomly toggling `esModuleInterop`; adds casts before diagnosing; cannot explain `keyof` relationship.

---

## 3 · 60-minute senior TypeScript round

### Timing

- 0–10: soundness/compatibility
- 10–20: variance/inference
- 20–30: conditional/mapped types
- 30–40: library API design
- 40–50: performance/debugging
- 50–60: architecture/upgrade

### Questions

1. Explain structural typing and one intentional unsoundness compromise.
2. Draw covariance/contravariance/invariance using `Dog` and `Animal`.
3. Why did a literal widen and how would you preserve it without unnecessary assertion?
4. Explain distributive conditional types and suppressing distribution.
5. Design a public typed REST client where the caller cannot lie about response type.
6. How can adding a union member be semver-breaking?
7. Investigate a repo whose editor takes 40 seconds to load.
8. What changes when upgrading TypeScript 6 tooling to TypeScript 7.0?

### Follow-ups

Ask candidate to distinguish source model, declaration model, runtime validation, and public compatibility for every design answer.

### Strong-answer signals

Explains mechanism, not slogans; understands TypeScript 7.0 Compiler API caveat; optimizes public APIs for inference/diagnostics; measures performance before tuning.

### Warning signs

Treats type-level cleverness as inherently senior; ignores declaration compatibility; says native compiler makes project architecture irrelevant.

---

## 4 · 90-minute full-stack TypeScript round

### Timing

- 0–15: API contract design
- 15–30: backend/domain modeling
- 30–45: frontend/React integration
- 45–60: async/events/jobs
- 60–75: testing/security
- 75–90: system design review

### Scenario

Build a multi-tenant project-management platform with React frontend, Node API, database, background jobs, and webhook integrations.

### Questions

- Which contracts are shared?
- Where do runtime schemas live?
- DTO vs domain vs database types?
- How are tenant IDs modeled and authorized?
- How are webhooks validated/authenticated?
- How are job/event versions handled?
- What does the frontend infer from endpoint schemas?
- How do cancellation and stale requests work?
- What are CI gates?

### Strong-answer signals

Separates static identity from runtime authorization, validates every process boundary, curates shared contracts, versions events, and tests runtime plus types.

### Warning signs

One `User`/`Project` type shared across DB/API/UI; branded IDs treated as authorization; queue payload assumed safe because producer is TypeScript.

---

## 5 · Staff/Lead architecture round

### Timing

75 minutes recommended.

### Interviewer script

“You own TypeScript strategy for 40 teams in one monorepo plus several SDKs. Current state: mixed strictness, duplicated schemas, slow editor performance, TypeScript 6-era compiler tooling, and uncontrolled deep imports.”

### Questions

1. First 30-day assessment?
2. Strictness tiers and exception policy?
3. Schema ownership and generation strategy?
4. Package ownership/dependency policy?
5. TypeScript 7 rollout plan?
6. Tooling that still depends on TypeScript 6 Compiler API?
7. Performance budgets and observability?
8. Compatibility gates for SDKs/events?
9. Migration governance without cast spam?
10. Architecture fitness functions?

### Strong-answer signals

Phased rollout, measurable baselines, ownership, canaries, compatibility fixtures, developer-experience investments, and clear distinction between technical policy and social/team migration.

### Warning signs

“One shared tsconfig and enable strict everywhere tomorrow”; no migration/rollback plan; no owner model; no performance metrics.

---

## 6 · Library-author round

### Timing

60 minutes.

### Scenario

Design `@acme/client`, consumed by Node and bundler apps, with typed endpoints and plugins.

### Questions

- ESM-only or dual publish? Why?
- Package `exports` design?
- Declaration generation/maps?
- How does response `T` follow from runtime validator?
- How are plugin key→config relationships inferred?
- What type tests prove inference?
- Which changes require major semver?
- How do you test installed package fixtures?

### Strong-answer signals

Consumer-first API, runtime/package fixtures, declaration compatibility, simple inference, explicit side-effect/module policy.

### Warning signs

Only source tests; assumes “types compile here” means consumers resolve them; no package exports reasoning.

---

## 7 · Type-system deep dive

### Timing

60 minutes.

### Questions

1. Evaluate a conditional type over `string | number`.
2. Prevent distribution.
3. Implement `KeysMatching<T,V>`.
4. Explain `UnionToIntersection`.
5. Infer tuple head/tail.
6. Explain a `never` explosion.
7. Diagnose a contextual inference failure.
8. Discuss recursion/compiler complexity limits.

### Strong-answer signals

Can substitute concrete types step-by-step, states variance role, knows when to stop using type-level programming.

### Warning signs

Memorized utilities with no mechanism; cannot explain runtime irrelevance; treats challenge tricks as preferred product architecture.

---

## 8 · Live coding round

### Timing

60 minutes.

### Prompt

Implement a typed event bus:

```ts
type Events = {
  userCreated: User
  orderPaid: Order
}
```

Need `on`, `once`, `emit`, unsubscribe, async handler policy, and tests.

### Evaluation

- key→payload generic relationship
- public API inference
- internal storage invariant
- handler lifecycle
- error/concurrency policy
- type-level negative tests
- runtime tests

### Follow-ups

How would this change for cross-process events? Where would runtime validation/authenticity/versioning occur?

---

## 9 · Type challenges round

### Timing

45 minutes.

### Challenges

- `DeepReadonly`
- `PickByValue`
- `PathValue`
- tuple `Head`/`Tail`
- typed route params

### Interviewer instruction

Ask candidate to narrate transformations. Stop them if they jump directly to a memorized implementation; request concrete substitution.

### Scoring

Correctness 40%, reasoning 40%, restraint/production caveats 20%.

---

## 10 · Debugging round

### Timing

45 minutes.

### Cases

1. fresh object literal excess-property error
2. callback variance error
3. `never` after impossible intersection
4. generic inference becomes broad union
5. Node runtime cannot resolve a `paths` alias
6. declaration package returns unexpected `any`
7. editor and CI disagree

### Expected workflow

```text
actual type
expected type
failed relationship
compiler/config layer
runtime/tooling layer
minimal reproduction
fix without blind assertion
```

### Strong-answer signals

Separates errors by layer and uses tracing/minimal aliases/repros.

### Warning signs

Toggles random config flags; deletes lockfile as first move; adds `as any`.

---

## 11 · Production migration / behavioral round

### Timing

60 minutes.

### Scenario A

Migrate a 500k-line JavaScript service to strict TypeScript while product development continues.

Ask for milestones, metrics, ownership, runtime boundary strategy, strictness ratchet, rollback, and completion definition.

### Scenario B

A TypeScript upgrade causes hundreds of errors and declaration diffs.

Ask how candidate separates compiler behavior changes, `lib.d.ts`, dependency typings, config removals, and inference regressions.

### Behavioral prompts

- Describe a type-system issue whose root cause was not obvious.
- Tell me about a migration where you avoided a big-bang rewrite.
- Describe a public API type change you rejected or redesigned.
- How did you explain runtime validation vs static typing to non-TypeScript stakeholders?
- Tell me about an editor/build performance problem and how you measured it.

### Strong-answer signals

Concrete evidence, options considered, incremental delivery, measurable outcomes, and lessons learned.

### Warning signs

Only implementation details; no validation/results; blame-focused story; cannot describe trade-offs.

---

# Final interviewer scorecard

Rate 0–4:

- JavaScript/runtime mental model
- type-system fundamentals
- inference/narrowing
- assignability/variance
- generic/type manipulation
- modules/TSConfig
- runtime validation/security
- API/library design
- debugging
- testing/build/lint
- performance
- migration/upgrades
- architecture/ownership
- communication

Interpretation:

```text
0–18  foundational gaps
19–32 junior developing
33–42 solid mid-level
43–50 senior-ready depending on role evidence
51–56 strong senior / lead range
57–60 staff-level technical reasoning, subject to real-world leadership evidence
```

The score is a practice aid, not a hiring truth. Role scope, system experience, communication, and demonstrated production judgment matter more than trivia totals.