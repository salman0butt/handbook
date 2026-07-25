---
title: Effect Lifecycle and Dependencies
description: Understand reactive values, start/stop synchronization, dependency reasoning, stale closures, object and function dependencies, and lint-guided Effect design.
sidebar_position: 3
---

# Effect lifecycle and dependencies

Effects do not have a component-style lifecycle.

The correct model is:

```text
start synchronization
       ↓
reactive configuration changes
       ↓
stop old synchronization
       ↓
start new synchronization
       ↓
component disappears
       ↓
stop synchronization
```

This chapter explains why dependencies exist and how to reason about them without fighting the linter.

## Reactive values

Values declared inside a component can change between renders.

Examples:

```jsx
function ChatRoom({roomId}) {
  const [serverUrl, setServerUrl] = useState('https://example.com');
  const options = {roomId, serverUrl};
}
```

`roomId`, `serverUrl`, and `options` are reactive because a later render may contain different values.

If an Effect reads a reactive value, that value normally belongs in the dependency list.

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  return () => connection.disconnect();
}, [serverUrl, roomId]);
```

## Dependencies describe synchronization configuration

Think of dependencies as the configuration of an external process.

```text
Effect
 ├── serverUrl
 └── roomId
```

If either changes, the old process is no longer synchronized with current React state.

## React compares dependencies with Object.is

Conceptually:

```text
previous dependencies
["https://a.com", "general"]

next dependencies
["https://a.com", "travel"]

room changed
   ↓
re-synchronize
```

Primitive values are often straightforward. Objects and functions require more attention because identity can change even when contents appear equivalent.

## Stale closures

Every render creates new functions that close over that render's values.

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

This Effect captures the initial `count` value and never re-synchronizes.

The bug is not that React "failed to update the closure". The code asked React to keep using the synchronization process from the first render.

## Do not suppress the dependency linter casually

Bad:

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  connection.connect(roomId);
}, []);
```

Suppressing the rule removes a correctness check.

Instead ask:

1. Is the Effect necessary?
2. Is the reactive value genuinely part of synchronization?
3. Can code move to an event handler?
4. Can a value move outside the component?
5. Can an object/function be created inside the Effect?
6. Is some logic non-reactive Effect logic that belongs in an Effect Event?

## Move constants outside the component

Before:

```jsx
function ChatRoom({roomId}) {
  const serverUrl = 'https://chat.example.com';

  useEffect(() => {
    connect(serverUrl, roomId);
  }, [serverUrl, roomId]);
}
```

If `serverUrl` is truly constant, prove that by moving it outside:

```jsx
const serverUrl = 'https://chat.example.com';

function ChatRoom({roomId}) {
  useEffect(() => {
    const connection = connect(serverUrl, roomId);
    return () => connection.disconnect();
  }, [roomId]);
}
```

Now it is not reactive.

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

`options` is a new object each render.

Better:

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

Now the dependency expresses the actual reactive configuration.

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

`createRequest` is recreated each render.

Possible simplification:

```jsx
useEffect(() => {
  const request = {query, limit: 20};
  fetchResults(request);
}, [query]);
```

Again, simplify before reaching for `useCallback`.

## Separate reactive and non-reactive Effect logic

Suppose reconnecting depends on `roomId`, but a notification should use the latest theme.

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

Now changing the theme reconnects the room, even though theme does not configure the connection.

In React 19.2, `useEffectEvent` provides a model for separating this non-reactive Effect logic. The next chapter covers it in depth.

## Each Effect should model one synchronization process

Good:

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

These processes can start and stop independently.

Avoid coupling unrelated synchronization just because they happen to exist in the same component.

## Dependency changes and cleanup order

For an Effect:

```jsx
useEffect(() => {
  connect(roomId);

  return () => disconnect(roomId);
}, [roomId]);
```

If `roomId` changes from `general` to `travel`, think:

```text
render with travel
      ↓
commit
      ↓
cleanup synchronization created by general render
      ↓
start synchronization created by travel render
```

The cleanup closes over the values from the render that created it.

That is useful, not accidental.

## Empty dependency arrays

```jsx
useEffect(() => {
  const observer = observeWindowSize();
  return () => observer.disconnect();
}, []);
```

An empty array is correct when the Effect does not read reactive component values.

It does **not** mean:

> "Ignore all changing values because I want this to run once."

## No dependency array

```jsx
useEffect(() => {
  synchronizeSomething();
});
```

This tells React that synchronization may need to occur after every render.

This is relatively uncommon in well-structured production Effects because most external synchronization has explicit reactive configuration.

## Dependencies and state updater functions

Suppose an interval increments a counter:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(id);
}, [count]);
```

This recreates the interval after every count change.

Use an updater if the logic only needs the previous state:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(current => current + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

The updater describes a state transition rather than reading the current render's `count`.

## Common mistake: object identity disguised as business logic

```jsx
const filters = {status, category};

useEffect(() => {
  analytics.track('filters_changed', filters);
}, [filters]);
```

This runs every render because `filters` is new.

If the real reactive values are `status` and `category`:

```jsx
useEffect(() => {
  analytics.track('filters_changed', {status, category});
}, [status, category]);
```

The dependency list should communicate the actual data relationship.

## Debugging dependency loops

If an Effect loops, inspect this cycle:

```text
Effect runs
   ↓
Effect changes state
   ↓
render
   ↓
dependency identity changes
   ↓
Effect runs again
```

Questions:

- Is the state update necessary?
- Is the state actually derived data?
- Is an object/function recreated every render?
- Is the Effect synchronizing an external system at all?

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

This is a strong Effect use case:

```text
symbol
  ↓
external subscription
  ↓
price events
  ↓
React state
  ↓
UI
```

## Exercise

Fix the dependency behavior in this component without disabling the linter:

```jsx
function Notifications({userId, theme}) {
  const options = {userId};

  useEffect(() => {
    const connection = subscribe(options, notification => {
      showToast(notification, theme);
    });

    return () => connection.unsubscribe();
  }, [options, theme]);
}
```

Goal:

- reconnect only when `userId` changes;
- still use the latest `theme` for toasts.

The next chapter provides the React 19.2 tool for the second requirement.

## Interview questions

**Junior:** What is a reactive value?

**Mid-level:** Why can object/function dependencies cause repeated Effects?

**Senior:** How do you distinguish a genuine dependency from non-reactive Effect logic without suppressing `exhaustive-deps`?

## Summary

```text
Dependencies are not timing controls.
They describe the reactive configuration of synchronization.

If a dependency feels wrong,
redesign the Effect before overriding the linter.
```

## References

- https://react.dev/learn/lifecycle-of-reactive-effects
- https://react.dev/learn/removing-effect-dependencies
- https://react.dev/reference/react/useEffect

## Next

Continue with **[useEffectEvent](./use-effect-event.md)**.
