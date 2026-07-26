---
title: Choosing and Sharing State
description: Learn minimal state, single sources of truth, lifting state, controlled and uncontrolled components, and state ownership.
sidebar_position: 2
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

# Choosing and sharing state

Many React bugs are not caused by the wrong Hook. They are caused by the wrong **state model**.

A strong state model answers three questions:

<VisualDiagram title="Three state-architecture questions" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="What truly changes?" tone="blue">Separate real state from values you can derive.</DiagramNode>
    <DiagramNode title="Who owns it?" tone="purple">Choose one authoritative owner for each fact.</DiagramNode>
    <DiagramNode title="Who needs it?" tone="green">Place state only as high as its consumers require.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Contradictory booleans allow impossible UI" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="isLoading = true" tone="orange" />
    <DiagramNode title="isSuccess = true" tone="green" />
    <DiagramNode title="hasError = true" tone="red" />
  </DiagramGrid>
</VisualDiagram>

A status model may be clearer:

```jsx
const [status, setStatus] = useState('idle');
```

with states such as:

<VisualDiagram title="One status can model valid workflow states" compact>
  <LifecycleBar
    items={[
      { label: 'idle', tone: 'slate' },
      { label: 'submitting', tone: 'blue' },
      { label: 'success / error', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="Lift state to the closest common owner">
  <DiagramStack align="center">
    <DiagramNode title="ProductPage" tone="blue" wide eyebrow="owns selectedVariant" />
    <DiagramArrow label="passes value + callback" />
    <DiagramGrid columns={2}>
      <DiagramNode title="Gallery" tone="purple">reads selected variant</DiagramNode>
      <DiagramNode title="ProductOptions" tone="green">reads + requests changes</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="One owner per fact" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Local modal state" tone="blue">Modal feature</DiagramNode>
    <DiagramNode title="Selected product" tone="purple">Product page</DiagramNode>
    <DiagramNode title="Current user" tone="green">Broader app/session boundary</DiagramNode>
    <DiagramNode title="Server cache" tone="orange">Server-state layer</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Controlled vs uncontrolled">
  <DiagramGrid columns={2}>
    <DiagramNode title="Uncontrolled" tone="blue" eyebrow="SELF-OWNED">
      Easier to drop in; harder for a parent to coordinate externally.
    </DiagramNode>
    <DiagramNode title="Controlled" tone="purple" eyebrow="PARENT-OWNED">
      More configurable and coordinated; requires explicit parent wiring.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## State locality before global state

Before adding Context, Redux, Zustand, or another store, ask whether state can remain local.

<DecisionTree
  question="How far does this state need to travel?"
  items={[
    { label: 'One component', value: 'Keep it local' },
    { label: 'Siblings must coordinate', value: 'Lift to their closest common parent' },
    { label: 'Distant consumers / external access / specialised lifecycle', value: 'Consider composition, Context, or a store based on requirements' },
  ]}
/>

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

<VisualDiagram title="Workflow state should model valid phases" compact>
  <LifecycleBar
    items={[
      { label: 'viewing', tone: 'slate' },
      { label: 'editing', tone: 'blue' },
      { label: 'saving', tone: 'orange' },
      { label: 'saved / error', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="Good state architecture" compact>
  <LifecycleBar
    items={[
      { label: 'Store the minimum', tone: 'blue' },
      { label: 'Avoid contradictions', tone: 'red' },
      { label: 'Avoid duplication', tone: 'orange' },
      { label: 'Choose one owner per fact', tone: 'purple' },
      { label: 'Lift only as high as necessary', tone: 'green' },
    ]}
  />
</VisualDiagram>

Good state architecture removes bugs before they need debugging.

## References

- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/managing-state

## Next

Continue with **[Preserving and Resetting State](./preserving-and-resetting-state.md)**.
