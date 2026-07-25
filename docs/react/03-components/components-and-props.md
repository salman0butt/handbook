---
title: Components and Props
description: Learn component boundaries, props, composition, and how to design reusable React interfaces.
sidebar_position: 1
---

# Components and Props

Components are the building blocks of a React application.

A component is a JavaScript function that describes a piece of UI.

```jsx
function Badge() {
  return <span>New</span>;
}
```

Most useful components receive data through **props**.

```jsx
function Badge({label}) {
  return <span>{label}</span>;
}
```

Then the parent can configure the component:

```jsx
<Badge label="New" />
<Badge label="Featured" />
```

## Props are inputs

A useful mental model is:

```text
props
  ↓
component
  ↓
UI description
```

For example:

```jsx
function ProductCard({name, price, inStock}) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price}</p>
      <button disabled={!inStock}>Buy</button>
    </article>
  );
}
```

Props allow the same component behaviour and layout to work with different data.

## Parent-to-child data flow

Data normally flows down the component tree:

```text
App
 ↓
ProductList
 ↓
ProductCard
```

Example:

```jsx
function ProductList({products}) {
  return (
    <section>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          inStock={product.inStock}
        />
      ))}
    </section>
  );
}
```

This one-way flow makes it easier to reason about where data came from.

## Props are read-only

A component should not mutate props.

Bad:

```jsx
function Price({product}) {
  product.price = product.price * 0.8;
  return <span>{product.price}</span>;
}
```

Better:

```jsx
function Price({product}) {
  const discountedPrice = product.price * 0.8;
  return <span>{discountedPrice}</span>;
}
```

Treat props as input values owned by the parent.

## Passing objects vs individual props

Both are valid:

```jsx
<ProductCard name={product.name} price={product.price} />
```

and:

```jsx
<ProductCard product={product} />
```

The better choice depends on the component API.

Passing individual props can make dependencies explicit. Passing a domain object can be convenient when the child genuinely represents that object.

Avoid blindly forwarding every property with spreading:

```jsx
<ProductCard {...product} />
```

It is concise, but it can make the component contract harder to see.

## The `children` prop

React can pass nested content through `children`:

```jsx
function Card({children}) {
  return <div className="card">{children}</div>;
}
```

Usage:

```jsx
<Card>
  <h2>Account</h2>
  <p>Manage your profile settings.</p>
</Card>
```

This is **composition**: the component controls structure while the caller supplies content.

## Composition is often better than configuration

A highly configured component can become difficult to use:

```jsx
<Modal
  title="Delete account"
  description="This cannot be undone."
  showCancelButton
  cancelText="Cancel"
  confirmText="Delete"
  danger
  showIcon
/>
```

A composable API can be more flexible:

```jsx
<Modal>
  <Modal.Header>Delete account</Modal.Header>
  <Modal.Body>This cannot be undone.</Modal.Body>
  <Modal.Actions>
    <Button>Cancel</Button>
    <Button variant="danger">Delete</Button>
  </Modal.Actions>
</Modal>
```

Neither style is always correct. The important skill is designing an API that fits the component's responsibility.

## Choosing component boundaries

Beginners often split components based on visual size. A better question is:

> Does this piece of UI have a clear responsibility or reusable behaviour?

Useful boundaries often appear when:

- a section has its own state;
- the same pattern repeats;
- a part is independently testable;
- a part has a meaningful domain concept;
- a parent is becoming hard to understand;
- a piece needs its own performance boundary.

Do not extract components only to reduce line count.

## Too large

```text
CheckoutPage
├── address logic
├── shipping logic
├── payment logic
├── basket calculations
├── validation
└── all UI markup
```

This mixes responsibilities.

## Too fragmented

```text
CheckoutPage
├── CheckoutTitleText
├── CheckoutTitleWrapper
├── CheckoutDivider
├── CheckoutButtonText
└── CheckoutButtonIcon
```

This can make the code harder to navigate without adding useful abstraction.

Good component design sits between those extremes.

## Event callbacks as props

Parents can pass functions to children:

```jsx
function DeleteButton({onDelete}) {
  return <button onClick={onDelete}>Delete</button>;
}
```

Usage:

```jsx
<DeleteButton onDelete={() => removeProduct(product.id)} />
```

The child owns the interaction surface; the parent owns what that interaction means for application state.

This pattern becomes important when we study state ownership.

## Common mistakes

### Mutating props

Props are inputs. Create new values instead of changing them.

### Creating one giant component

Separate meaningful responsibilities, not arbitrary chunks of markup.

### Making everything reusable too early

A component used once is not a problem. Premature abstraction often produces complicated APIs.

### Passing too many unrelated props

A component with fifteen unrelated props may have too many responsibilities or the wrong boundary.

## Exercise

Design components for this page:

```text
Product Details
├── product image
├── product title
├── rating
├── price
├── variant selector
├── quantity selector
├── add-to-basket action
└── delivery information
```

Decide:

- which data each component receives;
- which pieces deserve their own component;
- where changing state should eventually live;
- where composition would be useful.

## Summary

Components define responsibilities. Props define how data and behaviour enter those components.

Good React architecture starts with good boundaries:

```text
clear responsibility
      +
clear inputs
      +
clear ownership
      =
component that is easier to understand and change
```

Next: **[useState](../04-hooks/use-state.md)**.
