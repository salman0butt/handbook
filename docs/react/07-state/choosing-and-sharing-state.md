---
title: Choosing and Sharing State
description: Learn minimal state, single sources of truth, lifting state, controlled and uncontrolled components, and state ownership.
sidebar_position: 2
---

# Choosing and sharing state

Many React bugs are not caused by the wrong Hook. They are caused by the wrong **state model**.

A strong state model answers three questions:

```text
What truly changes?
Who owns it?
Who needs it?
```

## Store the minimum state

Suppose a search screen has products and a query.

```jsx
const [products, setProducts] = useState(initialProducts);
const [query, setQuery] = useState('');
```

The filtered list can be calculated:

```jsx
const visibleProducts = products.filter(product =>
  product.name.toLowerCase().includes(query.toLowerCase()),
);
```

Do not store `visibleProducts` as separate state unless it represents independent information.

## Avoid redundant state

Bad:

```jsx
const [firstName, setFirstName] = useState('Ada');
const [lastName, setLastName] = useState('Lovelace');
const [fullName, setFullName] = useState('Ada Lovelace');
```

Better:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Every duplicated representation creates synchronization work.

## Avoid contradictory state

Bad:

```jsx
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [hasError, setHasError] = useState(false);
```

Impossible combinations can appear:

```text
isLoading = true
isSuccess = true
hasError = true
```

A status model may be clearer:

```jsx
const [status, setStatus] = useState('idle');
```

with states such as:

```text
idle → submitting → success
                  ↘ error
```

## Group related state, not merely nearby state

Good reason to group:

```jsx
const [position, setPosition] = useState({x: 0, y: 0});
```

`x` and `y` describe one coordinate and often update together.

Weak reason to group:

```jsx
const [state, setState] = useState({
  modalOpen: false,
  email: '',
  selectedTab: 'billing',
  notifications: [],
});
```

These fields may change for unrelated reasons.

## Avoid duplicating the same object in state

Bad:

```jsx
const [items, setItems] = useState(initialItems);
const [selectedItem, setSelectedItem] = useState(initialItems[0]);
```

If the item is edited in `items`, `selectedItem` can become stale.

Often store identity instead:

```jsx
const [selectedId, setSelectedId] = useState(initialItems[0].id);

const selectedItem = items.find(item => item.id === selectedId);
```

## State ownership

Each piece of state should have a clear owner.

```text
ProductPage
├── Gallery
└── ProductOptions
```

If both children need the selected variant, neither child is a good owner.

Move the state to their closest common parent:

```jsx
function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState('black');

  return (
    <>
      <Gallery variant={selectedVariant} />
      <ProductOptions
        value={selectedVariant}
        onChange={setSelectedVariant}
      />
    </>
  );
}
```

This is **lifting state up**.

## Single source of truth

“Single source of truth” does **not** mean all application state belongs in one global object.

It means:

> For each unique piece of information, choose one owner.

```text
local modal state → Modal feature
selected product → Product page
current user → broader app boundary
server cache → server-state layer
```

State should live as low as possible while still correctly serving all consumers.

## Controlled components

A controlled component receives important state through props.

```jsx
function Panel({isOpen, onOpen}) {
  return isOpen
    ? <p>Details</p>
    : <button onClick={onOpen}>Show</button>;
}
```

The parent owns the behavior:

```jsx
function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Panel
        isOpen={activeIndex === 0}
        onOpen={() => setActiveIndex(0)}
      />
      <Panel
        isOpen={activeIndex === 1}
        onOpen={() => setActiveIndex(1)}
      />
    </>
  );
}
```

## Uncontrolled components

A component is often called uncontrolled when it owns the relevant state itself.

```jsx
function Disclosure() {
  const [open, setOpen] = useState(false);

  return (
    <button onClick={() => setOpen(value => !value)}>
      {open ? 'Hide' : 'Show'}
    </button>
  );
}
```

Neither pattern is universally better.

```text
uncontrolled
+ easier to drop in
- harder for parent to coordinate

controlled
+ flexible and coordinated
- requires more parent configuration
```

## State locality before global state

Before adding Context, Redux, Zustand, or another store, ask whether state can remain local.

```text
Need state in one component?
→ keep it local

Need siblings to coordinate?
→ lift it to common parent

Need distant consumers?
→ consider composition/context/store based on the problem
```

Global state is not automatically “more scalable.” It can make ownership harder to reason about.

## Do not mirror props into state by default

Bad:

```jsx
function Profile({user}) {
  const [name, setName] = useState(user.name);
}
```

Now `user.name` and `name` are separate sources of truth.

This can be correct if `name` intentionally represents an editable draft. If so, name the concept clearly and decide how it resets when a different user arrives.

## State shape should model valid UI

Instead of many loosely related booleans:

```jsx
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [saved, setSaved] = useState(false);
```

consider a state that expresses the allowed workflow:

```jsx
const [status, setStatus] = useState('viewing');
```

Possible states:

```text
viewing
editing
saving
saved
error
```

For more complex transitions, this thinking naturally leads toward reducers or state machines.

## Common mistakes

### Storing derived values

Calculate them during render when possible.

### Duplicating shared state in siblings

Lift it to their closest common owner.

### Putting all state at the application root

State too high causes unnecessary coupling and can widen rendering scope.

### Installing a state library too early

Libraries solve specific coordination and architecture problems. They do not replace understanding ownership.

## Debugging state architecture

When values disagree, ask:

1. Are two pieces of state representing the same fact?
2. Can one be derived from the other?
3. Do multiple components think they own the same value?
4. Is the owner too high or too low?
5. Would a reducer make valid transitions clearer?

## Production example: filters

```jsx
function ProductSearch({products}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const visibleProducts = products.filter(product => {
    const matchesQuery = product.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === 'all' || product.category === category;

    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <Filters
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
      />
      <ProductGrid products={visibleProducts} />
    </>
  );
}
```

The filtered result is derived. The owner coordinates both the controls and the list.

## Exercise

Design state for a checkout screen containing:

- delivery method;
- basket items;
- basket total;
- promo code;
- discount amount;
- checkout status;
- modal visibility.

For each value, decide whether it is:

- real state;
- derived data;
- server data;
- local UI state.

## Interview questions

**Junior:** What does “lifting state up” mean?

**Mid-level:** Why is duplicated or contradictory state dangerous?

**Senior:** How do you decide between local state, Context, an external client store, and server-state tooling?

## Summary

```text
store the minimum
avoid contradictions
avoid duplication
choose one owner per fact
lift only as high as necessary
```

Good state architecture removes bugs before they need debugging.

## References

- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/managing-state

## Next

Continue with **[Preserving and Resetting State](./preserving-and-resetting-state.md)**.