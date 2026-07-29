---
title: useActionState
description: Learn how React 19 useActionState models Action results, pending state, ordered updates, form integration, and expected versus unexpected errors.
sidebar_position: 2
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

# `useActionState`

`useActionState` manages **state produced by Actions**.

```jsx
const [state, dispatchAction, isPending] = useActionState(
  reducerAction,
  initialState,
);
```

<VisualDiagram title="useReducer vs useActionState" subtitle="They both calculate next state, but they solve different lifecycle problems.">
  <DiagramGrid columns={2}>
    <DiagramNode title="useReducer" tone="blue" eyebrow="Pure UI transitions">Pure reducer · no side effects · synchronous state transition model.</DiagramNode>
    <DiagramNode title="useActionState" tone="purple" eyebrow="Action result state">Reducer Action may be async · may perform side effects · exposes pending state · queues Action calls.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Basic example

```jsx
import {useActionState, startTransition} from 'react';

async function updateName(previousState, nextName) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify({name: nextName}),
  });

  if (!response.ok) {
    return {...previousState, error: 'Could not update name'};
  }

  const user = await response.json();
  return {name: user.name, error: null};
}

function ProfileEditor() {
  const [state, dispatchAction, isPending] = useActionState(
    updateName,
    {name: 'Ada', error: null},
  );

  function handleSave() {
    startTransition(() => {
      dispatchAction('Grace');
    });
  }

  return (
    <section>
      <p>{state.name}</p>
      <button disabled={isPending} onClick={handleSave}>
        {isPending ? 'Saving…' : 'Save Grace'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </section>
  );
}
```

## Reducer Action mental model

<VisualDiagram title="How one dispatch becomes Action result state" compact>
  <DiagramStack align="center">
    <DiagramNode title="Previous Action state" tone="slate" />
    <DiagramArrow label="+ action payload" />
    <DiagramNode title="reducerAction(previousState, payload)" tone="purple" wide>May perform side effects and may be async.</DiagramNode>
    <DiagramArrow label="return result" />
    <DiagramNode title="Next Action state" tone="green" />
  </DiagramStack>
</VisualDiagram>

Unlike a `useReducer` reducer, the reducer Action can perform side effects:

```jsx
async function cartAction(previousCart, payload) {
  const savedCart = await saveCartChange(payload);
  return savedCart;
}
```

## Dispatch must happen inside an Action

Wrong:

```jsx
dispatchAction(payload); // ❌ outside an Action
```

Use `startTransition`:

```jsx
startTransition(() => {
  dispatchAction(payload);
});
```

Or pass the dispatcher to an Action prop such as a form:

```jsx
<form action={dispatchAction}>
  ...
</form>
```

## Pending state

```jsx
const [state, dispatchAction, isPending] = useActionState(action, initialState);
```

`isPending` belongs to the Action lifecycle for that Hook. Avoid duplicating the same concept with another `isSubmitting` flag unless it represents something different.

## Sequential Action ordering

Multiple dispatches are queued and processed sequentially.

<VisualDiagram title="Queued useActionState calls" subtitle="Each reducer Action receives the result of the previous call.">
  <LifecycleBar
    items={[
      { label: 'Dispatch A', tone: 'blue' },
      { label: 'Run A with previous state', tone: 'purple' },
      { label: 'Result A', tone: 'green' },
      { label: 'Dispatch B consumes Result A', tone: 'orange' },
      { label: 'Result B becomes state', tone: 'green' },
    ]}
  />
</VisualDiagram>

This ordering is useful when each operation logically depends on the previous result.

```jsx
async function quantityAction(previousQuantity, type) {
  if (type === 'add') return await addOne(previousQuantity);
  if (type === 'remove') return await removeOne(previousQuantity);
  return previousQuantity;
}
```

If operations should run independently or in parallel, consider a different model such as `useState` + `useTransition`, request-specific state, a server-state library, or a domain-specific mutation queue.

## Action payloads

Payloads can be simple or structured:

```jsx
dispatchAction({
  type: 'rename',
  productId: 'p-17',
  name: 'Mechanical Keyboard',
});
```

Choose a shape that communicates intent; do not copy reducer conventions mechanically.

## Form integration

The returned Action can be passed directly to a form:

```jsx
async function submitContact(previousState, formData) {
  const email = formData.get('email');

  if (!email) {
    return {message: 'Email is required'};
  }

  await saveContact(email);
  return {message: 'Saved'};
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    {message: null},
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>Save</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

The reducer Action receives `previousState` first and the `FormData` payload second.

## Expected vs unexpected errors

<VisualDiagram title="Error ownership" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Expected user/domain outcome" tone="orange">Validation error · out of stock · rejected business rule → return structured Action state.</DiagramNode>
    <DiagramNode title="Unexpected failure" tone="red">Programming/system failure → throw when an Error Boundary and monitoring strategy should handle it.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Example expected outcome:

```jsx
async function checkoutAction(previousState, formData) {
  const result = await checkout(formData);

  if (result.type === 'out-of-stock') {
    return {
      ...previousState,
      error: 'One item is no longer available',
    };
  }

  return {error: null, orderId: result.orderId};
}
```

Keep the returned state shape stable and intentional.

## Reset behaviour

`useActionState` does not expose a generic reset function. Possible designs include:

- dispatching an explicit reset payload;
- remounting with a different `key` when identity should reset;
- relying on appropriate successful form reset behaviour for browser-owned fields;
- moving canonical state to a different owner when that better matches the architecture.

## Progressive enhancement and `permalink`

The optional `permalink` argument supports a specific React Server Components + Server Function progressive-enhancement scenario:

```jsx
useActionState(action, initialState, '/profile');
```

Do not add it to ordinary client-only applications without that server-rendered workflow.

## Server Functions are not required

`useActionState` can also work with client-side async Actions. It is a React Action-state primitive; Server Functions add server integration and progressive-enhancement capabilities.

## `useActionState` + `useOptimistic`

<VisualDiagram title="Confirmed state and optimistic projection" compact>
  <DiagramStack align="center">
    <DiagramNode title="useActionState" tone="purple">Owns confirmed Action result + pending lifecycle + ordered Action state.</DiagramNode>
    <DiagramArrow label="canonical value becomes base" />
    <DiagramNode title="useOptimistic" tone="orange">Projects an immediate temporary UI assumption while the Action is pending.</DiagramNode>
    <DiagramArrow label="Action settles" />
    <DiagramNode title="Canonical result wins" tone="green" />
  </DiagramStack>
</VisualDiagram>

```jsx
const [cart, cartAction, isPending] = useActionState(saveCart, initialCart);
const [optimisticCart, updateOptimisticCart] = useOptimistic(cart, cartReducer);
```

They are complementary, not competing Hooks.

## Common mistakes

- Treating `useActionState` as a replacement for `useState`.
- Putting ordinary modal/tab/hover state in side-effectful Action logic.
- Forgetting sequential queue semantics.
- Returning incompatible state shapes.
- Calling `dispatchAction` outside an Action/Transition.
- Throwing expected validation errors when the UI should render them as state.

## Production decision guide

<DecisionTree
  question="Does useActionState fit this workflow?"
  items={[
    { label: 'State is specifically the result of a user Action?', value: 'Good candidate' },
    { label: 'Need pending state tied to that Action?', value: 'Good candidate' },
    { label: 'Sequential previous-result ordering is meaningful?', value: 'Strong fit' },
    { label: 'Actions should run independently in parallel?', value: 'Use a different mutation model' },
    { label: 'Need immediate temporary feedback?', value: 'Pair with useOptimistic' },
  ]}
/>

## Interview questions

**Junior:** What are the three values returned by `useActionState`?

**Mid-level:** How is the function passed to `useActionState` different from a `useReducer` reducer?

**Senior:** Why are queued `useActionState` Actions sequential, and when would that behaviour be the wrong fit?

## References

- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react-dom/components/form

## Next

Continue with **[Form Actions and useFormStatus](./form-actions-and-use-form-status.md)**.
