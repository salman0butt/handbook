---
title: Activity in React 19.2
description: Learn how the stable Activity component hides UI while preserving state, how hidden Effects behave, and when Activity is better than conditional rendering.
sidebar_position: 6
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# `<Activity>` in React 19.2

`<Activity>` lets React hide and later restore a subtree while preserving its internal state.

```jsx
import {Activity} from 'react';

<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

Its purpose is not simply “hide some DOM.” It gives React an explicit hidden/restorable lifecycle for the subtree.

## Conditional rendering usually unmounts

```jsx
{isOpen && <Sidebar />}
```

<VisualDiagram title="Conditional rendering removes the subtree" compact>
  <LifecycleBar
    items={[
      { label: 'Sidebar visible', tone: 'blue' },
      { label: 'Condition becomes false', tone: 'orange' },
      { label: 'Component unmounts', tone: 'red' },
      { label: 'Local state is discarded', tone: 'slate' },
      { label: 'Later mount starts fresh', tone: 'green' },
    ]}
  />
</VisualDiagram>

That is often exactly what you want when leaving the UI should also reset its state.

## Activity preserves state

```jsx
<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

<VisualDiagram title="Activity hide and restore lifecycle" compact>
  <LifecycleBar
    items={[
      { label: 'Visible', tone: 'blue' },
      { label: 'Switch to hidden', tone: 'orange' },
      { label: 'DOM is hidden', tone: 'slate' },
      { label: 'Component state is retained', tone: 'green' },
      { label: 'Effects are cleaned up', tone: 'red' },
      { label: 'Visible again', tone: 'cyan' },
      { label: 'State restored + Effects re-created', tone: 'purple' },
    ]}
  />
</VisualDiagram>

This is useful for tabs, sidebars, panels, and workflows where temporary hiding should not mean “forget everything.”

## Hidden mode

React 19.2 supports:

```jsx
<Activity mode="visible">...</Activity>
<Activity mode="hidden">...</Activity>
```

In hidden mode, React visually hides the subtree using `display: none` behaviour. Its state remains available for restoration, while hidden work is treated differently from visible UI.

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

Conditional rendering:

```jsx
{showFilters && <FiltersPanel />}
```

can reset the local checkbox state after unmount/remount.

Activity:

```jsx
<Activity mode={showFilters ? 'visible' : 'hidden'}>
  <FiltersPanel />
</Activity>
```

can restore the previous local state when the panel becomes visible again.

## Hidden Effects are cleaned up

State preservation does **not** mean all side effects remain active.

<VisualDiagram title="Think: state retained, activity paused" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="State" tone="green">Retained for restoration.</DiagramNode>
    <DiagramNode title="DOM" tone="slate">Hidden rather than destroyed in the normal element case.</DiagramNode>
    <DiagramNode title="Effects" tone="red">Cleaned up while hidden and re-created when visible.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

That prevents hidden UI from keeping unnecessary subscriptions, timers, observers, event listeners, or external connections active.

Correct cleanup matters:

```jsx
useEffect(() => {
  const connection = connect(roomId);
  connection.start();

  return () => {
    connection.stop();
  };
}, [roomId]);
```

## Activity vs CSS hiding

CSS-only hiding preserves a mounted subtree, but React still sees that subtree as ordinarily mounted.

```jsx
<div style={{display: isOpen ? 'block' : 'none'}}>
  <Sidebar />
</div>
```

<VisualDiagram title="CSS hiding vs Activity" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="CSS display: none" tone="slate">Browser visual concern. React does not receive a hidden/restorable lifecycle signal.</DiagramNode>
    <DiagramNode title="Activity hidden" tone="purple">React knows the subtree is hidden, can preserve state, defer hidden work, and clean up Effects.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Activity vs conditional rendering

| Requirement | Conditional render | Activity |
| --- | --- | --- |
| Remove UI entirely | strong fit | not primary goal |
| Reset local state when reopened | strong fit | wrong fit |
| Preserve local state | requires another owner/persistence | strong fit |
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

<VisualDiagram title="Preparing likely next UI" compact>
  <LifecycleBar
    items={[
      { label: 'Reports Activity hidden', tone: 'slate' },
      { label: 'React renders hidden work at lower priority', tone: 'purple' },
      { label: 'Code/data resources can start preparing', tone: 'orange' },
      { label: 'User opens Reports', tone: 'blue' },
      { label: 'Prepared subtree can reveal faster', tone: 'green' },
    ]}
  />
</VisualDiagram>

Pre-rendering is most useful when the future interaction is likely enough to justify the retained work.

## Activity + Suspense

Activity becomes especially useful with Suspense-enabled resources:

```jsx
<Suspense fallback={<LoadingReports />}>
  <Activity mode={showReports ? 'visible' : 'hidden'}>
    <Reports />
  </Activity>
</Suspense>
```

A hidden subtree can begin rendering and encounter supported suspending resources before the user makes it visible.

Activity does **not** magically make Effect-based fetching Suspense-aware:

```jsx
useEffect(() => {
  fetch('/api/reports').then(...);
}, []);
```

Use Suspense-aware resources when pre-rendering data during render is the goal.

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

Local filters or draft DOM state in each tab can survive temporary hiding.

## Memory and stale-state trade-offs

Preservation is not free.

<VisualDiagram title="What Activity keeps alive" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Benefit" tone="green">State restoration · preserved DOM state · faster likely-next interactions.</DiagramNode>
    <DiagramNode title="Cost" tone="orange">Memory retention · hidden stale state · broader retained trees · possible background preparation work.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not wrap every route or panel in Activity “just in case.”

If leaving checkout should discard a draft, preserving that subtree may be the wrong product behaviour. Unmounting or an explicit reset is clearer.

## DOM side effects need care

A hidden Activity preserves DOM, so DOM elements with their own side effects—such as playing media—may need explicit cleanup tied to the hidden lifecycle.

Design the component so its Effects or layout Effects clean up what should stop when the UI becomes hidden.

## Accessibility

Activity does not replace focus management or component semantics. You still need to design tab semantics, modal focus behaviour, announcements, keyboard navigation, and other accessibility requirements around the actual user experience.

## Activity and routers

Framework routers may already own route caching, navigation, data, streaming, scroll restoration, and lifecycle. Do not layer Activity-based route preservation on top without understanding the framework's model and memory costs.

## Production decision guide

<DecisionTree
  question="Should this hidden UI use Activity?"
  items={[
    { label: 'Should local state reset when hidden?', value: 'Conditional render / unmount' },
    { label: 'Should state and DOM state be restorable?', value: 'Activity is a candidate' },
    { label: 'Restoration not worth retained memory?', value: 'Lift only the state that truly must survive' },
    { label: 'Likely next screen can benefit from preparation?', value: 'Activity + Suspense resources may help' },
    { label: 'Framework already owns route preservation?', value: 'Prefer the framework model first' },
  ]}
/>

## Common mistakes

- Using Activity where product behaviour should reset state.
- Assuming hidden Effects keep running normally.
- Treating Activity as generic CSS `display: none`.
- Pre-rendering too many future screens.
- Expecting Effect-based fetching to become Suspense-aware.
- Ignoring memory, stale-state, and accessibility trade-offs.

## Interview questions

**Junior:** How does Activity differ from conditionally rendering a component?

**Mid-level:** What happens to state and Effects when an Activity becomes hidden?

**Senior:** What are the memory, DOM, and data-lifecycle trade-offs of using Activity for tab or route preservation?

## References

- https://react.dev/reference/react/Activity
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/reference/react/Suspense

## Next

Continue with **[Metadata and Resource Loading](./metadata-and-resources.md)**.
