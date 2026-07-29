---
title: useLayoutEffect, useInsertionEffect, and useDebugValue
description: Specialized React Hooks for pre-paint layout work, CSS-in-JS style insertion, and custom Hook debugging.
sidebar_position: 4
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# `useLayoutEffect`, `useInsertionEffect`, and `useDebugValue`

These Hooks solve specialized problems. They should not become default substitutes for `useEffect` or ordinary logging.

<VisualDiagram title="Three specialized responsibilities">
  <DiagramGrid columns={3}>
    <DiagramNode title="useLayoutEffect" tone="orange">Read/update layout after DOM commit but before paint</DiagramNode>
    <DiagramNode title="useInsertionEffect" tone="purple">CSS-in-JS library style insertion before layout Effects</DiagramNode>
    <DiagramNode title="useDebugValue" tone="teal">Expose semantic custom-Hook state in DevTools</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## `useLayoutEffect`

`useLayoutEffect` runs after React commits DOM changes and before the browser repaints.

```js
useLayoutEffect(setup, dependencies);
```

Use it when the user must never see the provisional layout.

## Tooltip measurement flow

```jsx
function Tooltip() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  }, []);

  return (
    <div ref={ref} style={{ transform: `translateY(${-height}px)` }}>
      Tooltip
    </div>
  );
}
```

<VisualDiagram title="Pre-paint layout correction">
  <LifecycleBar items={[
    { label: 'Render provisional position', tone: 'blue' },
    { label: 'Commit DOM', tone: 'purple' },
    { label: 'useLayoutEffect measures', tone: 'orange' },
    { label: 'Synchronous state update / second render', tone: 'red' },
    { label: 'Browser paints final position', tone: 'green' },
  ]} />
</VisualDiagram>

The trade-off is clear: the user avoids a visible jump, but the browser must wait before painting.

## `useLayoutEffect` vs `useEffect`

<DecisionTree
  question="Does this synchronization need to finish before paint?"
  items={[
    { label: 'Yes — geometry/position must be correct before user sees it', value: 'useLayoutEffect may be justified' },
    { label: 'No — subscription, analytics, timers, network, most integrations', value: 'Prefer useEffect' },
    { label: 'The layout can be expressed with CSS instead', value: 'Avoid measurement Effect entirely' },
  ]}
/>

Keep layout Effects minimal because they block visible progress.

## Server rendering

Effects do not run during server rendering. Browser layout does not exist on the server.

If a component fundamentally depends on measured layout, consider a client-only boundary, a hydration-safe initial UI, an ordinary Effect when a visible adjustment is acceptable, or CSS architecture that removes the measurement.

## Strict Mode

Development Strict Mode performs an extra setup/cleanup cycle. Cleanup must mirror setup.

```js
useLayoutEffect(() => {
  window.addEventListener('resize', measure);
  return () => window.removeEventListener('resize', measure);
}, []);
```

## Layout thrashing

Alternating DOM reads and writes can repeatedly force layout calculation.

<VisualDiagram title="Batch reads and writes instead of forcing repeated layout">
  <DiagramGrid columns={2}>
    <DiagramNode title="Risky" tone="red">read width → write style → read height → write style</DiagramNode>
    <DiagramNode title="Better" tone="green">collect required reads → compute → perform minimal writes</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React cannot remove browser layout cost for you.

## `useInsertionEffect`

`useInsertionEffect` is primarily for CSS-in-JS library authors.

```js
useInsertionEffect(setup, dependencies);
```

Its job is to insert runtime styles before layout Effects need to measure layout using those styles.

<VisualDiagram title="Why insertion timing exists">
  <DiagramGrid columns={2}>
    <DiagramNode title="Too late" tone="red">DOM update → layout measurement → style injected</DiagramNode>
    <DiagramNode title="Insertion Effect" tone="green">style injection → layout Effects can measure with intended CSS</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Example library Hook:

```js
function useCSS(rule) {
  useInsertionEffect(() => {
    insertRule(rule);
  }, [rule]);

  return getClassName(rule);
}
```

This is library infrastructure, not typical application business logic.

## Current `useInsertionEffect` caveats

React's current documentation states that:

- it runs only on the client;
- state updates are not allowed inside it;
- refs are not attached yet;
- you must not rely on the DOM having been updated at a specific moment;
- cleanup/setup are interleaved one component at a time rather than globally batched like ordinary Effects.

That intentionally makes it a narrow tool.

## Prefer static CSS when practical

React recommends static extraction or normal CSS/inline styles over runtime `<style>` injection when possible. Runtime injection can force repeated style recalculation and is sensitive to lifecycle timing.

## `useDebugValue`

`useDebugValue` exposes semantic state for reusable custom Hooks in React DevTools.

```js
function useOnlineStatus() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  useDebugValue(online ? 'Online' : 'Offline');
  return online;
}
```

<VisualDiagram title="Debug values translate implementation into domain meaning">
  <DiagramRow>
    <DiagramNode title="Hook internals" tone="gray">subscriptions · refs · state</DiagramNode>
    <DiagramArrow direction="right" label="useDebugValue" />
    <DiagramNode title="DevTools label" tone="teal">Offline / Authenticated / Loading products</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Best candidates are reusable public Hooks with non-obvious internal state.

## Deferred debug formatting

If formatting is expensive:

```js
useDebugValue(data, value => expensiveFormat(value));
```

The formatter can be evaluated when DevTools inspects the Hook instead of on every render.

## Performance comparison

<DiagramGrid columns={3}>
  <DiagramNode title="useLayoutEffect" tone="orange">Can block paint. Keep work tiny.</DiagramNode>
  <DiagramNode title="useInsertionEffect" tone="purple">Coordinates runtime styling infrastructure.</DiagramNode>
  <DiagramNode title="useDebugValue" tone="teal">Usually cheap; defer expensive formatting.</DiagramNode>
</DiagramGrid>

## Common mistakes

- Using `useLayoutEffect` because it sounds faster.
- Measuring layout every render without need.
- Updating state from `useInsertionEffect`.
- Using `useInsertionEffect` for product business logic.
- Eagerly formatting expensive debug values.

## Classification exercise

<DecisionTree
  question="Which tool fits this job?"
  items={[
    { label: 'Analytics after navigation or WebSocket subscription', value: 'useEffect' },
    { label: 'Measure tooltip geometry before paint', value: 'useLayoutEffect' },
    { label: 'Inject CSS rules in a runtime styling library', value: 'useInsertionEffect' },
    { label: 'Expose readable state for a reusable custom Hook', value: 'useDebugValue' },
  ]}
/>

## Interview questions

### Why can `useLayoutEffect` hurt performance?

It and synchronous updates from it run before repaint, delaying visible progress.

### What is `useInsertionEffect` for?

Primarily CSS-in-JS infrastructure that must insert styles before layout Effects measure layout.

### Can it update state?

No.

### What does `useDebugValue` do?

It exposes a semantic label/value for custom Hooks in React DevTools.

## References

- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/reference/react/useInsertionEffect
- https://react.dev/reference/react/useDebugValue
