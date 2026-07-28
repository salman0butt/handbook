---
title: useSyncExternalStore and External Subscriptions
description: Subscribe React components to stores and browser APIs outside React using subscribe/getSnapshot/getServerSnapshot with correct snapshot identity and SSR behavior.
sidebar_position: 2
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# `useSyncExternalStore` and external subscriptions

`useSyncExternalStore` is React's built-in Hook for reading from a source that lives **outside React** and can notify subscribers when that source changes.

```jsx
const snapshot = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot,
);
```

It solves a different problem from Context.

<VisualDiagram title="Context vs useSyncExternalStore">
  <DiagramGrid columns={2}>
    <DiagramNode title="Context" tone="purple">Distributes a React-tree value from the nearest provider.</DiagramNode>
    <DiagramNode title="useSyncExternalStore" tone="green">Subscribes React rendering to an externally owned mutable source.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## What counts as an external store?

Examples include custom JavaScript stores, browser subscription APIs, third-party state libraries, state shared with non-React code, and any source with snapshot + subscription semantics.

“External” describes ownership—not necessarily global scope.

## Basic mental model

React needs two capabilities:

<VisualDiagram title="The external-store contract" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="getSnapshot()" tone="blue" eyebrow="READ">Return the current renderable snapshot.</DiagramNode>
    <DiagramNode title="subscribe(callback)" tone="green" eyebrow="NOTIFY">Tell React that the source may have changed.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

When the store notifies React, React reads the snapshot again and decides whether the rendered value changed.

## Minimal external store

```js
let todos = [];
const listeners = new Set();

export const todosStore = {
  getSnapshot() {
    return todos;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  addTodo(todo) {
    todos = [...todos, todo];
    for (const listener of listeners) listener();
  },
};
```

React consumer:

```jsx
function TodoList() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
  );

  return todos.map(todo => <p key={todo.id}>{todo.text}</p>);
}
```

## Subscription lifecycle

<VisualDiagram title="How React observes an external source">
  <LifecycleBar
    items={[
      {label: 'component subscribes', tone: 'blue'},
      {label: 'store changes', tone: 'orange'},
      {label: 'store notifies callback', tone: 'purple'},
      {label: 'React calls getSnapshot()', tone: 'cyan'},
      {label: 'snapshot changed?', tone: 'green'},
      {label: 'render if needed', tone: 'slate'},
    ]}
  />
</VisualDiagram>

`subscribe` should register the callback and return a cleanup function that removes it.

## Snapshot identity is part of the contract

If the store has not changed, repeated `getSnapshot()` calls should return an `Object.is`-equal value.

Bad:

```js
function getSnapshot() {
  return [...todos]; // ❌ new identity every call
}
```

Better:

```js
function getSnapshot() {
  return todos;
}
```

Create a new immutable snapshot only when the store actually changes.

<VisualDiagram title="Stable snapshot contract">
  <DiagramGrid columns={2}>
    <DiagramNode title="Store unchanged" tone="green">getSnapshot() returns the same / Object.is-equal snapshot.</DiagramNode>
    <DiagramNode title="Store changed" tone="orange">Create a new snapshot, then notify subscribers.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If the underlying source mutates in place, cache an immutable snapshot and replace that cache only when relevant data changes.

## Browser API example: online status

```jsx
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

This is a natural fit because the browser owns the authoritative value.

## Why not `useEffect` + `useState`?

A manual subscription can work for simple sources, but `useSyncExternalStore` exists specifically to integrate externally owned mutable state with React's rendering model and concurrency expectations.

If you are building or adapting an external store, prefer the dedicated primitive.

## Hide mechanics behind a custom Hook

```jsx
export function useTodos() {
  return useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
  );
}
```

Consumers should depend on a domain API rather than repeat subscription plumbing.

## `subscribe` identity matters

Defining a new subscribe function during every render can cause unnecessary resubscription.

```jsx
function Component() {
  const value = useSyncExternalStore(
    callback => store.subscribe(callback),
    store.getSnapshot,
  );
}
```

Prefer a stable subscription function outside the component when possible, or use a library abstraction that owns this efficiently.

## Parameterized subscriptions

A store may subscribe by identifier:

```jsx
function useProject(projectId) {
  return useSyncExternalStore(
    callback => projectStore.subscribe(projectId, callback),
    () => projectStore.getSnapshot(projectId),
  );
}
```

This can be valid, but function identity, snapshot caching, and selector design become part of the store architecture.

## `getServerSnapshot`

The optional third argument supports server rendering and hydration.

```jsx
const value = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot,
);
```

`getServerSnapshot` returns the value used during server rendering and the initial hydration path.

For browser-only data such as online status, the server may choose a deterministic placeholder snapshot:

```jsx
function getServerSnapshot() {
  return true;
}
```

## Hydration consistency

<VisualDiagram title="External store SSR → hydration flow" subtitle="The initial browser store state should be compatible with the server snapshot.">
  <LifecycleBar
    items={[
      {label: 'server chooses snapshot', tone: 'blue'},
      {label: 'render HTML', tone: 'purple'},
      {label: 'serialize / recreate initial data', tone: 'cyan'},
      {label: 'browser initializes compatible snapshot', tone: 'green'},
      {label: 'hydrate', tone: 'orange'},
      {label: 'live subscriptions take over', tone: 'slate'},
    ]}
  />
</VisualDiagram>

The exact transfer mechanism is framework/application specific. The important contract is that server and initial client snapshots agree enough for hydration.

## “The result of getSnapshot should be cached”

A common cause is returning a new object on every read:

```js
function getSnapshot() {
  return {count: store.count}; // ❌
}
```

Instead, update a cached snapshot only when state changes:

```js
let snapshot = {count: 0};

function increment() {
  snapshot = {count: snapshot.count + 1};
  emitChange();
}

function getSnapshot() {
  return snapshot;
}
```

## External stores and selectors

Reading one property from a whole-store snapshot does not automatically create a fine-grained subscription.

```jsx
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
const total = state.cart.total;
```

The subscription still observes the snapshot returned by `getSnapshot`. Fine-grained selector behaviour requires store/library design that supports the desired comparison/subscription semantics.

## Context + external store

Context and external stores can work together.

```jsx
<StoreContext value={workspaceStore}>
  <Workspace />
</StoreContext>
```

```jsx
function useWorkspaceSnapshot() {
  const store = useContext(StoreContext);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
```

<VisualDiagram title="Scoped external-store pattern">
  <DiagramStack align="center">
    <DiagramNode title="Context" tone="purple" wide>Chooses which store instance this subtree uses.</DiagramNode>
    <DiagramArrow label="consumer reads instance" />
    <DiagramNode title="useSyncExternalStore" tone="green" wide>Subscribes to that store's changing snapshot.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

This allows store A and store B to exist in separate provider subtrees without requiring one global singleton.

## When to use this Hook directly

Use it directly when building your own external-store abstraction, integrating browser subscription APIs, connecting mutable state outside React, or authoring React bindings for a library.

Application code using Redux, Zustand, or similar libraries normally uses the library's own React Hooks rather than wiring `useSyncExternalStore` manually.

## Not a replacement for local state

<DecisionTree
  question="Does this value need an external store?"
  items={[
    {label: 'It is ordinary local UI state owned by one component/feature', value: 'Prefer useState / useReducer'},
    {label: 'React owns it but descendants need broad access', value: 'Context may be enough'},
    {label: 'The underlying source lives outside React and can notify subscribers', value: 'useSyncExternalStore is the matching primitive'},
    {label: 'The problem is remote fetching/cache lifecycle', value: 'Use a server-state architecture instead'},
  ]}
/>

## Not a server-state cache

`useSyncExternalStore` does not automatically provide fetching, caching policy, invalidation, deduplication, retries, mutations, or pagination. It synchronizes React with an external source; it does not define that source's domain lifecycle.

## Concurrency mental model

React can reason about the source only through the snapshot contract you provide.

<VisualDiagram title="Your external-store responsibilities" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="subscribe" tone="green">Notify React when relevant store state may change.</DiagramNode>
    <DiagramNode title="getSnapshot" tone="blue">Return a stable immutable snapshot while unchanged.</DiagramNode>
    <DiagramNode title="getServerSnapshot" tone="purple">Provide compatible initial server/hydration state when SSR is used.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not mutate a snapshot behind React's back while continuing to return the same identity.

## Exercise

Build a preferences store containing `compactMode` and `fontScale`. Make snapshots immutable/stable, implement subscribe/unsubscribe, expose a `usePreferencesStore` Hook, and explain how this differs from Context + `useReducer`.

## Interview questions

**Mid-level:** What problem does `useSyncExternalStore` solve?

**Senior:** Why must an unchanged store return a stable snapshot identity?

**Staff:** How would you design SSR/hydration for an external store, and how would you scope multiple store instances safely?

## Summary

<VisualDiagram title="External-store integration sequence">
  <LifecycleBar
    items={[
      {label: 'external source owns data', tone: 'green'},
      {label: 'React subscribes', tone: 'blue'},
      {label: 'source notifies', tone: 'orange'},
      {label: 'React rereads stable snapshot', tone: 'purple'},
      {label: 'render if snapshot changed', tone: 'cyan'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react/useSyncExternalStore
- https://react.dev/reference/react/useContext

## Next

Continue into the state-management ecosystem chapters, where Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, and URL state are compared by ownership and lifecycle.
