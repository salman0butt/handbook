---
title: Activity in React 19.2
description: Learn how the stable Activity component hides UI while preserving state, how hidden Effects behave, and when Activity is better than conditional rendering.
sidebar_position: 6
---

# `<Activity>` in React 19.2

React 19.2 adds the stable `<Activity>` component.

```jsx
import {Activity} from 'react';

<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

Its purpose is not merely “hide some DOM.” It lets React hide a subtree while **preserving its internal state for later restoration**.

## Conditional rendering normally unmounts

```jsx
{isOpen && <Sidebar />}
```

When `isOpen` becomes false, the component leaves the tree.

That usually means its local state is lost.

```text
visible Sidebar
   ↓
condition false
   ↓
unmount
   ↓
local state destroyed
```

When it mounts again, it starts fresh.

## Activity preserves state

```jsx
<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

Conceptually:

```text
visible
  ↓
hidden
  ↓
UI not visible
state retained
  ↓
visible again
  ↓
state restored
```

This is valuable for tabs, sidebars, panels, and workflows where temporary hiding should not mean “forget everything.”

## Hidden mode

Current React 19.2 Activity supports modes such as:

```jsx
<Activity mode="visible">...</Activity>
<Activity mode="hidden">...</Activity>
```

When hidden, React visually hides the subtree using `display: none` behavior.

That is different from conditionally removing it from the React tree.

## State preservation example

```jsx
function FiltersPanel() {
  const [advanced, setAdvanced] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={advanced}
        onChange={event => setAdvanced(event.target.checked)}
      />
      Advanced filters
    </label>
  );
}
```

With conditional rendering:

```jsx
{showFilters && <FiltersPanel />}
```

Hide and show it again and its local state may reset because the component unmounted.

With Activity:

```jsx
<Activity mode={showFilters ? 'visible' : 'hidden'}>
  <FiltersPanel />
</Activity>
```

The component can resume with its previous state.

## Hidden Effects do not keep running normally

State preservation does **not** mean every side effect remains active.

When an Activity becomes hidden, React can clean up Effects in that subtree.

That prevents hidden UI from continuing unnecessary synchronization such as:

- subscriptions;
- timers;
- observers;
- media synchronization;
- event listeners;
- external connections.

When the Activity becomes visible again, React can set those Effects up again.

This is why Effect cleanup correctness matters.

## Think “state retained, activity paused”

A useful model is:

```text
hidden Activity
  ├── component state retained
  ├── DOM hidden
  └── Effects not treated as continuously active UI
```

Do not treat hidden Activity as “the component is fully running off-screen forever.”

## Activity vs CSS hiding

You could write:

```jsx
<div style={{display: isOpen ? 'block' : 'none'}}>
  <Sidebar />
</div>
```

That preserves the mounted subtree, but React still sees it as ordinarily mounted.

Activity gives React semantic knowledge that the subtree is hidden, allowing React to coordinate rendering and Effects differently.

```text
CSS-only hiding
→ browser visual concern

Activity
→ React knows this subtree is hidden/restorable
```

## Activity vs conditional rendering

Use conditional rendering when hidden UI should genuinely leave the tree.

```jsx
{isModalOpen && <Modal />}
```

Use Activity when you intentionally want stateful restoration or background preparation.

Decision table:

| Requirement | Conditional render | Activity |
| --- | --- | --- |
| Remove UI entirely | strong fit | not primary goal |
| Reset local state when reopened | strong fit | wrong fit |
| Preserve local state | requires lifting/persistence | strong fit |
| React knows subtree is hidden | no | yes |
| Prepare likely future UI | limited | useful |

## Pre-rendering likely future content

A hidden Activity can prepare content before it becomes visible.

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Activity mode={activeTab === 'reports' ? 'visible' : 'hidden'}>
    <Reports />
  </Activity>
</Suspense>
```

This can help React prepare a tab or destination the user is likely to visit next.

## Activity and Suspense

Activity becomes especially interesting with Suspense-enabled resources.

```jsx
<Suspense fallback={<LoadingReports />}>
  <Activity mode={showReports ? 'visible' : 'hidden'}>
    <Reports />
  </Activity>
</Suspense>
```

A hidden subtree may begin rendering and encounter Suspense-enabled resources before the user makes it visible.

That can reduce waiting when the interaction happens later.

## Activity does not make Effect fetching Suspense-aware

Important:

```jsx
useEffect(() => {
  fetch('/api/reports').then(...);
}, []);
```

A hidden Activity does not automatically turn this Effect fetch into pre-rendered Suspense data.

Pre-rendering benefits supported resources that suspend during render, such as Promises read with `use` or framework-managed Suspense resources.

## Example: tab state preservation

```jsx
function Dashboard() {
  const [tab, setTab] = useState('overview');

  return (
    <>
      <nav>
        <button onClick={() => setTab('overview')}>Overview</button>
        <button onClick={() => setTab('reports')}>Reports</button>
      </nav>

      <Activity mode={tab === 'overview' ? 'visible' : 'hidden'}>
        <Overview />
      </Activity>

      <Activity mode={tab === 'reports' ? 'visible' : 'hidden'}>
        <Reports />
      </Activity>
    </>
  );
}
```

If `Reports` contains local filter state, hiding and restoring the tab can preserve it.

## Memory is still a trade-off

Preserving hidden UI is not free.

Keeping many large Activity subtrees means React still retains their state and associated structures.

Do not wrap every route and panel in Activity “just in case.”

Ask:

```text
Is restoration valuable enough to retain this subtree?
```

Potential costs:

- memory;
- complexity;
- hidden stale state;
- harder mental models;
- accidental pre-render work;
- broader retained component trees.

## Hidden stale state

State preservation can itself be wrong.

Suppose a checkout form should reset whenever the user leaves the checkout flow.

Activity preservation may retain values that product requirements expect to discard.

In that case, unmounting or explicit reset is preferable.

## Effects must tolerate visibility cycles

An Effect inside Activity should have correct setup and cleanup:

```jsx
useEffect(() => {
  const connection = connect(roomId);
  connection.start();

  return () => {
    connection.stop();
  };
}, [roomId]);
```

Activity can expose incorrect Effects because visibility changes may cause setup/cleanup cycles without destroying state.

## Accessibility

Hidden Activity content is visually hidden through React's hidden behavior, but accessibility should still be designed around the user's actual active experience.

Do not rely on Activity alone to solve:

- focus management;
- tab semantics;
- modal focus trapping;
- announcements;
- keyboard navigation.

When switching visible panels, move focus only when product interaction requires it and use correct semantic structures.

## Activity and routes

It can be tempting to preserve every route with Activity.

Framework routers may already have their own caching, navigation, data, and streaming models.

Do not layer Activity-based route caching on top of a framework without understanding:

- loader lifecycle;
- server-state invalidation;
- navigation semantics;
- memory growth;
- scroll restoration;
- accessibility.

## Common mistakes

### Using Activity when state should reset

If leaving the UI should discard local state, normal unmounting is clearer.

### Assuming hidden Effects keep running

Design Effects with correct cleanup and reconnection.

### Treating it as generic CSS `display: none`

Activity is a React lifecycle/rendering primitive with state preservation semantics.

### Pre-rendering too much

Preparing every possible future screen can waste CPU, memory, and network work.

### Expecting Effect-based data fetching to pre-render

Use Suspense-aware resources if pre-rendering is the goal.

## Production decision guide

```text
Need to hide UI?
   ↓
Should local state reset?
  ├─ yes → conditional rendering/unmount
  └─ no
      ↓
Is restoration valuable enough to retain subtree?
  ├─ no → consider lifting only required state
  └─ yes → Activity may fit
             ↓
Would pre-rendering likely future UI help?
  ├─ yes → combine thoughtfully with Suspense resources
  └─ no  → state restoration alone may still justify it
```

## Interview questions

**Junior:** How does Activity differ from conditionally rendering a component?

**Mid-level:** What happens to state and Effects when an Activity becomes hidden?

**Senior:** What are the memory and data-lifecycle trade-offs of using Activity for tab or route preservation?

## References

- https://react.dev/reference/react/Activity
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/reference/react/Suspense

## Next

Continue with **[Metadata and Resource Loading](./metadata-and-resources.md)**.