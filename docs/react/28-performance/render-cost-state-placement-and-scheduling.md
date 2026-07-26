---
title: Render Cost, State Placement, and Scheduling
description: How state ownership, update scope, Context, external stores, Transitions, Suspense, and list architecture shape React performance.
sidebar_position: 5
---

# Render Cost, State Placement, and Scheduling

React performance is often determined more by **where state lives and how updates propagate** than by manual memoization.

A useful question is:

> What is the smallest part of the tree that actually needs to update?

## Update scope starts with state ownership

Imagine:

```text
App
 ├── Header
 ├── Sidebar
 └── ProductPage
      ├── Filters
      └── ProductGrid
```

If hover state lives in `App`, every hover update begins at the top of the tree.

```text
App state changes
   ↓
App renders
   ↓
all descendants are considered
```

If hover state belongs only to one product card, keep it there.

```text
ProductCard state changes
   ↓
ProductCard renders
```

This is often a better optimization than wrapping everything in `memo`.

## State should live at the lowest common owner

Not the lowest component possible.

The correct owner is the lowest component that must coordinate all readers/writers of that state.

If two siblings need the same selected item:

```text
Page
 ├── List
 └── Details
```

then `Page` may be the right owner.

Do not force state downward so aggressively that coordination becomes indirect or duplicated.

## Separate state by update frequency

Suppose one Context contains:

```js
{
  currentUser,
  theme,
  mousePosition,
  notifications,
  locale
}
```

`mousePosition` may update dozens of times per second, while `locale` almost never changes.

Putting them in one Context value creates a broad update surface.

Better architecture may split providers by domain/frequency:

```text
AuthContext
ThemeContext
LocaleContext
PointerStore
NotificationStore
```

## Context is not selective by default

A component reading Context re-renders when the provided value changes.

```js
const value = {
  user,
  logout,
};

<AuthContext value={value}>
```

If `value` gets a new identity every provider render, consumers see a changed Context value.

React Compiler may stabilize ordinary values automatically, but architecture still matters.

For very high-frequency or highly selective updates, an external store can be a better fit.

## External stores and selective subscriptions

`useSyncExternalStore` is useful when state exists outside React and subscribers need snapshot-based updates.

Store architectures can let different components subscribe to different slices.

Mental model:

```text
store changes
   ↓
subscribers notified
   ↓
React asks getSnapshot()
   ↓
only affected subscribers render
```

This can be preferable to pushing a rapidly changing monolithic Context object through a large tree.

## Derived data should stay derived

Bad:

```js
const [filtered, setFiltered] = useState([]);

useEffect(() => {
  setFiltered(filterItems(items, query));
}, [items, query]);
```

This creates:

```text
render
commit
Effect
setState
second render
```

Better:

```js
const filtered = filterItems(items, query);
```

If `filterItems` is measured as expensive and inputs frequently remain stable, then consider Compiler or targeted `useMemo`.

Do not create state merely to avoid a calculation.

## Update frequency vs render cost

Two dimensions matter:

```text
              low cost        high cost
low frequency   fine          profile
high frequency  often fine    likely bottleneck
```

A 0.1 ms render at 60 Hz may still be acceptable.

A 20 ms render on every keypress is much more concerning.

## Urgent and non-urgent updates

React concurrency lets you distinguish work by urgency.

Example search UI:

```js
setInputValue(nextValue);

startTransition(() => {
  setQuery(nextValue);
});
```

The input update is urgent.

The result update is non-urgent and interruptible.

This can keep typing responsive while large result trees render.

## Scheduling does not reduce CPU cost

If rendering the result tree costs 100 ms, a Transition does not make it cost 10 ms.

It can make the update interruptible and lower priority.

You may still need:

- better algorithms;
- list virtualization;
- server-side filtering;
- smaller component trees;
- memoization;
- reduced update frequency.

## `useDeferredValue` as architecture

Instead of maintaining two explicit states:

```js
const [query, setQuery] = useState('');
const [slowQuery, setSlowQuery] = useState('');
```

`useDeferredValue` can let a subtree lag behind an urgent value:

```js
const deferredQuery = useDeferredValue(query);
```

```text
input uses query
results use deferredQuery
```

This preserves the simple state model while allowing lower-priority rendering.

## Suspense and already-visible UI

Transitions and deferred values can help avoid replacing already-visible content with a fallback during non-urgent updates.

This is both a UX and performance architecture concern.

Users often prefer:

```text
old content + pending indicator
```

instead of:

```text
old content disappears
spinner appears
new content appears
```

## Large lists

Rendering architecture matters more than `memo` when the list is genuinely large.

Problems include:

- thousands of DOM nodes;
- expensive item renderers;
- expensive layout;
- scrolling cost;
- updates touching the entire collection.

Potential strategies:

### Virtualization

Render only what is visible plus a buffer.

```text
10,000 records
   ↓
~30 mounted rows
```

### Pagination

Reduce data and DOM size by product design.

### Server filtering/sorting

Avoid transferring or processing unnecessary data on the client.

### Stable item identity

Use real item keys.

```jsx
<Row key={item.id} item={item} />
```

Keys are identity, not a performance trick.

## Composition can reduce update fan-out

Suppose a wrapper owns state:

```jsx
function Page() {
  const [color, setColor] = useState('blue');

  return (
    <Layout color={color}>
      <VeryLargeContent />
    </Layout>
  );
}
```

Depending on component structure, pushing state deeper or passing stable `children` composition can reduce how much expensive work participates in an update.

The architectural goal is not “prevent all renders.”

It is “make update boundaries match ownership.”

## Avoid unnecessary global state

Global state increases the number of potential consumers and update paths.

Prefer local state when the state is local.

Good local candidates:

- open/closed state;
- hover state;
- local form draft;
- selected tab inside one panel;
- temporary UI state.

Global/shared state should earn its scope.

## Server state is not ordinary client state

Remote data has different properties:

- freshness;
- loading;
- retry;
- invalidation;
- deduplication;
- pagination;
- optimistic updates.

Treating server data as generic global client state often creates duplicated caches and excessive updates.

Use a data architecture designed for server state or framework data APIs.

## URL state

Filters, pagination, tabs, and search terms may belong in the URL when they are:

- shareable;
- bookmarkable;
- navigation-relevant;
- expected to survive reload.

Keeping URL-relevant state only in React state can create synchronization complexity.

## Ref state for non-rendering values

Some values change frequently but should not trigger rendering.

Examples:

- timer IDs;
- previous pointer coordinates used by imperative logic;
- DOM nodes;
- third-party object instances.

Refs can hold these values.

But do not hide render-relevant state in refs just to reduce renders.

If the UI needs to reflect the value, state/store data is usually the correct model.

## Batch updates around intent

React batches many state updates automatically.

```js
setFirstName('Ada');
setLastName('Lovelace');
```

Do not manually combine unrelated fields solely out of fear that two setters always mean two renders.

Model state by meaning and ownership.

## Avoid Effect feedback loops

Bad pattern:

```js
useEffect(() => {
  setState(transform(state));
}, [state]);
```

This may create repeated updates or infinite loops.

More subtle versions can cause performance regressions without infinite looping.

Ask whether the next state can be calculated:

- in the event handler;
- in the reducer;
- during render;
- at the external source.

## Architecture checklist

When an update is expensive, ask:

1. Who owns the state?
2. Who actually needs it?
3. Is any state duplicated/derived?
4. Is Context too broad?
5. Would an external store subscription be narrower?
6. Is this work urgent?
7. Is the collection too large to render fully?
8. Is the calculation expensive or the DOM expensive?
9. Could work happen on the server?
10. Can the API shape prevent unnecessary prop churn?

## Exercise

You have a trading dashboard with:

- live prices updating 10 times per second;
- theme Context;
- a large order history table;
- a search input;
- selected instrument state;
- chart hover coordinates.

Design ownership for each value.

Explain which should use:

- local state;
- Context;
- external store;
- deferred/Transition rendering;
- refs;
- server state.

## Interview questions

### Why can moving state improve performance?

Because updates begin where state is owned. Narrower ownership can reduce the amount of tree React needs to reconsider for each update.

### When might an external store outperform Context?

For high-frequency or selectively consumed external state where subscribers need narrow snapshot-based updates rather than every consumer reacting to one provider value.

### Does `startTransition` reduce render cost?

No. It changes scheduling priority and interruption behavior. The work may still cost the same CPU time.

### Why is derived state often a performance smell?

If derived through Effects, it can create extra render/commit/update cycles and duplicated sources of truth.

## References

- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useSyncExternalStore
