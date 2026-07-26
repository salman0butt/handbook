---
title: 60-Minute Senior React Interview
sidebar_position: 3
description: A senior React interview round covering mental models, state architecture, performance, debugging, testing, and design trade-offs.
---

# 60-Minute Senior React Interview

This round tests whether a candidate can move beyond API recall into production reasoning.

## Interview plan

```text
0–10 min   rendering and state mental models
10–25 min  state architecture and Effects
25–40 min  performance and debugging
40–55 min  design exercise
55–60 min  candidate questions
```

## Round 1 — rendering depth

### Question 1

**Walk through render → commit → browser paint.**

Strong answer should distinguish:

- React deciding what UI should look like;
- render work being restartable/interruptible in concurrent rendering;
- commit applying host mutations;
- layout Effects running around the commit/paint boundary;
- passive Effects running after commit;
- render work does not itself mean DOM mutation.

### Question 2

**How does React decide whether state is preserved?**

Expected:

- identity is tied to component type and position in the rendered tree;
- keys provide explicit sibling identity;
- changing type/key/position can reset state;
- moving JSX text around without changing tree identity may preserve state.

### Follow-up

**A form should reset when the selected customer changes. What approaches would you consider?**

Strong answer should compare:

- keying the form by customer identity;
- explicit state reset;
- state ownership redesign;
- avoiding an Effect whose only job is mirroring identity changes.

## Round 2 — state architecture

### Scenario

You are designing a SaaS analytics page with:

- selected date range;
- selected organization;
- open/closed side panel;
- fetched report data;
- websocket connection status;
- current authenticated user;
- draft report title;
- table sort and filters;
- feature flags.

**Prompt:** Where should each piece of state live?

A strong candidate should classify by ownership and lifecycle rather than choosing one global store.

Possible reasoning:

- shareable navigation/filter state → URL where useful;
- report data → server-state/data layer;
- side panel → local UI state unless multiple distant owners need it;
- websocket subscription → external resource with subscription boundary;
- current user → application/session boundary;
- draft title → local form state;
- feature flags → platform/config boundary;
- organization selection → URL/session/app boundary depending product semantics.

### Pressure follow-up

**What changes if the filters update 20 times per second?**

Expected:

- update frequency matters;
- broad Context propagation may become expensive;
- split contexts/selective subscription/external store may be appropriate;
- measure before changing architecture.

## Round 3 — Effects and synchronization

### Question

**You inherit a component with seven Effects. How do you review it?**

Strong process:

1. identify the external system for each Effect;
2. remove pure derivations;
3. move user-triggered logic into event/action paths;
4. check cleanup symmetry;
5. inspect dependency correctness;
6. inspect races and cancellation;
7. separate unrelated synchronization processes;
8. verify Strict Mode behavior;
9. ask whether framework/server-state tooling should own the work.

### Scenario: request race

```tsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

User switches IDs quickly.

**Prompt:** What can go wrong?

Expected:

- older request can resolve later and overwrite newer data;
- cancellation/ignore strategy is needed if this Effect owns fetching;
- better architecture may move fetching into router/framework/server-state tooling;
- loading/error/retry/cache semantics matter too.

## Round 4 — performance and Compiler

### Question

**A page feels slow. What is your investigation process?**

Strong answer:

```text
reproduce
→ define slow interaction
→ browser Performance / React Profiler / Performance Tracks
→ classify network, JS, render, layout, paint, hydration
→ identify expensive path
→ optimize the dominant cost
→ remeasure
```

### Follow-up

**Do you add `memo`, `useMemo`, and `useCallback` first?**

Expected: no.

Strong answer mentions:

- React Compiler can automatically memoize many components/values when adopted;
- manual memoization still matters for measured hot paths or semantic identity requirements;
- memoization adds complexity and can be ineffective when props are always new;
- architectural fixes often beat scattered memoization.

## Round 5 — production debugging

### Scenario

After deployment:

- some users report a blank analytics panel;
- logs show hydration recoverable errors;
- issue appears only in one locale;
- local development works.

**Prompt:** How do you investigate?

Strong answer should include:

- correlate issue with release/version and locale;
- inspect `onRecoverableError` telemetry;
- compare server/client rendered inputs;
- inspect locale/timezone/randomness/browser-only branching;
- reproduce with production build and same locale/timezone;
- verify invalid HTML or extension interference where relevant;
- fix root deterministic mismatch rather than silencing with `suppressHydrationWarning`.

## Round 6 — architecture exercise

### Design a reusable async combobox

Requirements:

- accessible keyboard interaction;
- server-backed search;
- loading and error states;
- request race handling;
- controlled and uncontrolled use cases;
- design-system reuse;
- 10,000+ possible options;
- analytics instrumentation;
- testability.

Candidate should discuss:

- semantic/ARIA pattern;
- state ownership;
- API contract;
- async boundary;
- caching/debouncing vs deferred rendering;
- virtualization if needed;
- focus management;
- cancellation/order handling;
- public component API;
- behavior tests over implementation tests.

## Senior scoring signals

### Strong senior

- starts with ownership and requirements;
- distinguishes React scheduling from network behavior;
- removes unnecessary Effects;
- profiles before optimizing;
- considers accessibility in component design;
- treats error/loading/empty states as part of the architecture;
- discusses rollout and observability for risky changes.

### Weak senior signal

- defaults every problem to a global store;
- uses Effects for derivation;
- proposes memoization before measurement;
- ignores request ordering;
- treats accessibility as final QA;
- cannot distinguish SSR, hydration, and RSC.

## Candidate questions

Strong questions include:

- Which frontend production metrics do you actively watch?
- How do teams review cross-cutting architecture decisions?
- What are the largest current sources of frontend complexity?
- How much ownership does this role have over design-system and platform decisions?