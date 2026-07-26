---
title: React Learning Roadmap
description: The complete zero-to-senior React roadmap from JavaScript prerequisites through React 19.2, internals, production engineering, capstones, and interview mastery.
sidebar_position: 3
---

# React learning roadmap

> **Status: all 12 original roadmap phases are complete for the audited React 19.2 stable line.**

This handbook is designed to build **mental models before API memorization**.

The progression is:

```text
JavaScript for React
        ↓
React mental model
        ↓
JSX + components
        ↓
rendering + events + state
        ↓
Effects + refs + custom Hooks
        ↓
Context + reducers + state architecture
        ↓
modern React 19+
        ↓
Suspense + transitions + concurrency
        ↓
React DOM + SSR + Server Components
        ↓
Compiler + Rules of React
        ↓
TypeScript + testing + accessibility
        ↓
performance + architecture + patterns
        ↓
internals + debugging + production engineering
        ↓
capstone projects + interview mastery
```

## How to use the roadmap

For most topics, study in this order:

```text
WHAT
 ↓
WHY
 ↓
MENTAL MODEL
 ↓
SYNTAX
 ↓
SMALL EXAMPLE
 ↓
HOW REACT BEHAVES
 ↓
REAL EXAMPLE
 ↓
COMMON MISTAKES
 ↓
DEBUGGING
 ↓
TRADE-OFFS
 ↓
PRODUCTION PATTERN
 ↓
EXERCISE
 ↓
INTERVIEW REASONING
```

The handbook repeatedly reinforces these mental models:

- **state is a snapshot**;
- **keys are identity**;
- **Effects synchronize external systems**;
- **refs are escape hatches**;
- **Context propagates values but does not own state by itself**;
- **reducers model state transitions**;
- **Suspense is a readiness/reveal boundary, not a fetch API**;
- **concurrency is not multithreading**;
- **Server Components are not the same thing as SSR**;
- **Compiler optimization does not replace the Rules of React**;
- **profile before optimizing**;
- **production architecture is about ownership, failure boundaries, evidence, and reversibility**.

## Phase 1 — Foundations ✅

Goal: become comfortable reading and writing small React components without treating React as magic.

Covered:

- JavaScript prerequisites;
- declarative UI;
- component trees;
- JSX;
- props/composition;
- Vite setup;
- `createRoot`;
- Strict Mode;
- development vs production behavior.

Milestone: build a small product page from reusable components.

## Phase 2 — Rendering, events, state, lists, and forms ✅

Goal: understand why UI changes.

Covered:

- render triggers;
- render vs commit;
- state snapshots;
- queued/batched updates;
- events;
- minimal state;
- lifting state;
- controlled/uncontrolled inputs;
- lists/keys/identity;
- forms and validation.

Milestone: build a Todo/product-filtering app without unnecessary Effects.

## Phase 3 — Effects, refs, and reusable Hooks ✅

Goal: learn escape hatches without overusing them.

Covered:

- synchronization;
- `useEffect`;
- dependencies;
- cleanup;
- race conditions;
- stale closures;
- removing unnecessary Effects;
- `useEffectEvent`;
- refs / DOM refs / callback refs;
- imperative handles;
- custom Hooks.

Milestone: integrate a browser API or remote system with correct cleanup/cancellation.

## Phase 4 — Context, reducers, and state architecture ✅

Goal: make deliberate ownership decisions.

Covered:

- Context mental model and provider placement;
- Context performance;
- reducers/actions;
- reducer purity;
- reducer + Context;
- local/shared/server/URL/external state;
- `useSyncExternalStore`.

Milestone: design state for a multi-feature dashboard without one giant global store.

## Phase 5 — Modern React 19+ ✅

Goal: learn the current platform instead of stopping at React 18-era patterns.

Covered:

- Actions;
- async transitions;
- form actions;
- `useActionState`;
- `useFormStatus`;
- `useOptimistic`;
- `use`;
- ref as a prop;
- modern Context provider syntax;
- metadata/resource APIs;
- `<Activity>`;
- React 19 migration/removals.

Milestone: build a mutation flow with pending, validation, error, success, and optimistic states.

## Phase 6 — Suspense, transitions, and concurrency ✅

Goal: reason about responsiveness and interruptible rendering.

Covered:

- urgent/non-urgent updates;
- `startTransition`;
- `useTransition`;
- `useDeferredValue`;
- Suspense boundaries;
- nested reveal sequences;
- stale-content patterns;
- `lazy` and code splitting;
- supported suspension sources;
- concurrent rendering mental model.

Milestone: build responsive search that keeps urgent input updates fast.

## Phase 7 — React DOM, SSR, and Server Components ✅

Goal: understand where React ends and framework infrastructure begins.

Covered:

- React DOM components/props;
- portals / `flushSync`;
- hydration;
- streaming SSR;
- static rendering / resume / PPR architecture;
- Server Components;
- Server/Client boundaries;
- `'use client'` / `'use server'`;
- Server Functions;
- `cache` / `cacheSignal`;
- serialization and security boundaries.

Milestone: explain the full server-render → streaming → hydration/client-interaction path.

## Phase 8 — React Compiler and Rules of React ✅

Goal: write code React and Compiler can reason about safely.

Covered:

- purity/idempotence;
- immutability;
- Rules of Hooks;
- Compiler mental model;
- automatic memoization;
- configuration;
- directives;
- diagnostics;
- incremental adoption;
- library compilation;
- compiler-aware ESLint.

Milestone: explain when Compiler removes the need for manual memoization and when explicit identity still matters.

## Phase 9 — TypeScript, testing, and accessibility ✅

Goal: make correctness part of component design.

Covered:

- typed components/Hooks/context/reducers/refs/forms;
- discriminated unions and reusable APIs;
- Testing Library;
- async `act`;
- Suspense/Action/optimistic testing;
- test-layer strategy;
- semantic HTML;
- `useId`;
- keyboard/focus/dialog/form/live-region accessibility.

Milestone: build and test an accessible typed mutation workflow.

## Phase 10 — Performance, architecture, and patterns ✅

Goal: move from feature implementation to system design.

Covered:

- measurement-first optimization;
- `memo` / `useMemo` / `useCallback`;
- `<Profiler>`;
- React Performance Tracks;
- layout/insertion/debug Hooks;
- state placement/update scope;
- feature architecture;
- design systems;
- controlled/uncontrolled/compound/slot/render-prop/HOC patterns.

Milestone: design and defend the frontend architecture for a large SaaS feature.

## Phase 11 — Internals, debugging, and production engineering ✅

Goal: understand implementation concepts without confusing them with public contracts.

Covered:

- reconciliation and identity;
- Fiber work model;
- scheduling priorities;
- render vs commit;
- private implementation vs public contract;
- Error Boundaries;
- Owner Stacks / `captureOwnerStack`;
- root error callbacks;
- production observability/triage;
- application security;
- legacy maintenance/migration;
- large-team engineering;
- senior architectural decision-making.

Milestone: reason from production symptoms to likely causes and design a safe remediation path.

## Phase 12 — Projects and interview mastery ✅

Goal: turn the handbook into demonstrable engineering skill.

Projects:

- progressive fundamentals→production project ladder;
- real-time operations dashboard;
- commerce/action/optimistic workflow capstone;
- multi-team SaaS architecture/platform capstone.

Interview mastery:

- junior→senior React questions;
- debugging/performance/security scenarios;
- React system-design prompts;
- trade-off drills;
- staff architecture/leadership scenarios.

Milestone: defend architecture, debug from evidence, explain trade-offs, and communicate production decisions clearly.

## Beginner coverage cross-check

The handbook covers the reasonable beginner expectations found in common React curricula:

- modern JavaScript;
- JSX;
- components/props;
- events;
- conditionals;
- lists;
- forms;
- refs;
- core Hooks;
- Effects;
- custom Hooks;
- portals;
- Suspense/transitions;
- accessibility basics.

Ecosystem tools such as React Router, TanStack Query, Redux Toolkit, Zustand, React Hook Form, Tailwind, and framework-specific APIs are labeled as **ecosystem**, not React core.

## What not to skip

For senior-level understanding, do not skip:

1. state as a snapshot;
2. state ownership;
3. keys and identity;
4. render vs commit;
5. Effects as synchronization;
6. stale closures;
7. Context trade-offs;
8. server state vs client state;
9. Suspense and transitions;
10. server/client boundaries;
11. Rules of React / Compiler;
12. profiling before optimization;
13. accessibility;
14. security trust boundaries;
15. failure/observability architecture;
16. public API vs implementation detail;
17. migration and reversibility.

## Completion and maintenance

The original roadmap is complete against the stable React 19.2 documentation line audited on **2026-07-26**.

Use these pages to maintain it:

- **[Official React API Coverage](./reference/api-coverage.md)** — compact ongoing coverage contract;
- **[Final React Handbook Completeness Audit](./reference/final-completeness-audit.md)** — long-form stable-surface audit.

When stable React changes, re-check official React docs, npm stable tags, release notes, Compiler/ESLint guidance, and the production build before changing recommendations.

## References

- https://react.dev/learn
- https://react.dev/reference/react
- https://react.dev/reference/react-dom
- https://react.dev/versions
- https://react.dev/blog

## Continue learning

A completed roadmap is not the end of React learning.

Use the capstones, interview drills, production scenarios, and future release audits to keep the handbook current and turn knowledge into engineering judgment.
