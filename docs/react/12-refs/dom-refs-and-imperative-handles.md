---
title: DOM Refs and Imperative Handles
description: Learn DOM refs, focus, scrolling, measurement, callback refs, ref cleanup, React 19 ref-as-prop, and useImperativeHandle.
sidebar_position: 2
---

# DOM refs and imperative handles

React normally manages the DOM for you.

Sometimes, however, you need an imperative browser action such as:

- focus an input;
- scroll an element into view;
- measure a node;
- play or pause media;
- integrate a non-React widget.

That is where DOM refs are useful.

## Getting a DOM node

```jsx
import {useRef} from 'react';

function Search() {
  const inputRef = useRef(null);

  function handleFocus() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus search</button>
    </>
  );
}
```

React assigns the DOM node to `inputRef.current` during the commit phase.

## Render versus commit matters for refs

During render, the next DOM has not been committed yet.

```text
render
  ↓
calculate next UI
  ↓
commit
  ↓
React updates DOM refs
```

That is why reading a DOM ref during render is generally wrong.

Use refs from event handlers or Effects when the DOM is committed.

## Focus

```jsx
function LoginForm() {
  const emailRef = useRef(null);

  function handleInvalidSubmit() {
    emailRef.current?.focus();
  }

  return (
    <form>
      <input ref={emailRef} type="email" />
      <button type="button" onClick={handleInvalidSubmit}>
        Focus email
      </button>
    </form>
  );
}
```

Programmatic focus is useful, but accessibility matters.

Do not move focus unexpectedly unless it helps the user complete an action or understand a state change.

## Scrolling

```jsx
function ProductCard() {
  const detailsRef = useRef(null);

  function handleShowDetails() {
    detailsRef.current?.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <button onClick={handleShowDetails}>Show details</button>
      <section ref={detailsRef}>...</section>
    </>
  );
}
```

## Media APIs

```jsx
function VideoPlayer() {
  const videoRef = useRef(null);

  return (
    <>
      <video ref={videoRef} src="/demo.mp4" />
      <button onClick={() => videoRef.current?.play()}>Play</button>
      <button onClick={() => videoRef.current?.pause()}>Pause</button>
    </>
  );
}
```

This is a classic imperative escape hatch: React renders the `<video>`, and browser methods control playback.

## Measurement

Sometimes layout information is needed after commit.

```jsx
function Panel() {
  const panelRef = useRef(null);

  function measure() {
    const rect = panelRef.current?.getBoundingClientRect();
    console.log(rect?.width);
  }

  return (
    <>
      <div ref={panelRef}>Panel</div>
      <button onClick={measure}>Measure</button>
    </>
  );
}
```

If measurement must happen before the browser paints a visible adjustment, `useLayoutEffect` may be required. That Hook is covered later because it has different performance implications from `useEffect`.

## Callback refs

A ref can also be a function:

```jsx
<div
  ref={node => {
    console.log('node', node);
  }}
/>
```

Callback refs are especially useful for dynamic collections.

Example with a Map:

```jsx
function ProductList({products}) {
  const itemRefs = useRef(new Map());

  return products.map(product => (
    <article
      key={product.id}
      ref={node => {
        if (node) {
          itemRefs.current.set(product.id, node);
        } else {
          itemRefs.current.delete(product.id);
        }
      }}
    >
      {product.name}
    </article>
  ));
}
```

This lets imperative code find a specific rendered item later.

## Callback ref cleanup

Modern React supports returning a cleanup function from a ref callback.

```jsx
<li
  ref={node => {
    const map = itemsRef.current;
    map.set(item.id, node);

    return () => {
      map.delete(item.id);
    };
  }}
>
  {item.name}
</li>
```

This can make collection ref lifecycle clearer.

## Avoid destructive DOM mutation

React owns the DOM it renders.

Risky:

```jsx
containerRef.current.innerHTML = '';
```

Now React's internal view of the tree may disagree with the actual DOM.

Prefer non-destructive actions such as:

- focus;
- scroll;
- read measurement;
- media methods;
- integration with DOM regions React does not manage directly.

## Passing refs to components in React 19

> **React 19+**

Function components can receive `ref` as a prop.

```jsx
function MyInput({label, ref}) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
}
```

Usage:

```jsx
const inputRef = useRef(null);

<MyInput ref={inputRef} label="Email" />
```

This is the modern React 19 direction.

## forwardRef is historical/maintenance knowledge

`forwardRef` remains important when maintaining older React code and libraries, but in React 19 it is no longer necessary for new function components that simply receive `ref` as a prop.

Legacy-style pattern:

```jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

For new React 19 code, prefer the `ref` prop model unless library compatibility requirements dictate otherwise.

## Why expose less than the full DOM node?

Suppose a parent only needs to:

- focus an input;
- clear it.

Exposing the entire DOM node gives the parent broad imperative access.

A narrower component API can be safer.

## useImperativeHandle

`useImperativeHandle` lets a component customize what its ref exposes.

```jsx
import {useImperativeHandle, useRef} from 'react';

function SearchInput({ref}) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  }), []);

  return <input ref={inputRef} />;
}
```

Parent:

```jsx
function Toolbar() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchInput ref={searchRef} />
      <button onClick={() => searchRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}
```

The parent gets a custom handle rather than the raw input element.

## Imperative APIs should stay small

Bad component contract:

```text
ref.current
├── getInternalState
├── setInternalState
├── mutateCache
├── forceRefresh
├── resetStore
└── rewriteDom
```

This bypasses declarative React architecture.

Better imperative surface:

```text
Dialog ref
├── focusInitialControl()
└── scrollToError()
```

Use imperative handles for narrow actions that are genuinely difficult to express declaratively.

## Prefer props for declarative behavior

Instead of:

```jsx
modalRef.current.open();
```

A declarative API is often better:

```jsx
<Modal open={isOpen} />
```

Why?

```text
state
 ↓
props
 ↓
UI
```

React can reason about this data flow.

Use imperative APIs when the behavior itself is inherently imperative, such as focus or scrolling.

## Common mistake: using refs to communicate ordinary state

Avoid:

```jsx
childRef.current.selectedTab
```

if `selectedTab` affects the parent or rendered UI.

Prefer lifting state:

```jsx
<Tabs value={selectedTab} onChange={setSelectedTab} />
```

## Common mistake: DOM query instead of ownership

```js
document.querySelector('#email').focus();
```

This reaches globally into the document.

A ref keeps the relationship local to the component tree:

```jsx
const emailRef = useRef(null);
<input ref={emailRef} />
```

## Integrating third-party widgets

```jsx
function Chart({data}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = createChart(containerRef.current);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setData(data);
  }, [data]);

  return <div ref={containerRef} />;
}
```

This combines:

- DOM ref for the host node;
- instance ref for the chart object;
- Effects for external synchronization.

That is a healthy escape-hatch architecture when the widget is outside React's rendering model.

## Debugging refs

If a DOM ref is `null`, check:

1. Is the element currently rendered?
2. Are you reading the ref before commit?
3. Did conditional rendering remove the element?
4. Is the ref passed to the correct node/component?
5. Is a callback ref cleanup removing it?

## Exercise

Build a reusable `SearchInput` that:

- receives `ref` as a prop;
- keeps the actual DOM node private;
- exposes only `focus()` and `selectAll()` with `useImperativeHandle`;
- has a parent button that calls those methods.

Then explain why exposing the entire input DOM node may create a weaker component boundary.

## Interview questions

**Junior:** When would you use a DOM ref?

**Mid-level:** Why should you avoid reading DOM refs during render?

**Senior:** When is an imperative handle a better API than exposing a raw DOM node, and when should both be avoided in favor of props/state?

## Summary

```text
React owns DOM structure.
Refs give controlled imperative access.
React 19 lets function components receive ref as a prop.
useImperativeHandle narrows the exposed imperative API.
```

## References

- https://react.dev/learn/manipulating-the-dom-with-refs
- https://react.dev/reference/react/useImperativeHandle
- https://react.dev/reference/react/forwardRef
- https://react.dev/blog/2024/12/05/react-19

## Next

Continue with **[Custom Hooks](../13-custom-hooks/custom-hooks.md)**.
