---
title: Concurrent Rendering Mental Model
description: Understand React concurrency as interruptible prioritized rendering, with render purity, commit semantics, scheduling, Transitions, deferred values, and Suspense.
sidebar_position: 3
---

# Concurrent rendering mental model

“Concurrent React” is easy to misunderstand.

It does **not** mean React runs your component code on several JavaScript threads at once.

The practical mental model is:

> **React can prepare some renders with lower priority, interrupt them, abandon obsolete work, and later commit only the result that matters.**

This changes how you reason about rendering, but it does not change JavaScript into a multithreaded runtime.

## Render and commit are separate phases

React rendering computes what the UI should look like.

Commit applies the chosen result to the host environment, such as the DOM.

```text
state update
→ render work
→ maybe interrupt/restart
→ choose completed result
→ commit DOM changes
→ run committed layout/passive Effects at their appropriate times
```

The critical insight is that **not every render attempt commits**.

## Rendering must be pure

If React can restart rendering, render functions must not perform externally visible side effects.

Bad:

```jsx
function Invoice({ invoice }) {
  localStorage.setItem('lastInvoice', invoice.id);
  return <h1>{invoice.number}</h1>;
}
```

React might call the component while preparing work that never commits.

The external write would still happen.

Render should calculate UI:

```jsx
function Invoice({ invoice }) {
  return <h1>{invoice.number}</h1>;
}
```

Then synchronize external systems for the correct reason using events, Actions, or Effects.

## Priority is about user experience

Not every update has equal urgency.

Examples of urgent work:

- typing into a controlled input;
- pressing a control;
- dragging;
- focus/selection feedback.

Examples that can often be non-urgent:

- switching large tab contents;
- route navigation;
- rendering a filtered analytics table after the input itself updates;
- preparing a heavy visualization.

Transitions and deferred values let you express these relationships.

## Interruption

Imagine React is preparing an expensive chart update as Transition work.

```text
render chart for filter A
```

Before it finishes, the user types.

The typing update is urgent.

React can prioritize the input update:

```text
pause/abandon lower-priority chart render
→ render urgent input state
→ commit responsive input
→ continue/restart chart work for latest state
```

This is why concurrency improves responsiveness without requiring every render to finish first.

## Obsolete work can be abandoned

Suppose the user selects filters quickly:

```text
A → B → C
```

If B's render has not committed and C becomes the desired state, React does not need to commit B just because it started working on it.

The goal is not to preserve every intermediate frame.

The goal is to keep the UI responsive and eventually commit the latest valid result.

## Concurrency is not asynchronous state

State remains snapshot-based.

Inside one render, you see that render's state snapshot.

Concurrency does not make variables magically mutate underneath a running component function.

```text
render A sees snapshot A
render B sees snapshot B
```

React may work on those renders at different times, but each render remains conceptually isolated.

## Concurrency is not parallel execution

A Transition does not do this:

```text
thread 1: input
thread 2: chart
```

It is still ordinary JavaScript scheduling on the main thread unless you separately use platform primitives such as Web Workers.

React's scheduler can yield between units of rendering work and prioritize newer work.

## `useTransition` expresses update priority

```jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setPage(nextPage);
});
```

You are telling React:

> This update may be prepared without blocking more urgent interactions.

## `useDeferredValue` expresses consumption priority

```jsx
const deferredQuery = useDeferredValue(query);
```

You are telling React:

> The latest query is urgent, but this consumer may temporarily use the previous value.

## Suspense coordinates readiness

Concurrency determines which rendering work React can prioritize or restart.

Suspense determines what happens when a subtree is not ready to reveal.

They work together.

```text
Transition/deferred work
→ render new tree in background
→ subtree suspends
→ React can keep useful previous content visible
→ retry when resource becomes ready
→ commit new tree
```

## `lazy` introduces code readiness

A lazy component may suspend because its module code has not loaded yet.

This creates another reason a background render may not be ready to commit.

Concurrency + Suspense lets React coordinate that delay without requiring a destructive whole-page loading state.

## Effects belong to committed UI

A background render that never commits should not cause committed Effects to run.

This is one reason React separates rendering from effects.

For deferred background renders, Effects run only after the corresponding render is committed.

This prevents synchronization based on UI the user never received.

## Layout Effects and hidden content

If Suspense hides already visible content, React cleans up layout Effects for the hidden subtree and re-runs them when the content becomes visible again.

That keeps DOM measurement tied to visible committed layout.

## Concurrency and Strict Mode

Strict Mode development behaviors already train you to avoid assumptions such as:

```text
render happens exactly once
Effect setup happens exactly once
```

Concurrent rendering reinforces the broader principle:

> Code must remain correct even when React renders, discards, retries, or replays work before commit.

Do not use Strict Mode double execution as a literal model of production scheduling, but understand the design lesson it exposes.

## Scheduling is an implementation capability, not app state

Do not store your own flags such as:

```js
const [isConcurrent, setIsConcurrent] = useState(false);
```

Concurrency is not a mode your application manually toggles per component.

You express priorities using React APIs, and React schedules accordingly.

## Avoid depending on exact scheduling timings

Do not write logic that expects:

```text
Transition render will always begin after exactly X ms
```

or:

```text
deferred value will always lag by 300ms
```

These APIs are priority mechanisms, not timing contracts.

React may complete low-priority work quickly on a fast device.

## Responsive rendering does not replace profiling

Concurrency can let urgent interactions cut ahead of expensive renders, but expensive work still consumes CPU.

If a list renders 50,000 DOM nodes, consider:

- virtualization;
- pagination;
- better data structures;
- component boundaries;
- memoization where justified;
- React Compiler where applicable;
- moving non-render CPU work off the main thread.

Concurrency improves scheduling. It does not remove computational cost.

## Concurrent rendering and data consistency

React scheduling does not solve application-level consistency problems automatically.

Examples still requiring explicit handling:

- stale network response ordering;
- optimistic mutation conflicts;
- cache invalidation;
- transaction semantics;
- authorization changes;
- stale external-store snapshots.

React decides when rendering work is urgent. Your data architecture decides what data is valid.

## A complete search mental model

Consider a search page:

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
```

Flow:

```text
1. user types
2. query updates urgently
3. input commits immediately
4. old deferredQuery can remain
5. React prepares results for latest query in background
6. newer typing can interrupt that render
7. Suspense can preserve stale results if data is not ready
8. latest completed result commits
```

That is concurrent rendering in a practical application.

## A complete navigation mental model

```jsx
startTransition(() => {
  setRoute(nextRoute);
});
```

Flow:

```text
1. navigation event occurs
2. route update is marked non-urgent
3. React prepares next route
4. lazy code or data may suspend
5. current revealed route can remain visible
6. pending navigation feedback remains interactive
7. user can choose another route
8. obsolete render may be abandoned
9. latest ready route commits
```

## Common mistake: side effects during render

Concurrency makes this bug easier to expose.

Bad examples during render:

- analytics events;
- API mutation requests;
- DOM mutation outside refs/effects;
- writing storage;
- mutating shared module state;
- registering subscriptions.

Render is calculation.

## Common mistake: interpreting every extra render as a bug

A render that does not commit can be expected behavior.

Optimize based on measured user impact, not render-count anxiety alone.

Ask:

- did this render perform expensive unnecessary work?
- did it cause an external side effect incorrectly?
- did it block an urgent interaction?

## Common mistake: using concurrency to cover broken architecture

If every state change re-renders the whole application because state ownership is poor, a Transition is not the fundamental fix.

First improve:

- state scope;
- context boundaries;
- store selectors;
- component composition;
- data normalization;
- memoization or Compiler optimization where useful.

Then use priority APIs for real urgency differences.

## Common mistake: assuming old UI is always safe

Preserving old content during background work is only correct when stale UI is acceptable.

Do not preserve stale values for decisions where correctness requires immediate freshness.

## Debugging concurrency

When UI feels unresponsive or surprising, inspect:

1. Which state update is urgent?
2. Which state update is marked as a Transition?
3. Which value is deferred?
4. Which subtree is expensive?
5. Does that subtree suspend?
6. Which boundary handles suspension?
7. Can work be interrupted safely?
8. Are there render side effects?
9. Is stale UI acceptable?
10. Is the actual bottleneck rendering, network, JavaScript computation, or DOM volume?

## Senior design rule

React concurrency is most effective when the architecture already separates:

```text
urgent interaction state
from
expensive derived presentation
```

If all state and UI are tightly coupled, React has fewer useful boundaries where priority can help.

## Exercise

Build an analytics explorer with:

- a controlled search input;
- a large result list;
- a lazy chart;
- a tab switch wrapped in a Transition;
- a deferred search value;
- Suspense boundaries around result/chart regions.

Instrument renders with console logging in development.

Then answer:

1. Which renders commit?
2. Which work may be interrupted?
3. Which UI is allowed to stay stale?
4. Which updates must remain urgent?
5. Which expensive work should be optimized rather than merely deferred?

## Interview questions

**Beginner:** Does concurrent rendering mean React runs components on multiple threads?

**Intermediate:** Why must render functions remain pure if React can interrupt or abandon rendering work?

**Senior:** Explain how urgent state, Transition updates, deferred values, Suspense, code splitting, and commit semantics interact during a slow route navigation with continued user input.

## Summary

```text
Concurrency means prioritized, interruptible rendering—not multithreaded component execution.
Render and commit are separate.
Not every render attempt commits.
Purity makes abandoned/retried work safe.
Transitions prioritize updates.
Deferred values let consumers lag.
Suspense coordinates readiness and reveal.
Concurrency improves responsiveness but does not remove CPU or data-consistency costs.
```

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/lazy

## Next

Next, move from client concurrency into React DOM, portals, hydration, SSR, streaming, and server rendering.