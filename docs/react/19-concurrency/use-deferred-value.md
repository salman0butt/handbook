---
title: useDeferredValue and Stale UI
description: Learn how useDeferredValue keeps urgent UI responsive while expensive or suspending subtrees lag behind, including caveats, stale indicators, and performance trade-offs.
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

# `useDeferredValue` and stale UI

`useDeferredValue` lets one part of the UI lag behind the latest value.

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

<VisualDiagram title="Latest value and deferred value have different jobs">
  <DiagramGrid columns={2}>
    <DiagramNode title="Latest value" tone="blue" eyebrow="CANONICAL / URGENT">
      What the input and immediate UI need now.
    </DiagramNode>
    <DiagramNode title="Deferred value" tone="purple" eyebrow="PRESENTATION MAY LAG">
      What slower or suspending UI may temporarily keep using.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## How the catch-up render works

Suppose `query` changes from `react` to `reacts`.

<LifecycleBar
  items={[
    { label: 'query = react', tone: 'green' },
    { label: 'User types s', tone: 'blue' },
    { label: 'Urgent render: query = reacts, deferredQuery = react', tone: 'orange' },
    { label: 'Background catch-up render begins', tone: 'purple' },
    { label: 'deferredQuery = reacts commits when ready', tone: 'green' },
  ]}
/>

The canonical value updates immediately. The dependent subtree is allowed to catch up in background work.

## Background rendering is interruptible

If the user keeps typing, React can abandon an obsolete deferred render and restart toward the latest value.

<VisualDiagram title="Deferred work follows the latest intent, not every intermediate frame">
  <DiagramStack align="center">
    <DiagramNode title="Background render for r" tone="purple" />
    <DiagramArrow label="user types re" />
    <DiagramNode title="Old render becomes obsolete" tone="red" />
    <DiagramArrow label="restart toward newest value" />
    <DiagramNode title="Background render for re" tone="purple" />
    <DiagramArrow label="commit only when ready" />
    <DiagramNode title="Slow UI catches up" tone="green" />
  </DiagramStack>
</VisualDiagram>

## There is no fixed delay

`useDeferredValue` is not a debounce. React does not wait a fixed 200ms or 500ms timer. It starts background rendering after urgent work and can interrupt that render when more urgent work arrives.

## It does not debounce requests

```jsx
const deferredQuery = useDeferredValue(query);
```

This does not guarantee fewer network requests. If your data layer starts a request for every query value, you may still get one request per keystroke.

<VisualDiagram title="Rendering priority and request frequency are separate concerns">
  <DiagramGrid columns={2}>
    <DiagramNode title="useDeferredValue" tone="purple">Controls React presentation priority.</DiagramNode>
    <DiagramNode title="Debounce / cache / cancel / dedupe" tone="orange">Controls request timing and network work.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Stale content with Suspense

```jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

return (
  <Suspense fallback={<ResultsSkeleton />}>
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <SearchResults query={deferredQuery} />
    </div>
  </Suspense>
);
```

<VisualDiagram title="First load and later updates can have different UX">
  <DiagramGrid columns={2}>
    <DiagramNode title="First load" tone="orange">No useful previous results exist → fallback may appear.</DiagramNode>
    <DiagramNode title="Later update" tone="green">Old deferred results stay visible while fresh results prepare.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Stale UI should be communicated through dimming, `aria-busy`, subtle progress, or another appropriate indicator.

## `initialValue`

Current React supports an optional initial value:

```jsx
const deferredValue = useDeferredValue(value, initialValue);
```

If supplied, `initialValue` can be used during the initial render before React catches up in the background. Without it, the initial render uses `value` because there is no previous version to preserve.

Use this carefully: an inappropriate initial value can briefly represent UI that never existed as canonical state.

## Stable value identity matters

Primitive values are straightforward.

```jsx
const deferredQuery = useDeferredValue(query);
```

Avoid creating a brand-new object during every render just to defer it:

```jsx
const deferredFilters = useDeferredValue({ query, sort });
```

That object is different every render. Prefer stable structured values when identity matters.

```jsx
const filters = useMemo(() => ({ query, sort }), [query, sort]);
const deferredFilters = useDeferredValue(filters);
```

React compares values using `Object.is` semantics when deciding whether background catch-up work is needed.

## Effects wait for the deferred render to commit

<VisualDiagram title="Background render is not committed UI">
  <DiagramStack align="center">
    <DiagramNode title="Deferred background render" tone="purple" />
    <DiagramArrow label="may suspend or be interrupted" />
    <DiagramNode title="No commit yet" tone="orange" />
    <DiagramArrow label="render finally completes" />
    <DiagramNode title="Commit" tone="green" />
    <DiagramArrow label="then" />
    <DiagramNode title="Effects for that committed render run" tone="blue" />
  </DiagramStack>
</VisualDiagram>

## Inside a Transition

If an update is already inside a Transition, `useDeferredValue` does not need to create a separate deferred render for that same value. The update is already non-urgent.

Do not mechanically combine every concurrency API; choose the smallest one that expresses the intended priority relationship.

## `useDeferredValue` vs `useTransition`

<VisualDiagram title="Initiated update vs lagging consumer">
  <DiagramGrid columns={2}>
    <DiagramNode title="useTransition" tone="purple">You control the setter and want that update to be non-urgent.</DiagramNode>
    <DiagramNode title="useDeferredValue" tone="teal">The value is already changing; one consumer may lag behind.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

```jsx
startTransition(() => {
  setTab(nextTab);
});
```

```jsx
const deferredQuery = useDeferredValue(query);
```

## Deferred rendering vs debounce

<VisualDiagram title="Different timing models">
  <DiagramGrid columns={2}>
    <DiagramNode title="Debounce" tone="orange">User types → wait → start work.</DiagramNode>
    <DiagramNode title="Deferred rendering" tone="purple">User types → urgent UI updates now → slower subtree catches up when possible.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

You can use both when you need both request timing control and rendering responsiveness.

## Deferred rendering does not make slow UI cheap

If the slow child still re-renders urgently even while its deferred prop is unchanged, component boundaries or `memo` may still matter.

```jsx
const SlowList = memo(function SlowList({ text }) {
  // expensive rendering
});

const deferredText = useDeferredValue(text);
return <SlowList text={deferredText} />;
```

Concurrency changes priority; profiling and architecture still decide cost.

## Production data-table pattern

<VisualDiagram title="Keep controls urgent; let expensive presentation lag">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent state" tone="blue">Input value · selected controls · accessibility state.</DiagramNode>
    <DiagramNode title="Deferred consumption" tone="purple">Large table · summary visualization · suspending results.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## When not to defer

Do not defer values when lag would be confusing or unsafe, for example direct drag position, checkbox state, current accessibility state, or values immediately required for a destructive confirmation.

<DecisionTree
  question="Can this consumer safely lag?"
  items={[
    { label: 'Old content remains useful and clearly marked stale', value: 'Good deferred candidate' },
    { label: 'Interaction itself must reflect current state immediately', value: 'Keep urgent' },
    { label: 'Problem is too many requests', value: 'Use network/data-layer controls' },
    { label: 'Problem is expensive render cost', value: 'Defer if appropriate, then profile/optimize too' },
  ]}
/>

## Common mistakes

- treating the deferred value as canonical state;
- expecting fewer server requests automatically;
- hiding that visible content is stale;
- passing unstable objects created during every render;
- assuming deferral replaces memoization or architecture work.

## Debugging checklist

1. Is urgent state updating immediately?
2. Does the expensive subtree actually receive the deferred value?
3. Are unstable identities causing extra background work?
4. Does Suspense preserve old deferred content as expected?
5. Are requests still firing too often?
6. Is stale UI visibly communicated?
7. Is stale UI actually acceptable for this feature?

## Exercise

Build a search page with 5,000 local items. Add artificial render cost, compare urgent rendering to `useDeferredValue`, memoize the list, show stale feedback, and compare the behavior with a 300ms debounce.

## Interview questions

**Beginner:** What does `useDeferredValue` return?

**Intermediate:** Why does it not reduce network requests by itself?

**Senior:** How would you combine urgent input, deferred results, Suspense, memoization, request cancellation, and stale-state UX in production search?

## Summary

<VisualDiagram title="Deferred-value mental model">
  <DiagramStack align="center">
    <DiagramNode title="Canonical value updates urgently" tone="blue" />
    <DiagramArrow label="consumer may keep previous value" />
    <DiagramNode title="Background catch-up render" tone="purple" />
    <DiagramArrow label="interruptible / may suspend" />
    <DiagramNode title="Latest completed presentation commits" tone="green" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition

## Next

Next, connect these APIs to React's broader concurrent rendering mental model.