---
title: Optimistic UI with useOptimistic
description: Learn React 19 optimistic state, Action-scoped updates, reducers, rollback behavior, pending item design, and when optimistic UI is appropriate.
sidebar_position: 4
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

# Optimistic UI with `useOptimistic`

Optimistic UI shows the user an expected result **before** the underlying Action has finished.

<VisualDiagram title="Optimistic mutation lifecycle" subtitle="The UI temporarily projects the expected result while canonical state is still being confirmed.">
  <LifecycleBar
    items={[
      { label: 'User intent', tone: 'blue' },
      { label: 'Optimistic projection appears', tone: 'orange' },
      { label: 'Action remains pending', tone: 'purple' },
      { label: 'Canonical result arrives', tone: 'green' },
      { label: 'Projection converges or rolls back', tone: 'cyan' },
    ]}
  />
</VisualDiagram>

React provides `useOptimistic` for this pattern:

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

<VisualDiagram title="Canonical state remains the source of truth" compact>
  <DiagramStack align="center">
    <DiagramNode title="Canonical value" tone="green" wide>Props/state/cache value that actually owns the data.</DiagramNode>
    <DiagramArrow label="Action starts" />
    <DiagramNode title="Optimistic projection" tone="orange" wide>Temporary expected UI layered on top of the canonical value.</DiagramNode>
    <DiagramArrow label="Action settles" />
    <DiagramNode title="Canonical value renders again" tone="green" wide>Success catches up; failure naturally removes the projection.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

`useOptimistic` does not replace the source of truth.

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

The user sees immediate feedback while the canonical `liked` state waits for confirmation.

## Optimistic updates belong inside an Action

Incorrect:

```jsx
setOptimisticLiked(true); // 🚩 outside Action/Transition
```

Use:

```jsx
startTransition(() => {
  setOptimisticLiked(true);
});
```

A function-valued Action prop also provides Action context.

## Why rollback can happen automatically

Suppose canonical `liked` is still `false`, while the optimistic projection temporarily shows `true`.

<VisualDiagram title="Success vs failure convergence" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Success" tone="green">Canonical state changes to the optimistic result, so the projection and source agree.</DiagramNode>
    <DiagramNode title="Failure" tone="red">Canonical state stays unchanged, so the temporary projection disappears when the Action ends.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Automatic rollback does not automatically explain the failure. Important operations still need understandable error and retry UX.

## Use a reducer for related optimistic updates

A reducer helps one intent update several related values consistently:

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

const [optimisticUser, dispatchOptimistic] = useOptimistic(
  user,
  optimisticReducer,
);
```

The reducer should remain pure and immutable.

## Why intent-based reducers matter

Canonical data may change from somewhere else while an optimistic Action is still pending.

<VisualDiagram title="Project intent onto the latest base" compact>
  <DiagramStack align="center">
    <DiagramNode title="Latest canonical base" tone="green" wide />
    <DiagramArrow label="re-apply optimistic intent" />
    <DiagramNode title="Optimistic reducer" tone="purple" wide>`add item` · `follow` · `mark pending delete`</DiagramNode>
    <DiagramArrow />
    <DiagramNode title="Current optimistic projection" tone="orange" wide />
  </DiagramStack>
</VisualDiagram>

Prefer representing **intent** over copying an entire stale next-state snapshot.

Better:

```jsx
{type: 'add', item: newItem}
```

Less robust:

```jsx
{entireNextArray: staleArray}
```

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

Stable temporary identity matters for keys, focus, editing, pending styling, and reconciling the confirmed item.

## Optimistic delete needs recovery design

Removing an item immediately may hide the information required for retry. A safer design can mark it as pending deletion:

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

The UI can fade or disable the item while keeping enough context for recovery.

## Failure UX

<VisualDiagram title="Failure should be visible, not mysterious" compact>
  <LifecycleBar
    items={[
      { label: 'Show optimistic result', tone: 'orange' },
      { label: 'Request fails', tone: 'red' },
      { label: 'Canonical state remains unchanged', tone: 'slate' },
      { label: 'Projection disappears', tone: 'cyan' },
      { label: 'Explain error + offer recovery', tone: 'blue' },
    ]}
  />
</VisualDiagram>

Avoid unexplained “snap back” behaviour for meaningful operations.

## Loading vs optimistic state

<VisualDiagram title="Two different UX statements" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Pending/loading" tone="blue">“I am waiting for confirmation.”</DiagramNode>
    <DiagramNode title="Optimistic" tone="orange">“I expect this result, so I will show it while confirmation happens.”</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

You can use both: show the optimistic item immediately while marking it as pending.

## `useOptimistic` + `useActionState`

<VisualDiagram title="Complementary Action primitives" compact>
  <DiagramStack align="center">
    <DiagramNode title="useActionState" tone="purple">Confirmed Action result + pending lifecycle + ordered result state.</DiagramNode>
    <DiagramArrow label="provides canonical base" />
    <DiagramNode title="useOptimistic" tone="orange">Immediate temporary projection.</DiagramNode>
    <DiagramArrow label="confirmation" />
    <DiagramNode title="Canonical state replaces projection" tone="green" />
  </DiagramStack>
</VisualDiagram>

```jsx
const [cart, cartAction, isPending] = useActionState(saveCart, initialCart);
const [optimisticCart, updateOptimisticCart] = useOptimistic(cart, cartReducer);
```

## When optimistic UI fits

Good candidates often include likes/reactions, follows, lightweight item creation, preference toggles, and low-risk ordering changes with a high success rate and clear rollback.

Higher-risk operations need caution: payments, irreversible destructive actions, security-sensitive permission changes, inventory reservation, or any flow where showing success before confirmation would be misleading or dangerous.

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

## Production decision guide

<DecisionTree
  question="Should this mutation use optimistic UI?"
  items={[
    { label: 'Must wait for confirmation before showing success?', value: 'Use pending/loading UI' },
    { label: 'Expected result unsafe or misleading to show early?', value: 'Do not use optimistic UI' },
    { label: 'Result can be reconciled or rolled back cleanly?', value: 'useOptimistic may fit' },
    { label: 'Canonical data may change while pending?', value: 'Prefer reducer-based optimistic intent' },
    { label: 'Failure needs explicit recovery?', value: 'Keep enough optimistic metadata for retry/error UX' },
  ]}
/>

## Common mistakes

- Treating optimistic state as permanent/canonical state.
- Calling the optimistic setter outside an Action/Transition.
- Showing premature success for high-risk operations.
- Providing no failure feedback.
- Using unstable keys for temporary items.
- Copying stale base state instead of applying intent.
- Mutating the canonical collection in the optimistic reducer.

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
