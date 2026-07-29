---
title: useTransition and startTransition Deep Dive
description: Deep mental model for non-blocking React updates, interruption, pending state, async Actions, Suspense coordination, and Transition trade-offs.
sidebar_position: 1
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

# `useTransition` and `startTransition` deep dive

Transitions let React treat some state updates as **non-urgent** so urgent interactions can stay responsive while the next UI prepares.

```jsx
const [isPending, startTransition] = useTransition();

function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}
```

<VisualDiagram title="Urgent and Transition updates express different priorities">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent update" tone="blue" eyebrow="RESPOND NOW">
      Typing, pressed state, focus, drag position, direct control feedback.
    </DiagramNode>
    <DiagramNode title="Transition update" tone="purple" eyebrow="CAN PREPARE">
      Navigation, expensive tab content, large filtered views, heavy presentation changes.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Transitions do not create threads, workers, or delayed timers. They change how React schedules rendering work.

## `useTransition` vs standalone `startTransition`

```jsx
const [isPending, startTransition] = useTransition();
```

`useTransition` gives local pending state plus a Transition starter.

```jsx
import { startTransition } from 'react';

startTransition(() => {
  setRoute(nextRoute);
});
```

Standalone `startTransition` is useful outside component Hook scope or when pending state is managed elsewhere.

## The callback runs immediately

```jsx
startTransition(() => {
  console.log('runs now');
  setPage('/reports');
});
```

<VisualDiagram title="startTransition does not delay the callback">
  <DiagramStack align="center">
    <DiagramNode title="Call startTransition" tone="blue" />
    <DiagramArrow label="callback executes immediately" />
    <DiagramNode title="Eligible state setters are marked as Transition updates" tone="purple" />
    <DiagramArrow label="React schedules resulting render with lower urgency" />
    <DiagramNode title="Background rendering may be interrupted" tone="orange" />
  </DiagramStack>
</VisualDiagram>

## Rendering is interruptible

If urgent work arrives while React prepares a Transition render, React can prioritize the urgent work and later resume or restart the background work.

<LifecycleBar
  items={[
    { label: 'Start expensive Transition render', tone: 'purple' },
    { label: 'User types', tone: 'blue' },
    { label: 'Urgent input render wins', tone: 'green' },
    { label: 'Obsolete work may be abandoned', tone: 'red' },
    { label: 'Transition restarts with latest state', tone: 'purple' },
  ]}
/>

This is why rendering must remain pure: a render can happen without committing.

## Transitions cannot control text inputs

Bad:

```jsx
function handleChange(event) {
  startTransition(() => {
    setQuery(event.target.value);
  });
}
```

Good:

```jsx
function handleChange(event) {
  setQuery(event.target.value);
}
```

Then defer expensive dependent presentation with `useDeferredValue`, or update separate downstream state inside a Transition.

## Pending state is feedback, not a global lock

```jsx
const [isPending, startTransition] = useTransition();
```

<VisualDiagram title="A pending Transition should keep the interface understandable">
  <DiagramGrid columns={3}>
    <DiagramNode title="Current UI" tone="green">Can remain usable.</DiagramNode>
    <DiagramNode title="Pending feedback" tone="orange">Shows that the action/navigation was accepted.</DiagramNode>
    <DiagramNode title="Next UI" tone="purple">Prepares without blocking unrelated urgent work.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Transitions and Suspense

A Transition can prevent already revealed content from being replaced by an unwanted fallback while the new UI prepares.

<VisualDiagram title="Suspense behavior during a non-urgent update">
  <DiagramGrid columns={2}>
    <DiagramNode title="Without Transition" tone="red">Old page → fallback → new page.</DiagramNode>
    <DiagramNode title="With Transition" tone="green">Old page + pending feedback → new page.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

New nested boundaries can still reveal their own local fallbacks after the next shell commits.

## Async Transition Actions and `await`

Modern React accepts async Actions passed to Transition starters.

```jsx
startTransition(async () => {
  await saveDraft();

  startTransition(() => {
    setStatus('saved');
  });
});
```

Current React has an important limitation: state updates after an `await` need another `startTransition` wrapper to be marked as Transition updates.

<VisualDiagram title="Transition scope across await">
  <DiagramStack align="center">
    <DiagramNode title="Outer Transition Action starts" tone="purple" />
    <DiagramArrow label="await async work" />
    <DiagramNode title="Async boundary" tone="orange">React currently loses Transition marking for later setters.</DiagramNode>
    <DiagramArrow label="wrap post-await setter again" />
    <DiagramNode title="Nested startTransition" tone="purple" />
    <DiagramArrow label="final state remains non-urgent" />
    <DiagramNode title="Commit next UI" tone="green" />
  </DiagramStack>
</VisualDiagram>

This is current API behavior and a documented limitation, not a general JavaScript rule.

## Multiple ongoing Transitions

React currently may batch multiple ongoing Transitions together. `isPending` is therefore not a request identifier or fine-grained transaction record.

If you need request-specific ordering, cancellation, retries, or mutation identity, model those in the data layer.

## Render priority is not network consistency

<VisualDiagram title="A Transition cannot solve stale response ordering">
  <DiagramStack align="center">
    <DiagramNode title="Request A starts" tone="blue" />
    <DiagramArrow label="then" />
    <DiagramNode title="Request B starts" tone="purple" />
    <DiagramArrow label="B returns first" />
    <DiagramNode title="Newer B result" tone="green" />
    <DiagramArrow label="A returns later" />
    <DiagramNode title="Older A must not overwrite B" tone="red" />
  </DiagramStack>
</VisualDiagram>

Use request IDs, cancellation, mutation ordering, or framework/data-layer primitives for consistency.

## Transition vs related tools

<VisualDiagram title="Choose the tool that matches the problem">
  <DiagramGrid columns={4}>
    <DiagramNode title="Transition" tone="purple">Prioritize React rendering for an update you initiate.</DiagramNode>
    <DiagramNode title="useDeferredValue" tone="teal">Let one consumer lag behind an already-changing value.</DiagramNode>
    <DiagramNode title="Debounce" tone="orange">Delay when work starts.</DiagramNode>
    <DiagramNode title="Web Worker" tone="blue">Move suitable computation to another thread.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A Transition has no fixed timer and does not rate-limit network requests or arbitrary computation.

## Render cost still matters

Transitions change priority, not cost. If rendering is expensive, you may still need better state placement, memoization, virtualization, smaller DOM, better algorithms, or off-main-thread computation.

## Event, Effect, and Action ownership

<DecisionTree
  question="Where should this work happen?"
  items={[
    { label: 'User intent causes the operation', value: 'Event / Action logic' },
    { label: 'UI must synchronize with external system after commit', value: 'Effect' },
    { label: 'Update is expensive but non-urgent', value: 'Transition around the relevant state update' },
    { label: 'Render contains side effects', value: 'Move them out; render must stay pure' },
  ]}
/>

## Production example: tab switch

```jsx
function Tabs() {
  const [tab, setTab] = useState('overview');
  const [isPending, startTransition] = useTransition();

  function select(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabBar tab={tab} onSelect={select} pending={isPending} />
      <Suspense fallback={<PanelSkeleton />}>
        <TabPanel tab={tab} />
      </Suspense>
    </>
  );
}
```

Design whether the tab indicator is urgent, whether old panel content remains visible, where pending feedback appears, and which nested regions may reveal independently.

## Common mistakes

- wrapping every update in a Transition;
- transitioning controlled input state;
- treating `isPending` as a network request object;
- expecting Transitions to fix very expensive rendering without profiling;
- confusing render priority with request ordering;
- performing side effects during render.

## Debugging checklist

1. Which setter is inside the Transition?
2. Is input/control state accidentally non-urgent?
3. Does expensive work come from another urgent update?
4. Does Suspense activate?
5. Is pending feedback useful?
6. Are post-`await` setters wrapped correctly?
7. Are request-ordering problems handled separately?
8. Is rendering safe to interrupt and restart?

## Exercise

Build a slow analytics tab screen. Compare synchronous tab state to Transition-based tab changes, add pending feedback and a lazy/Suspense chart, then rapidly switch tabs and explain which render work React may abandon.

## Interview questions

**Beginner:** What is the difference between an urgent and Transition update?

**Intermediate:** Why can't a Transition control a text input value?

**Senior:** How do interruption, Suspense preservation, async ordering, and pending UX interact during route navigation?

## Summary

<VisualDiagram title="Transition mental model">
  <DiagramStack align="center">
    <DiagramNode title="Mark eligible update as non-urgent" tone="purple" />
    <DiagramArrow label="React prepares it in background" />
    <DiagramNode title="Urgent work may interrupt" tone="blue" />
    <DiagramArrow label="obsolete work can be abandoned" />
    <DiagramNode title="Latest valid result commits" tone="green" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/Suspense

## Next

Next, learn how `useDeferredValue` lets a specific value lag behind urgent state.