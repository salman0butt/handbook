---
title: Fiber, Render Work, and Scheduling
description: A senior React mental model for Fiber, render work, interruption, scheduling, and why internal details must not become app dependencies.
sidebar_position: 2
---

# Fiber, Render Work, and Scheduling

React's public API is declarative:

```jsx
function App({ user }) {
  return <Profile user={user} />;
}
```

But internally React needs to perform work such as:

- process updates;
- call components;
- evaluate Hooks;
- compare child identities;
- decide what changed;
- coordinate Suspense;
- prioritize urgent and non-urgent work;
- prepare host mutations;
- commit accepted work.

Modern React's reconciler is built on an internal architecture commonly called **Fiber**.

A senior engineer should understand why Fiber exists and what behaviors it enables, without depending on private implementation fields.

> **Important:** Fiber is an implementation architecture, not an application API. Exact fields, flags, lane representations, traversal details, and scheduling algorithms can change between React releases.

## Why React needs resumable work

Imagine rendering a large dashboard synchronously as one indivisible call stack:

```text
render root
→ render navigation
→ render 2,000-row table
→ render charts
→ render side panel
→ finish everything
→ respond to next input
```

If all work had to complete before React could react to higher-priority updates, expensive renders could make interactions feel blocked.

The architectural goal behind Fiber is to represent render work in units that React can coordinate more flexibly.

A useful mental model is:

```text
update arrives
   ↓
React creates/schedules render work
   ↓
work can be evaluated incrementally
   ↓
work may finish, pause, restart, or be abandoned
   ↓
accepted result reaches commit
```

This is what makes modern concurrency features understandable.

## A Fiber is best treated as an internal work record

Historically, Fiber was described as a unit of work or a virtual stack frame.

For application reasoning, think of React as maintaining internal records that connect:

- component identity;
- parent/child relationships;
- pending updates;
- state and Hook bookkeeping;
- work priority;
- information needed to commit changes.

Do **not** turn this into code that reads internal properties.

Bad:

```js
// Never build app logic around React internals.
const fiber = node.__reactFiber$something;
```

That is unsupported and version-fragile.

## Render work and commit work are different

React's architecture separates calculating what should change from applying visible changes.

```text
RENDER PHASE
- call components
- read state/props/context
- calculate JSX
- reconcile children
- may suspend
- may restart
- may be abandoned

COMMIT PHASE
- apply accepted host changes
- update refs
- run layout-related work
- make the result externally observable
```

This separation explains many React rules.

### Render must be pure

If React may render a component more than once or abandon a render attempt, render-time side effects would be unsafe.

Bad:

```jsx
function Checkout() {
  analytics.track('checkout-rendered'); // side effect during render
  return <Form />;
}
```

A render attempt that never commits could still send analytics.

Better:

- event-caused work belongs in event handlers;
- synchronization belongs in Effects;
- render calculates UI.

## Commit is the visible boundary

A completed render attempt is not the same as a committed result.

```text
render attempt A
  ↓
interrupted
  ↓
render attempt B
  ↓
committed
```

Only B becomes the accepted UI.

This is why logs placed directly inside render can be misleading during debugging:

```jsx
console.log('rendered');
```

That means:

> React evaluated this component.

It does **not** necessarily mean:

> The user saw this result.

For commit-aware timing, use Profiler data, Effects, browser performance tools, and React Performance Tracks.

## Concurrency is cooperative scheduling, not parallel JavaScript

React concurrency does not mean your component functions run simultaneously on multiple browser JavaScript threads.

The browser's main JavaScript execution model still applies.

The useful React meaning is:

```text
React can prioritize, interrupt, restart, and discard render work
```

That is different from:

```text
React automatically moves CPU-heavy JavaScript to another thread
```

If you perform a huge synchronous calculation inside one component render, React cannot magically split that calculation into a Web Worker.

```jsx
function ExpensiveReport({ data }) {
  const result = enormousSynchronousCalculation(data);
  return <Report result={result} />;
}
```

Scheduling can help coordinate React work around expensive tasks, but CPU-bound work may still require:

- better algorithms;
- less data;
- virtualization;
- caching;
- server computation;
- Web Workers;
- architectural changes.

## Updates have different UX importance

React exposes application-level ways to communicate scheduling intent.

### Urgent work

Examples:

- controlled text input value;
- pressed-state feedback;
- direct manipulation response;
- accessibility-critical immediate state.

### Transition work

Examples:

- changing a large result panel after input;
- route/view transitions;
- preparing secondary UI;
- rendering expensive derived views that may be interrupted.

```jsx
const [isPending, startTransition] = useTransition();

function selectTab(tab) {
  startTransition(() => {
    setSelectedTab(tab);
  });
}
```

The public contract is that Transition work is non-blocking and interruptible relative to more urgent updates.

## Do not depend on lanes

You may encounter React source code or articles discussing **lanes**.

Lanes are an internal priority representation used by React's reconciler.

Understanding the general idea can help when reading source:

```text
updates carry scheduling information
React groups/coordinates work by priority
```

But application code should **not** depend on:

- lane numbers;
- lane bitmasks;
- internal priority constants;
- assumptions about exact lane assignment;
- internal Scheduler package APIs.

Use public APIs such as:

- normal state updates;
- `startTransition` / `useTransition`;
- `useDeferredValue`;
- `<Activity>`;
- Suspense;
- framework scheduling primitives built on supported React APIs.

## Why state is a snapshot

Each render sees a state snapshot for that render attempt.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);
  }
}
```

The existing event handler closure still sees the snapshot from the render that created it.

Fiber's ability to manage multiple render attempts does not turn state into a mutable global variable.

The snapshot mental model becomes **more** important under concurrency.

## Why update queues exist conceptually

When multiple updates happen, React needs to process them according to update semantics and scheduling.

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

Functional updaters let React apply transformations to pending state without your code assuming immediate mutation.

You do not need internal queue structures to reason correctly.

The stable application model is:

```text
updates are requested
→ React queues/processes them
→ a render computes the next snapshot
→ commit publishes accepted state
```

## Work can be restarted

Render work may be restarted when:

- a higher-priority update arrives;
- a Suspense resource becomes available;
- render suspends and retries;
- Strict Mode intentionally re-invokes development work;
- React discards stale Transition work;
- an error changes the render path.

Therefore component render logic should be safe to execute repeatedly.

Bad:

```jsx
let nextId = 0;

function Item() {
  const id = nextId++; // global mutation during render
  return <div>{id}</div>;
}
```

The number of render attempts is not a stable semantic input.

## Work can be abandoned

Suppose a search UI starts rendering results for `rea`, then the user types `react` before that work commits.

React may decide that preparing `rea` results is no longer useful.

```text
render "rea"
   ↓
new urgent input: "react"
   ↓
abandon/restart stale non-urgent work
   ↓
render latest result
```

This is one of the practical benefits of interruptible rendering.

It also explains why side effects inside render are bugs even when they "work most of the time."

## Suspense changes work availability

A component reading a pending Suspense resource cannot currently finish that render path.

```jsx
const data = use(dataPromise);
```

Conceptually:

```text
React reaches pending resource
→ current path suspends
→ nearest Suspense boundary coordinates fallback/reveal
→ React retries when work can continue
```

This is scheduling and rendering coordination, not an exception-handling pattern you should catch with `try/catch`.

## Error Boundaries change the render path

If a child throws during rendering, React can abandon the failed path and render the nearest Error Boundary fallback.

```text
render child
→ throw error
→ unwind to nearest Error Boundary
→ render fallback path
→ commit recoverable UI
```

This is another reason render is modeled as work that can fail before commit.

## Effects belong after commit

Effects synchronize committed UI with external systems.

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

React should not establish that connection for a render attempt that never commits.

This keeps external systems aligned with accepted UI state.

## Layout Effects are commit-sensitive

`useLayoutEffect` runs around the commit/presentation boundary and can block paint.

That makes it appropriate for rare cases like DOM measurement before the user sees the next paint.

It is not a render-phase escape hatch.

## Strict Mode reveals unsafe assumptions

Development Strict Mode intentionally stresses behaviors that need to be resilient to repeated execution.

If code breaks because a component function or Effect setup executes more than once in development, the fix is usually to make the code correctly pure/symmetric—not to depend on exact production call counts.

## Fiber and memoization

Memoization can reduce work React needs to evaluate.

Fiber/scheduling determines how pending work is coordinated.

These are different axes:

```text
memoization
→ should this computation/component work be repeated?

scheduling
→ when/how urgently should pending work be processed?
```

React Compiler optimizes many memoization opportunities, while concurrency primitives communicate scheduling intent.

## Fiber and React Compiler

React Compiler can produce optimized component code, but React still needs runtime reconciliation and scheduling.

Compiler does not replace Fiber.

```text
build time
React Compiler
→ optimize recalculation / identity

runtime
React reconciler + renderer
→ process updates / schedule / reconcile / commit
```

## Reading React source responsibly

When studying internals:

1. pin the exact React commit/version;
2. distinguish `react`, `react-dom`, `react-reconciler`, and `scheduler` packages;
3. treat names as implementation details;
4. verify assumptions against public docs;
5. do not copy internal constants into app code;
6. expect Canary/main internals to differ from stable releases.

An internal source walkthrough can improve understanding, but it should not change your public API architecture unless React documents the behavior.

## Debugging with the mental model

### "Why did I see render logs twice?"

Possible causes include Strict Mode, retries, parent updates, state/context changes, or interrupted work.

Ask whether the result committed rather than counting render logs.

### "Why is input responsive but results lag behind?"

That may be intentional scheduling via Transition/deferred work.

### "Why did an Effect not run for a render log I saw?"

The render attempt may not have committed.

### "Why did stale async work update state?"

Scheduling does not automatically solve network ordering. Use cancellation, request IDs, framework data primitives, or Action-specific ordering semantics.

## Senior architecture rule

Do not optimize for an internal mechanism.

Optimize for a user-visible requirement using supported React semantics.

Bad reasoning:

> We need to manipulate lane priority.

Better reasoning:

> Typing must remain urgent while rendering this expensive results panel can be non-urgent, so this update belongs in a Transition.

## Exercise

Build a searchable 10,000-item catalog.

Implement:

1. urgent controlled input state;
2. deferred or Transition-driven result rendering;
3. Profiler measurement;
4. a deliberately expensive row transform;
5. a fix that reduces actual CPU work;
6. a write-up distinguishing reduced work from reprioritized work.

Then explain why reading private Fiber/lane fields would not be an acceptable solution.

## Interview questions

### What problem does Fiber solve conceptually?

It gives React an internal architecture for representing and coordinating render work so work can be prioritized, interrupted, resumed/retried, or abandoned before commit.

### Is concurrent rendering multithreaded rendering?

No. React can cooperatively schedule work on the JavaScript thread; it does not automatically run component functions in parallel worker threads.

### Why must render be pure?

Because React may evaluate render work multiple times or abandon it without committing.

### What is the difference between render and commit?

Render calculates a candidate next tree; commit publishes accepted changes to the renderer and runs commit-phase work.

### Should application code use lane APIs?

No. Lanes are internal implementation details. Use supported scheduling APIs.

## References

- https://react.dev/learn/render-and-commit
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://github.com/acdlite/react-fiber-architecture
