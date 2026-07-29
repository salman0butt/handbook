---
title: Render Cost, State Placement, and Scheduling
description: How state ownership, update scope, Context, external stores, Transitions, Suspense, and list architecture shape React performance.
sidebar_position: 5
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Render Cost, State Placement, and Scheduling

React performance is often determined more by **where state lives and how updates propagate** than by manual memoization.

A useful question is:

> What is the smallest part of the tree that actually needs to update?

## Update scope starts with ownership

<VisualDiagram title="State ownership defines where an update begins">
  <DiagramGrid columns={2}>
    <DiagramNode title="Hover state in App" tone="red">App update → large subtree is reconsidered</DiagramNode>
    <DiagramNode title="Hover state in ProductCard" tone="green">Only the local card owns and renders the hover update</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Moving state closer to its true owner can outperform wrapping the whole tree in `memo`.

## Lowest common owner, not lowest possible component

If two siblings coordinate selected state:

```text
Page
├── List
└── Details
```

`Page` may be the correct owner.

<DecisionTree
  question="Where should this state live?"
  items={[
    { label: 'Only one component needs it', value: 'Keep it local' },
    { label: 'Several siblings coordinate on it', value: 'Lift to their lowest common owner' },
    { label: 'Many distant consumers need a stable shared domain', value: 'Context/store may be appropriate' },
    { label: 'It is remote cached data', value: 'Use server-state/framework data architecture' },
  ]}
/>

Do not push state downward so aggressively that coordination becomes duplicated or indirect.

## Separate state by update frequency

A single Context containing `currentUser`, `theme`, `mousePosition`, notifications, and locale mixes slow and extremely fast domains.

<VisualDiagram title="Different update frequencies deserve different boundaries">
  <DiagramGrid columns={3}>
    <DiagramNode title="Slow-changing" tone="blue">Auth · locale · theme</DiagramNode>
    <DiagramNode title="Moderate" tone="purple">Notifications · feature state</DiagramNode>
    <DiagramNode title="High-frequency" tone="orange">Pointer/streaming/live data</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A high-frequency value should not automatically force every unrelated consumer of a giant Context value to participate.

## Context is not selective by default

```js
const value = {
  user,
  logout,
};

<AuthContext value={value}>...</AuthContext>
```

When the provided value changes, consumers that read that Context update.

React Compiler may stabilize ordinary values automatically, but it does not change the ownership model. Very high-frequency or selectively consumed state may fit an external store better.

## External stores and narrow subscriptions

<VisualDiagram title="External-store update flow">
  <DiagramRow>
    <DiagramNode title="Store changes" tone="blue">External source owns state</DiagramNode>
    <DiagramArrow direction="right" label="notify" />
    <DiagramNode title="Subscribers" tone="teal">React asks getSnapshot()</DiagramNode>
    <DiagramArrow direction="right" label="changed snapshot" />
    <DiagramNode title="Affected consumers render" tone="green">Narrow update surface</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Selectors/store architecture can make subscription granularity much narrower than one monolithic Context value.

## Keep derived data derived

Avoid storing a calculated value merely to recompute it in an Effect:

```js
const [filtered, setFiltered] = useState([]);

useEffect(() => {
  setFiltered(filterItems(items, query));
}, [items, query]);
```

<VisualDiagram title="Effect-derived state creates an extra cycle">
  <LifecycleBar items={[
    { label: 'Render with old derived state', tone: 'blue' },
    { label: 'Commit', tone: 'purple' },
    { label: 'Effect recalculates', tone: 'orange' },
    { label: 'setState', tone: 'red' },
    { label: 'Second render', tone: 'red' },
  ]} />
</VisualDiagram>

Prefer:

```js
const filtered = filterItems(items, query);
```

If calculation cost is measured as significant and inputs often remain stable, then consider Compiler or targeted `useMemo`.

## Frequency × cost determines urgency

<VisualDiagram title="Update frequency and render cost are separate axes">
  <DiagramGrid columns={2}>
    <DiagramNode title="Low frequency · low cost" tone="green">Usually fine</DiagramNode>
    <DiagramNode title="Low frequency · high cost" tone="orange">Profile the interaction</DiagramNode>
    <DiagramNode title="High frequency · low cost" tone="teal">Often fine, measure</DiagramNode>
    <DiagramNode title="High frequency · high cost" tone="red">Likely architectural bottleneck</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A tiny 60 Hz update can still be cheaper than a 20 ms render on every keypress.

## Urgent vs non-urgent updates

```js
setInputValue(nextValue);

startTransition(() => {
  setQuery(nextValue);
});
```

<VisualDiagram title="Scheduling can protect urgent interaction">
  <DiagramRow>
    <DiagramNode title="Urgent input" tone="blue">Character should appear immediately</DiagramNode>
    <DiagramArrow direction="right" label="alongside" />
    <DiagramNode title="Transition results" tone="purple">Non-urgent · interruptible</DiagramNode>
    <DiagramArrow direction="right" label="eventually" />
    <DiagramNode title="Committed results" tone="green">Catch up to latest query</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A Transition does **not** reduce total CPU cost. It changes priority and interruption behavior.

## `useDeferredValue`

```js
const deferredQuery = useDeferredValue(query);
```

<DiagramGrid columns={2}>
  <DiagramNode title="Input" tone="blue">Uses canonical `query` immediately</DiagramNode>
  <DiagramNode title="Results" tone="purple">Use `deferredQuery` and may lag behind</DiagramNode>
</DiagramGrid>

This often preserves a simpler state model than manually maintaining both `query` and `slowQuery`.

## Suspense and already-visible UI

Transitions and deferred values can keep useful previous content visible during non-urgent work.

<VisualDiagram title="Preserve orientation when new work is pending">
  <DiagramGrid columns={2}>
    <DiagramNode title="Preferred when appropriate" tone="green">Old content stays visible + pending feedback</DiagramNode>
    <DiagramNode title="More disruptive" tone="orange">Old content disappears → spinner → new content</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Boundary placement is both a performance and UX decision.

## Large lists need bounded rendering

When thousands of rows dominate DOM/layout/render cost, architecture matters more than per-row memoization.

<VisualDiagram title="Virtualization bounds mounted work">
  <DiagramRow>
    <DiagramNode title="10,000 records" tone="red">Full dataset</DiagramNode>
    <DiagramArrow direction="right" label="viewport" />
    <DiagramNode title="~30 mounted rows" tone="green">Visible region + buffer</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Other strategies include pagination, server filtering/sorting, reducing item complexity, and stable item identity.

```jsx
<Row key={item.id} item={item} />
```

Keys preserve identity; they are not a performance trick.

## Composition can reduce update fan-out

The architectural goal is not to prevent all renders. It is to make update boundaries match ownership.

A wrapper that owns small local state should not automatically make unrelated expensive content depend on that state.

## Avoid unnecessary global state

Good local candidates include open/closed state, hover state, a local form draft, one panel's selected tab, and temporary interaction state.

Shared/global state should earn its scope.

## Server state has a different lifecycle

Remote data includes freshness, loading, retry, invalidation, deduplication, pagination, and optimistic updates.

Treating it as generic global client state often creates duplicate caches and broad updates.

Use a server-state/query framework or framework data architecture for the lifecycle it actually has.

## URL state

Filters, pagination, tabs, and search terms often belong in the URL when they are shareable, bookmarkable, navigation-relevant, or expected to survive reload.

Duplicating URL state into generic React state can create extra synchronization work.

## Refs for non-rendering values

Refs are appropriate for timer IDs, DOM nodes, third-party instances, and high-frequency imperative values that should not trigger rendering.

Do not hide render-relevant state in refs merely to reduce renders. If the UI must reflect a value, it belongs in state/store data.

## Automatic batching

React batches many updates automatically:

```js
setFirstName('Ada');
setLastName('Lovelace');
```

Do not combine unrelated state purely out of fear that multiple setters always mean multiple renders. Model state by meaning and ownership.

## Avoid Effect feedback loops

```js
useEffect(() => {
  setState(transform(state));
}, [state]);
```

This can create repeated or infinite updates.

<DecisionTree
  question="Where should the next value be calculated?"
  items={[
    { label: 'Direct result of current props/state', value: 'During render' },
    { label: 'Result of explicit user intent', value: 'Event handler / reducer' },
    { label: 'Owned by an external source', value: 'At the source/store boundary' },
    { label: 'Synchronization with an external system', value: 'Effect when genuinely needed' },
  ]}
/>

## Architecture checklist

When an update is expensive, ask:

1. Who owns the state?
2. Who actually needs it?
3. Is any state duplicated or derived?
4. Is Context too broad?
5. Would a narrower external-store subscription help?
6. Is this work urgent?
7. Is the collection too large to render fully?
8. Is the calculation expensive, or is the DOM/layout expensive?
9. Could work happen on the server?
10. Can API/prop shape reduce unnecessary churn?

## Interview questions

### Why can moving state improve performance?

Updates begin where state is owned. Narrower ownership can reduce the amount of tree participating in each update.

### When might an external store outperform Context?

For high-frequency or selectively consumed external state where subscribers need narrow snapshot-based updates.

### Does `startTransition` reduce render cost?

No. It changes scheduling priority and interruption behavior; the work may cost the same CPU time.

### Why is derived state often a performance smell?

When derived through Effects, it creates duplicate sources of truth and extra render/commit/update cycles.

## References

- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useSyncExternalStore
