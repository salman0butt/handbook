---
title: useRef
description: Learn refs as persistent mutable values that do not trigger rendering, their differences from state, safe usage, timers, previous values, and common mistakes.
sidebar_position: 1
---

# useRef

`useRef` lets a component remember a value between renders **without causing a new render when that value changes**.

```jsx
import {useRef} from 'react';

function Example() {
  const ref = useRef(0);
}
```

The returned object looks conceptually like:

```js
{
  current: 0
}
```

The same ref object is retained across renders.

## The mental model

Think of a ref as a persistent mutable pocket attached to the component:

```text
render 1 ─┐
render 2 ─┼──> same ref object
render 3 ─┘        ↓
                 current
```

Changing `ref.current` does not ask React to render again.

That makes refs useful for values React does not need in order to calculate JSX.

## State versus refs

| State | Ref |
| --- | --- |
| retained between renders | retained between renders |
| setter schedules a render | changing `.current` does not render |
| read as part of render | normally do not read/write during render |
| represents UI-relevant data | represents imperative/non-render data |
| snapshot per render | mutable immediately |

Example state:

```jsx
const [count, setCount] = useState(0);
```

Example ref:

```jsx
const clickCountRef = useRef(0);
```

If the UI needs to display the value, state is usually the correct tool.

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

Clicking mutates the ref, but the component does not re-render, so the displayed count does not reliably update.

If a value affects rendered output:

```jsx
const [count, setCount] = useState(0);
```

Use state.

## Good ref use cases

Refs are useful for values such as:

- timer IDs;
- DOM nodes;
- external library instances;
- previous/reference values used outside render;
- AbortController instances;
- mutable caches that are not part of UI;
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

The timeout ID matters to event logic, but it does not belong in JSX.

A ref fits well.

## Refs are mutable immediately

```jsx
const ref = useRef(0);

ref.current = 5;
console.log(ref.current); // 5
```

This differs from state, where the current render keeps its existing snapshot even after calling the setter.

That difference is powerful, but it also means ref-based logic is easier to make imperative and harder to reason about if overused.

## Do not read or write refs during render

Bad:

```jsx
function Component() {
  const countRef = useRef(0);
  countRef.current += 1; // ❌ mutation during render

  return <p>{countRef.current}</p>;
}
```

Rendering should stay pure.

React may render more than once, interrupt work, or re-run components in development checks. Render-time ref mutation creates behavior React cannot reason about safely.

Usually access refs from:

- event handlers;
- Effects;
- ref callbacks;
- imperative APIs.

## Exception: stable lazy initialization

A narrow pattern can be safe when initialization is predictable and only happens once:

```jsx
const playerRef = useRef(null);

if (playerRef.current === null) {
  playerRef.current = new VideoPlayer();
}
```

This is different from changing a ref based on changing render inputs.

Use this pattern only when the initialization result is stable and deterministic for the component instance.

## Ref identity is stable

```jsx
const ref = useRef(null);
```

React returns the same ref object on later renders.

That means code can safely retain references to the object itself.

```text
render 1: ref object A
render 2: ref object A
render 3: ref object A
```

Only `ref.current` changes.

## Previous values

You may see a `usePrevious` pattern:

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

This can be useful in specific debugging or transition scenarios, but do not reach for previous values by default.

Often current props/state are enough, and many "previous value" requirements indicate duplicated or awkward state modeling.

## Refs and latest callbacks

Older React code sometimes stores latest values/functions in refs to avoid stale closures:

```jsx
const callbackRef = useRef(onChange);
callbackRef.current = onChange;
```

This technique can still be useful for some low-level integrations, but for non-reactive logic inside Effects in React 19.2+, first consider `useEffectEvent`, which communicates the intent more directly.

## Ref versus module variable

Bad shared module state:

```js
let timeoutId;

function SearchBox() {
  // all component instances share timeoutId
}
```

A ref is scoped to the component instance:

```jsx
function SearchBox() {
  const timeoutRef = useRef(null);
}
```

Each mounted `SearchBox` gets its own persistent ref.

## Ref versus local variable

Local variable:

```jsx
function Example() {
  let timeoutId;
}
```

This variable is recreated whenever the component renders.

Ref:

```jsx
const timeoutRef = useRef(null);
```

The ref survives renders.

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

The external object itself is not React state.

The ref provides an instance-level place to keep it.

## Common mistake: using refs to avoid state

Bad motivation:

> "State re-renders, so I will store everything in refs for performance."

That breaks React's data flow.

If UI depends on a value, React needs to know when it changes.

Use state, reducer, context, or external-store integration according to ownership—not refs as invisible global state.

## Common mistake: ref as uncontrolled business store

```jsx
const checkoutRef = useRef({
  items: [],
  discount: null,
  customer: null,
});
```

If the interface depends on these values, this makes updates invisible to React and encourages mutation-heavy architecture.

Refs are best kept narrow.

## Debugging refs

Ask:

```text
Does this value affect JSX?
       ↓ yes
Use state.

Does it need to survive renders but not trigger them?
       ↓ yes
Ref may fit.

Is this external/imperative state?
       ↓ yes
Ref is often appropriate.
```

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

The timer ID does not need to render.

The query value, if displayed or controlled, should still be state/props.

## Exercise

Build a stopwatch with:

- rendered elapsed time in state;
- interval ID in a ref;
- Start button;
- Stop button;
- Reset button.

Explain why elapsed time and interval ID belong in different storage models.

## Interview questions

**Junior:** What is the main difference between `useRef` and `useState`?

**Mid-level:** Why is reading or writing `ref.current` during render usually unsafe?

**Senior:** What architecture problems appear when refs are used as a hidden replacement for reactive state?

## Summary

```text
State
→ React should re-render when it changes.

Ref
→ persist a mutable value that React does not use to calculate JSX.
```

Treat refs as escape hatches, not a second state-management system.

## References

- https://react.dev/learn/referencing-values-with-refs
- https://react.dev/reference/react/useRef

## Next

Continue with **[DOM Refs and Imperative Handles](./dom-refs-and-imperative-handles.md)**.
