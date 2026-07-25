---
title: Components and Props
description: Learn function components, props, composition, pure rendering, boundaries, reusable APIs, and production component design.
sidebar_position: 1
---

# Components and Props

Components are the building blocks of a React application.

A function component is a JavaScript function that React uses to calculate part of the UI.

```jsx
function Badge() {
  return <span>New</span>;
}
```

Most useful components receive data through **props**:

```jsx
function Badge({label}) {
  return <span>{label}</span>;
}
```

Then a parent configures it:

```jsx
<Badge label="New" />
<Badge label="Featured" />
```

## Why components exist

Without components, a growing interface can become one large mixture of markup, behavior, and data decisions.

Components let you create boundaries around meaningful UI responsibilities.

```text
ProductPage
├── ProductGallery
├── ProductDetails
│   ├── Price
│   ├── VariantSelector
│   └── AddToBasketButton
└── DeliveryInfo
```

Good boundaries make it easier to understand:

- what data a piece of UI needs;
- what behavior it owns;
- what it can reuse;
- what should be tested independently;
- where state should live;
- how changes propagate through the tree.

## Component mental model

Treat a component as a UI calculation:

```text
props + state + context
          ↓
      component
          ↓
   React elements
```

A component should not be thought of as a long-lived mutable object that you manually update.

React renders it with the inputs for that render.

## Component naming

React components start with a capital letter:

```jsx
function SaveButton() {
  return <button>Save</button>;
}
```

Use:

```jsx
<SaveButton />
```

Lowercase JSX names are treated as host/platform elements such as `div`, `button`, and `input`.

## Props are inputs

A useful model is:

```text
parent owns data
      ↓
passes props
      ↓
child receives inputs
      ↓
child calculates UI
```

Example:

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

Props let the same component structure work with different values.

## Parent-to-child data flow

Data normally flows down the tree:

```text
App
 ↓
ProductList
 ↓
ProductCard
```

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

This one-way flow helps you trace where a value came from.

A child does not "reach up" and mutate a parent's props. When a child interaction needs to affect parent-owned state, the parent can pass a callback.

## Props are read-only snapshots

Do not mutate props.

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

Props belong to the caller. Mutating them makes rendering impure and can create surprising behavior elsewhere in the tree.

## Pure rendering

React components should be pure during render.

If two renders receive the same relevant inputs, they should calculate the same result without changing external systems.

Bad:

```jsx
const analyticsEvents = [];

function ProductCard({product}) {
  analyticsEvents.push({type: 'view', id: product.id});
  return <h2>{product.name}</h2>;
}
```

Rendering now changes module state. Repeated or discarded rendering can produce duplicate external behavior.

The render phase should calculate UI. Event-driven side effects belong in event handlers; synchronization with external systems may belong in Effects.

## Destructuring props

These are equivalent ideas:

```jsx
function Avatar(props) {
  return <img src={props.src} alt={props.alt} />;
}
```

```jsx
function Avatar({src, alt}) {
  return <img src={src} alt={alt} />;
}
```

Destructuring often makes a component's direct dependencies easier to see.

## Default prop values

Use JavaScript default parameters for modern function components:

```jsx
function Avatar({size = 48, name, imageUrl}) {
  return (
    <img
      src={imageUrl}
      alt={name}
      width={size}
      height={size}
    />
  );
}
```

The default is used when `size` is `undefined`.

```jsx
<Avatar name="Aisha" imageUrl="/aisha.jpg" />
```

Do not teach function component `defaultProps` as the modern React 19 default pattern.

## Passing objects vs individual props

Both are valid:

```jsx
<ProductCard name={product.name} price={product.price} />
```

and:

```jsx
<ProductCard product={product} />
```

Choose based on the component contract.

Individual props can make dependencies explicit. Passing a domain object is natural when the child genuinely represents that object and needs much of it.

Avoid blindly spreading everything:

```jsx
<ProductCard {...product} />
```

It is concise, but it can hide the component API and accidentally forward data the component should not depend on.

## `children`

Nested JSX is passed through the `children` prop:

```jsx
function Card({children}) {
  return <section className="card">{children}</section>;
}
```

Usage:

```jsx
<Card>
  <h2>Account</h2>
  <p>Manage your profile settings.</p>
</Card>
```

This is **composition**: `Card` owns the container while the caller supplies the inner content.

## Passing JSX as data

`children` is not the only place JSX can be passed.

```jsx
function Page({sidebar, children}) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
```

```jsx
<Page sidebar={<AccountNavigation />}>
  <ProfileSettings />
</Page>
```

This pattern can keep layout components flexible without adding many boolean configuration props.

## Composition vs configuration

A highly configured component can become difficult to understand:

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

A composable API may be more flexible:

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

But composition is not automatically superior. If every caller needs exactly the same structure, a smaller explicit prop API may be easier and safer.

The design question is:

> Which parts should the component own, and which parts should the caller control?

## Callbacks as props

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

The child owns the interaction surface. The parent owns what deletion means for parent/domain state.

```text
parent owns state
      ↓
passes data + callback
      ↓
child renders UI
      ↓
user interacts
      ↓
child calls callback
      ↓
parent updates owned state
```

This is how one-way data flow still supports child-to-parent interactions.

## Choosing component boundaries

Do not split components only because a file has many lines.

Ask whether a part has a meaningful responsibility.

Useful boundaries often appear when:

- a section has its own behavior or state;
- a UI pattern repeats;
- a part represents a domain concept;
- a part can be independently tested;
- a parent is mixing unrelated responsibilities;
- a part forms a useful composition boundary;
- a design-system primitive deserves a stable API;
- a performance boundary is justified by measurement.

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

One component owns several domains and changes for unrelated reasons.

## Too fragmented

```text
CheckoutPage
├── CheckoutTitleWrapper
├── CheckoutTitleText
├── CheckoutTitleIcon
├── CheckoutDivider
├── CheckoutButtonText
└── CheckoutButtonIcon
```

Many tiny components can add indirection without adding meaningful ownership, reuse, or behavior.

Good design sits between those extremes.

## Colocate logic with its owner

If behavior exists only for one feature, keeping it close to that feature is often easier than placing every function in a global utility folder.

```text
features/
└── checkout/
    ├── CheckoutPage.jsx
    ├── AddressForm.jsx
    ├── ShippingOptions.jsx
    └── calculateOrderTotal.js
```

Colocation makes dependencies easier to discover and reduces accidental coupling.

Do not interpret colocation as "put everything in one file." It means related code should have an understandable home near the feature or abstraction it serves.

## Presentational vs domain components

A useful distinction can be:

```text
UI primitive
Button, Dialog, TextField

Feature/domain component
CheckoutSummary, UserPermissions, InvoiceTable
```

Domain components know application concepts. UI primitives try to expose reusable presentation/interaction contracts.

Older React material often teaches "container vs presentational components" as a strict architecture. Treat it as a useful historical pattern, not a rule. Hooks and modern composition provide more ways to separate responsibilities.

## Avoid premature abstraction

A component used once is not a problem.

Do not build a universal abstraction before you understand the actual repeated requirements.

Bad abstraction pressure often creates props such as:

```text
compact
small
smallButWide
useLegacySpacing
noBorderSometimes
specialCheckoutMode
```

A healthier progression is:

```text
build concrete feature
      ↓
observe real repetition
      ↓
identify stable responsibility
      ↓
extract smallest useful API
```

Duplication can be cheaper than the wrong abstraction.

## What happens during rendering?

Suppose:

```jsx
function App() {
  return <ProductCard product={product} />;
}
```

A simplified render model is:

```text
App renders
   ↓
creates ProductCard element description
   ↓
React renders ProductCard with props
   ↓
ProductCard calculates children
   ↓
React reconciles result
   ↓
necessary changes may commit
```

A parent rendering can cause child rendering. That does not mean every child's DOM changes.

Later performance chapters will cover memoization, compiler behavior, and profiling. Do not reach for `memo` just because a child function executed again.

## Common mistakes

### Mutating props

Props are inputs. Calculate new values instead of changing caller-owned data.

### Creating one giant component

Separate meaningful responsibilities and domains.

### Making everything reusable too early

Premature generalization often produces complicated APIs and accidental coupling.

### Passing too many unrelated props

A component with fifteen unrelated props may have too many responsibilities or the wrong boundary.

### Using boolean-prop explosions

When combinations become difficult to reason about, consider composition, separate components, or a more explicit state model.

### Moving state upward "just in case"

State should live as low as possible while still being owned by all consumers that need to coordinate it.

### Wrapping components in `memo` by default

Memoization has costs and depends on stable inputs. Profile first, and account for React Compiler when choosing manual memoization.

## Debugging component data flow

If a child displays the wrong value:

1. inspect the prop value in React DevTools;
2. identify the parent that passed it;
3. find the real source of truth;
4. verify whether the parent calculated/updated the value correctly;
5. check whether state was copied unnecessarily from props;
6. check identity/keys if the wrong child state is being preserved.

```text
wrong child UI
      ↓
inspect child inputs
      ↓
trace prop upward
      ↓
find source of truth
      ↓
fix ownership/calculation
```

## When should I create a component?

Create a component when a piece of UI has a clear responsibility, meaningful reuse, behavior, domain identity, composition role, or an independently useful API.

## When should I not extract a component?

Avoid extraction when it creates indirection without clearer responsibility.

A three-line piece of markup used once can remain where it is if the parent stays understandable.

## Trade-offs

More component boundaries can improve:

- ownership;
- reuse;
- testing;
- readability;
- composition.

But too many boundaries can increase:

- navigation overhead;
- prop plumbing;
- abstraction surface area;
- indirection;
- API maintenance.

Component architecture is a design trade-off, not a line-count optimization.

## Production example

```jsx
function ProductCard({product, onAddToBasket}) {
  const canPurchase = product.inStock && !product.discontinued;

  return (
    <article className="product-card">
      <ProductImage product={product} />

      <div className="product-card__content">
        <h2>{product.name}</h2>
        <ProductPrice price={product.price} currency={product.currency} />

        <StockMessage inStock={product.inStock} />

        <button
          type="button"
          disabled={!canPurchase}
          onClick={() => onAddToBasket(product.id)}
        >
          Add to basket
        </button>
      </div>
    </article>
  );
}
```

This example keeps `ProductCard` responsible for the product-card composition while delegating meaningful sub-responsibilities.

Do not automatically extract `ProductImage`, `ProductPrice`, and `StockMessage`; the example assumes they are meaningful abstractions elsewhere in the product. If they are not, inline markup may be better.

## Exercise

Design components for:

```text
Product Details
├── product image gallery
├── product title
├── rating
├── price
├── variant selector
├── quantity selector
├── add-to-basket action
└── delivery information
```

For each proposed component, answer:

- What responsibility does it own?
- Which props does it receive?
- Does it own changing state or only display data?
- What behavior belongs in the parent?
- Is the abstraction based on real responsibility or only visual size?
- Would composition make the API clearer?

Do not add Context or a global store. Solve the component boundaries first.

## Interview questions

### Junior

What are props, and why should a component not mutate them?

### Mid-level

How do callbacks as props preserve one-way data flow while still allowing a child interaction to update parent-owned state?

### Senior

How do you decide whether to extract a reusable component, and what costs can premature abstraction introduce?

## Summary

Components define **responsibilities**. Props define **inputs**.

Keep this model:

```text
clear responsibility
      +
clear inputs
      +
pure rendering
      +
clear state ownership
      +
deliberate composition
      =
component that is easier to understand and change
```

Do not optimize for the largest possible component or the smallest possible component. Optimize for boundaries that make ownership and change easier to reason about.

## References

- https://react.dev/learn/your-first-component
- https://react.dev/learn/passing-props-to-a-component
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/learn/thinking-in-react
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/reference/react/memo

## Next

Continue with **[useState](../04-hooks/use-state.md)**.