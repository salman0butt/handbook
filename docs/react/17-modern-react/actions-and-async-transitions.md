---
title: Actions and Async Transitions
description: Understand React 19 Actions, async Transitions, pending UI, ordering, and where Actions fit relative to events, Effects, and server mutations.
sidebar_position: 1
---

# Actions and async Transitions

React 19 gives a first-class name and set of patterns to a workflow that modern applications perform constantly:

```text
user intent
   ↓
start async work
   ↓
keep urgent UI responsive
   ↓
show pending feedback
   ↓
commit confirmed result
```

React calls functions executed inside a Transition **Actions**.

An Action is not a replacement for event handlers, Effects, or API functions. It is a way to coordinate updates that may include asynchronous work while React treats the resulting UI update as non-urgent.

## Start with the problem

Imagine changing the quantity of an item:

```jsx
async function updateQuantity(nextQuantity) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({quantity: nextQuantity}),
  });

  return response.json();
}
```

The network request itself is ordinary JavaScript. The React-specific question is:

> How should the UI behave while that operation is happening and when its result updates rendered state?

React 19's Action model connects this workflow to Transitions.

## `useTransition`

```jsx
import {useState, useTransition} from 'react';

function QuantityEditor() {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  function saveQuantity(nextQuantity) {
    startTransition(async () => {
      const saved = await updateQuantity(nextQuantity);

      startTransition(() => {
        setQuantity(saved.quantity);
      });
    });
  }

  return (
    <button disabled={isPending} onClick={() => saveQuantity(quantity + 1)}>
      {isPending ? 'Saving…' : `Quantity: ${quantity}`}
    </button>
  );
}
```

The important mental model is:

```text
startTransition(action)
        ↓
React executes action immediately
        ↓
updates marked as Transition work
        ↓
urgent interactions remain interruptible
```

`startTransition` does **not** delay your callback like `setTimeout`.

## Why call these functions Actions?

By convention, a callback intended to run inside a Transition can be named with an `Action` suffix:

```jsx
function SubmitButton({submitAction}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}
```

This makes the component contract clearer:

```text
onClick       → event callback
submitAction  → operation intended to run as Transition work
```

The name is a convention, not special JavaScript syntax.

## Actions can contain side effects

A reducer passed to `useReducer` must remain pure.

An Action may perform side effects:

```jsx
startTransition(async () => {
  const result = await saveProfile(formValues);
  // state update follows
});
```

That difference becomes especially important when comparing `useReducer` with `useActionState` later.

## Actions are not Effects

Do not move user-triggered work into `useEffect` just because it is asynchronous.

Bad:

```jsx
useEffect(() => {
  if (shouldSave) {
    saveProfile();
  }
}, [shouldSave]);
```

Better:

```jsx
function handleSave() {
  startTransition(async () => {
    await saveProfile();
  });
}
```

Use this decision rule:

```text
user caused it directly?     → event handler / Action
external system must stay
synchronized with rendering? → Effect
```

## Pending state

`useTransition` returns:

```jsx
const [isPending, startTransition] = useTransition();
```

`isPending` lets the UI communicate background work:

```jsx
<button disabled={isPending}>
  {isPending ? 'Updating…' : 'Update'}
</button>
```

Pending UI should usually preserve context instead of replacing the whole screen with a spinner.

## Important current limitation after `await`

React's current Transition behavior has an important caveat.

```jsx
startTransition(async () => {
  const result = await saveSomething();

  setValue(result); // not automatically marked as a Transition today
});
```

For state updates after an `await`, wrap them in another `startTransition`:

```jsx
startTransition(async () => {
  const result = await saveSomething();

  startTransition(() => {
    setValue(result);
  });
});
```

Treat this as a current limitation, not a timeless design rule.

## Urgent vs non-urgent updates

Transitions are for work that can yield to urgent interaction.

Typical urgent updates:

- typing into a controlled input;
- clicking a button;
- opening a menu;
- direct pointer interaction.

Typical Transition candidates:

- navigation;
- expensive tab content changes;
- mutation result rendering;
- background recalculation of large UI regions.

## Do not put controlled input state in a Transition

Bad:

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  function handleChange(event) {
    startTransition(() => {
      setQuery(event.target.value); // ❌ input state should be immediate
    });
  }

  return <input value={query} onChange={handleChange} />;
}
```

Use synchronous state for the input itself. Later, `useDeferredValue` or a second Transition-backed value can make expensive results lag behind without making typing lag.

## Action props

A reusable component can expose an Action-shaped prop:

```jsx
function SaveButton({action}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await action();
        });
      }}
    >
      {isPending ? 'Saving…' : 'Save'}
    </button>
  );
}
```

Then callers provide behavior rather than duplicating pending-state plumbing.

```jsx
<SaveButton action={() => saveProfile(profile)} />
```

## Request ordering matters

Raw async Transitions do not automatically solve every race condition.

```text
request A starts
request B starts
request B finishes
request A finishes later
```

If both blindly commit state, the older result can overwrite the newer one.

React provides higher-level tools such as `useActionState` and form Actions for common ordered mutation flows, but custom async Transition code may still need explicit request-ordering logic.

## Actions compose

A component may await another Action-shaped callback:

```jsx
function TabButton({action, children}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await action();
        });
      }}
    >
      {children}
    </button>
  );
}
```

This lets UI primitives own pending presentation while feature code owns domain behavior.

## Common mistakes

### Using Actions for everything async

A plain async event handler is still valid:

```jsx
async function handleDownload() {
  await downloadFile();
}
```

Use an Action when the operation participates in React state/render coordination where Transition semantics help.

### Treating Transition work as delayed work

`startTransition` calls its function immediately. It changes how React prioritizes state updates; it does not schedule the callback for later.

### Ignoring failures

Production Actions need an error strategy:

- return expected validation/domain errors as state;
- throw unexpected errors to an Error Boundary where appropriate;
- preserve enough context for retry.

### Showing pending UI too broadly

Avoid disabling an entire application because one small mutation is pending. Keep feedback close to the operation when possible.

## Production decision guide

```text
Need async operation?
      ↓
Does it update React UI?
  ├─ no → ordinary async function may be enough
  └─ yes
       ↓
Should update remain non-blocking / expose pending UI?
  ├─ no → normal state update may be enough
  └─ yes → Transition / Action pattern
                 ↓
Common mutation with ordered result state?
  ├─ yes → consider useActionState
  └─ no  → custom useTransition/startTransition flow
```

## Interview questions

**Junior:** What does `startTransition` change about a state update?

**Mid-level:** Why should controlled input state usually not be updated inside a Transition?

**Senior:** What race conditions can remain when building custom async Actions, and when would `useActionState` be a better abstraction?

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/blog/2024/12/05/react-19

## Next

Continue with **[useActionState](./use-action-state.md)** to manage the result, pending state, and ordering of Actions.