---
title: useEffect and Synchronizing with External Systems
description: Learn the correct mental model for Effects, synchronization, cleanup, dependencies, Strict Mode, subscriptions, timers, and network requests.
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

# useEffect and synchronizing with external systems

`useEffect` is one of the most misunderstood React Hooks.

The most important mental model is:

<VisualDiagram title="What an Effect actually represents" subtitle="Effects are synchronization boundaries, not a generic place for code that happens after rendering.">
  <DiagramGrid columns={3}>
    <DiagramNode tone="red" eyebrow="NOT THIS" title="After-render bucket">
      An Effect is not “run arbitrary code after render”.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="NOT THIS" title="componentDidMount replacement">
      Hook code should not be designed by mechanically translating class lifecycle methods.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="MENTAL MODEL" title="External synchronization">
      Keep something outside React synchronized with the rendered component's current configuration.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Examples of external systems include:

- browser APIs;
- network connections;
- third-party widgets;
- subscriptions;
- timers;
- analytics systems;
- media APIs;
- non-React DOM libraries.

```jsx
import {useEffect} from 'react';

function ChatRoom({roomId}) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <h1>Room: {roomId}</h1>;
}
```

The component describes UI. The Effect keeps an external connection synchronized with `roomId`.

## Rendering, events, and Effects are different

A React component contains three different kinds of logic.

<VisualDiagram title="Three kinds of component logic" subtitle="Classify the cause of the work before choosing where it belongs.">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="RENDER" title="Calculate UI">
      Pure calculations from the current props, state, and Context.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="EVENT" title="Respond to an interaction">
      Runs because a specific user action such as click, submit, or input happened.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="EFFECT" title="Synchronize externally">
      Runs because the rendered component must keep an external system aligned with its current configuration.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

### Render logic

```jsx
const total = items.reduce((sum, item) => sum + item.price, 0);
```

This is a calculation. It belongs in render.

### Event logic

```jsx
function handlePurchase() {
  submitOrder(cart);
}
```

The POST happens because the user clicked Buy. That belongs in the event handler.

### Effect logic

```jsx
useEffect(() => {
  const connection = connectToRoom(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

The connection should exist whenever this rendered room exists. That is synchronization.

## Basic syntax

```jsx
useEffect(() => {
  // start synchronization

  return () => {
    // stop synchronization
  };
}, [dependencies]);
```

The dependency list is not a scheduling wish list. It describes the reactive values your synchronization process uses.

## Effect lifecycle

Think in terms of **start** and **stop**, not mount/update/unmount.

<VisualDiagram title="Effect lifecycle as a synchronization process" subtitle="When reactive configuration changes, React stops the old process before starting the new one.">
  <LifecycleBar
    items={[
      { label: 'roomId = general', tone: 'blue' },
      { label: 'start general', tone: 'green' },
      { label: 'roomId → travel', tone: 'orange' },
      { label: 'stop general', tone: 'red' },
      { label: 'start travel', tone: 'green' },
      { label: 'component disappears', tone: 'slate' },
      { label: 'stop travel', tone: 'red' },
    ]}
  />
</VisualDiagram>

This model scales better than trying to translate class lifecycle methods into Hook code.

## Cleanup

Cleanup should undo whatever the Effect set up.

Subscription:

```jsx
useEffect(() => {
  function handleOnline() {
    setOnline(true);
  }

  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}, []);
```

Timer:

```jsx
useEffect(() => {
  const id = setInterval(refresh, 30_000);

  return () => {
    clearInterval(id);
  };
}, [refresh]);
```

Connection:

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  return () => connection.disconnect();
}, [serverUrl, roomId]);
```

A good question is:

> If this Effect ran, what must happen before it runs again or disappears?

## Dependency arrays

### No dependency array

```jsx
useEffect(() => {
  synchronize();
});
```

React considers re-synchronization after every commit.

### Empty dependency array

```jsx
useEffect(() => {
  connectOnceForThisMountedInstance();
  return disconnect;
}, []);
```

This says the Effect does not read changing reactive values from the component.

It should **not** be used to imitate a class lifecycle method by habit.

### Reactive dependencies

```jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

When `roomId` changes according to `Object.is`, React re-synchronizes.

## You do not choose dependencies independently from the code

Bad reasoning:

```jsx
useEffect(() => {
  connect(roomId);
}, []); // ❌ "I only want it once"
```

The Effect reads `roomId`. If the component can render with different rooms, the synchronization must follow the current room.

Better:

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

If you disagree with the linter, first ask whether the Effect is designed correctly.

## Strict Mode and duplicate setup in development

In development Strict Mode, React deliberately performs an extra setup → cleanup → setup cycle to expose Effects that are missing cleanup.

<VisualDiagram title="Strict Mode stress-tests Effect symmetry" compact>
  <LifecycleBar
    items={[
      { label: 'setup', tone: 'green' },
      { label: 'cleanup', tone: 'red' },
      { label: 'setup again', tone: 'green' },
    ]}
  />
</VisualDiagram>

The goal is not to make an Effect "run once despite Strict Mode".

The goal is to make this sequence safe.

Bad workaround:

```jsx
const didRun = useRef(false);

useEffect(() => {
  if (didRun.current) return;
  didRun.current = true;

  connection.connect();
}, []);
```

This may hide the development signal while still failing to disconnect when the component actually leaves the screen.

Correct approach:

```jsx
useEffect(() => {
  const connection = createConnection();
  connection.connect();

  return () => connection.disconnect();
}, []);
```

## Fetching in an Effect

A client-only app may sometimes fetch inside an Effect:

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(`/api/products?q=${query}`, {
      signal: controller.signal,
    });

    const data = await response.json();
    setProducts(data);
  }

  load().catch(error => {
    if (error.name !== 'AbortError') {
      setError(error);
    }
  });

  return () => controller.abort();
}, [query]);
```

But raw Effect-based data fetching creates architectural concerns:

- caching;
- deduplication;
- waterfalls;
- race conditions;
- loading/error coordination;
- preloading;
- server rendering.

Later chapters will compare raw Effects with framework data APIs and server-state libraries.

## Race conditions

Consider two requests:

<VisualDiagram title="How an async race can produce stale UI" subtitle="Completion order does not have to match start order.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="REQUEST A" title="react starts first">
      Starts earlier, but the network response is slower.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="REQUEST B" title="redux starts second">
      Starts later and finishes first, so its result is the newer intended UI.
    </DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="responses arrive out of order" />
  <DiagramNode tone="red" title="A finishes after B" wide>
    Without cancellation or stale-result protection, the older React request can overwrite the newer Redux result.
  </DiagramNode>
</VisualDiagram>

Without protection, stale request A might overwrite the newer Redux result.

Cancellation with `AbortController`, framework loaders, or a data library can prevent this class of bug.

## Common infinite loop

```jsx
useEffect(() => {
  setFiltered(products.filter(matchesQuery));
}, [products, filtered]); // ❌
```

The Effect updates `filtered`, which is also a dependency, creating another synchronization cycle.

More importantly, `filtered` is derived data and likely does not need an Effect at all:

```jsx
const filtered = products.filter(matchesQuery);
```

## Object and function dependencies

This creates a new object every render:

```jsx
const options = {roomId, serverUrl};

useEffect(() => {
  connect(options);
}, [options]);
```

Because the object identity changes, the Effect may reconnect unnecessarily.

Often the cleanest solution is to construct the object inside the Effect:

```jsx
useEffect(() => {
  const options = {roomId, serverUrl};
  const connection = connect(options);

  return () => connection.disconnect();
}, [roomId, serverUrl]);
```

Do not add `useMemo` automatically. First simplify the synchronization boundary.

## Effects should represent separate synchronization processes

Bad:

```jsx
useEffect(() => {
  connectToRoom(roomId);
  logVisit(userId);
  subscribeToNotifications();
}, [roomId, userId]);
```

These processes have different reasons to re-synchronize.

Prefer separate Effects when they synchronize independent systems:

```jsx
useEffect(() => {
  const connection = connectToRoom(roomId);
  return () => connection.disconnect();
}, [roomId]);

useEffect(() => {
  logVisit(userId);
}, [userId]);
```

## Debugging an Effect

Use this sequence:

<VisualDiagram title="Effect debugging flow" subtitle="If you cannot name the external system, question whether an Effect is needed at all.">
  <LifecycleBar
    items={[
      { label: 'Name the external system', tone: 'blue' },
      { label: 'Identify setup', tone: 'green' },
      { label: 'Identify cleanup', tone: 'red' },
      { label: 'List reactive configuration', tone: 'purple' },
      { label: 'Check setup/cleanup symmetry', tone: 'orange' },
      { label: 'Could this be render or event logic?', tone: 'cyan' },
    ]}
  />
</VisualDiagram>

If you cannot name the external system, the Effect deserves extra scrutiny.

## When should I use an Effect?

Use one when rendering the component requires synchronization with something React does not control.

Examples:

- WebSocket connection;
- browser event listener;
- media playback API;
- map/chart widget;
- timer;
- third-party DOM library;
- certain client-side network synchronization cases.

## When should I NOT use an Effect?

Usually not for:

- deriving values from props/state;
- sorting/filtering for render;
- responding to a click;
- resetting one state variable because another changed;
- notifying a parent about state that the parent could own directly;
- chaining internal state transitions.

Those cases are covered in **You Might Not Need an Effect**.

<DecisionTree
  question="Does this logic belong in an Effect?"
  items={[
    { label: 'Purely calculates UI from current React data', value: 'Keep it in render.' },
    { label: 'Runs because a specific user interaction happened', value: 'Use the event handler.' },
    { label: 'Keeps a browser API, subscription, connection, timer, or third-party system synchronized', value: 'An Effect is appropriate.' },
  ]}
/>

## Exercise

Create a `ChatRoom` component with:

- `roomId` prop;
- simulated `connect()` and `disconnect()` methods;
- correct cleanup;
- a room selector in the parent.

Log every connect/disconnect and explain why switching rooms produces:

<VisualDiagram title="Switching rooms restarts the synchronization" compact>
  <LifecycleBar
    items={[
      { label: 'disconnect old room', tone: 'red' },
      { label: 'connect new room', tone: 'green' },
    ]}
  />
</VisualDiagram>

Then test under Strict Mode.

## Interview questions

**Junior:** What problem does `useEffect` solve?

**Mid-level:** Why are Effect dependencies determined by reactive values rather than by how often you want the Effect to run?

**Senior:** How would you decide whether a data-fetching Effect should remain local code or move to framework/server-state infrastructure?

## Summary

Remember:

<VisualDiagram title="Effect mental model summary">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Render">Calculates UI from current React inputs.</DiagramNode>
    <DiagramNode tone="orange" title="Events">Respond to specific interactions.</DiagramNode>
    <DiagramNode tone="purple" title="Effects">Synchronize with external systems.</DiagramNode>
    <DiagramNode tone="red" title="Cleanup">Stops or reverses the previous synchronization.</DiagramNode>
    <DiagramNode tone="green" title="Dependencies">Describe the reactive configuration the process reads.</DiagramNode>
    <DiagramNode tone="cyan" title="Design test">If there is no external system, reconsider the Effect.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## References

- https://react.dev/learn/synchronizing-with-effects
- https://react.dev/learn/lifecycle-of-reactive-effects
- https://react.dev/reference/react/useEffect

## Next

Continue with **[You Might Not Need an Effect](./you-might-not-need-an-effect.md)**.
