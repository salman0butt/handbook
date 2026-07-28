---
title: useReducer and Reducer Design
description: Learn when useReducer helps, how actions and reducers work, purity rules, immutability, initialization, debugging, and reducer architecture.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# `useReducer` and reducer design

`useReducer` is another React state primitive. It is useful when centralizing related state transitions makes the application easier to reason about.

## Core mental model

<VisualDiagram title="Reducer update flow" subtitle="Events describe what happened; the reducer calculates the next state.">
  <LifecycleBar
    items={[
      {label: 'user / system event', tone: 'orange'},
      {label: 'dispatch action', tone: 'blue'},
      {label: 'reducer receives state + action', tone: 'purple'},
      {label: 'reducer returns next state', tone: 'green'},
      {label: 'React renders next snapshot', tone: 'cyan'},
    ]}
  />
</VisualDiagram>

`useReducer` is not the “serious app” version of `useState`. Use whichever model makes transitions clearer.

## When `useState` is enough

```jsx
const [open, setOpen] = useState(false);
```

A reducer would add ceremony without improving a simple boolean transition.

## Moving related transitions into a reducer

```jsx
function tasksReducer(state, action) {
  switch (action.type) {
    case 'task_added':
      return [
        ...state,
        {id: action.id, text: action.text, done: false},
      ];

    case 'task_toggled':
      return state.map(task =>
        task.id === action.id
          ? {...task, done: !task.done}
          : task
      );

    case 'task_deleted':
      return state.filter(task => task.id !== action.id);

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Tasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  // ...
}
```

Now event handlers describe domain events instead of manually rebuilding next state everywhere.

## Actions describe what happened

Prefer event-shaped actions:

```jsx
dispatch({
  type: 'task_added',
  id: crypto.randomUUID(),
  text,
});
```

<VisualDiagram title="Good action names explain why state changed">
  <DiagramGrid columns={2}>
    <DiagramNode title="Event / domain language" tone="green">task_added · checkout_started · shipping_address_changed · cart_cleared</DiagramNode>
    <DiagramNode title="Implementation language" tone="red">set_tasks · set_field_7 · update_everything</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React does not require `{type: ...}`; it is a useful convention because structured action objects are easy to log, type, test, and inspect.

## Reducers are pure calculations

<VisualDiagram title="Reducer = current state + action → next state" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Inputs" tone="blue">current state + action</DiagramNode>
    <DiagramNode title="Output" tone="green">next state</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Reducers should not perform network requests, analytics, timers, DOM mutation, storage writes, or other side effects.

Bad:

```jsx
function reducer(state, action) {
  if (action.type === 'order_submitted') {
    fetch('/api/orders', {method: 'POST'}); // ❌
  }
  return state;
}
```

Reducer logic can run during rendering, so purity matters.

## Do not mutate reducer state

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
      ? {...task, done: !task.done}
      : task
  );
```

## One domain event may update several fields

```jsx
case 'submission_succeeded':
  return {
    ...state,
    status: 'success',
    error: null,
    orderId: action.orderId,
  };
```

Do not dispatch three setter-like actions merely because three fields change. Model one transition when one domain event changed them together.

## Reducers can expose poor state modelling

If several booleans must always be synchronized:

```jsx
{
  isLoading,
  isSuccess,
  isError,
}
```

consider a single status:

```jsx
{
  status: 'idle' | 'loading' | 'success' | 'error'
}
```

<VisualDiagram title="Prefer representable state over conflicting flags" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Three booleans" tone="red">Can accidentally represent impossible combinations.</DiagramNode>
    <DiagramNode title="One status" tone="green">Encodes one valid mode at a time.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A reducer does not fix a weak state model automatically.

## `useReducer` signature

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

React gives you the current state snapshot and a stable `dispatch` function.

## Lazy initialization

```jsx
function createInitialState(products) {
  return {
    products,
    selectedIds: new Set(),
  };
}

const [state, dispatch] = useReducer(
  reducer,
  products,
  createInitialState,
);
```

Use the initializer when creating initial state is expensive or when the initial argument needs transformation.

## Props are not automatically reducer state

```jsx
function Editor({document}) {
  const [state, dispatch] = useReducer(reducer, document);
}
```

Later `document` prop changes do not automatically reset reducer state. Decide explicitly whether you need one-time initialization, a controlled model, an explicit reset action, a key-based identity reset, or derived values instead of copied state.

## Dispatch queues a future state snapshot

```jsx
function handleClick() {
  dispatch({type: 'incremented'});
  console.log(state.count);
}
```

The current event handler still sees the current render's state snapshot.

<VisualDiagram title="Dispatch follows the same snapshot model as useState" compact>
  <LifecycleBar
    items={[
      {label: 'current render has state A', tone: 'blue'},
      {label: 'dispatch(action)', tone: 'orange'},
      {label: 'React queues update', tone: 'purple'},
      {label: 'reducer calculates state B', tone: 'green'},
      {label: 'future render sees state B', tone: 'cyan'},
    ]}
  />
</VisualDiagram>

## Reducer debugging

Every transition has a powerful debugging shape:

<VisualDiagram title="Reducer transition record" compact>
  <DiagramStack align="center">
    <DiagramNode title="Previous state" tone="slate" wide />
    <DiagramArrow label="+ action" />
    <DiagramNode title="Reducer" tone="purple" wide />
    <DiagramArrow label="returns" />
    <DiagramNode title="Next state" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

A temporary debug wrapper can log `action`, `previousState`, and `nextState`. Reducers are also straightforward to unit-test because transition logic is pure.

## When `useReducer` helps

Good signals include:

- several handlers perform related transitions;
- state has meaningful domain events;
- update bugs come from duplicated transition logic;
- next state depends on multiple current fields;
- central transition rules improve clarity;
- the transition function is valuable to test independently.

<DecisionTree
  question="Should this local state use a reducer?"
  items={[
    {label: 'Updates are simple and obvious', value: 'useState is usually clearer'},
    {label: 'Many related handlers encode the same transition rules', value: 'useReducer may centralize the logic well'},
    {label: 'The real problem is remote caching or global subscription granularity', value: 'A reducer is solving the wrong problem'},
  ]}
/>

## Event handlers and reducers have different jobs

<VisualDiagram title="Event layer vs reducer layer">
  <DiagramGrid columns={2}>
    <DiagramNode title="Event handler" tone="orange">understands browser/user event · prepares domain payload · dispatches action</DiagramNode>
    <DiagramNode title="Reducer" tone="purple">calculates next state · enforces transition rules · stays pure</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The reducer should not know about DOM event objects.

## Side effects happen outside the reducer

```jsx
async function handleSave() {
  dispatch({type: 'save_started'});

  try {
    const result = await saveOrder(state.order);
    dispatch({type: 'save_succeeded', orderId: result.id});
  } catch (error) {
    dispatch({type: 'save_failed', message: error.message});
  }
}
```

<VisualDiagram title="Async workflow around a pure reducer">
  <LifecycleBar
    items={[
      {label: 'user submits', tone: 'orange'},
      {label: 'event/action layer starts async work', tone: 'blue'},
      {label: 'result arrives', tone: 'cyan'},
      {label: 'dispatch success/failure event', tone: 'purple'},
      {label: 'reducer calculates next state', tone: 'green'},
    ]}
  />
</VisualDiagram>

React 19 Actions provide another mutation model later in the handbook; they do not change reducer purity.

## Reducer invariants

Senior-level reducer design often centres on rules that must remain true after every transition, for example:

- success requires an `orderId`;
- editing state has no submission error;
- quantity can never fall below `1`.

The reducer is a natural boundary for ensuring each action preserves those invariants.

## File boundaries

A feature may keep `cartReducer.js`, selectors, and optional action helpers near the UI that owns them. Do not create Redux-style boilerplate around local `useReducer` unless it solves a real problem.

## Exercise

Build a checkout reducer supporting customer changes, shipping selection, submit start/success/failure, and reset. Explain why each action describes a domain event rather than a setter.

## Interview questions

**Junior:** How is `useReducer` different from `useState`?

**Mid-level:** Why must reducers be pure and immutable?

**Senior:** What makes a good action model, and when does moving logic into a reducer improve architecture rather than just add boilerplate?

## Summary

<VisualDiagram title="Reducer design summary">
  <LifecycleBar
    items={[
      {label: 'identify related transitions', tone: 'blue'},
      {label: 'dispatch meaningful events', tone: 'orange'},
      {label: 'pure reducer calculates next state', tone: 'purple'},
      {label: 'React renders next snapshot', tone: 'green'},
    ]}
  />
</VisualDiagram>

Use reducers for clearer transitions, not because the application crossed an arbitrary size threshold.

## References

- https://react.dev/learn/extracting-state-logic-into-a-reducer
- https://react.dev/reference/react/useReducer

## Next

Continue with **Reducer + Context Architecture**.
