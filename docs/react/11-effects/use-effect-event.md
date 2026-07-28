---
title: useEffectEvent
description: Learn React 19.2 Effect Events, reactive versus non-reactive Effect logic, latest committed values, restrictions, and misuse cases.
sidebar_position: 4
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

# useEffectEvent

> **React 19.2+**

`useEffectEvent` separates **reactive synchronization** from **non-reactive logic that runs as part of an Effect**.

```jsx
import {useEffect, useEffectEvent} from 'react';
```

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

`roomId` and `theme` play different roles.

<VisualDiagram title="One Effect, two different kinds of values">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="REACTIVE CONFIGURATION" title="roomId">
      Configures which external connection exists. Changing it should reconnect.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="LATEST VALUE" title="theme">
      Only affects notification presentation. Changing it should not reconnect.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Putting both values in the dependency list makes a theme change reconnect the chat unnecessarily.

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

<VisualDiagram title="Reactive restart vs latest-value read">
  <DiagramGrid columns={2}>
    <DiagramStack align="center">
      <DiagramNode tone="blue" title="roomId changes" wide />
      <DiagramArrow label="reactive dependency" />
      <DiagramNode tone="green" title="Reconnect" wide />
    </DiagramStack>
    <DiagramStack align="center">
      <DiagramNode tone="purple" title="theme changes" wide />
      <DiagramArrow label="no restart" />
      <DiagramNode tone="cyan" title="Next Effect Event call sees latest theme" wide />
    </DiagramStack>
  </DiagramGrid>
</VisualDiagram>

## Mental model

<VisualDiagram title="What is an Effect Event?">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="Logic belongs to an Effect" wide />
    <DiagramArrow label="and" />
    <DiagramNode tone="cyan" title="It needs the latest committed values" wide />
    <DiagramArrow label="but" />
    <DiagramNode tone="orange" title="Those values should not restart synchronization" wide />
  </DiagramStack>
</VisualDiagram>

It behaves somewhat like an event handler, but it is specifically for logic called from Effects.

## Basic syntax

```jsx
const onSomething = useEffectEvent(() => {
  // read latest committed props/state here
});
```

Call it from an Effect:

```jsx
useEffect(() => {
  onSomething();
}, [/* actual synchronization dependencies */]);
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

<VisualDiagram title="Timer ownership">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="intervalMs">Configures the timer, so changing it restarts the timer.</DiagramNode>
    <DiagramNode tone="purple" title="message">Does not configure the timer; each tick should read the latest message.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Classify reactive and non-reactive logic

Ask one question:

> Should changing this value restart or reconfigure the external system?

<DecisionTree
  question="How should an Effect-related value behave?"
  items={[
    { label: 'Changing it must restart/reconfigure the external process', value: 'Keep it as a normal Effect dependency' },
    { label: 'Changing it should not restart, but the latest value is needed when an external event fires', value: 'Consider reading it inside an Effect Event' },
    { label: 'The work is caused directly by a click, submit, or input', value: 'Use a normal event handler instead' },
    { label: 'The value is needed to calculate UI', value: 'Read it during render' },
  ]}
/>

Examples:

| Value | Likely role |
|---|---|
| WebSocket URL | Reactive connection configuration |
| `roomId` | Reactive connection configuration |
| Notification theme | Latest-value Effect Event logic |
| Muted preference | Often latest-value event logic |
| Latest cart count for logging | Possibly latest-value event logic |

The correct classification depends on the external system being synchronized.

## Do not use Effect Events to cheat dependencies

Bad:

```jsx
const run = useEffectEvent(() => {
  connect(roomId);
});

useEffect(() => {
  run();
}, []); // ❌ hides that the connection depends on roomId
```

`roomId` configures the connection. It belongs in normal Effect synchronization:

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

<VisualDiagram title="Effect Event misuse">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="WRONG" title="Hide a real dependency">Moves reactive configuration into an Effect Event merely to silence the linter.</DiagramNode>
    <DiagramNode tone="green" eyebrow="RIGHT" title="Separate roles honestly">Dependencies restart the process; Effect Events read non-reactive latest values.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Where Effect Events can be called

They are for Effect logic and may be called from:

- `useEffect`;
- `useLayoutEffect`;
- `useInsertionEffect`;
- another Effect Event in the same component.

Do not call them during rendering.

```jsx
const readLatest = useEffectEvent(() => value);
const current = readLatest(); // ❌ during render
```

If render needs `value`, read `value` directly.

## Do not pass Effect Events around

```jsx
<Child onConnected={onConnected} /> // ❌
```

Effect Events conceptually belong to the Effect that uses them. A child callback triggered by user interaction should be a normal event callback.

## Do not put Effect Events in dependency arrays

```jsx
useEffect(() => {
  onConnected();
}, [onConnected]); // ❌
```

Effect Event functions intentionally do not provide stable identity and are not dependencies.

## Effect Event vs `useCallback`

<VisualDiagram title="Different tools, different problems">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="useCallback">Memoizes function identity when identity itself matters.</DiagramNode>
    <DiagramNode tone="purple" title="useEffectEvent">Separates non-reactive Effect logic and reads latest committed values.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`useEffectEvent` is not a performance optimization.

## Effect Event vs a ref for latest values

Older code sometimes stores the latest value manually:

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

For genuine Effect-event logic in React 19.2+, `useEffectEvent` communicates intent more clearly and integrates with the Hooks linter. Refs remain useful for other imperative, non-render values.

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

<VisualDiagram title="Listener lifecycle and latest callback">
  <LifecycleBar
    items={[
      { label: 'enabled controls listener existence', tone: 'blue' },
      { label: 'Browser keydown event fires', tone: 'orange' },
      { label: 'Effect Event runs', tone: 'purple' },
      { label: 'Latest onShortcut callback is used', tone: 'green' },
    ]}
  />
</VisualDiagram>

## When should you use it?

Use `useEffectEvent` when all are true:

1. the logic genuinely belongs to an Effect;
2. it needs the latest committed values;
3. those values should not restart the external system;
4. the logic is called from an Effect or another Effect Event.

Do not use it for normal user-event handlers, render calculations, dependency suppression, stable callback identity, cross-component callback props, or hiding genuine synchronization dependencies.

## Debugging checklist

<VisualDiagram title="Effect Event debugging flow">
  <LifecycleBar
    items={[
      { label: 'Name the external system', tone: 'slate' },
      { label: 'Identify values that configure it', tone: 'blue' },
      { label: 'Keep those as dependencies', tone: 'green' },
      { label: 'Identify latest-only values used when events fire', tone: 'purple' },
      { label: 'Move only those reads into an Effect Event', tone: 'cyan' },
    ]}
  />
</VisualDiagram>

## Production example

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

Changing workspaces reconnects. Toggling mute does not reconnect, but later notifications use the latest mute preference.

## Exercise

Refactor a player connection so changing `trackId` reconnects, changing `volume` does not reconnect, and the `ready` event uses the latest volume.

## Interview questions

**Junior:** What problem does `useEffectEvent` solve?

**Mid-level:** Why is an Effect Event different from `useCallback`?

**Senior:** How would you decide whether a value belongs in the dependency list or should only be read from an Effect Event?

## Summary

<VisualDiagram title="Reactive Effect logic vs Effect Event logic" compact>
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Reactive Effect logic">Determines when synchronization restarts.</DiagramNode>
    <DiagramNode tone="purple" title="Effect Event logic">Runs from an Effect and sees latest committed values without becoming a restart dependency.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## References

- https://react.dev/reference/react/useEffectEvent
- https://react.dev/learn/separating-events-from-effects
- https://react.dev/learn/removing-effect-dependencies

## Next

Continue with **[useRef](../12-refs/use-ref.md)**.
