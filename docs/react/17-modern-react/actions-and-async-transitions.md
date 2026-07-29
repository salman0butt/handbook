---
title: Actions and Async Transitions
description: Understand React 19 Actions, async Transitions, pending UI, ordering, and where Actions fit relative to events, Effects, and server mutations.
sidebar_position: 1
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Actions and async Transitions

React 19 gives a first-class name and set of patterns to a workflow that modern applications perform constantly.

<VisualDiagram title="Action lifecycle" subtitle="User intent can start async work without turning the resulting UI update into urgent rendering work.">
  <LifecycleBar
    items={[
      { label: 'User intent', tone: 'blue' },
      { label: 'Start Action / Transition', tone: 'purple' },
      { label: 'Async work runs', tone: 'orange' },
      { label: 'Urgent UI stays responsive', tone: 'cyan' },
      { label: 'Pending feedback stays local', tone: 'slate' },
      { label: 'Confirmed result renders', tone: 'green' },
    ]}
  />
</VisualDiagram>

React calls functions executed inside a Transition **Actions**.

An Action is not a replacement for event handlers, Effects, or API functions. It coordinates updates that may include asynchronous work while React treats the resulting UI update as non-urgent.

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

The network request is ordinary JavaScript. The React question is how the UI should behave while it is happening and when its result updates rendered state.

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

<VisualDiagram title="What startTransition changes" compact>
  <DiagramStack align="center">
    <DiagramNode title="startTransition(action)" tone="purple" wide />
    <DiagramArrow label="calls action immediately" />
    <DiagramNode title="Action executes now" tone="blue" wide>It is not delayed like `setTimeout`.</DiagramNode>
    <DiagramArrow label="mark eligible updates" />
    <DiagramNode title="Transition rendering" tone="green" wide>Non-urgent rendering may yield to more urgent interaction.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

`startTransition` changes update priority; it does not postpone the callback.

## Action naming is a convention

A callback intended to run as Transition work can use an `Action` suffix:

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

<VisualDiagram title="Event callback vs Action-shaped callback" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="onClick" tone="blue" eyebrow="Event">Represents the browser/user event boundary.</DiagramNode>
    <DiagramNode title="submitAction" tone="purple" eyebrow="Action">Represents an operation intended to participate in Transition coordination.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The name is a convention, not special JavaScript syntax.

## Actions can contain side effects

A reducer passed to `useReducer` must remain pure. An Action may perform side effects:

```jsx
startTransition(async () => {
  const result = await saveProfile(formValues);
  // state update follows
});
```

That difference matters when comparing `useReducer` with `useActionState`.

## Actions are not Effects

Do not move user-triggered work into an Effect merely because it is asynchronous.

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

<DecisionTree
  question="Where should this work start?"
  items={[
    { label: 'Directly caused by user intent?', value: 'Event handler / Action' },
    { label: 'Must stay synchronized with an external system because rendering changed?', value: 'Effect' },
  ]}
/>

## Pending state

`useTransition` returns:

```jsx
const [isPending, startTransition] = useTransition();
```

Use `isPending` for local feedback:

```jsx
<button disabled={isPending}>
  {isPending ? 'Updating…' : 'Update'}
</button>
```

Pending UI should usually preserve context instead of replacing the whole screen with a global spinner.

## State updates after `await`

A current React limitation matters when an Action awaits asynchronous work.

```jsx
startTransition(async () => {
  const result = await saveSomething();

  setValue(result); // not automatically Transition work today
});
```

Wrap state updates after the `await` in another `startTransition`:

```jsx
startTransition(async () => {
  const result = await saveSomething();

  startTransition(() => {
    setValue(result);
  });
});
```

<VisualDiagram title="Async Transition boundary" compact>
  <DiagramStack align="center">
    <DiagramNode title="startTransition" tone="purple" />
    <DiagramArrow label="await async work" />
    <DiagramNode title="Async boundary" tone="orange">React currently loses automatic Transition marking for later setters.</DiagramNode>
    <DiagramArrow label="wrap setter again" />
    <DiagramNode title="startTransition(() => setState(...))" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

Treat this as a current implementation limitation, not a timeless conceptual rule.

## Urgent vs non-urgent updates

<VisualDiagram title="Update priority" subtitle="Transitions are for work that can yield to more urgent interaction.">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent" tone="blue">Controlled typing · direct pointer interaction · immediate button/menu feedback.</DiagramNode>
    <DiagramNode title="Transition candidate" tone="purple">Navigation · expensive tab content · mutation result rendering · background recalculation.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not put controlled input state itself in a Transition:

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  function handleChange(event) {
    setQuery(event.target.value); // immediate
  }

  return <input value={query} onChange={handleChange} />;
}
```

Use synchronous state for the input. `useDeferredValue` or a separate Transition-backed result can lag behind without making typing lag.

## Action props

Reusable components can own pending presentation while callers provide domain behavior:

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

<SaveButton action={() => saveProfile(profile)} />
```

## Request ordering still matters

Raw async Transitions do not automatically solve race conditions.

<VisualDiagram title="Out-of-order async completion" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Request A" tone="orange">Starts first · finishes last.</DiagramNode>
    <DiagramNode title="Request B" tone="green">Starts second · finishes first.</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="blindly committing both can overwrite newer state" />
  <DiagramNode title="Ordering strategy required" tone="red" wide>Use a higher-level ordered Action model or explicit request identity/cancellation when correctness depends on recency.</DiagramNode>
</VisualDiagram>

`useActionState` and form Actions help with common ordered mutation flows. Custom async Transition code may still need explicit request-ordering logic.

## Common mistakes

- Using Actions for every async function. A normal async event handler is still valid.
- Treating Transition work as delayed work. The callback runs immediately.
- Ignoring failures. Expected validation/domain errors need a user-facing state model; unexpected failures need an error strategy.
- Showing pending UI too broadly. Keep feedback close to the operation.
- Using Transition state to control text inputs.

## Production decision guide

<DecisionTree
  question="Do I need an Action / Transition?"
  items={[
    { label: 'Async work does not update React UI?', value: 'Ordinary async function may be enough' },
    { label: 'UI update is immediate and cheap?', value: 'Normal state update may be enough' },
    { label: 'Update should be non-blocking and expose pending UI?', value: 'Transition / Action pattern' },
    { label: 'Mutation result depends on previous Action result?', value: 'Consider useActionState' },
  ]}
/>

## Interview questions

**Junior:** What does `startTransition` change about a state update?

**Mid-level:** Why should controlled input state usually not be updated inside a Transition?

**Senior:** What race conditions can remain when building custom async Actions, and when would `useActionState` be a better abstraction?

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/blog/2024/12/05/react-19

## Next

Continue with **[useActionState](./use-action-state.md)** to manage Action result state, pending state, and ordered updates.
