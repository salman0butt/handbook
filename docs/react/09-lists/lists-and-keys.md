---
title: Lists and Keys
description: Learn rendering arrays, stable keys, identity, reorder bugs, fragments, filtering, and production list design.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Lists and keys

React applications constantly turn collections of data into collections of UI.

<VisualDiagram title="Data collection → rendered list">
  <LifecycleBar
    items={[
      { label: 'Array of data', tone: 'blue' },
      { label: 'map / filter', tone: 'purple' },
      { label: 'Array of React elements', tone: 'cyan' },
      { label: 'Keys identify siblings', tone: 'orange' },
      { label: 'Rendered list', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Rendering a list with `map`

```jsx
function ProductList({products}) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

`map()` is JavaScript. React receives the resulting elements.

## Filtering before rendering

```jsx
const availableProducts = products.filter(product => product.inStock);

return (
  <ul>
    {availableProducts.map(product => (
      <li key={product.id}>{product.name}</li>
    ))}
  </ul>
);
```

Keep transformations readable. It is often easier to name intermediate collections than to build one dense JSX expression.

## What a key means

A key tells React which sibling corresponds to which conceptual item across renders.

<VisualDiagram title="Key = sibling identity" compact>
  <DiagramStack align="center">
    <DiagramNode title="Conceptual item" tone="blue" wide>for example user #42</DiagramNode>
    <DiagramArrow label="stable key" />
    <DiagramNode title="Rendered sibling identity" tone="green" wide>React can match this item across renders.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Example:

```jsx
<UserRow key={user.id} user={user} />
```

The key is not passed as a normal prop to `UserRow`.

If the component also needs the ID:

```jsx
<UserRow key={user.id} userId={user.id} user={user} />
```

## Why keys matter

Imagine A, B, C and then an item is inserted at the top.

<VisualDiagram title="Stable keys preserve identity during insertion">
  <DiagramGrid columns={2}>
    <DiagramNode title="Before" tone="slate">A · B · C</DiagramNode>
    <DiagramNode title="After" tone="blue">X · A · B · C</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="stable keys let React match existing items" />
  <DiagramNode title="A, B, and C keep their conceptual identities" tone="green" wide>Only X is new.</DiagramNode>
</VisualDiagram>

With stable keys, React can understand that A, B, and C are still the same conceptual items and X is new.

Without useful identity, React must rely more heavily on position.

## Stable keys

Good keys usually come from the data:

```jsx
key={product.id}
key={message.id}
key={invoice.number}
```

A good key is:

- stable across renders;
- unique among siblings;
- tied to the item's conceptual identity.

## Why array indexes can fail

```jsx
{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} />
))}
```

If the list never inserts, removes, sorts, filters, or reorders, an index may appear to work.

But if order changes, the key stays attached to the **position**, not the item.

<VisualDiagram title="Index keys can move local state to the wrong item" subtitle="Position stays stable while the conceptual item changes.">
  <DiagramGrid columns={2}>
    <DiagramNode title="Before reorder" tone="blue">
      index 0 → Todo A → local state A<br />index 1 → Todo B → local state B
    </DiagramNode>
    <DiagramNode title="After reorder" tone="red">
      index 0 → Todo B → may preserve state A<br />index 1 → Todo A → may preserve state B
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This can produce bugs such as:

- text input state moving to another row;
- animations attaching to the wrong item;
- toggles appearing on the wrong record;
- incorrect preserved component state.

## Random keys are worse

Bad:

```jsx
key={Math.random()}
```

Every render produces a new identity.

<VisualDiagram title="Random key forces remounting" compact>
  <LifecycleBar
    items={[
      { label: 'Old item removed', tone: 'red' },
      { label: 'New item mounted', tone: 'orange' },
      { label: 'State lost', tone: 'purple' },
      { label: 'DOM work repeated', tone: 'slate' },
    ]}
  />
</VisualDiagram>

A random key does not make rendering safer.

## Keys are local to siblings

Keys do not need to be globally unique across the entire app.

```jsx
<ul>
  {teamA.map(member => <li key={member.id}>{member.name}</li>)}
</ul>

<ul>
  {teamB.map(member => <li key={member.id}>{member.name}</li>)}
</ul>
```

Each list has its own sibling identity space.

## Keys and Fragments

The short Fragment syntax cannot receive a key.

If each item needs to return multiple sibling elements, use `Fragment` explicitly:

```jsx
import {Fragment} from 'react';

function DefinitionList({items}) {
  return items.map(item => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
```

## Do not create keys from unstable display text blindly

```jsx
key={product.name}
```

is unsafe if names can duplicate or change.

Prefer an actual stable ID from the data model.

## Where should the key go?

Put the key on the element directly created by the array operation.

Wrong:

```jsx
{products.map(product => (
  <ProductRow product={product} />
))}
```

and then inside `ProductRow`:

```jsx
<li key={product.id}>...</li>
```

The parent array still has unkeyed `ProductRow` siblings.

Correct:

```jsx
{products.map(product => (
  <ProductRow key={product.id} product={product} />
))}
```

## Sorting and immutability

Do not mutate props/state while preparing a list.

Bad:

```jsx
products.sort(compareByPrice);
```

Better:

```jsx
const sortedProducts = [...products].sort(compareByPrice);
```

or with modern JavaScript where available:

```jsx
const sortedProducts = products.toSorted(compareByPrice);
```

React rendering should not mutate its inputs.

## Rendering large lists

Stable keys solve identity; they do not solve all list performance problems.

For very large lists, later performance chapters will cover:

- virtualization;
- pagination;
- incremental loading;
- state locality;
- memoization when justified;
- profiling.

Do not treat `key` as a performance optimization switch.

## Empty states

A list UI often has more than the list itself.

```jsx
function ProductResults({products}) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <ul>
      {products.map(product => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

This is often clearer than forcing list logic to handle every UI mode.

## Common mistakes

### Missing keys

React warns because it cannot reliably track sibling identity.

### Index keys in changing lists

These can preserve state by position instead of item identity.

### Random/time-based keys

These force remounting.

### Using keys as normal props

`key` is consumed by React. Pass the ID separately if your component needs it.

### Mutating the source array before mapping

Treat props and state as immutable inputs.

## Debugging wrong-row state

If a row's local input/toggle state appears on another item:

1. inspect the key;
2. check whether it uses the array index;
3. check whether IDs are stable and unique among siblings;
4. check whether data was reordered or filtered;
5. check whether component identity changed unexpectedly.

## Production example

```jsx
function OrderTable({orders}) {
  const visibleOrders = orders.filter(order => !order.archived);

  return (
    <table>
      <tbody>
        {visibleOrders.map(order => (
          <OrderRow
            key={order.id}
            order={order}
          />
        ))}
      </tbody>
    </table>
  );
}
```

The database/order ID is the correct identity because it survives filtering, sorting, and pagination within the loaded data.

## Exercise

Build an editable Todo list with:

- insert at top;
- delete;
- reorder;
- filter completed;
- an input inside each row.

First use index keys and observe the failure modes. Then switch to stable IDs and explain why the behavior changes.

## Interview questions

**Junior:** Why does React need keys in lists?

**Mid-level:** Why can index keys cause state bugs during reordering?

**Senior:** Explain keys as part of reconciliation and identity rather than as a performance hint.

## Summary

<VisualDiagram title="List identity summary" compact>
  <LifecycleBar
    items={[
      { label: 'map creates elements', tone: 'blue' },
      { label: 'key identifies siblings', tone: 'purple' },
      { label: 'stable identity preserves correct state', tone: 'green' },
      { label: 'position-only identity can break when collections change', tone: 'red' },
    ]}
  />
</VisualDiagram>

Keys model identity. Design them from your data, not from render position.

## References

- https://react.dev/learn/rendering-lists
- https://react.dev/learn/preserving-and-resetting-state

## Next

Continue with **[Forms](../10-forms/forms.md)**.
