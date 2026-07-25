---
title: useActionState
description: Learn how React 19 useActionState models Action results, pending state, ordered updates, form integration, and expected versus unexpected errors.
sidebar_position: 2
---

# `useActionState`

`useActionState` manages **state produced by Actions**.

```jsx
const [state, dispatchAction, isPending] = useActionState(
  reducerAction,
  initialState,
);
```

It looks superficially similar to `useReducer`, but the two Hooks solve different problems.

```text
useReducer
  → pure UI state transitions

useActionState
  → Action result state
  → may perform side effects
  → may be async
  → exposes pending state
  → orders queued Actions
```

## Basic example

```jsx
import {useActionState, startTransition} from 'react';

async function updateName(previousState, nextName) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify({name: nextName}),
  });

  if (!response.ok) {
    return {
      ...previousState,
      error: 'Could not update name',
    };
  }

  const user = await response.json();

  return {
    name: user.name,
    error: null,
  };
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

## The reducer Action

The first argument receives:

```text
previous state
+
action payload
↓
next state
```

Unlike a `useReducer` reducer, this function is allowed to perform side effects and be asynchronous.

```jsx
async function cartAction(previousCart, payload) {
  const savedCart = await saveCartChange(payload);
  return savedCart;
}
```

That is why React's documentation describes it as a **reducer Action** rather than an ordinary reducer.

## `useReducer` vs `useActionState`

### `useReducer`

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {...state, count: state.count + 1};
    default:
      return state;
  }
}
```

Requirements:

- pure;
- deterministic;
- no network requests;
- no analytics;
- no imperative side effects.

### `useActionState`

```jsx
async function reducerAction(previousState, payload) {
  const result = await save(payload);
  return result;
}
```

This function exists specifically to model a side-effectful Action and its resulting state.

## Dispatch must happen inside an Action

This is wrong:

```jsx
dispatchAction(payload); // ❌ outside an Action
```

Use `startTransition`:

```jsx
startTransition(() => {
  dispatchAction(payload);
});
```

Or pass the returned dispatcher to an Action prop such as a React form:

```jsx
<form action={dispatchAction}>
  ...
</form>
```

Action props already run in the Action/Transition model.

## Pending state

The third returned value tells you whether Action work for this Hook is pending:

```jsx
const [state, dispatchAction, isPending] = useActionState(action, initialState);
```

Use it for local feedback:

```jsx
<button disabled={isPending}>
  {isPending ? 'Adding…' : 'Add to cart'}
</button>
```

Do not invent a duplicate `isSubmitting` state unless you actually need a different concept.

## Sequential Action ordering

A major behavior to understand is that multiple dispatches are queued and processed sequentially.

```text
dispatch A
   ↓
reducerAction(previousState, A)
   ↓
result A
   ↓
dispatch B uses result A as previousState
```

This is useful when each operation logically depends on the previous result.

Example:

```jsx
async function quantityAction(previousQuantity, type) {
  if (type === 'add') {
    return await addOne(previousQuantity);
  }

  if (type === 'remove') {
    return await removeOne(previousQuantity);
  }

  return previousQuantity;
}
```

## When sequential ordering is a trade-off

Suppose the user clicks four times and every request takes one second.

`useActionState` may intentionally execute those Actions one after another because each receives the previous result.

That gives correctness for reducer-style Action state, but it is not ideal for every workload.

If operations should run independently or in parallel, a different model may be better:

- `useState` + `useTransition`;
- request-specific state;
- a server-state library;
- a domain-specific mutation queue.

## Action payloads

You can dispatch any suitable payload:

```jsx
dispatchAction({
  type: 'rename',
  productId: 'p-17',
  name: 'Mechanical Keyboard',
});
```

Then branch inside the Action:

```jsx
async function productAction(previousState, action) {
  switch (action.type) {
    case 'rename':
      return await renameProduct(previousState, action);
    case 'archive':
      return await archiveProduct(previousState, action);
    default:
      return previousState;
  }
}
```

Do not blindly copy reducer action objects if a simpler payload communicates intent more clearly.

## Form integration

`useActionState` is especially useful with function-valued form `action` props.

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

In this pattern, the Action receives `FormData` as its payload.

## Expected errors vs unexpected errors

Treat known business outcomes as state.

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

Unexpected programmer/system failures may be thrown:

```jsx
async function checkoutAction(previousState, formData) {
  const result = await checkout(formData);

  if (!result) {
    throw new Error('Checkout returned no result');
  }

  return result;
}
```

Thrown errors can flow to the nearest Error Boundary.

## Do not mix validation and exceptions carelessly

Bad model:

```text
invalid email → throw
out of stock  → throw
network down   → throw
undefined bug  → throw
```

A better model distinguishes expected user-correctable outcomes from unexpected failures.

```text
validation/domain problem → return structured state
unexpected failure        → throw / error boundary / monitoring
```

## State shape matters

Avoid returning unrelated primitive values from different code paths.

Hard to maintain:

```jsx
return 'Saved';
return null;
return false;
return {error: 'Failed'};
```

Prefer a stable state shape:

```jsx
return {
  status: 'success',
  message: 'Saved',
  data: result,
};
```

Or:

```jsx
return {
  status: 'error',
  message: 'Could not save',
  data: previousState.data,
};
```

This gives rendering code a predictable contract.

## Reset behavior

`useActionState` does not give you a generic reset function.

Possible designs include:

1. dispatching an explicit reset payload;
2. remounting the component with a different `key`;
3. designing form behavior so successful submission naturally resets browser-owned form fields;
4. lifting canonical state to the appropriate owner.

Example explicit reset:

```jsx
const initialState = {status: 'idle', message: null};

async function action(previousState, payload) {
  if (payload.type === 'reset') {
    return initialState;
  }

  // mutation...
}
```

## Progressive enhancement and `permalink`

`useActionState` accepts an optional third `permalink` argument for a specific server-rendered progressive-enhancement scenario.

```jsx
useActionState(action, initialState, '/profile');
```

This matters when:

- the page uses React Server Components;
- the Action is a Server Function;
- a form may submit before JavaScript has hydrated;
- the framework can navigate to the canonical URL and preserve the Action result.

This is framework/RSC territory. Do not add `permalink` to ordinary client-only Vite forms without a reason.

## Server Functions are not required for the Hook

`useActionState` can be useful with client-side async functions too.

Do not teach:

> `useActionState` is only for server actions.

The Hook is a React Action-state primitive. Server Functions add additional server integration and progressive-enhancement capabilities.

## `useActionState` + `useOptimistic`

These Hooks complement each other:

```text
useActionState
  → confirmed Action result
  → pending lifecycle
  → ordered Action state

useOptimistic
  → temporary immediate UI assumption
  → converges back to canonical state
```

Example mental model:

```text
click Add
  ↓
optimistic count: 4 immediately
  ↓
server Action pending
  ↓
confirmed count: 4
```

We cover this in the optimistic UI chapter.

## Common mistakes

### Treating it as a drop-in replacement for `useState`

It is not the default state Hook. Use it when state is specifically the result of Actions.

### Putting pure UI state in side-effectful Action logic

Modal visibility, active tabs, and hover state usually belong in normal React state.

### Forgetting queue semantics

Repeated dispatches are not automatically independent parallel requests.

### Returning incompatible state shapes

Keep the returned state type stable and intentional.

### Calling the dispatcher outside an Action

Wrap it in `startTransition` or use it through an Action prop.

## Production checklist

Before choosing `useActionState`, ask:

```text
Is this state the result of a user Action?
Is the Action sync or async?
Do I want pending state tied to that Action?
Does sequential ordering make sense?
Can expected errors be represented as state?
Would optimistic UI improve responsiveness?
Is this client-only, or am I using framework/RSC progressive enhancement?
```

## Interview questions

**Junior:** What are the three values returned by `useActionState`?

**Mid-level:** How is the function passed to `useActionState` different from a `useReducer` reducer?

**Senior:** Why are queued `useActionState` Actions sequential, and when would that behavior be the wrong fit?

## References

- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react-dom/components/form

## Next

Continue with **[Form Actions and useFormStatus](./form-actions-and-use-form-status.md)**.