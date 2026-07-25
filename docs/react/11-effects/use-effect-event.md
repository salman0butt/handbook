---
title: useEffectEvent
description: Learn React 19.2 Effect Events, reactive versus non-reactive Effect logic, latest committed values, restrictions, and misuse cases.
sidebar_position: 4
---

# useEffectEvent

> **React 19.2+**

`useEffectEvent` lets you separate **reactive synchronization** from **non-reactive logic that runs as part of an Effect**.

```jsx
import {useEffect, useEffectEvent} from 'react';
```

The core problem is easier to understand with an example.

## The reconnect problem

```jsx
function ChatRoom({roomId, theme}) {
  useEffect(() => {
    const connection = createConnection(roomId);

    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });

    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);
}
```

This Effect uses both `roomId` and `theme`.

But they play different roles:

```text
roomId
  ↓
configures the connection
  ↓
should cause re-synchronization


theme
  ↓
only affects the notification
  ↓
should use latest value
but should not reconnect
```

If `theme` changes, reconnecting the chat is unnecessary.

## Effect Event solution

```jsx
function ChatRoom({roomId, theme}) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);

    connection.on('connected', () => {
      onConnected();
    });

    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

Now:

```text
roomId changes
   ↓
reconnect


theme changes
   ↓
no reconnect
   ↓
next Effect Event call sees latest theme
```

## Mental model

An Effect Event is:

```text
logic that belongs to an Effect
        +
should see latest committed values
        +
should not itself make the Effect reactive to those values
```

It behaves more like an event handler than ordinary Effect code, but it is specifically for Effect logic.

## Basic syntax

```jsx
const onSomething = useEffectEvent(() => {
  // read latest committed props/state here
});
```

Then call it from an Effect:

```jsx
useEffect(() => {
  onSomething();
}, [/* actual reactive synchronization dependencies */]);
```

## Effect Events see latest committed values

```jsx
function Timer({intervalMs, message}) {
  const onTick = useEffectEvent(() => {
    console.log(message);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);
}
```

Changing `message` does not restart the interval.

The next tick sees the latest committed `message`.

Changing `intervalMs` **does** restart the interval because that value configures the external timer synchronization.

## Reactive versus non-reactive Effect logic

Ask:

> Should changing this value restart or reconfigure the external system?

If yes, it is reactive synchronization logic.

If no, but the latest value should be read when some external event fires, it may belong in an Effect Event.

Example:

```text
WebSocket URL          → reactive
roomId                 → reactive
notification theme     → non-reactive Effect Event logic
muted preference       → possibly non-reactive event logic
latest cart count      → possibly non-reactive event logic
```

The classification depends on what the external system is actually synchronizing with.

## Do not use Effect Events to cheat dependency arrays

Bad:

```jsx
const run = useEffectEvent(() => {
  connect(roomId);
});

useEffect(() => {
  run();
}, []); // ❌ hides that connection depends on roomId
```

`roomId` configures the connection. It belongs in normal Effect synchronization.

Correct:

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

Effect Events are not a general-purpose "ignore dependencies" mechanism.

## Where Effect Events can be called

Effect Events are for Effect logic.

They can be called from:

- `useEffect`;
- `useLayoutEffect`;
- `useInsertionEffect`;
- another Effect Event in the same component.

Do not call them during rendering.

Bad:

```jsx
const readLatest = useEffectEvent(() => value);

const current = readLatest(); // ❌ during render
```

If render needs `value`, read `value` directly.

## Do not pass Effect Events around

Bad:

```jsx
<Child onConnected={onConnected} />
```

Effect Events conceptually belong to the Effect that uses them.

Do not treat them like normal callbacks or callback props.

If a child needs a callback because of a user interaction, use a normal event callback.

## Do not put Effect Events in dependency arrays

Bad:

```jsx
useEffect(() => {
  onConnected();
}, [onConnected]); // ❌
```

Effect Event functions intentionally do not have stable identity.

They are not dependencies.

## Effect Event versus useCallback

They solve different problems.

### `useCallback`

```text
memoizes a function identity
        ↓
useful when identity itself matters
```

Examples:

- memoized child props;
- another Hook/API requiring a stable callback identity;
- specific performance scenarios.

### `useEffectEvent`

```text
separates non-reactive Effect logic
        ↓
latest committed values without re-synchronizing
```

It is not a performance optimization.

## Effect Event versus ref for latest values

Older code sometimes stores the latest value in a ref:

```jsx
const themeRef = useRef(theme);
themeRef.current = theme;

useEffect(() => {
  const connection = createConnection(roomId);

  connection.on('connected', () => {
    showNotification('Connected!', themeRef.current);
  });

  return () => connection.disconnect();
}, [roomId]);
```

This can work, but it manually creates a "latest value" channel outside React's reactive model.

For genuine Effect-event logic in React 19.2+, `useEffectEvent` communicates intent more clearly and integrates with the Hooks linter.

Refs remain useful for many other imperative/non-render values.

## Timer example

```jsx
function ClockLogger({delay, prefix}) {
  const onTick = useEffectEvent(() => {
    console.log(prefix, new Date().toISOString());
  });

  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

`delay` configures the timer.

`prefix` does not need to recreate the timer but should remain current.

## Browser listener example

```jsx
function KeyboardTracker({enabled, onShortcut}) {
  const handleShortcut = useEffectEvent(event => {
    onShortcut(event.key);
  });

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === 'k') {
        handleShortcut(event);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
```

Here `enabled` controls whether the listener exists.

The latest `onShortcut` behavior can be used without tearing down and recreating the listener solely because a callback prop changed.

## When should I use useEffectEvent?

Use it when all of these are true:

1. the logic genuinely belongs to an Effect;
2. it needs the latest committed values;
3. those values should not re-synchronize the external system;
4. the logic will be called from an Effect or Effect Event.

## When should I NOT use it?

Do not use it for:

- normal click/input handlers;
- avoiding dependency warnings;
- general stable callback identity;
- calculations during render;
- passing callbacks between components;
- hiding a real synchronization dependency.

## Debugging checklist

If an Effect Event seems necessary, ask:

```text
What external system does the Effect manage?
            ↓
Which values configure that system?
            ↓
Those stay reactive dependencies.
            ↓
Which latest values are only needed when an external event occurs?
            ↓
Those may belong in an Effect Event.
```

## Production example

A SaaS notification socket:

```jsx
function Notifications({workspaceId, muted}) {
  const onNotification = useEffectEvent(notification => {
    if (!muted) {
      showDesktopNotification(notification);
    }
  });

  useEffect(() => {
    const socket = connectToWorkspace(workspaceId);

    socket.on('notification', onNotification);
    socket.connect();

    return () => socket.disconnect();
  }, [workspaceId]);
}
```

Changing workspaces reconnects.

Toggling mute does not reconnect, but subsequent notifications use the latest mute preference.

## Exercise

Start with:

```jsx
function Player({trackId, volume}) {
  useEffect(() => {
    const player = connectPlayer(trackId);

    player.on('ready', () => {
      player.setVolume(volume);
    });

    player.connect();
    return () => player.disconnect();
  }, [trackId, volume]);
}
```

Refactor so:

- changing `trackId` reconnects;
- changing `volume` does not reconnect;
- when `ready` fires, it uses the latest volume.

## Interview questions

**Junior:** What problem does `useEffectEvent` solve?

**Mid-level:** Why is an Effect Event different from `useCallback`?

**Senior:** How would you decide whether a value belongs in the dependency list or should only be read from an Effect Event?

## Summary

```text
Reactive Effect logic
→ determines when synchronization restarts.

Effect Event logic
→ runs from the Effect and sees latest committed values
  without becoming a synchronization dependency.
```

## References

- https://react.dev/reference/react/useEffectEvent
- https://react.dev/learn/separating-events-from-effects
- https://react.dev/learn/removing-effect-dependencies

## Next

Continue with **[useRef](../12-refs/use-ref.md)**.
