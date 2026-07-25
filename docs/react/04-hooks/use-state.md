---
title: useState
description: Understand React state, snapshots, queued updates, lazy initialization, immutable state, ownership, debugging, and production useState decisions.
sidebar_position: 1
---

# useState

State is information a component needs to remember between renders.

`useState` gives a function component a state value and a setter that can request another render with a new value.

```jsx
import {useState} from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Why does state exist?

Ordinary local variables do not provide React with persistent render state.

```jsx
function Counter() {
  let count = 0;

  function increment() {
    count += 1;
  }

  return <button onClick={increment}>{count}</button>;
}
```

Two problems exist:

1. changing `count` does not schedule a React render;
2. when the component renders again, the local variable is created again.

State solves both:

```text
React remembers state value
        +
setter queues an update
        ↓
React can render again with new state
```

## Basic syntax

```jsx
const [count, setCount] = useState(0);
```

`useState(0)` returns an array with two positions:

```text
[count, setCount]
  ↑       ↑
value   setter
```

The square brackets are JavaScript array destructuring, not special React syntax.

## The most important mental model: state is a snapshot

Do not think of `setCount` as mutating the `count` variable in the current function call.

Think of it as queuing state for a future render.

```text
render A
count = 0
   ↓
click handler from render A runs
   ↓
setCount(1)
   ↓
React schedules/queues update
   ↓
render B
count = 1
```

Each render receives its own snapshot of props and state.

## Why the current handler still sees the old value

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

If `count` is `0`, the log prints `0` in that handler.

The setter requested another render. It did not rewrite the `count` constant captured by this render's handler.

```text
render creates count = 0
        ↓
render creates handleClick closure
        ↓
handler remembers that render's count
        ↓
setter queues future state
        ↓
current closure still has count = 0
```

This snapshot model explains many "stale state" bugs later.

## Choosing state

A value usually belongs in state when it:

1. changes over time; and
2. affects what the component renders.

Examples:

```text
selected tab
form input
open/closed dialog
current page
basket quantity
expanded accordion item
```

Not every variable belongs in state.

## Store the minimum state necessary

Suppose:

```jsx
const [firstName, setFirstName] = useState('Salman');
const [lastName, setLastName] = useState('Butt');
const [fullName, setFullName] = useState('Salman Butt');
```

`fullName` is derivable:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Storing the derived value creates another source that must stay synchronized.

A strong default is:

> If a value can be calculated during render from current props and state, calculate it instead of storing another copy.

## Queued state updates

This code does not necessarily produce `+3` from one click:

```jsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

All three calls use the same `count` snapshot from the current render.

If `count` is `0`, each expression asks for `1`.

```text
current snapshot: count = 0

setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
```

## Updater functions

When the next state depends on the previous queued state, use an updater function:

```jsx
setCount((current) => current + 1);
setCount((current) => current + 1);
setCount((current) => current + 1);
```

Conceptually:

```text
queued 0
 ↓ +1
1
 ↓ +1
2
 ↓ +1
3
```

Updater functions are especially useful when multiple updates can occur in one event or when the update logic is naturally expressed from the previous state.

## Batching

React can batch state updates so several setter calls do not force separate immediate renders after every call.

A useful mental model is:

```text
event / update source
      ↓
queue state updates
      ↓
React processes updates
      ↓
render with resulting state
```

Do not write code that depends on a setter synchronously changing the current state variable.

## Replacing vs updating objects

State should be treated as immutable.

Bad:

```jsx
user.name = 'Aisha';
setUser(user);
```

This mutates the existing object.

Better:

```jsx
setUser((currentUser) => ({
  ...currentUser,
  name: 'Aisha',
}));
```

For nested data:

```jsx
setUser((currentUser) => ({
  ...currentUser,
  address: {
    ...currentUser.address,
    city: 'Lahore',
  },
}));
```

Spread is shallow, so every changed nested level needs a new object if you use this style.

## Arrays in state

Add:

```jsx
setItems((currentItems) => [...currentItems, newItem]);
```

Remove:

```jsx
setItems((currentItems) =>
  currentItems.filter((item) => item.id !== id),
);
```

Update:

```jsx
setItems((currentItems) =>
  currentItems.map((item) =>
    item.id === id ? {...item, completed: true} : item,
  ),
);
```

Reorder using operations that produce a new array rather than mutating the state array in place.

## Why immutability matters

Treating state as immutable helps preserve the snapshot model:

```text
previous state object
        ↓ remains unchanged
new state object
        ↓ represents next snapshot
```

It also makes reference identity meaningful for React and surrounding tooling.

Do not reduce this to "React cannot detect mutation." The deeper reason is that mutating old snapshots makes rendering and debugging much harder to reason about.

## Lazy initialization

For cheap initial values:

```jsx
const [count, setCount] = useState(0);
```

If creating the initial value is expensive, pass an initializer function:

```jsx
const [settings, setSettings] = useState(() => loadInitialSettings());
```

Compare:

```jsx
// Function is called while evaluating every render expression,
// although React only uses the initial result as state initialization.
const [settings] = useState(loadInitialSettings());
```

with:

```jsx
// React receives the initializer function itself.
const [settings] = useState(loadInitialSettings);
```

The second form avoids recalculating the initial value on ordinary re-renders.

### Initializers must be pure

React may call initializer/updater functions more than once in development Strict Mode to help reveal impurity.

Do not perform external side effects inside a state initializer.

Bad:

```jsx
const [id] = useState(() => {
  analytics.track('created');
  return crypto.randomUUID();
});
```

The initializer should calculate initial state, not perform external work.

## Passing a function as state

Because passing a function to `useState` means "initializer function," storing a function value requires wrapping it:

```jsx
const [formatter, setFormatter] = useState(() => defaultFormatter);
```

And when replacing it with another function:

```jsx
setFormatter(() => nextFormatter);
```

Otherwise React may interpret the function as an updater.

## State structure

Avoid one giant object merely because values are used in the same component:

```jsx
const [state, setState] = useState({
  email: '',
  password: '',
  modalOpen: false,
  selectedTab: 'profile',
  notifications: [],
});
```

Unrelated values often deserve separate state:

```jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [modalOpen, setModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('profile');
```

Group values when they represent one cohesive transition or domain concept, not just because they share a component.

If many state transitions are tightly related and update logic becomes difficult to follow, `useReducer` may eventually be clearer.

## State ownership

Every state value should have a clear owner.

Suppose siblings need the same selected variant:

```text
ProductPage
├── ProductGallery
└── ProductDetails
```

If both need one coordinated value, move ownership to their closest common parent:

```jsx
function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState('black');

  return (
    <>
      <ProductGallery selectedVariant={selectedVariant} />
      <ProductDetails
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
      />
    </>
  );
}
```

This is often called **lifting state up**.

The deeper rule is:

> Put state in the lowest component that can correctly own every consumer that must coordinate around it.

Do not move all state to the application root "for consistency."

## Controlled vs uncontrolled state

A component is **controlled** for a value when the caller owns that value and passes it in.

```jsx
<Tabs selectedId={selectedId} onSelect={setSelectedId} />
```

A component is **uncontrolled** for a value when it owns its own state:

```jsx
function Tabs({defaultSelectedId}) {
  const [selectedId, setSelectedId] = useState(defaultSelectedId);
  // ...
}
```

Neither is always better.

Controlled APIs improve coordination from outside. Uncontrolled APIs can reduce parent state for self-contained behavior.

Later chapters will design reusable component APIs that intentionally support one or both models.

## Copying props into state

This can be a bug:

```jsx
function Profile({user}) {
  const [name, setName] = useState(user.name);
}
```

The initial prop is used only to create the initial state. If `user.name` later changes, React does not automatically reinitialize `name`.

Now there may be two sources of truth:

```text
user.name from parent
        vs
name local state
```

This can be correct for an editable draft:

```text
server/current profile value
        ↓ initialize draft
local editable draft
        ↓ save/cancel
explicit synchronization decision
```

But it should be intentional.

## Resetting state

Sometimes you want new data to produce a fresh component state rather than manually synchronizing many fields.

React ties state to a component's identity and position in the tree. A different `key` can intentionally reset that state.

```jsx
<ProfileEditor key={user.id} user={user} />
```

Do not use keys randomly. The rendering/identity chapter will explain why this works and when it is appropriate.

## `useState` vs a ref

State:

```text
persists between renders
+
updates can trigger rendering
```

Ref:

```text
persists between renders
+
changing ref.current does not request rendering
```

If a changing value affects the rendered UI, state is usually the right primitive.

If a value is only needed by imperative logic and should not trigger rendering, a ref may be more appropriate.

## `useState` vs derived value

Bad:

```jsx
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);
```

Usually:

```jsx
const itemCount = items.length;
```

Derived values reduce synchronization bugs.

## `useState` vs reducer

`useState` is excellent when state updates are simple and local.

A reducer can become clearer when:

- many fields change together;
- transitions are event/action driven;
- update rules are complex;
- you want transitions centralized and independently testable.

Do not introduce a reducer merely because the component has more than one state variable.

## `useState` vs global/store state

Do not install a global state library because props exist.

Start with ownership:

```text
local component state
      ↓ if siblings coordinate
lift state
      ↓ if distant subtree needs stable shared value
Context / reducer
      ↓ if external-store requirements exist
external store
```

The right choice depends on consumers, update frequency, domain boundaries, persistence, and server/client state distinction.

## Common mistakes

### Expecting the variable to change immediately

```jsx
setCount(count + 1);
console.log(count);
```

The current render's `count` snapshot does not change.

### Using direct values when updates depend on previous queued state

Use the updater form when the next value depends on previous state.

### Mutating objects or arrays

Create next-state values rather than modifying old snapshots.

### Storing derived data

Calculate from existing props/state where possible.

### Copying props into state without defining synchronization behavior

Ask which value is the source of truth and what should happen when the prop changes.

### Initializing from an expensive function call every render

Use a lazy initializer when initial calculation is genuinely expensive.

### Putting server data into local state automatically

Remote/server state introduces caching, invalidation, refetching, race conditions, and mutation concerns. Local `useState` is not automatically the correct abstraction for those problems.

## Debugging

### "State didn't update"

Ask:

1. Did the setter run?
2. What value did this render's closure capture?
3. Did the next state equal the current state by React's comparison semantics?
4. Was the state mutated before setting?
5. Is the UI actually derived from a different source?
6. Did component identity change and reset the state?

### "My three increments only added one"

Use updater functions when the next value depends on previous queued state.

### "Changing a prop doesn't update local state"

`useState(prop)` uses the prop to initialize state; it does not create ongoing synchronization.

### "My object changed elsewhere too"

You may have mutated a shared object reference instead of creating the next state immutably.

### "State resets unexpectedly"

Check component position and `key` identity. A component mounted as a different identity receives fresh state.

## When should I use `useState`?

Use it for component-local information that:

- must persist between renders;
- can change over time;
- affects rendered output or child inputs;
- has relatively straightforward update rules.

Examples:

- selected filter;
- open dialog;
- form field draft;
- quantity selector;
- active accordion panel;
- local pagination state.

## When should I NOT use `useState`?

Avoid it for:

- values derivable during render;
- constants;
- values that do not need rendering when changed (consider refs);
- complex remote/server cache state where a dedicated server-state architecture is more appropriate;
- duplicated state with no clear source of truth;
- values better represented by the URL/router state;
- values already owned by a parent and only needed as props.

## Trade-offs

Local state has strong advantages:

- simple;
- colocated with its owner;
- minimal architecture;
- easy to understand for small interactions.

But too much local state can create:

- duplicated sources of truth;
- difficult sibling coordination;
- long prop chains when ownership is wrong;
- complex transition logic;
- accidental mixing of client UI state and server state.

Senior-level state management starts with **classification and ownership**, not library choice.

## Production example: quantity selector

```jsx
import {useState} from 'react';

function QuantitySelector({max = 10, onChange}) {
  const [quantity, setQuantity] = useState(1);

  function increment() {
    setQuantity((current) => {
      const next = Math.min(current + 1, max);
      onChange?.(next);
      return next;
    });
  }

  function decrement() {
    setQuantity((current) => {
      const next = Math.max(current - 1, 1);
      onChange?.(next);
      return next;
    });
  }

  return (
    <div aria-label="Quantity">
      <button
        type="button"
        onClick={decrement}
        disabled={quantity === 1}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <output aria-live="polite">{quantity}</output>

      <button
        type="button"
        onClick={increment}
        disabled={quantity === max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
```

This is intentionally local state because the selector owns the draft quantity.

In a real cart, the canonical quantity might instead belong to cart/domain state or server state. The important question is ownership, not whether `useState` can technically store it.

## Exercise

Build a quantity selector with:

```text
[-]  1  [+]
```

Requirements:

- initial quantity is `1`;
- quantity cannot go below `1`;
- maximum quantity is passed as a prop;
- `+` and `-` buttons disable at their limits;
- add a Reset button;
- display the subtotal using `price * quantity`;
- **do not store subtotal in state**.

Then answer:

1. Which value is state?
2. Which value is derived?
3. Why is an updater function useful?
4. Where should quantity live if the whole cart needs to coordinate it?

## Interview questions

### Junior

Why does logging state immediately after calling its setter often show the previous value?

### Mid-level

When should you use the updater form of a state setter, and how does React process queued updater functions?

### Senior

How do you decide whether a value belongs in local state, a parent, a reducer, Context, an external store, the URL, or a server-state cache?

## Summary

Keep these rules:

```text
State belongs to renders, not mutable variables.
Each render sees a snapshot.
Setters queue future state.
Use updater functions for previous-state transitions.
Store the minimum state necessary.
Derive what you can.
Treat state as immutable.
Give each state value one clear owner.
Choose a different abstraction when the problem is not local UI state.
```

## References

- https://react.dev/reference/react/useState
- https://react.dev/learn/state-a-components-memory
- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/learn/queueing-a-series-of-state-updates
- https://react.dev/learn/updating-objects-in-state
- https://react.dev/learn/updating-arrays-in-state
- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/sharing-state-between-components

## Next

The next curriculum batch separates the state mental model from the Hook API and then adds **events, render/commit behavior, lists and keys, and forms** before introducing Effects.