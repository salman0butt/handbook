---
title: React Interview Mastery — Fundamentals to Senior
description: A structured React interview guide from junior foundations through senior reasoning, with model answers, follow-ups, traps, and production trade-offs.
sidebar_position: 1
---

# React interview mastery — fundamentals to senior

React interviews become much easier when you stop treating them as trivia.

The strongest answers usually follow this structure:

```text
Definition
   ↓
Mental model
   ↓
Behavior
   ↓
Common mistake
   ↓
Trade-off
   ↓
Production example
```

This chapter organizes questions by seniority and shows the depth expected at each level.

## Junior level

### What is React?

A good answer:

React is a library for building user interfaces from components. You describe the UI for the current state, and React reconciles that description with what is already rendered.

A stronger follow-up:

React is declarative: instead of manually changing individual DOM nodes for every state transition, components return the UI that should exist for the current props/state.

### What is JSX?

JSX is syntax that lets JavaScript express element trees in a readable form. It is transformed into React element creation calls by the build tool.

Important distinctions:

- JSX is not HTML;
- expressions use `{}`;
- component names start uppercase;
- JSX describes elements; it does not directly create DOM nodes by itself.

### Props vs state

Props are inputs from a parent. State is memory owned by a component position in the React tree.

A useful phrase:

> Props describe what a component receives. State describes what the component remembers.

### Why should state updates be immutable?

React treats state values as snapshots. Mutating an existing object can make updates harder to detect/reason about and breaks assumptions used by memoization and the Rules of React.

Prefer creating a new value:

```js
setUser(prev => ({ ...prev, name: 'Aisha' }));
```

### What is a key?

A key helps React identify siblings across renders.

Strong answer:

Keys are not only for removing warnings. They participate in identity. A changed key can intentionally reset state, while unstable keys can cause state to move to the wrong item or be recreated unexpectedly.

### Controlled vs uncontrolled input

Controlled:

```tsx
<input value={name} onChange={e => setName(e.target.value)} />
```

React state is the source of truth.

Uncontrolled:

```tsx
<input name="name" defaultValue="" />
```

The DOM owns the current input value until it is read/submitted.

Neither is universally better. Choose based on workflow needs.

## Mid-level questions

### What causes a component to render?

Common triggers include:

- its state updates;
- its parent renders and React evaluates the child again;
- a consumed Context value changes;
- an external store subscription reports a new snapshot.

Rendering is not the same as DOM mutation.

React can render and decide the committed DOM does not need to change.

### Render phase vs commit phase

Render phase:

- React calls components;
- computes the next tree;
- must remain pure;
- may be restarted or abandoned.

Commit phase:

- React applies the chosen result;
- DOM/ref/layout-effect consequences become visible.

This distinction becomes especially important with concurrent rendering.

### Why is state described as a snapshot?

Each render sees the state values for that render.

If you call:

```js
setCount(count + 1);
setCount(count + 1);
```

both calls may use the same captured `count` value.

For sequential updates based on previous state:

```js
setCount(c => c + 1);
setCount(c => c + 1);
```

### What is `useEffect` for?

Best answer:

> `useEffect` synchronizes React with an external system after commit.

Examples:

- network connection;
- browser API;
- third-party widget;
- subscription.

Do not describe it primarily as "code that runs after render" or "component lifecycle replacement". Those descriptions encourage unnecessary Effects.

### When do you not need an Effect?

Usually not for:

- deriving values from props/state;
- handling a user event;
- resetting state when identity can be modeled with a key;
- computing filtered data;
- transforming data for rendering.

### `useRef` vs state

Use state when a change should trigger rendering.

Use a ref for mutable values that must survive renders without causing a render, or for imperative DOM/object access.

Refs are an escape hatch, not hidden state for rendering.

### Context vs global state

Context is a propagation mechanism for values through a subtree.

It does not automatically provide:

- persistence;
- selectors;
- request caching;
- normalization;
- time travel;
- update optimization.

The value still needs an owner.

### `useReducer` vs `useState`

Use a reducer when related state transitions become easier to model as explicit actions.

A reducer is:

```text
(state, action) → nextState
```

It should remain pure.

The choice is about state-transition clarity, not seniority or application size alone.

## Senior questions

### Explain React identity and state preservation

State is associated with a component's position/identity in the React tree.

Identity depends on factors including:

- component type;
- sibling position;
- key.

Changing a key can intentionally reset state.

Using unstable keys can unintentionally reset or move state.

### What is reconciliation?

Reconciliation is React's process for comparing the previous rendered element tree with the next one to determine what can be preserved, updated, mounted, or removed.

Do not claim React performs a generic optimal tree diff.

React uses its own heuristics and element identity rules.

### What does concurrent rendering mean?

It does **not** mean React runs your components on multiple CPU threads.

It means render work can be scheduled with priorities and may be:

- interrupted;
- restarted;
- abandoned;
- resumed conceptually from work structures.

Commit remains the point where the chosen result becomes visible.

This is why render purity matters.

### Transition vs deferred value

`startTransition`/`useTransition` mark updates as non-urgent.

`useDeferredValue` lets one value lag behind another so expensive downstream rendering can use a stale value temporarily.

Neither is a replacement for:

- debouncing network calls;
- request cancellation;
- background workers;
- caching.

### What is Suspense?

Suspense is a readiness/reveal boundary.

It can show fallback while supported resources are not ready.

Stable suspension sources include framework-supported data, lazy modules, and Promises read with `use` in supported environments.

An arbitrary fetch started inside `useEffect` does not automatically activate Suspense.

### Error Boundary vs Suspense

Suspense handles **not ready yet**.

Error Boundaries handle **rendering failed**.

They often compose:

```tsx
<ErrorBoundary fallback={<ErrorPanel />}>
  <Suspense fallback={<Loading />}>
    <Feature />
  </Suspense>
</ErrorBoundary>
```

### Server Components vs SSR

Server Components answer:

> Where does component code execute and what crosses the server/client module boundary?

SSR answers:

> How is HTML produced for the initial response?

They are related but not the same concept.

### What does `'use client'` mean?

It establishes a client module boundary in an RSC environment.

It does **not** simply mean "this component only renders in the browser".

Client Components can still participate in server pre-rendering/hydration flows depending on the framework.

### What does `'use server'` mean?

It marks Server Functions—not Server Components.

A Server Function can be invoked from client-side code through framework infrastructure.

Treat its arguments as untrusted network input and authenticate/authorize on the server.

### Why doesn't TypeScript replace runtime validation?

TypeScript checks code at compile time.

Network data, FormData, URL params, storage, and user-controlled Server Function arguments exist at runtime and can violate expected types.

Trust boundaries still need runtime validation.

### React Compiler vs manual memoization

React Compiler can automatically memoize many calculations and component expressions.

Manual `memo`, `useMemo`, and `useCallback` still matter when:

- the code is not compiled;
- explicit identity stability is required by another API;
- profiling proves a specific optimization valuable;
- compatibility or library constraints require it.

Do not use manual memoization as a default style rule.

## Senior follow-up traps

### "Should every Context value be memoized?"

No.

First ask:

- does this provider update often?
- do consumers care about all fields?
- is Context even the right ownership mechanism?
- is the real issue broad state placement?

Memoizing a giant Context value may hide an architecture problem.

### "Should every list use `memo`?"

No.

Profile first.

For large lists, the bigger win may be:

- pagination;
- virtualization;
- narrower subscriptions;
- moving state down;
- avoiding expensive row work;
- reducing request payloads.

### "Can transitions make CPU-heavy code fast?"

No.

Transitions can improve responsiveness by changing scheduling priority, but they do not remove CPU work.

A genuinely CPU-heavy algorithm may need a different algorithm, worker, server computation, or reduced workload.

### "Does `useMemo` guarantee a value is never recomputed?"

Do not treat memoization as semantic storage.

Use it as an optimization. Code must remain correct if React recomputes the value.

### "Can Error Boundaries catch event-handler errors?"

Not as a general event error-handling mechanism.

Expected event/mutation failures should be handled in the event/action flow.

Error Boundaries are primarily for rendering-tree failures.

## Answer quality ladder

### Weak

> `useEffect` runs after render.

### Better

> `useEffect` runs after React commits and can synchronize with an external system.

### Senior

> `useEffect` is an escape hatch for synchronizing committed React state with external systems. If I am deriving render data or responding directly to an event, I usually do not need one. I also design setup/cleanup symmetrically because Strict Mode can expose missing cleanup during development.

The difference is not vocabulary. It is reasoning.

## Whiteboard drills

Explain each without code first:

1. state snapshot and batching;
2. keys and identity;
3. Effect synchronization;
4. reducer transition model;
5. Context propagation;
6. Suspense reveal boundary;
7. transition priority;
8. Server/Client Component boundary;
9. optimistic mutation authority;
10. Error Boundary placement.

Then add code only if needed.

## Rapid-fire practice

Answer in 30–60 seconds each:

- Why not store derived state?
- Why can index keys be dangerous?
- Why can an Effect loop forever?
- Why can stale closures happen?
- Why can a Context update rerender memoized consumers?
- Why can't a transition control a text input?
- Why does a Promise need stable caching for Suspense?
- Why must hydration output initially match?
- Why is `renderToStaticMarkup` not hydratable?
- Why is `flushSync` unusual?
- Why is `useInsertionEffect` not normal app logic?
- Why can broad state ownership be a performance problem?

## Interview self-check

Before saying you are ready for senior React interviews, make sure you can explain:

- behavior without memorized buzzwords;
- failure modes;
- trade-offs;
- when *not* to use an API;
- how you would debug the problem;
- how the choice changes in production.

A senior interview answer should sound like a decision process, not a glossary.