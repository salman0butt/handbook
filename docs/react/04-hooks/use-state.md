---
title: useState
description: Understand React state, updates, batching, derived values, and common useState mistakes.
sidebar_position: 1
---

# useState

State is data that a component remembers between renders.

`useState` lets a function component store that data and request a new render when it changes.

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

## The mental model

Do not think of `setCount` as changing a normal JavaScript variable immediately.

Think of it as asking React to render the component again with a new state value.

```text
render with count = 0
        ↓
user clicks
        ↓
setCount(1)
        ↓
React schedules update
        ↓
component renders again
        ↓
count = 1
```

Each render sees its own snapshot of state.

## State vs ordinary variables

This does not work as application state:

```jsx
function Counter() {
  let count = 0;

  function increment() {
    count += 1;
  }

  return <button onClick={increment}>{count}</button>;
}
```

Changing `count` does not tell React to render again, and the variable is recreated on future renders.

State solves both problems:

```jsx
const [count, setCount] = useState(0);
```

React remembers the value and schedules rendering when it changes.

## Choosing state

State is useful for values that:

1. change over time; and
2. affect what the component renders.

Examples:

```text
selected tab
form input
open/closed modal
current page
basket quantity
expanded accordion item
```

Not every value belongs in state.

## Do not store derived state unnecessarily

Consider:

```jsx
const [firstName, setFirstName] = useState('Salman');
const [lastName, setLastName] = useState('Butt');
const [fullName, setFullName] = useState('Salman Butt');
```

`fullName` can be calculated from existing state:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Storing it separately creates another value that must remain synchronised.

A strong rule is:

> If a value can be calculated during rendering from current props and state, usually calculate it instead of storing it.

## Updating from the previous state

This looks reasonable:

```jsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

But all three calls can use the same `count` snapshot from the current render.

When the next value depends on the previous one, use the updater form:

```jsx
setCount((current) => current + 1);
setCount((current) => current + 1);
setCount((current) => current + 1);
```

Each update receives the result of the previous update.

## Objects in state

State should be treated as immutable.

Bad:

```jsx
user.name = 'Aisha';
setUser(user);
```

Create a new object instead:

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

This makes state transitions explicit and gives React new references to work with.

## Arrays in state

Add an item:

```jsx
setItems((currentItems) => [...currentItems, newItem]);
```

Remove an item:

```jsx
setItems((currentItems) =>
  currentItems.filter((item) => item.id !== id),
);
```

Update an item:

```jsx
setItems((currentItems) =>
  currentItems.map((item) =>
    item.id === id ? {...item, completed: true} : item,
  ),
);
```

Avoid mutating methods directly on state values when they change the existing array.

## State should have one clear owner

Imagine two sibling components both need the selected product:

```text
ProductPage
├── ProductGallery
└── ProductDetails
```

If both need the same changing value, the state usually belongs in their closest common owner:

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

This idea is often called **lifting state up**.

The deeper principle is more useful than the phrase:

> Put state in the lowest component that can correctly own all consumers of that state.

## Avoid one giant state object by default

You could write:

```jsx
const [state, setState] = useState({
  email: '',
  password: '',
  modalOpen: false,
  selectedTab: 'profile',
  notifications: [],
});
```

But unrelated values changing for unrelated reasons often deserve separate state.

```jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [modalOpen, setModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('profile');
```

Group values when they represent one cohesive state transition, not merely because they are used by the same component.

## Initialisation

For cheap initial values:

```jsx
const [count, setCount] = useState(0);
```

If calculating the initial value is expensive, pass an initializer function:

```jsx
const [settings, setSettings] = useState(() => loadInitialSettings());
```

This communicates that the function is used to produce the initial state rather than being the state value itself.

## Common mistakes

### Copying props into state without a reason

```jsx
function Profile({user}) {
  const [name, setName] = useState(user.name);
}
```

Now there are two sources of truth: `user.name` and local `name`.

This can be correct for an editable draft, but it should be intentional.

### Using state for values that can be calculated

```jsx
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);
```

Usually:

```jsx
const itemCount = items.length;
```

### Mutating state

Create new objects and arrays rather than changing existing state references.

### Expecting the variable to change immediately

After:

```jsx
setCount(count + 1);
```

the current event handler still sees the `count` value from the render that created that handler.

That behaviour becomes much easier to understand once we study renders as snapshots.

## Exercise

Build a quantity selector with these requirements:

```text
[-]  1  [+]
```

Rules:

- initial quantity is `1`;
- quantity cannot go below `1`;
- `+` increases the quantity;
- `-` decreases the quantity;
- disable `-` when quantity is already `1`.

Then extend it with a `Reset` button.

Ask yourself whether any additional state is actually necessary.

## Summary

Use state for changing information that affects rendering.

Keep these principles in mind:

```text
Store the minimum state necessary.
Derive what you can.
Treat state as immutable.
Use updater functions when the next value depends on the previous value.
Give each piece of state a clear owner.
```

Later chapters will build on this model with reducers, context, server state, and more complex state architecture.
