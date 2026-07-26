---
title: useLayoutEffect, useInsertionEffect, and useDebugValue
description: Specialized React Hooks for pre-paint layout work, CSS-in-JS style insertion, and custom Hook debugging.
sidebar_position: 4
---

# `useLayoutEffect`, `useInsertionEffect`, and `useDebugValue`

These Hooks solve specialized problems.

They should not become default substitutes for `useEffect` or ordinary logging.

```text
useEffect
→ synchronize after commit, usually without blocking paint

useLayoutEffect
→ run after DOM commit but before browser repaint

useInsertionEffect
→ library-level style insertion before layout Effects

useDebugValue
→ expose useful custom Hook state in React DevTools
```

## `useLayoutEffect`

`useLayoutEffect` fires after React commits DOM changes and before the browser repaints.

```js
useLayoutEffect(setup, dependencies);
```

Use it when the UI must read layout and update again **before the user sees the intermediate result**.

## Tooltip example

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

Flow:

```text
render with provisional position
   ↓
DOM commit
   ↓
useLayoutEffect measures DOM
   ↓
state update
   ↓
second render
   ↓
browser paints final position
```

The user never sees the provisional position.

## Why `useLayoutEffect` can hurt performance

The browser cannot paint until layout Effects and synchronous updates from them finish.

So this:

```js
useLayoutEffect(() => {
  expensiveSynchronousWork();
});
```

blocks visible progress.

Use `useEffect` when the work does not have to happen before paint.

## `useLayoutEffect` vs `useEffect`

Use `useLayoutEffect` for:

- measuring element geometry before paint;
- synchronously positioning overlays/tooltips;
- reading layout that determines the immediately visible result;
- certain imperative UI integrations requiring pre-paint coordination.

Use `useEffect` for:

- subscriptions;
- analytics;
- network synchronization;
- timers;
- most third-party integrations;
- work that can happen after paint.

## Server rendering

Effects do not run during server rendering.

`useLayoutEffect` specifically depends on browser layout information, which does not exist on the server.

If a component fundamentally needs layout before it can render correctly, consider:

- making the component client-only;
- rendering a hydration-safe fallback first;
- replacing layout work with normal Effect work when visible jumping is acceptable;
- redesigning the layout using CSS so measurement is unnecessary.

## Strict Mode behavior

Development Strict Mode performs an extra setup/cleanup cycle before the first real setup.

That means layout Effect cleanup must mirror setup correctly.

Bad:

```js
useLayoutEffect(() => {
  window.addEventListener('resize', measure);
}, []);
```

Better:

```js
useLayoutEffect(() => {
  window.addEventListener('resize', measure);
  return () => window.removeEventListener('resize', measure);
}, []);
```

## Layout thrashing

Repeatedly mixing DOM reads and writes can force browser layout recalculation.

Risky pattern:

```text
read width
write style
read height
write style
```

Prefer grouping reads and minimizing synchronous DOM writes.

React cannot eliminate browser layout cost for you.

## `useInsertionEffect`

`useInsertionEffect` is primarily for CSS-in-JS library authors.

```js
useInsertionEffect(setup, dependencies);
```

Its purpose is to insert styles before layout Effects need to read layout using those styles.

## Why this exists

Runtime CSS-in-JS can create a timing problem:

```text
DOM update
   ↓
layout measurement
   ↓
style inserted too late
```

The measurement can be wrong because the expected styles were not present yet.

`useInsertionEffect` lets a styling library insert styles earlier in the commit process.

## Example library Hook

```js
function useCSS(rule) {
  useInsertionEffect(() => {
    insertRule(rule);
  }, [rule]);

  return getClassName(rule);
}
```

This is library infrastructure, not typical application code.

## Important `useInsertionEffect` caveats

Current React guidance includes these constraints:

- it runs only on the client;
- you cannot update state inside it;
- refs are not attached yet;
- do not rely on the DOM already being updated at a particular moment;
- cleanup/setup ordering differs from ordinary Effect batching.

That makes it intentionally narrow.

## Prefer static CSS when possible

React's docs recommend static extraction or ordinary CSS over runtime style injection when practical.

Why?

Runtime style insertion can trigger extra style recalculation and create performance overhead.

Use `useInsertionEffect` when building infrastructure that truly needs runtime injection—not because it sounds like the “fastest Effect.”

## `useDebugValue`

`useDebugValue` gives custom Hooks meaningful labels in React DevTools.

```js
function useOnlineStatus() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

  useDebugValue(online ? 'Online' : 'Offline');

  return online;
}
```

DevTools can then show a readable value instead of only the underlying primitive state.

## Best use case

`useDebugValue` is most valuable in reusable custom Hooks where developers need to inspect a semantic state.

Examples:

```text
useAuth()        → Authenticated as Alice
useNetwork()     → Offline
useQueryState()  → Loading products
useFeatureFlag() → checkout-v2 enabled
```

## Deferred formatting

Formatting debug state might be expensive.

Instead of:

```js
useDebugValue(expensiveFormat(data));
```

use the formatter argument:

```js
useDebugValue(data, value => expensiveFormat(value));
```

React DevTools can call the formatter only when the Hook is inspected.

This avoids formatting work on every render.

## Do not overuse `useDebugValue`

A simple local Hook used once does not automatically need a debug label.

Useful rule:

```text
public/reusable custom Hook
+ non-obvious internal state
→ consider useDebugValue
```

## Performance relationship

These Hooks have very different performance implications.

### `useLayoutEffect`

Can block paint. Keep work minimal.

### `useInsertionEffect`

Exists to coordinate runtime styling infrastructure. Misuse can create fragile timing assumptions.

### `useDebugValue`

Usually cheap, but expensive formatting should be deferred.

## Common mistakes

### Using `useLayoutEffect` because it “runs faster”

It does not make work cheaper. It makes the browser wait before painting.

### Measuring layout every render

If the measurement is only needed after a specific change, express that through dependencies or architecture.

### Updating state in `useInsertionEffect`

Not supported.

### Using `useInsertionEffect` for app business logic

It is not an “earlier Effect.” It is specialized styling infrastructure.

### Formatting debug values eagerly

Use the formatter callback when formatting is expensive.

## Exercise

Classify each task:

1. send analytics after route change;
2. position a tooltip based on measured height before paint;
3. insert runtime CSS rules for a styling library;
4. subscribe to WebSocket messages;
5. label a custom `useSession` Hook in DevTools.

Expected directions:

```text
1 → useEffect
2 → useLayoutEffect
3 → useInsertionEffect
4 → useEffect or external-store abstraction
5 → useDebugValue
```

## Interview questions

### Why can `useLayoutEffect` hurt performance?

Because it and synchronous state updates from it run before the browser repaints, so excessive work blocks paint.

### What is `useInsertionEffect` for?

Primarily CSS-in-JS library infrastructure that must insert styles before layout Effects read layout.

### Can you update state from `useInsertionEffect`?

No.

### What does `useDebugValue` do?

It exposes a readable value for a custom Hook in React DevTools, with optional deferred formatting.

## References

- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/reference/react/useInsertionEffect
- https://react.dev/reference/react/useDebugValue
