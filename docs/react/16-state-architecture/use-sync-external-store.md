---
title: useSyncExternalStore and External Subscriptions
description: Subscribe React components to stores and browser APIs outside React using subscribe/getSnapshot/getServerSnapshot with correct snapshot identity and SSR behavior.
sidebar_position: 2
---

# `useSyncExternalStore` and external subscriptions

`useSyncExternalStore` is React's built-in Hook for reading values from a data source that lives **outside React** and can notify subscribers when it changes.

```jsx
const snapshot = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot,
);
```

It solves a different problem from Context.

```text
Context
→ distributes React tree data

useSyncExternalStore
→ subscribes React to an external mutable source
```

## What counts as an external store?

An external store is any source whose state is not owned by `useState` or `useReducer` in the component tree.

Examples:

- custom JavaScript store object;
- third-party state library;
- browser online/offline state;
- media query subscription;
- shared store used by React and non-React code;
- application store with `subscribe` + snapshot semantics.

## Basic mental model

React needs two capabilities:

```text
1. Read the current value
2. Know when that value may have changed
```

That maps to:

```text
getSnapshot()  → read
subscribe(cb)  → notify
```

## Minimal external store

```js
let todos = [];
let listeners = new Set();

export const todosStore = {
  getSnapshot() {
    return todos;
  },

  subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  addTodo(todo) {
    todos = [...todos, todo];

    for (const listener of listeners) {
      listener();
    }
  },
};
```

React consumer:

```jsx
import { useSyncExternalStore } from 'react';
import { todosStore } from './todosStore.js';

function TodoList() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
  );

  return todos.map(todo => (
    <p key={todo.id}>{todo.text}</p>
  ));
}
```

## `subscribe`

The subscribe function receives a callback.

It should register that callback and return an unsubscribe function.

```js
function subscribe(callback) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}
```

Whenever the external data may have changed:

```js
for (const listener of listeners) {
  listener();
}
```

React then calls `getSnapshot` to determine the current value.

## `getSnapshot`

`getSnapshot` returns the value React should render from the external store.

```js
function getSnapshot() {
  return todos;
}
```

Important requirement:

> If the store has not changed, repeated `getSnapshot()` calls should return an `Object.is`-equal snapshot.

Bad:

```js
function getSnapshot() {
  return [...todos]; // ❌ new array every call
}
```

Even when nothing changed, this creates a different snapshot identity.

Better:

```js
let todos = [];

function getSnapshot() {
  return todos;
}
```

Create a new array only when the store actually changes.

## Immutable snapshots are easiest

A strong store model is:

```text
store changes
   ↓
create new immutable snapshot
   ↓
notify subscribers
```

```js
function addTodo(todo) {
  todos = [...todos, todo];
  emitChange();
}
```

If the underlying store is mutable, you may need to cache an immutable snapshot and only replace it when relevant data changes.

## Browser API example: online status

```jsx
import { useSyncExternalStore } from 'react';

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

Component:

```jsx
function StatusBadge() {
  const online = useOnlineStatus();

  return <span>{online ? 'Online' : 'Offline'}</span>;
}
```

This is a clean example because the browser, not React, owns the source of truth.

## Why not `useEffect` + `useState`?

You could manually write:

```jsx
const [online, setOnline] = useState(navigator.onLine);

useEffect(() => {
  // subscribe and set state
}, []);
```

For some simple browser APIs that can work.

But `useSyncExternalStore` exists specifically to integrate external stores with React's rendering model safely and consistently.

Use the dedicated primitive when you are subscribing to an external mutable source.

## Extract into a custom Hook

Consumers should usually not repeat store wiring.

```jsx
export function useTodos() {
  return useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
  );
}
```

Then:

```jsx
const todos = useTodos();
```

This hides external-store mechanics behind a domain API.

## `subscribe` identity matters

If you define `subscribe` inside a component:

```jsx
function Component() {
  const value = useSyncExternalStore(
    callback => store.subscribe(callback),
    store.getSnapshot,
  );
}
```

that function is recreated on every render.

React may need to resubscribe when `subscribe` changes.

Prefer a stable function defined outside the component when possible:

```js
const subscribe = callback => store.subscribe(callback);
```

or expose `store.subscribe` directly if its calling semantics are safe.

## Parameterized subscriptions

Sometimes a custom Hook depends on an ID.

```jsx
function useProject(projectId) {
  return useSyncExternalStore(
    callback => projectStore.subscribe(projectId, callback),
    () => projectStore.getSnapshot(projectId),
  );
}
```

This can be valid, but function identity and caching deserve attention.

A library may provide selector/subscription primitives that handle this efficiently.

## `getServerSnapshot`

The optional third argument supports server rendering.

```jsx
const value = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot,
);
```

`getServerSnapshot` supplies the snapshot used during server rendering and hydration.

Example for online status:

```jsx
function getServerSnapshot() {
  return true;
}
```

The server cannot know the browser's actual network state, so you choose a deterministic server snapshot.

## Hydration consistency

The server snapshot and initial client hydration need to be compatible.

If the server renders one value and hydration immediately sees a different value without a valid strategy, you can create hydration inconsistencies.

For external stores used with SSR, think about:

- what value exists on the server;
- how initial store data reaches the client;
- whether the same initial snapshot can be reconstructed;
- when live subscriptions should take over.

## Server-injected store data

A server-rendered application might serialize initial store data into the HTML.

Conceptually:

```text
server store snapshot
      ↓
render HTML
      ↓
serialize snapshot
      ↓
browser initializes store with same snapshot
      ↓
hydrate
      ↓
start live subscriptions
```

The exact mechanism is framework/application specific.

## Snapshot caching error

A common error is effectively:

```text
The result of getSnapshot should be cached
```

Cause:

```js
function getSnapshot() {
  return { count: store.count }; // new object every call
}
```

Fix by returning a cached/immutable snapshot that only changes when store data changes.

```js
let snapshot = { count: 0 };

function increment() {
  snapshot = { count: snapshot.count + 1 };
  emitChange();
}

function getSnapshot() {
  return snapshot;
}
```

## External stores and selectors

A simple store may return the whole state:

```jsx
const state = useSyncExternalStore(
  store.subscribe,
  store.getSnapshot,
);
```

Then:

```jsx
const total = state.cart.total;
```

But the component's subscription is still based on the snapshot returned by `getSnapshot`.

Fine-grained selector behavior requires store/library design that can subscribe or compare at the required granularity.

Do not assume destructuring creates a selector subscription.

## Context + external store

These tools can work together.

For example, Context may provide a store instance:

```jsx
<StoreContext value={workspaceStore}>
  <Workspace />
</StoreContext>
```

Then a custom Hook can subscribe to that external store:

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

Now:

```text
Context chooses which store instance
useSyncExternalStore subscribes to its data
```

This is a powerful pattern for scoped external stores.

## Store instance scope

You can create one store per feature instance rather than one global singleton.

```text
EditorProvider
└── editorStore A

EditorProvider
└── editorStore B
```

Each subtree can subscribe to its own store instance.

This combines tree-based scoping with external-store subscription behavior.

## When to use this Hook directly

Use `useSyncExternalStore` directly when:

- building your own external store abstraction;
- integrating a browser subscription API;
- integrating existing mutable state outside React;
- authoring a library that exposes React bindings for an external source.

Application developers using Redux/Zustand/etc. normally use the library's React Hooks instead of wiring `useSyncExternalStore` manually.

## Not a replacement for `useState`

Bad idea:

```text
I learned useSyncExternalStore,
so all state can move outside React.
```

Local React state remains the best default for local UI state.

Use external stores because the ownership/subscription requirements demand them.

## Not a server-state cache

`useSyncExternalStore` subscribes to an external store.

It does not automatically provide:

- fetching;
- caching policy;
- invalidation;
- deduplication;
- retries;
- mutations;
- pagination.

Those are separate concerns.

## Concurrency mental model

The Hook exists so React can reason about the external source through a stable snapshot contract.

Your responsibility is to provide:

```text
subscribe
getSnapshot
optional getServerSnapshot
```

with consistent semantics.

Do not mutate a snapshot behind React's back while continuing to return the same identity.

## Exercise

Build a small external store for browser preferences:

```js
{
  compactMode: false,
  fontScale: 1,
}
```

Requirements:

- `getSnapshot` returns stable immutable snapshots;
- `subscribe` registers/removes listeners;
- setters create a new snapshot;
- a `usePreferencesStore` Hook uses `useSyncExternalStore`;
- render two separate consumers;
- explain how this differs from Context + `useReducer`.

## Interview questions

**Mid-level:** What problem does `useSyncExternalStore` solve?

**Senior:** Why must an unchanged store return a stable snapshot identity?

**Staff:** How would you design SSR/hydration for an external store, and how would you decide between Context, reducer+Context, and an external subscription model?

## Summary

```text
state lives outside React
        ↓
subscribe tells React when it may change
        ↓
getSnapshot returns current stable snapshot
        ↓
React renders consumers safely
        ↓
getServerSnapshot bridges SSR when needed
```

## References

- https://react.dev/reference/react/useSyncExternalStore

## Next

Next phase moves into **modern React 19+ APIs**, including Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, modern provider/ref patterns, `<Activity>`, and current React DOM capabilities.