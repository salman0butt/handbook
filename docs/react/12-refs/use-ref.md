---
title: useRef
description: Learn refs as persistent mutable values that do not trigger rendering, their differences from state, safe usage, timers, previous values, and common mistakes.
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

# useRef

`useRef` lets a component remember a value between renders **without causing a new render when that value changes**.

```jsx
import {useRef} from 'react';

function Example() {
  const ref = useRef(0);
}
```

The returned object is conceptually:

```js
{
  current: 0
}
```

React keeps the same ref object for the mounted component instance.

## The mental model

<VisualDiagram title="A ref is a persistent mutable pocket" subtitle="The component can render many times while React preserves the same ref object.">
  <DiagramStack align="center">
    <DiagramGrid columns={3}>
      <DiagramNode title="Render 1" tone="blue" />
      <DiagramNode title="Render 2" tone="purple" />
      <DiagramNode title="Render 3" tone="cyan" />
    </DiagramGrid>
    <DiagramArrow label="all keep" />
    <DiagramNode title="Same ref object" tone="green" wide>Only <code>ref.current</code> is mutable.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Changing `ref.current` does not ask React to render again. That makes refs useful for values React does not need to calculate JSX.

## State versus refs

<VisualDiagram title="State and refs solve different storage problems">
  <DiagramGrid columns={2}>
    <DiagramNode title="State" tone="blue" eyebrow="REACTIVE">
      Retained between renders · setter schedules rendering · snapshot per render · use for UI-relevant data
    </DiagramNode>
    <DiagramNode title="Ref" tone="orange" eyebrow="IMPERATIVE">
      Retained between renders · changing .current does not render · mutates immediately · use for non-render data
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

```jsx
const [count, setCount] = useState(0);
const timeoutRef = useRef(null);
```

If the interface must display a value, state is usually the correct owner. If the value merely supports imperative/event/synchronization logic, a ref may fit.

## A ref does not update the screen

```jsx
function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;
  }

  return (
    <button onClick={handleClick}>
      Count: {countRef.current}
    </button>
  );
}
```

The click mutates the ref, but it does not schedule a render. Use state when the rendered output depends on the value.

## Good ref use cases

Refs are useful for values such as:

- timer IDs;
- DOM nodes;
- external library instances;
- previous/reference values used outside render;
- `AbortController` instances;
- mutable caches that are not UI state;
- imperative handles.

## Timer ID example

```jsx
function DelayedMessage() {
  const timeoutRef = useRef(null);

  function schedule() {
    timeoutRef.current = setTimeout(() => {
      alert('Done');
    }, 3000);
  }

  function cancel() {
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <button onClick={schedule}>Schedule</button>
      <button onClick={cancel}>Cancel</button>
    </>
  );
}
```

The timeout ID matters to event logic, not JSX.

## Refs are mutable immediately

```jsx
const ref = useRef(0);
ref.current = 5;
console.log(ref.current); // 5
```

This differs from state: calling a state setter queues future React work while the current render keeps its existing state snapshot.

<VisualDiagram title="State update vs ref mutation" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="setState(next)" tone="blue">Queues a future render; current render keeps its snapshot.</DiagramNode>
    <DiagramNode title="ref.current = next" tone="orange">Mutates immediately; React is not notified.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Do not read or write refs during render

Bad:

```jsx
function Component() {
  const countRef = useRef(0);
  countRef.current += 1; // ❌ mutation during render

  return <p>{countRef.current}</p>;
}
```

Rendering should remain pure. React may render repeatedly, interrupt work, or replay components in development checks.

Use refs from places where imperative mutation is expected:

- event handlers;
- Effects;
- ref callbacks;
- imperative APIs.

## Exception: stable lazy initialization

A narrow deterministic pattern can be safe:

```jsx
const playerRef = useRef(null);

if (playerRef.current === null) {
  playerRef.current = new VideoPlayer();
}
```

Use this only when initialization is predictable and the result is stable for the component instance.

## Ref identity is stable

<VisualDiagram title="Stable ref identity across renders" compact>
  <LifecycleBar
    items={[
      {label: 'render 1 → ref A', tone: 'blue'},
      {label: 'render 2 → ref A', tone: 'purple'},
      {label: 'render 3 → ref A', tone: 'cyan'},
      {label: 'only .current changes', tone: 'green'},
    ]}
  />
</VisualDiagram>

## Previous values

A common pattern stores the last committed value:

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

Use this only when the previous value is genuinely required. Many “previous value” requirements indicate duplicated or awkward state modelling.

## Refs and latest callbacks

Older code may keep the latest callback in a ref:

```jsx
const callbackRef = useRef(onChange);
callbackRef.current = onChange;
```

That can still be useful for low-level integrations, but for non-reactive logic inside Effects in React 19.2+, first consider `useEffectEvent` because it communicates that intent directly.

## Ref versus module variable

A module variable is shared by every component instance:

```js
let timeoutId;
```

A ref belongs to one mounted component instance:

```jsx
function SearchBox() {
  const timeoutRef = useRef(null);
}
```

## Ref versus local variable

A local variable is recreated each render. A ref survives renders.

<VisualDiagram title="Lifetime comparison">
  <DiagramGrid columns={3}>
    <DiagramNode title="Local variable" tone="slate">Exists for one function execution.</DiagramNode>
    <DiagramNode title="Ref" tone="orange">Persists for the mounted component instance.</DiagramNode>
    <DiagramNode title="Module variable" tone="red">Shared outside component instance boundaries.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Storing an external instance

```jsx
function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = createMap();

    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  return <div id="map" />;
}
```

The external map object is not React state. The ref provides instance-level storage while the Effect owns synchronization and cleanup.

## Do not use refs to avoid state

A dangerous motivation is:

> “State re-renders, so I will store everything in refs for performance.”

That makes UI-driving changes invisible to React and encourages mutation-heavy architecture.

```jsx
const checkoutRef = useRef({
  items: [],
  discount: null,
  customer: null,
});
```

If the interface depends on those values, refs are the wrong ownership model.

## Debugging refs

<DecisionTree
  question="Where should this value live?"
  items={[
    {label: 'The value affects JSX', value: 'Use state/reducer/another reactive owner'},
    {label: 'It must persist across renders but should not trigger rendering', value: 'A ref may fit'},
    {label: 'It is an external/imperative object or handle', value: 'A ref is often appropriate'},
  ]}
/>

## Production example: debounced API request

```jsx
function SearchInput({onSearch}) {
  const timeoutRef = useRef(null);

  function handleChange(event) {
    const nextQuery = event.target.value;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch(nextQuery);
    }, 300);
  }

  return <input onChange={handleChange} />;
}
```

The timer ID does not need to render. A controlled/displayed query still belongs in state or props.

## Exercise

Build a stopwatch with rendered elapsed time in state and the interval ID in a ref. Add Start, Stop, and Reset controls, then explain why those two values use different storage models.

## Interview questions

**Junior:** What is the main difference between `useRef` and `useState`?

**Mid-level:** Why is reading or writing `ref.current` during render usually unsafe?

**Senior:** What architecture problems appear when refs are used as a hidden replacement for reactive state?

## Summary

<VisualDiagram title="Ref decision summary" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="State" tone="blue">React should render when this value changes.</DiagramNode>
    <DiagramNode title="Ref" tone="orange">Persist mutable non-render data for this component instance.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Treat refs as escape hatches, not a second state-management system.

## References

- https://react.dev/learn/referencing-values-with-refs
- https://react.dev/reference/react/useRef

## Next

Continue with **[DOM Refs and Imperative Handles](./dom-refs-and-imperative-handles.md)**.
