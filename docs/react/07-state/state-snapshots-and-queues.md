---
title: State as a Snapshot and Update Queues
description: Understand why state does not change immediately, how batching works, and when updater functions are required.
sidebar_position: 1
---

# State as a snapshot and update queues

State variables look like ordinary JavaScript variables, but their behavior is different.

The key mental model is:

```text
Each render receives a snapshot of state.
A setter requests another render.
It does not mutate the snapshot you already have.
```

## A render owns a fixed snapshot

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

If `count` is `0` in this render, the handler created by this render sees `0`.

Calling:

```jsx
setCount(1);
```

requests a future render. It does not rewrite the `count` variable in the currently executing handler.

## Render snapshots

Think of renders as separate photographs:

```text
Render A
count = 0
handler A captures count = 0
      ↓ click
setCount(1)
      ↓
Render B
count = 1
handler B captures count = 1
```

This explains many “stale state” questions without treating React as asynchronous magic.

## State setters queue updates

```jsx
setCount(count + 1);
```

means roughly:

```text
using this render's count,
request a future state value
```

It does not mean:

```text
mutate count right now
```

## React batches updates

React normally waits until the event handler has finished before processing the queued updates.

```jsx
function handleClick() {
  setCount(count + 1);
  setOpen(true);
  setMessage('Updated');
}
```

Conceptually:

```text
event handler begins
   ↓
queue update
queue update
queue update
   ↓
event handler finishes
   ↓
React processes updates
   ↓
next render
```

Batching avoids unnecessary intermediate renders and inconsistent half-updated UI.

## Why three replacements do not mean +3

```jsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

If this render's `count` is `0`, all three expressions calculate `1`.

```text
replace with 1
replace with 1
replace with 1
```

The next state is `1`, not `3`.

## Updater functions

When the next state depends on the previously queued state, use an updater function:

```jsx
setCount(current => current + 1);
setCount(current => current + 1);
setCount(current => current + 1);
```

React processes the queue:

```text
0 → 1 → 2 → 3
```

This is the correct tool when multiple updates must build on each other.

## Replacement and updater operations can mix

Imagine `count === 0`:

```jsx
setCount(count + 5);
setCount(current => current + 1);
```

Conceptually:

```text
replace with 5
then run n => n + 1
result = 6
```

If you later write:

```jsx
setCount(42);
```

that replacement becomes the final queued result after earlier queue processing.

## Updater functions must be pure

React may evaluate updater functions more than once in development Strict Mode to reveal accidental impurity.

Bad:

```jsx
setItems(items => {
  analytics.track('adding item'); // ❌ side effect
  return [...items, newItem];
});
```

Better:

```jsx
analytics.track('adding item');
setItems(items => [...items, newItem]);
```

The side effect belongs in the event handler; the updater only calculates state.

## Async code and snapshots

Snapshots become especially important around `await` and timers.

```jsx
async function handleBuy() {
  setPending(pending + 1);
  await submitOrder();
  setPending(pending - 1);
}
```

The function still has the `pending` snapshot from the render that created it.

If the update depends on the latest queued value, prefer:

```jsx
setPending(value => value + 1);
await submitOrder();
setPending(value => value - 1);
```

## State updates and intentional events

React does not merge separate user interactions into one giant event.

Each click is its own intentional interaction. Batching mainly lets React process the updates generated during a unit of work efficiently.

This matters for safety behavior such as disabling a submit button after one click before another intentional click is handled.

## Derived values are not queued state

Bad:

```jsx
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);
```

If `itemCount` is always `items.length`, derive it:

```jsx
const itemCount = items.length;
```

The fewer synchronized state variables you maintain, the fewer queues can disagree.

## Common mistakes

### Reading state immediately after setting it

```jsx
setOpen(true);
console.log(open); // current render's snapshot
```

### Using updater functions everywhere as ritual

If the next value does not depend on previous state, direct replacement is clearer:

```jsx
setStatus('success');
```

### Using a setter to “force” imperative sequencing

State updates describe future UI. If you need to perform a side effect in response to the current event, do it in the handler rather than waiting for state as a signal.

### Side effects inside updater functions

Updaters should calculate only.

## Debugging stale-state bugs

Ask:

```text
Which render created this handler?
      ↓
What values existed in that render?
      ↓
Am I replacing state or deriving from queued state?
      ↓
Does async code retain an older snapshot?
```

This reasoning is more reliable than adding random dependencies or refs.

## Production example: request counter

```jsx
function OrderButton() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleOrder() {
    setPending(value => value + 1);

    try {
      await submitOrder();
      setCompleted(value => value + 1);
    } finally {
      setPending(value => value - 1);
    }
  }

  return (
    <section>
      <p>Pending: {pending}</p>
      <p>Completed: {completed}</p>
      <button onClick={handleOrder}>Buy</button>
    </section>
  );
}
```

Each completion updates from the latest queued value rather than an old render snapshot.

## Exercise

Predict the next state without running the code:

```jsx
setNumber(number + 5);
setNumber(n => n + 1);
setNumber(n => n * 2);
```

Assume `number` is `0` in the current render.

Then explain your answer using the queue model.

## Interview questions

**Junior:** Why does logging state immediately after a setter show the old value?

**Mid-level:** Why can three `setCount(count + 1)` calls result in only one increment?

**Senior:** How do render snapshots interact with async event handlers, and when are updater functions necessary?

## Summary

```text
state belongs to a render snapshot
setter → queues future state
React batches updates
updater function → derives from queued previous state
```

If you understand snapshots and queues, stale-state behavior becomes predictable.

## References

- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/learn/queueing-a-series-of-state-updates
- https://react.dev/reference/react/useState

## Next

Continue with **[Choosing and Sharing State](./choosing-and-sharing-state.md)**.