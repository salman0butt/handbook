---
title: useDeferredValue and Stale UI
description: Learn how useDeferredValue keeps urgent UI responsive while expensive or suspending subtrees lag behind, including caveats, stale indicators, and performance trade-offs.
sidebar_position: 2
---

# `useDeferredValue` and stale UI

`useDeferredValue` lets one part of your UI use a value that may lag behind the latest value.

```jsx
import { useDeferredValue, useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <SearchResults query={deferredQuery} />
    </>
  );
}
```

The input remains urgent. The expensive results subtree is allowed to lag behind.

The mental model is:

```text
latest value       → what urgent UI needs now
deferred value     → what slower UI may catch up to in the background
```

## How updates happen

Suppose:

```text
query = "react"
```

The user types another character:

```text
query = "reacts"
```

React can first render:

```text
query = "reacts"
deferredQuery = "react"
```

Then it attempts a background render with:

```text
query = "reacts"
deferredQuery = "reacts"
```

When that background render completes successfully, React commits it.

## The background render is interruptible

If the user continues typing before the deferred render finishes, React can abandon obsolete background work and restart with the newest value.

```text
type r
→ deferred render begins

type re
→ old background render becomes obsolete
→ React works toward latest value
```

This is useful for slow lists, visualizations, and content-heavy views that depend on rapidly changing urgent state.

## There is no fixed delay

`useDeferredValue` is not a debounce.

React does not wait for a hardcoded 200ms or 500ms timer.

It begins working on the deferred update after urgent work and may interrupt that work if more urgent updates arrive.

## `useDeferredValue` does not debounce requests

This is one of the most important production distinctions.

```jsx
const deferredQuery = useDeferredValue(query);
```

does not guarantee only one network request will happen.

If your data layer starts requests for each query value, you may still create one request per keystroke.

Use request deduplication, caching, debounce, cancellation, or framework data APIs when you need network control.

## Stale content with Suspense

A powerful pattern is to keep old results visible while new results suspend.

```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <Suspense fallback={<ResultsSkeleton />}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

On first load, the fallback may appear.

During later updates, the stale deferred results can stay visible while fresh content loads.

## Communicate staleness

Keeping stale content visible can be better UX, but users should know it is stale.

Useful signals include:

- dimming;
- subtle progress indicators;
- “Updating…” labels;
- `aria-busy` where appropriate;
- temporary restrictions on actions that require fresh data.

Do not visually preserve stale content when correctness depends on users knowing it changed immediately.

## `initialValue`

Current React supports an optional initial value:

```jsx
const deferredValue = useDeferredValue(value, initialValue);
```

On initial render, React can use `initialValue` first and then render the current value in the background.

If you omit it, the initial render uses the provided value because there is no previous deferred value to preserve.

Use this intentionally. An incorrect initial value can briefly represent UI state that never actually existed.

## Values should have stable identity

Primitive values are naturally straightforward:

```jsx
const deferredQuery = useDeferredValue(query);
```

Be careful with objects created during every render:

```jsx
const deferredFilters = useDeferredValue({ query, sort });
```

That object is new every render, so React sees it as a different value every time.

Prefer stable objects when deferring structured values:

```jsx
const filters = useMemo(() => ({ query, sort }), [query, sort]);
const deferredFilters = useDeferredValue(filters);
```

Later, React Compiler may reduce some manual memoization needs, but value identity still matters conceptually.

## `Object.is` comparison

React compares the incoming value against the previous one using `Object.is` semantics.

If it differs, React can schedule a background render with the new deferred value.

That is why recreating objects unnecessarily can cause unnecessary deferred work.

## Effects from deferred renders

A deferred background render is not committed until it is ready.

Effects associated with that render do not run until the render commits.

This reinforces the render/commit distinction:

```text
background rendering may happen
→ no commit yet
→ no committed Effects yet
```

## Inside a Transition

If an update is already happening inside a Transition, `useDeferredValue` does not need to create another separate deferred render for the same value.

The update is already non-urgent.

This means you should not mechanically combine every concurrency API.

Use the smallest tool that expresses the intended priority relationship.

## `useDeferredValue` vs `useTransition`

Use `useTransition` when you control the update:

```jsx
startTransition(() => {
  setTab(nextTab);
});
```

Use `useDeferredValue` when a value is already changing urgently but one consumer may lag:

```jsx
const deferredQuery = useDeferredValue(query);
```

A useful distinction:

```text
useTransition      → mark an update you initiate as non-urgent
useDeferredValue   → let a consumer lag behind a value you receive
```

## `useDeferredValue` vs debounce

Debounce changes **when work begins**.

```text
user types
→ wait 300ms
→ start work
```

Deferred rendering changes **React render priority**.

```text
user types
→ urgent UI updates now
→ slower React subtree catches up when possible
```

You can use both if both network timing and rendering responsiveness matter.

## `useDeferredValue` vs memoization

Deferring does not automatically make a slow component cheap.

If the parent re-renders urgently and your slow subtree recomputes even when its deferred prop is unchanged, you may need `memo` or better component boundaries.

```jsx
const SlowList = memo(function SlowList({ text }) {
  // expensive rendering
});
```

Then urgent parent renders can skip the expensive child while `deferredText` is unchanged.

## Deferred rendering and memo

Consider:

```jsx
const deferredText = useDeferredValue(text);
return <SlowList text={deferredText} />;
```

If `SlowList` is not memoized, the urgent render of the parent may still render `SlowList` even though `deferredText` has not changed.

Deferring the value and avoiding unnecessary child renders are related but distinct concerns.

## Production example: data table filtering

Urgent state:

```text
input value
selected controls
```

Deferred state consumption:

```text
large filtered table
summary visualization
```

Architecture:

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

return (
  <>
    <SearchBox value={query} onChange={setQuery} />
    <MemoizedLargeTable query={deferredQuery} />
  </>
);
```

The user sees immediate keystrokes while table rendering can lag.

## Production example: Suspense-backed search

If the results resource suspends:

```jsx
const deferredQuery = useDeferredValue(query);
const stale = query !== deferredQuery;

<Suspense fallback={<FirstLoadSkeleton />}>
  <Results query={deferredQuery} stale={stale} />
</Suspense>
```

The first load can show a fallback. Later searches can preserve old results while new data prepares.

## When not to defer

Do not defer values where lag would be confusing or unsafe.

Examples:

- password strength rules that must reflect the exact current value;
- confirmation totals immediately before a destructive payment action;
- direct cursor/drag position;
- selected checkbox state;
- accessibility state that must match the control now.

Priority is a product decision.

## Common mistake: using deferred value as canonical state

The deferred value is a rendering tool, not a second source of truth.

Do not build application logic that treats the stale deferred value as authoritative.

Canonical state remains the latest value.

## Common mistake: expecting fewer server requests

Again:

```text
useDeferredValue ≠ debounce
```

Measure network behavior separately.

## Common mistake: hiding stale state

If users see old search results for a new query with no indication, they may assume the system returned incorrect data.

## Debugging deferred UI

Ask:

1. Is the urgent state updating immediately?
2. Is the expensive subtree actually receiving the deferred value?
3. Is the child memoized where necessary?
4. Are new object identities causing unnecessary deferred renders?
5. Is Suspense preserving old deferred content as expected?
6. Are network requests still firing too often?
7. Is staleness visibly communicated?
8. Does the use case tolerate stale UI?

## Exercise

Build a search page with 5,000 locally generated items.

1. Filter using the urgent input value.
2. Add artificial render cost and observe typing lag.
3. Add `useDeferredValue`.
4. Memoize the slow list.
5. Add a stale indicator.
6. Compare the behavior to a 300ms debounce.
7. Explain why the two techniques solve different problems.

## Interview questions

**Beginner:** What does `useDeferredValue` return?

**Intermediate:** Why does `useDeferredValue` not reduce network requests by itself?

**Senior:** How would you combine urgent input state, a deferred query, Suspense-backed results, memoization, cancellation, and stale-state UX in a production search page?

## Summary

```text
useDeferredValue lets a UI consumer lag behind the latest value.
There is no fixed delay.
Background deferred rendering is interruptible.
It integrates with Suspense to preserve stale content.
It does not debounce requests.
Stable value identity and memoized expensive children still matter.
Use it only when stale UI is acceptable.
```

## References

- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition

## Next

Next, connect these APIs to React's broader concurrent rendering mental model.