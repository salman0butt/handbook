---
title: Optimistic UI with useOptimistic
description: Learn React 19 optimistic state, Action-scoped updates, reducers, rollback behavior, pending item design, and when optimistic UI is appropriate.
sidebar_position: 4
---

# Optimistic UI with `useOptimistic`

Optimistic UI shows the user an expected result **before** the underlying Action has finished.

```text
user clicks Like
      ↓
UI shows liked immediately
      ↓
request is still pending
      ↓
success → canonical state catches up
failure → UI falls back to canonical state
```

React 19 provides `useOptimistic` for this pattern.

```jsx
const [optimisticState, setOptimistic] = useOptimistic(value);
```

Or with a reducer:

```jsx
const [optimisticState, dispatchOptimistic] = useOptimistic(
  value,
  reducer,
);
```

## Optimistic state is temporary

The most important mental model is:

```text
canonical value
   ↓
useOptimistic(value)
   ↓
Action starts
   ↓
temporary optimistic projection
   ↓
Action ends
   ↓
render canonical value again
```

`useOptimistic` does not replace the source of truth.

It layers temporary UI state on top of the canonical value while an Action is pending.

## Basic example

```jsx
import {startTransition, useOptimistic, useState} from 'react';

function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);

  function handleClick() {
    const nextLiked = !optimisticLiked;

    startTransition(async () => {
      setOptimisticLiked(nextLiked);

      const saved = await saveLike(nextLiked);

      startTransition(() => {
        setLiked(saved.liked);
      });
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticLiked ? '♥ Liked' : '♡ Like'}
    </button>
  );
}
```

The user sees feedback immediately even though the canonical `liked` state changes only after confirmation.

## The setter must run inside an Action

This is not the intended usage:

```jsx
setOptimisticLiked(true); // 🚩 outside Action/Transition
```

Use:

```jsx
startTransition(() => {
  setOptimisticLiked(true);
});
```

Or call it from a function Action such as a form Action, where Action context already exists.

## Why optimistic state reverts automatically

Suppose the canonical value is:

```jsx
const liked = false;
```

During the Action you set:

```jsx
setOptimisticLiked(true);
```

React temporarily renders `true`.

When the Action finishes, `useOptimistic` goes back to the `value` argument passed by the component.

If the canonical state was updated to `true`, both agree.

If the request failed and canonical state is still `false`, the optimistic projection disappears and the UI returns to `false`.

This gives rollback behavior without a separate manual “undo optimistic state” setter for the basic case.

## Canonical state still owns truth

Bad mental model:

```text
optimistic state becomes the real state
```

Better:

```text
real state / props
      ↓
optimistic projection while Action pending
```

If the server changes or rejects the value, canonical state wins.

## Use a reducer for related optimistic updates

A reducer is useful when one user intent changes multiple related values.

```jsx
function optimisticReducer(state, action) {
  switch (action.type) {
    case 'follow':
      return {
        ...state,
        following: true,
        followerCount: state.followerCount + 1,
      };

    case 'unfollow':
      return {
        ...state,
        following: false,
        followerCount: state.followerCount - 1,
      };

    default:
      return state;
  }
}
```

Then:

```jsx
const [optimisticUser, dispatchOptimistic] = useOptimistic(
  user,
  optimisticReducer,
);
```

This keeps related fields consistent.

## Why reducers matter when base state changes

Suppose an optimistic item is added while the canonical list also receives new data from elsewhere.

A reducer can be re-applied to the latest base value:

```jsx
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (currentTodos, newTodo) => [
    ...currentTodos,
    {...newTodo, pending: true},
  ],
);
```

This is safer than assuming the base list is frozen for the entire Action.

## Optimistic list insertion

```jsx
function TodoList({todos, addTodoAction}) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      {...newTodo, pending: true},
    ],
  );

  function handleAdd(text) {
    const optimisticTodo = {
      id: crypto.randomUUID(),
      text,
    };

    startTransition(async () => {
      addOptimisticTodo(optimisticTodo);
      await addTodoAction(optimisticTodo);
    });
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          {todo.pending && ' (Adding…)'}
        </li>
      ))}
    </ul>
  );
}
```

## Stable optimistic identity

When creating temporary list items, use a stable temporary ID.

Bad:

```jsx
{id: Math.random()}
```

Better:

```jsx
{id: crypto.randomUUID()}
```

Or use a client-generated ID strategy that the server can preserve or map predictably.

Stable identity matters for:

- list keys;
- pending styling;
- focus;
- editing;
- reconciliation;
- replacing the temporary record with the confirmed record.

## Optimistic delete

Deletion is trickier because removing something immediately may hide the object needed for retry.

A safer optimistic reducer can retain metadata:

```jsx
function reducer(items, action) {
  switch (action.type) {
    case 'delete':
      return items.map(item =>
        item.id === action.id
          ? {...item, pendingDelete: true}
          : item,
      );

    default:
      return items;
  }
}
```

Then the UI may fade/disable the item rather than removing it instantly.

The right optimistic design depends on recovery needs.

## Failure UX

Automatic rollback does not automatically explain the failure to the user.

You still need an error strategy.

```text
optimistic projection
      ↓
request fails
      ↓
canonical state remains unchanged
      ↓
optimistic projection disappears
      ↓
show understandable error + retry path
```

Avoid silent “snap back” behavior for important operations.

## When optimistic UI is appropriate

Good candidates:

- likes/reactions;
- follow/unfollow;
- adding lightweight items;
- toggling preferences;
- low-risk ordering changes;
- operations with a high success rate and clear rollback.

Less suitable without careful design:

- payments;
- destructive irreversible operations;
- inventory reservation;
- security-sensitive permission changes;
- legal/financial confirmation states;
- operations where failure is common or expensive.

The question is not “Can we make this optimistic?”

Ask:

> Would temporarily showing success before confirmation create misleading or dangerous UX?

## Optimistic state vs loading state

Loading state says:

```text
I am waiting.
```

Optimistic state says:

```text
I expect this result, so I will show it now while confirmation happens.
```

They solve different UX problems.

You may use both:

```jsx
<li className={todo.pending ? 'pending' : ''}>
  {todo.text}
  {todo.pending && <span>Saving…</span>}
</li>
```

## `useOptimistic` and `useActionState`

A common architecture:

```text
server/canonical state
        ↓
useActionState manages mutation result
        ↓
useOptimistic projects immediate UI
        ↓
confirmed state replaces projection
```

Example:

```jsx
const [cart, cartAction, isPending] = useActionState(saveCart, initialCart);
const [optimisticCart, updateOptimisticCart] = useOptimistic(cart, cartReducer);
```

They are complementary, not competitors.

## Optimistic state and concurrent updates

A senior-level concern is what happens when:

1. an optimistic Action is pending;
2. canonical data changes independently;
3. the optimistic projection must still apply correctly.

Reducer-based optimistic state is valuable because React can calculate the projection against the latest base value.

This is why optimistic state design should be based on **intent**, not copied snapshots.

Better:

```jsx
{type: 'add', item: newItem}
```

Less robust:

```jsx
{entireNextArray: staleArray}
```

## Do not mutate canonical state

Bad:

```jsx
function optimisticReducer(items, newItem) {
  items.push(newItem); // ❌
  return items;
}
```

Good:

```jsx
function optimisticReducer(items, newItem) {
  return [...items, newItem];
}
```

The optimistic reducer should remain pure.

## Common mistakes

### Using optimistic state as permanent state

The `value` argument remains the canonical source.

### Calling the setter outside an Action

Wrap the update in `startTransition` or use it inside an Action prop.

### Optimistically confirming high-risk operations

Do not show “Payment completed” before payment actually completes.

### No failure feedback

Rollback without explanation can look like a bug.

### Unstable list keys

Temporary items still need stable identity.

### Copying stale base state

Prefer reducer intent when the canonical value may change during the Action.

## Production decision guide

```text
Should UI wait for confirmation?
  ├─ yes → pending/loading state
  └─ no
      ↓
Is expected result safe to show temporarily?
  ├─ no → do not use optimistic UI
  └─ yes
      ↓
Can result be cleanly reconciled/rolled back?
  ├─ no → redesign mutation UX
  └─ yes → useOptimistic may fit
```

## Interview questions

**Junior:** What happens to optimistic state after the Action completes?

**Mid-level:** Why can a reducer be safer than passing a complete optimistic value when base state may change?

**Senior:** Which product operations should not use optimistic UI, and how would you design failure recovery for optimistic list mutations?

## References

- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useTransition

## Next

Continue with **[`use` and Suspense Resources](./use-api-and-resources.md)**.