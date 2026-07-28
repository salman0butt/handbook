---
title: DOM Refs and Imperative Handles
description: Learn DOM refs, focus, scrolling, measurement, callback refs, ref cleanup, React 19 ref-as-prop, and useImperativeHandle.
sidebar_position: 2
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

# DOM refs and imperative handles

React normally manages the DOM for you. Refs are the controlled escape hatch for browser operations that are inherently imperative, such as focus, scrolling, measurement, media control, and third-party widget integration.

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

React assigns the committed DOM node to `inputRef.current`.

## Render versus commit matters for refs

<VisualDiagram title="When does a DOM ref become usable?" subtitle="The next DOM node does not exist as committed UI during render.">
  <LifecycleBar
    items={[
      {label: 'Render calculates next UI', tone: 'purple'},
      {label: 'React commits DOM changes', tone: 'green'},
      {label: 'DOM refs are updated', tone: 'cyan'},
      {label: 'Events / Effects can use the node', tone: 'blue'},
    ]}
  />
</VisualDiagram>

Reading a DOM ref during render is generally wrong because the DOM for that render has not been committed yet.

## Common imperative DOM actions

<VisualDiagram title="Healthy DOM-ref use cases">
  <DiagramGrid columns={3}>
    <DiagramNode title="Focus" tone="blue">Move keyboard focus after a user-relevant transition.</DiagramNode>
    <DiagramNode title="Scroll" tone="cyan">Call scrollIntoView for a specific owned node.</DiagramNode>
    <DiagramNode title="Measure" tone="purple">Read geometry after commit.</DiagramNode>
    <DiagramNode title="Media" tone="orange">Play, pause, seek, or inspect media APIs.</DiagramNode>
    <DiagramNode title="Observer / widget" tone="green">Connect imperative browser or third-party systems.</DiagramNode>
    <DiagramNode title="Custom handle" tone="slate">Expose a narrow imperative API instead of the raw node.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

### Focus

```jsx
function LoginForm() {
  const emailRef = useRef(null);

  function handleInvalidSubmit() {
    emailRef.current?.focus();
  }

  return (
    <form>
      <input ref={emailRef} type="email" />
      <button type="button" onClick={handleInvalidSubmit}>Focus email</button>
    </form>
  );
}
```

Programmatic focus should help the user understand or complete an action, not jump unexpectedly.

### Scrolling

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

### Media APIs

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

### Measurement

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

If a measurement must drive a visual adjustment before paint, `useLayoutEffect` may be needed; use it deliberately because it can block painting.

## Callback refs

A ref can also be a function:

```jsx
<div
  ref={node => {
    console.log('node', node);
  }}
/>
```

Callback refs are useful for dynamic collections.

```jsx
function ProductList({products}) {
  const itemRefs = useRef(new Map());

  return products.map(product => (
    <article
      key={product.id}
      ref={node => {
        if (node) itemRefs.current.set(product.id, node);
        else itemRefs.current.delete(product.id);
      }}
    >
      {product.name}
    </article>
  ));
}
```

## Callback ref cleanup

Modern React allows a ref callback to return cleanup:

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

<VisualDiagram title="Callback-ref lifecycle" compact>
  <LifecycleBar
    items={[
      {label: 'node commits', tone: 'green'},
      {label: 'ref callback receives node', tone: 'blue'},
      {label: 'register imperative relationship', tone: 'purple'},
      {label: 'node leaves / ref changes', tone: 'orange'},
      {label: 'cleanup removes registration', tone: 'red'},
    ]}
  />
</VisualDiagram>

## Avoid destructive DOM mutation

React owns the DOM structure it renders.

Risky:

```jsx
containerRef.current.innerHTML = '';
```

This can make the real DOM disagree with React's model. Prefer non-destructive actions such as focus, scroll, measurement, media methods, or integration with DOM regions that React does not manage directly.

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

```jsx
const inputRef = useRef(null);
<MyInput ref={inputRef} label="Email" />;
```

`forwardRef` remains maintenance knowledge for older React code and libraries, but new React 19 function components can use the `ref` prop model directly.

## Raw DOM node versus narrow imperative handle

Exposing a raw node gives the parent every DOM capability. Often the component should expose much less.

<VisualDiagram title="Prefer the smallest imperative surface" subtitle="Expose the capability the parent needs, not the implementation object.">
  <DiagramGrid columns={2}>
    <DiagramNode title="Too broad" tone="red" eyebrow="RAW / LEAKY">
      getInternalState · setInternalState · mutateCache · forceRefresh · rewrite DOM
    </DiagramNode>
    <DiagramNode title="Narrow handle" tone="green" eyebrow="CAPABILITY">
      focus() · selectAll() · scrollToError()
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## useImperativeHandle

`useImperativeHandle` customizes what a component exposes through its ref.

```jsx
import {useImperativeHandle, useRef} from 'react';

function SearchInput({ref}) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = '';
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
      <button onClick={() => searchRef.current?.focus()}>Focus</button>
    </>
  );
}
```

<VisualDiagram title="Imperative handle boundary">
  <DiagramStack align="center">
    <DiagramNode title="Parent" tone="blue" wide>Needs a small imperative capability.</DiagramNode>
    <DiagramArrow label="ref handle" />
    <DiagramNode title="Component API" tone="purple" wide>Exposes focus() / clear(), not the raw implementation.</DiagramNode>
    <DiagramArrow label="internally controls" />
    <DiagramNode title="Private DOM node" tone="green" wide>The component keeps ownership of the actual input.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Prefer props for declarative behaviour

A declarative model is usually better when state can describe the UI.

```jsx
<Modal open={isOpen} />
```

<VisualDiagram title="Declarative before imperative" compact>
  <DiagramStack align="center">
    <DiagramNode title="State" tone="blue" wide />
    <DiagramArrow label="props" />
    <DiagramNode title="Component" tone="purple" wide />
    <DiagramArrow label="renders" />
    <DiagramNode title="UI" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

Use an imperative API when the behaviour itself is imperative, such as focus, scrolling, selection, or media control.

<DecisionTree
  question="Should this interaction use props/state or a ref?"
  items={[
    {label: 'The value describes what UI should exist', value: 'Prefer state + props'},
    {label: 'The action is inherently imperative browser behaviour', value: 'A DOM ref may fit'},
    {label: 'A parent needs only a tiny subset of child capabilities', value: 'Expose a narrow useImperativeHandle API'},
  ]}
/>

## Common mistake: refs as ordinary state communication

Avoid reading child business state through a ref:

```jsx
childRef.current.selectedTab;
```

If `selectedTab` affects rendered UI or parent logic, prefer controlled state:

```jsx
<Tabs value={selectedTab} onChange={setSelectedTab} />
```

## Common mistake: global DOM query instead of ownership

```js
document.querySelector('#email').focus();
```

A ref keeps the relationship local to the component tree:

```jsx
const emailRef = useRef(null);
<input ref={emailRef} />;
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

<VisualDiagram title="Healthy third-party widget integration">
  <LifecycleBar
    items={[
      {label: 'React commits host node', tone: 'green'},
      {label: 'DOM ref exposes container', tone: 'blue'},
      {label: 'Effect creates widget', tone: 'purple'},
      {label: 'data Effect synchronizes updates', tone: 'cyan'},
      {label: 'cleanup destroys widget', tone: 'red'},
    ]}
  />
</VisualDiagram>

## Debugging refs

If a DOM ref is `null`, check whether the element is rendered, whether you are reading before commit, whether conditional rendering removed it, whether the ref reaches the correct node/component, and whether callback-ref cleanup removed it.

## Exercise

Build a reusable `SearchInput` that receives `ref` as a prop, keeps the actual DOM node private, and exposes only `focus()` and `selectAll()` through `useImperativeHandle`.

## Interview questions

**Junior:** When would you use a DOM ref?

**Mid-level:** Why should you avoid reading DOM refs during render?

**Senior:** When is an imperative handle a better API than exposing a raw DOM node, and when should both be avoided in favour of props/state?

## Summary

<VisualDiagram title="DOM refs summary">
  <LifecycleBar
    items={[
      {label: 'React owns DOM structure', tone: 'blue'},
      {label: 'Refs expose controlled imperative access', tone: 'orange'},
      {label: 'React 19 supports ref as a prop', tone: 'purple'},
      {label: 'useImperativeHandle narrows the API', tone: 'green'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/learn/manipulating-the-dom-with-refs
- https://react.dev/reference/react/useImperativeHandle
- https://react.dev/reference/react/forwardRef
- https://react.dev/blog/2024/12/05/react-19

## Next

Continue with **[Custom Hooks](../13-custom-hooks/custom-hooks.md)**.
