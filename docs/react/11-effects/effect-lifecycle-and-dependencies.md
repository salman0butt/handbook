---
title: Effect Lifecycle and Dependencies
description: Understand reactive values, start/stop synchronization, dependency reasoning, stale closures, object and function dependencies, and lint-guided Effect design.
sidebar_position: 3
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

# Effect lifecycle and dependencies

Effects do not have a component-style lifecycle. An Effect describes a **restartable synchronization process**.

<VisualDiagram title="Effect synchronization lifecycle" subtitle="When reactive configuration changes, React stops the old process before starting the new one.">
  <LifecycleBar
    items={[
      { label: 'Start synchronization', tone: 'green' },
      { label: 'Reactive configuration changes', tone: 'orange' },
      { label: 'Stop old synchronization', tone: 'red' },
      { label: 'Start new synchronization', tone: 'green' },
      { label: 'Component disappears', tone: 'slate' },
      { label: 'Stop synchronization', tone: 'red' },
    ]}
  />
</VisualDiagram>

Dependencies exist so React can keep an external process aligned with the current render's configuration.

## Reactive values

Values declared inside a component can differ between renders:

```jsx
function ChatRoom({roomId}) {
  const [serverUrl, setServerUrl] = useState('https://example.com');
  const options = {roomId, serverUrl};
}
```

`roomId`, `serverUrl`, and `options` are reactive. If an Effect reads a reactive value, that value normally belongs in the dependency list.

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  return () => connection.disconnect();
}, [serverUrl, roomId]);
```

## Dependencies describe synchronization configuration

<VisualDiagram title="Dependencies configure the external process">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="Effect synchronization" wide>Chat connection</DiagramNode>
    <DiagramArrow label="configured by" />
    <DiagramGrid columns={2}>
      <DiagramNode tone="blue" title="serverUrl">Which server should be used?</DiagramNode>
      <DiagramNode tone="cyan" title="roomId">Which room should be joined?</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

If either value changes, the old connection no longer matches the current React state.

## React compares dependencies with `Object.is`

<VisualDiagram title="Dependency comparison between renders">
  <DiagramGrid columns={2}>
    <DiagramNode tone="slate" eyebrow="PREVIOUS RENDER" title="Dependencies">https://a.com · general</DiagramNode>
    <DiagramNode tone="blue" eyebrow="NEXT RENDER" title="Dependencies">https://a.com · travel</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="Object.is comparison finds roomId changed" />
  <DiagramNode tone="orange" title="Re-synchronize" wide>Clean up the general-room process, then start the travel-room process.</DiagramNode>
</VisualDiagram>

Primitive values are often straightforward. Objects and functions require more care because their identity can change even when their contents appear equivalent.

## Stale closures

Every render creates functions that close over that render's values.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
    }, 1000);

    return () => clearInterval(id);
  }, []); // ❌ count is reactive but omitted
}
```

<VisualDiagram title="Why the interval sees a stale value">
  <LifecycleBar
    items={[
      { label: 'Initial render: count = 0', tone: 'blue' },
      { label: 'Effect creates interval closure', tone: 'purple' },
      { label: 'Empty dependency array keeps that process', tone: 'slate' },
      { label: 'Later renders have new count values', tone: 'orange' },
      { label: 'Old interval still closes over count = 0', tone: 'red' },
    ]}
  />
</VisualDiagram>

React did not fail to update the closure. The code asked React to keep using the synchronization process created by the first render.

## Do not suppress the dependency linter casually

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  connection.connect(roomId);
}, []);
```

Suppressing the rule removes a correctness check. Redesign the Effect first.

<DecisionTree
  question="A dependency feels inconvenient. What should you inspect?"
  items={[
    { label: 'The Effect only derives render data', value: 'Remove the Effect and calculate during render' },
    { label: 'The work is caused by a user action', value: 'Move it into the event handler' },
    { label: 'A value is truly constant', value: 'Move it outside the component' },
    { label: 'An object/function only supports the Effect', value: 'Create it inside the Effect' },
    { label: 'Latest data is needed but should not restart synchronization', value: 'Consider an Effect Event' },
    { label: 'The value configures the external process', value: 'Keep it as a dependency' },
  ]}
/>

## Move constants outside the component

```jsx
const serverUrl = 'https://chat.example.com';

function ChatRoom({roomId}) {
  useEffect(() => {
    const connection = connect(serverUrl, roomId);
    return () => connection.disconnect();
  }, [roomId]);
}
```

Moving a genuinely constant value outside proves it is not reactive.

## Create objects inside the Effect

Problem:

```jsx
function ChatRoom({roomId}) {
  const options = {
    serverUrl: 'https://chat.example.com',
    roomId,
  };

  useEffect(() => {
    const connection = createConnection(options);
    return () => connection.disconnect();
  }, [options]);
}
```

`options` is a new object each render. Prefer expressing the real reactive configuration:

```jsx
function ChatRoom({roomId}) {
  useEffect(() => {
    const options = {
      serverUrl: 'https://chat.example.com',
      roomId,
    };

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

## Functions can cause the same problem

```jsx
function Search({query}) {
  function createRequest() {
    return {query, limit: 20};
  }

  useEffect(() => {
    fetchResults(createRequest());
  }, [createRequest]);
}
```

`createRequest` is recreated each render. Often the clearest fix is to move the supporting logic into the Effect:

```jsx
useEffect(() => {
  const request = {query, limit: 20};
  fetchResults(request);
}, [query]);
```

Simplify before reaching for `useCallback`.

## Separate reactive and non-reactive Effect logic

Suppose `roomId` configures a connection, while `theme` only affects a notification.

```jsx
useEffect(() => {
  const connection = createConnection(roomId);

  connection.on('connected', () => {
    showNotification('Connected!', theme);
  });

  connection.connect();
  return () => connection.disconnect();
}, [roomId, theme]);
```

Changing the theme now reconnects the room even though theme does not configure the connection.

<VisualDiagram title="Classify values by their role">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="REACTIVE" title="roomId">Changing it must restart or reconfigure the connection.</DiagramNode>
    <DiagramNode tone="purple" eyebrow="LATEST VALUE ONLY" title="theme">The notification should use the latest theme without reconnecting.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React 19.2's `useEffectEvent` provides a clearer model for the second category.

## Each Effect should model one synchronization process

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);

useEffect(() => {
  const subscription = subscribeToPresence(userId);
  return () => subscription.unsubscribe();
}, [userId]);
```

<VisualDiagram title="Independent processes deserve independent Effects">
  <DiagramGrid columns={2}>
    <DiagramNode tone="cyan" title="Room connection">Starts/stops when roomId changes.</DiagramNode>
    <DiagramNode tone="green" title="Presence subscription">Starts/stops when userId changes.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Avoid coupling unrelated synchronization merely because it occurs in one component.

## Dependency changes and cleanup order

```jsx
useEffect(() => {
  connect(roomId);
  return () => disconnect(roomId);
}, [roomId]);
```

If `roomId` changes from `general` to `travel`:

<VisualDiagram title="Cleanup uses the render that created it">
  <LifecycleBar
    items={[
      { label: 'Render with travel', tone: 'blue' },
      { label: 'Commit travel UI', tone: 'cyan' },
      { label: 'Clean up general synchronization', tone: 'red' },
      { label: 'Start travel synchronization', tone: 'green' },
    ]}
  />
</VisualDiagram>

The cleanup closes over values from the render that created it. That is useful: the `general` cleanup knows which process it must stop.

## Empty dependency arrays

```jsx
useEffect(() => {
  const observer = observeWindowSize();
  return () => observer.disconnect();
}, []);
```

An empty array is correct when the Effect does not read reactive component values. It does not mean “ignore changing values because I want this to run once.”

## No dependency array

```jsx
useEffect(() => {
  synchronizeSomething();
});
```

This says synchronization may need to occur after every render. It is relatively uncommon in well-structured production Effects because most external processes have explicit configuration.

## State updater functions can remove unnecessary reads

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(current => current + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

The updater describes a transition from the previous state instead of reading the current render's `count`.

## Debugging dependency loops

<VisualDiagram title="Common Effect loop">
  <LifecycleBar
    items={[
      { label: 'Effect runs', tone: 'purple' },
      { label: 'Effect changes state', tone: 'orange' },
      { label: 'React renders', tone: 'blue' },
      { label: 'Dependency identity changes', tone: 'red' },
      { label: 'Effect runs again', tone: 'purple' },
    ]}
  />
</VisualDiagram>

Ask whether the state update is necessary, whether the value is derived data, whether an object/function is recreated each render, and whether the Effect synchronizes an external system at all.

## Production example: subscription architecture

```jsx
function StockTicker({symbol}) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const subscription = market.subscribe(symbol, nextPrice => {
      setPrice(nextPrice);
    });

    return () => subscription.unsubscribe();
  }, [symbol]);

  return <output>{price ?? 'Loading…'}</output>;
}
```

<VisualDiagram title="External subscription → React UI">
  <LifecycleBar
    items={[
      { label: 'symbol configures subscription', tone: 'blue' },
      { label: 'Market emits price events', tone: 'orange' },
      { label: 'Subscription updates React state', tone: 'purple' },
      { label: 'React renders current price', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Exercise

Refactor a notification subscription so it reconnects only when `userId` changes but still uses the latest `theme` for toasts. Do not disable the linter.

## Interview questions

**Junior:** What is a reactive value?

**Mid-level:** Why can object/function dependencies cause repeated Effects?

**Senior:** How do you distinguish a genuine dependency from non-reactive Effect logic without suppressing `exhaustive-deps`?

## Summary

<VisualDiagram title="Dependency reasoning in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Dependencies">Describe reactive synchronization configuration.</DiagramNode>
    <DiagramNode tone="red" title="Cleanup">Stops the process created by the previous render.</DiagramNode>
    <DiagramNode tone="green" title="Restart">Creates a process matching the latest committed configuration.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

If a dependency feels wrong, redesign the Effect before overriding the linter.

## References

- https://react.dev/learn/lifecycle-of-reactive-effects
- https://react.dev/learn/removing-effect-dependencies
- https://react.dev/reference/react/useEffect

## Next

Continue with **[useEffectEvent](./use-effect-event.md)**.
