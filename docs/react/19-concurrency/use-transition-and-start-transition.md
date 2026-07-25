---
title: useTransition and startTransition Deep Dive
description: Deep mental model for non-blocking React updates, interruption, pending state, async Actions, Suspense coordination, and Transition trade-offs.
sidebar_position: 1
---

# `useTransition` and `startTransition` deep dive

Transitions let React treat some state updates as **non-urgent**.

That means React can keep the interface responsive while work for the next UI happens in the background.

```jsx
const [isPending, startTransition] = useTransition();

function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);
  });
}
```

The central mental model is:

```text
urgent update      → user expects immediate visible response
Transition update  → React may render it in the background and interrupt/restart it
```

Transitions do not create threads, workers, or parallel JavaScript execution. They change how React prioritizes and schedules rendering work.

## `useTransition`

```jsx
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
```

You get:

- `isPending` — whether Transition work associated with this Hook is pending;
- `startTransition` — a function that marks eligible state updates as Transition updates.

## `startTransition`

React also exports standalone `startTransition`:

```jsx
import { startTransition } from 'react';

startTransition(() => {
  setRoute(nextRoute);
});
```

Use standalone `startTransition` when you cannot call a Hook or do not need local pending state.

For example, a router or data library may need to mark an update as non-urgent outside a component.

## The callback runs immediately

A common misconception is that React delays calling the callback.

It does not.

```jsx
startTransition(() => {
  console.log('runs now');
  setPage('/reports');
});
```

The callback executes immediately. React marks eligible state updates scheduled synchronously while that callback runs as Transition updates.

## Rendering may happen in the background

The state update is recorded, but React can work on the resulting render with lower urgency.

If a more urgent update arrives, React may interrupt the Transition render.

```text
start expensive Transition render
→ user types
→ urgent input render takes priority
→ React resumes or restarts Transition work with latest state
```

This is why render functions must stay pure.

React may call them without committing the result.

## Transitions are interruptible

Suppose a chart is rendering from a new filter selection.

```jsx
startTransition(() => {
  setFilter(nextFilter);
});
```

If the user changes the filter again before the first render commits, React can abandon obsolete work and render the newest request.

The user does not need to wait for every intermediate render.

## Transitions cannot control text inputs

Do not place the state update controlling a text input inside a Transition.

Bad:

```jsx
function handleChange(event) {
  startTransition(() => {
    setQuery(event.target.value);
  });
}
```

The controlled input value should update urgently.

Good:

```jsx
function handleChange(event) {
  setQuery(event.target.value);
}
```

Then defer expensive dependent UI with `useDeferredValue`, or trigger a separate Transition for downstream state.

## Pending state is feedback, not blocking

```jsx
const [isPending, startTransition] = useTransition();

return (
  <button
    aria-busy={isPending}
    onClick={() => {
      startTransition(() => {
        setTab('reports');
      });
    }}
  >
    Reports
  </button>
);
```

The point is not to disable the whole interface while pending.

One advantage of Transitions is that users can continue interacting.

## Transitions and Suspense

A Transition can prevent already revealed content from being replaced by a Suspense fallback during a non-urgent update.

That is especially useful for navigation and tab changes.

```text
without Transition:
old page → spinner → new page

with Transition:
old page + pending feedback → new page
```

New nested Suspense boundaries can still reveal their own fallback.

## Transition does not mean “wait for everything”

A Transition coordinates the update, but it is not a generic transaction that blocks until every network request in your application finishes.

Suspense-aware work and Action semantics matter.

Design pending state around the actual user operation.

## Async Transition Actions

Modern React supports async functions passed to Transition starters.

```jsx
startTransition(async () => {
  await saveDraft();
  startTransition(() => {
    setStatus('saved');
  });
});
```

Current React has an important limitation: state updates scheduled after an `await` may need another `startTransition` wrapper to be marked as Transition updates.

Treat this as current API behavior, not a conceptual requirement of asynchronous programming.

## Why the post-`await` wrapper exists

Transition context is associated with the synchronous execution around an Action.

After control leaves through `await`, React currently cannot always infer that later updates belong to the same Transition.

So this:

```jsx
startTransition(async () => {
  await submit();
  setStatus('done');
});
```

may require:

```jsx
startTransition(async () => {
  await submit();

  startTransition(() => {
    setStatus('done');
  });
});
```

Always verify current React documentation before relying on this detail because it is a known limitation intended to improve over time.

## Multiple ongoing Transitions

Current React may batch multiple ongoing Transitions together.

This means `isPending` is not a fine-grained transaction identifier for every request in a complex application.

If you need request-specific ordering, cancellation, or mutation identity, model that explicitly in your data layer.

## Request ordering is a separate concern

Transitions can make rendering interruptible, but they do not automatically solve stale network responses.

Imagine:

```text
request A starts
request B starts later
B returns first
A returns last
```

If your code blindly commits both responses, A can overwrite newer B data.

Solutions may include:

- request IDs;
- AbortController;
- framework/data-library mutation ordering;
- Action-based abstractions that preserve operation semantics.

Do not confuse render priority with network consistency.

## `useTransition` vs standalone `startTransition`

Use `useTransition` when the component needs pending state:

```jsx
const [isPending, startTransition] = useTransition();
```

Use standalone `startTransition` when:

- you are outside React component Hook scope;
- pending state is managed elsewhere;
- a library needs to mark updates as non-urgent.

## Transition vs debounce

They solve different problems.

Debounce:

```text
wait before starting work
```

Transition:

```text
start React work now, but schedule rendering as non-urgent
```

A Transition has no fixed timer.

React may begin rendering immediately, then interrupt if urgent work appears.

## Transition vs throttle

Throttle limits how often a function runs.

Transitions do not rate-limit events or requests.

They prioritize rendering.

## Transition vs Web Worker

A Web Worker can move JavaScript computation to another thread.

A Transition does not.

If your render performs huge synchronous calculations, marking an update as a Transition may improve responsiveness through interruptible React rendering, but it does not magically move arbitrary CPU work off the main thread.

## Transition vs `useDeferredValue`

Use a Transition when you control the state update:

```jsx
startTransition(() => setPage(nextPage));
```

Use `useDeferredValue` when you receive a value and want a dependent subtree to lag behind:

```jsx
const deferredQuery = useDeferredValue(query);
```

Typical mental model:

```text
Transition      → defer an update you initiate
Deferred value  → defer consumption of a value you already have
```

## Transition and memoization

A Transition changes priority, not render cost.

If a subtree is expensive because it recomputes unnecessary work on every render, you may still need architectural fixes, memoization, virtualization, or data-shape improvements.

Do not use Transitions to hide inefficient rendering without understanding the cause.

## Render purity becomes more important

Because Transition rendering can be interrupted and restarted, rendering must remain free of externally visible side effects.

Bad:

```jsx
function Report({ id }) {
  analytics.log('rendered report', id);
  return <div>{id}</div>;
}
```

Render may happen more than once without commit.

External synchronization belongs in Effects or event/Action logic depending on why it occurs.

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

Design questions:

- should the selected tab indicator update urgently or with the content?
- should old content stay visible?
- where should pending feedback appear?
- should a new nested panel show its own fallback?

Transitions are a UX tool as much as a scheduler API.

## Common mistake: wrapping everything

If every state update is a Transition, you erase the distinction between urgent and non-urgent work.

Ask whether the user expects immediate visual confirmation.

Urgent examples:

- typing;
- checkbox state;
- pressed state;
- direct drag position;
- focus-related UI.

Good Transition candidates:

- route navigation;
- tab content changes;
- expensive filtering after urgent input state;
- switching large analytical views.

## Common mistake: expecting `isPending` to identify a network request

`isPending` tells you Transition work is pending. It is not a request object with IDs, retries, cancellation, and response ordering.

## Common mistake: assuming slow rendering is acceptable forever

Transitions improve responsiveness but do not remove the need to profile.

If an expensive subtree takes seconds to render, fix the rendering architecture too.

## Debugging Transition behavior

Ask:

1. Which setter is inside the Transition?
2. Is the input itself accidentally controlled by Transition state?
3. Is the expensive work actually caused by another urgent state update?
4. Does Suspense activate during the update?
5. Is `isPending` shown in useful UI?
6. Are post-`await` state updates correctly marked?
7. Are stale network responses being handled separately?
8. Is rendering pure enough to be restarted safely?

## Exercise

Build a tabbed analytics screen with a deliberately slow chart.

1. Implement normal synchronous tab state.
2. Observe delayed interactions.
3. Wrap tab changes in `useTransition`.
4. Add a pending indicator.
5. Add Suspense around a lazy chart.
6. While one tab is rendering, immediately choose another tab.
7. Explain which work React may abandon and restart.

## Interview questions

**Beginner:** What is the difference between an urgent update and a Transition update?

**Intermediate:** Why can't a Transition control a text input value?

**Senior:** How do rendering interruption, Suspense fallback preservation, async request ordering, and pending UX interact during a route navigation?

## Summary

```text
Transitions mark state updates as non-urgent.
They do not create threads or timers.
Transition rendering can be interrupted and restarted.
Text input control stays urgent.
useTransition provides pending state; startTransition can work outside Hook scope.
Suspense and Transitions coordinate to avoid unwanted fallback replacement.
Network request ordering remains a separate responsibility.
```

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/Suspense

## Next

Next, learn how `useDeferredValue` lets a specific value lag behind urgent state.