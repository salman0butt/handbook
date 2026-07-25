---
title: React Learning Roadmap
description: A zero-to-senior learning path for the React handbook, from JavaScript prerequisites through internals and architecture.
sidebar_position: 3
---

# React learning roadmap

This handbook is designed to build **mental models before API memorisation**.

The target progression is:

```text
JavaScript for React
        ↓
React mental model
        ↓
JSX + components
        ↓
rendering + events + state
        ↓
Hooks + effects + refs
        ↓
forms + context + reducers
        ↓
modern React 19+
        ↓
Suspense + transitions + concurrency
        ↓
React DOM + SSR + Server Components
        ↓
TypeScript + testing + accessibility
        ↓
performance + architecture + patterns
        ↓
internals + senior decision-making
```

## How to use the roadmap

Do not race to advanced Hooks. A developer who understands rendering, state ownership, identity, and Effects can learn new APIs quickly. A developer who memorises APIs without those models often gets stuck when an application behaves unexpectedly.

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

## Phase 1 — Foundations

Goal: become comfortable reading and writing small React components without treating React as magic.

Topics:

- JavaScript concepts React code relies on;
- what React is and what problem it solves;
- declarative UI;
- UI as a function of state;
- component trees;
- JSX;
- props and composition;
- creating a modern React app with Vite;
- `createRoot`;
- Strict Mode;
- development vs production behavior.

Milestone: build a small product page from reusable components.

## Phase 2 — Rendering, events, state, lists, and forms

Goal: understand why UI changes.

Topics:

- render triggers;
- render phase vs commit phase;
- browser paint;
- state as a snapshot;
- batching and queued updates;
- event handlers;
- propagation and default browser behavior;
- choosing minimal state;
- immutability;
- lifting state;
- controlled and uncontrolled inputs;
- lists, keys, and identity;
- forms and validation.

Milestone: build a Todo/product-filtering app without unnecessary Effects.

## Phase 3 — Effects, refs, and reusable Hooks

Goal: learn React's escape hatches without overusing them.

Topics:

- synchronization with external systems;
- `useEffect`;
- dependency reasoning;
- cleanup;
- Strict Mode effect behavior;
- race conditions and cancellation;
- stale closures;
- removing unnecessary Effects;
- `useEffectEvent`;
- `useRef`;
- DOM refs;
- callback refs;
- imperative handles;
- custom Hooks.

Milestone: integrate a browser API or remote service with correct cleanup and cancellation.

## Phase 4 — Context, reducers, and state architecture

Goal: make deliberate state ownership decisions.

Topics:

- Context mental model;
- provider placement;
- context propagation;
- context performance;
- reducers and actions;
- reducer purity;
- reducer + Context;
- local state vs shared client state;
- server state vs client state;
- external stores;
- `useSyncExternalStore`.

Milestone: design state for a multi-feature dashboard without putting everything into one global store.

## Phase 5 — Modern React 19+

Goal: understand modern React instead of learning React 18-era patterns as the endpoint.

Topics:

- Actions;
- async transitions;
- form action functions;
- `useActionState`;
- `useFormStatus`;
- `useOptimistic`;
- `use`;
- ref as a prop;
- modern Context provider syntax;
- document metadata support;
- resource loading APIs;
- React 19 removals and migration knowledge;
- React 19.2 additions such as `<Activity>` and `useEffectEvent`.

Milestone: build a form/mutation flow with pending, error, and optimistic UI states.

## Phase 6 — Suspense, transitions, and concurrency

Goal: reason about responsiveness and interruptible rendering conceptually.

Topics:

- urgent vs non-urgent updates;
- `startTransition`;
- `useTransition`;
- `useDeferredValue`;
- interruption;
- Suspense boundaries;
- nested Suspense;
- stale-content patterns;
- code splitting;
- `lazy`;
- supported Suspense data sources;
- streaming interactions.

Milestone: build a responsive search experience that keeps urgent input updates fast.

## Phase 7 — React DOM, SSR, and Server Components

Goal: understand where React ends and frameworks begin.

Topics:

- `createRoot` and `hydrateRoot`;
- portals and `flushSync`;
- resource preloading APIs;
- CSR vs SSR vs static rendering;
- hydration;
- streaming;
- Node streams vs Web Streams;
- React Server Components concepts;
- Server vs Client Components;
- `'use client'` and `'use server'`;
- serialization boundaries;
- Server Functions/Actions concepts;
- framework responsibility.

Milestone: explain the complete path from server render to hydrated interactive UI.

## Phase 8 — React Compiler and Rules of React

Goal: write code that React and the compiler can reason about safely.

Topics:

- purity and idempotency;
- side effects outside render;
- immutability;
- Rules of Hooks;
- compiler mental model;
- automatic memoization;
- lint rules;
- diagnostics;
- incremental adoption;
- compiler vs `useMemo`, `useCallback`, and `memo`.

Milestone: profile an application and explain whether manual memoization is still justified.

## Phase 9 — TypeScript, testing, and accessibility

Goal: make correctness part of component design.

Topics:

- typed props, events, refs, context, and reducers;
- discriminated unions;
- generic and polymorphic components;
- React Testing Library;
- user-focused tests;
- async testing and API mocking;
- Playwright/E2E concepts;
- semantic HTML;
- keyboard interaction;
- focus management;
- forms, dialogs, ARIA, and live regions.

Milestone: build and test an accessible form/dialog workflow with strong types.

## Phase 10 — Performance, architecture, and patterns

Goal: move from feature implementation to system design.

Topics:

- React DevTools Profiler;
- React Performance Tracks;
- state locality;
- component boundaries;
- virtualization;
- network waterfalls;
- bundle splitting;
- feature-based architecture;
- dependency direction;
- public module APIs;
- design systems;
- compound components;
- controlled/uncontrolled APIs;
- headless components;
- provider/reducer/state-reducer patterns.

Milestone: design the frontend architecture for a large SaaS feature and defend the trade-offs.

## Phase 11 — Internals and senior engineering

Goal: understand implementation concepts without confusing them with React's public contract.

Topics:

- React elements;
- Fiber;
- Fiber tree;
- reconciliation;
- render and commit phases;
- update queues;
- scheduling and priorities;
- lanes at a conceptual level;
- batching;
- concurrent rendering;
- hydration;
- Suspense internals concepts;
- public contract vs implementation detail;
- debugging production rendering problems.

Milestone: reason from symptoms to likely causes instead of randomly changing Hooks.

## Phase 12 — Projects and interview preparation

Projects progress from a counter and Todo app to an ecommerce frontend and large SaaS architecture.

Interview preparation is organised by:

- junior;
- mid-level;
- senior;
- staff/architecture.

The goal is not one-sentence definitions. Answers should explain behavior, trade-offs, debugging, and production decisions.

## Beginner coverage cross-check

The curriculum also covers the reasonable beginner expectations found in common React tutorials: modern JavaScript syntax, JSX, components, props, events, conditionals, lists, forms, styling, routing, portals, Suspense, transitions, refs, common Hooks, and custom Hooks.

Third-party tools such as React Router, TanStack Query, Redux Toolkit, Zustand, React Hook Form, CSS-in-JS libraries, and Tailwind are always labelled **ecosystem**, not React core.

## What not to skip

If you want senior-level React understanding, do not skip these topics:

1. state as a snapshot;
2. state ownership;
3. keys and identity;
4. render vs commit;
5. Effects as synchronization;
6. stale closures;
7. Context trade-offs;
8. server state vs client state;
9. Suspense and transitions;
10. profiling before optimization;
11. accessibility;
12. public API vs implementation detail.

## References

- https://react.dev/learn
- https://react.dev/reference/react
- https://react.dev/reference/react-dom
- https://react.dev/blog
- https://www.w3schools.com/react/
- https://www.w3schools.com/react/react_syllabus.asp

## Next

Before React syntax, review **[JavaScript for React](./00-prerequisites/javascript-for-react.md)**.