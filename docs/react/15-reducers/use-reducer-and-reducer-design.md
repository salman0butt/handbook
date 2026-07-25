---
title: useReducer and Reducer Design
description: Learn when useReducer helps, how actions and reducers work, purity rules, immutability, initialization, debugging, and reducer architecture.
sidebar_position: 1
---

# `useReducer` and reducer design

`useReducer` is another way to manage component state.

It is especially useful when state updates become difficult to reason about because many event handlers modify related pieces of state in different ways.

The core idea is:

```text
an event happens
      ↓
dispatch an action describing what happened
      ↓
reducer receives current state + action
      ↓
reducer returns next state
      ↓
React renders with that state
```

## `useState` is not the beginner version of `useReducer`

Do not think:

```text
small app = useState
serious app = useReducer
```

Both are valid state primitives.

Use `useState` when updates are simple and easy to understand.

Use `useReducer` when centralizing update logic makes the state transitions clearer.

## A `useState` example

```jsx
function Tasks() {
  const [tasks, setTasks] = useState([]);

  function addTask(text) {
    setTasks(current => [
      ...current,
      { id: crypto.randomUUID(), text, done: false },
    ]);
  }

  function toggleTask(id) {
    setTasks(current =>
      current.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
  }
}
```

Nothing is wrong here.

But as transitions grow, update logic can become spread across many handlers.

## Moving to a reducer

```jsx
import { useReducer } from 'react';

function tasksReducer(state, action) {
  switch (action.type) {
    case 'task_added':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];

    case 'task_toggled':
      return state.map(task =>
        task.id === action.id
          ? { ...task, done: !task.done }
          : task
      );

    case 'task_deleted':
      return state.filter(task => task.id !== action.id);

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function Tasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  // ...
}
```

Now the component dispatches actions instead of directly constructing every next state.

## Actions describe what happened

```jsx
dispatch({
  type: 'task_added',
  id: crypto.randomUUID(),
  text,
});
```

A useful action describes an event in the domain.

Prefer:

```text
task_added
checkout_started
shipping_address_changed
cart_cleared
```

over implementation commands like:

```text
set_tasks
set_field_7
update_everything
```

The action should help you understand **why** the transition happened.

## Action shape is your design

React does not require `{ type: ... }`.

That is a convention.

You could technically dispatch any value, but structured action objects are easy to read, log, type, and test.

```jsx
{
  type: 'quantity_changed',
  productId: 'p-42',
  quantity: 3,
}
```

## Reducers are pure

A reducer receives:

```text
current state
+
action
```

and returns:

```text
next state
```

It should not perform side effects.

Bad:

```jsx
function reducer(state, action) {
  if (action.type === 'order_submitted') {
    fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(state),
    });
  }

  return state;
}
```

The network request does not belong in the reducer.

Reducers can run during rendering, so they must remain pure.

## No mutation

Bad:

```jsx
case 'task_toggled': {
  const task = state.find(task => task.id === action.id);
  task.done = !task.done;
  return state;
}
```

Better:

```jsx
case 'task_toggled':
  return state.map(task =>
    task.id === action.id
      ? { ...task, done: !task.done }
      : task
  );
```

The reducer must return new objects/arrays for changed state.

## One action can change multiple fields

Suppose a checkout state contains:

```jsx
{
  status: 'editing',
  error: null,
  orderId: null,
}
```

A successful submission can represent one domain transition:

```jsx
case 'submission_succeeded':
  return {
    ...state,
    status: 'success',
    error: null,
    orderId: action.orderId,
  };
```

Do not dispatch three actions merely because three fields change.

Actions should reflect interactions or events, not individual assignments.

## Reducers can expose invalid state design

If the reducer constantly has to keep several booleans synchronized:

```jsx
{
  isLoading,
  isSuccess,
  isError,
}
```

consider whether one status is better:

```jsx
{
  status: 'idle' | 'loading' | 'success' | 'error'
}
```

A reducer is not a cure for poor state modeling.

## `useReducer` signature

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

Common form:

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

React gives you:

1. current state;
2. a stable `dispatch` function.

## Lazy initialization

If initial state is expensive to create, use the third argument.

```jsx
function createInitialState(products) {
  return {
    products,
    selectedIds: new Set(),
  };
}

function Catalog({ products }) {
  const [state, dispatch] = useReducer(
    reducer,
    products,
    createInitialState,
  );
}
```

This separates the initial argument from the initialization calculation.

## Props are not automatically reducer state

Be careful with:

```jsx
function Editor({ document }) {
  const [state, dispatch] = useReducer(reducer, document);
}
```

The initial reducer state is used for initialization. Later prop changes do not magically reset reducer state.

Ask whether you want:

- state initialized once from a prop;
- a controlled component;
- explicit reset behavior;
- identity reset with a `key`;
- derived values instead of copied state.

## Dispatch does not immediately mutate `state`

```jsx
function handleClick() {
  dispatch({ type: 'incremented' });
  console.log(state.count);
}
```

The current event handler still sees the current render's state snapshot.

Dispatch queues an update for a future render.

The same snapshot mental model you learned with `useState` still applies.

## Reducer debugging

Reducers are convenient debugging boundaries because every transition has:

```text
previous state
+ action
= next state
```

A temporary wrapper can log transitions:

```jsx
function debugReducer(state, action) {
  const nextState = reducer(state, action);

  console.log({
    action,
    previousState: state,
    nextState,
  });

  return nextState;
}
```

Do not leave noisy production logging in hot paths, but the model is powerful.

## Reducers are testable in isolation

```js
const start = [{ id: 1, text: 'Learn reducers', done: false }];

const next = tasksReducer(start, {
  type: 'task_toggled',
  id: 1,
});

expect(next[0].done).toBe(true);
expect(start[0].done).toBe(false);
```

This tests transition logic directly.

However, do not replace all component/user tests with reducer unit tests. Reducer correctness is only one part of application behavior.

## When `useReducer` helps

Good signs:

- several handlers perform related state transitions;
- state has explicit domain events;
- update bugs are common;
- you want transitions in one place;
- the next state depends on multiple current fields;
- reducer logic can be tested clearly.

## When it may be overkill

```jsx
const [open, setOpen] = useState(false);
```

Replacing this with:

```jsx
const [state, dispatch] = useReducer(...);
```

usually adds ceremony without adding clarity.

## Reducer file boundaries

A useful feature structure:

```text
features/cart/
  Cart.jsx
  cartReducer.js
  cartActions.js      ← optional, not mandatory
  cartSelectors.js    ← optional
```

Do not create Redux-like boilerplate around local `useReducer` unless it solves a real problem.

## Reducer and event handler responsibilities

A healthy boundary is:

```text
Event handler
- understand browser/user event
- prepare domain payload
- dispatch action

Reducer
- calculate next state
- enforce transition rules
- remain pure
```

Example:

```jsx
function handleSubmit(event) {
  event.preventDefault();

  dispatch({
    type: 'customer_name_changed',
    name: event.currentTarget.elements.name.value,
  });
}
```

The reducer should not know about DOM event objects.

## Side effects happen outside the reducer

If an action requires a server request:

```text
user submits
   ↓
event/action layer starts async work
   ↓
result arrives
   ↓
dispatch success or failure event
```

For example:

```jsx
async function handleSave() {
  dispatch({ type: 'save_started' });

  try {
    const result = await saveOrder(state.order);
    dispatch({ type: 'save_succeeded', orderId: result.id });
  } catch (error) {
    dispatch({ type: 'save_failed', message: error.message });
  }
}
```

Later, React 19 Actions provide another model for mutation flows. Do not confuse that with reducer purity.

## Reducer invariants

Senior-level reducer design often centers on invariants.

For example:

```text
If status === 'success', orderId must exist.
If status === 'editing', error should be null.
Quantity can never be below 1.
```

The reducer is a natural place to ensure transitions preserve those rules.

## Exercise

Build a checkout reducer supporting:

- `customer_changed`;
- `shipping_selected`;
- `submission_started`;
- `submission_succeeded`;
- `submission_failed`;
- `reset`.

Then explain why each action describes an event rather than a setter.

## Interview questions

**Junior:** How is `useReducer` different from `useState`?

**Mid-level:** Why must reducers be pure and immutable?

**Senior:** What makes a good action model, and when does moving logic into a reducer improve architecture rather than just add boilerplate?

## Summary

```text
complex related transitions
        ↓
dispatch meaningful actions
        ↓
pure reducer calculates next state
        ↓
React renders
```

Use reducers for clearer transitions, not because the application crossed an arbitrary size threshold.

## References

- https://react.dev/learn/extracting-state-logic-into-a-reducer
- https://react.dev/reference/react/useReducer

## Next

Continue with **Reducer + Context Architecture**.