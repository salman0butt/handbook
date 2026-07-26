---
title: Component and State Architecture
description: Designing React boundaries around ownership, data flow, state categories, async work, and maintainable feature structure.
sidebar_position: 1
---

# Component and State Architecture

Good React architecture makes the correct behavior easy to express.

It aligns:

- component boundaries;
- state ownership;
- data flow;
- async boundaries;
- loading/error boundaries;
- testing boundaries;
- server/client boundaries.

The goal is not to create the most abstract component tree.

The goal is to make change predictable.

## Architecture starts with ownership

For every piece of state, ask:

```text
Who owns it?
Who reads it?
Who writes it?
How long should it live?
Should it survive navigation?
Is it local, URL, server, external, or derived?
```

A component tree is easier to maintain when ownership is obvious.

## Local state by default

If only one small region needs the state, keep it local.

```jsx
function AccordionItem() {
  const [open, setOpen] = useState(false);
  // ...
}
```

Do not promote state globally “just in case.”

Global scope creates coupling.

## Lift only when coordination requires it

If two siblings must agree:

```text
Checkout
 ├── ShippingMethod
 └── OrderSummary
```

then the closest shared owner may be `Checkout`.

This preserves one source of truth.

## Feature-oriented structure

A scalable codebase often benefits from grouping by feature instead of by file type.

Instead of:

```text
components/
hooks/
reducers/
api/
```

consider:

```text
features/
  checkout/
    components/
    hooks/
    api/
    state/
  search/
    components/
    hooks/
    api/
```

Shared primitives can live separately.

This keeps related behavior close together.

## Separate domain logic from view details

A component should not automatically own every rule it displays.

Example:

```js
function calculateOrderTotal(lines, discount) {
  // pure domain logic
}
```

Then UI code can render the result.

Pure domain functions are easy to test without React.

## Component responsibilities

A useful component boundary often has one clear responsibility:

- render a reusable UI primitive;
- own a local interaction;
- orchestrate a feature;
- provide Context;
- bridge to a third-party system;
- define an async/loading boundary.

Avoid both extremes:

```text
one 2,000-line component
```

and

```text
40 tiny wrapper components with no meaningful boundary
```

## Container/presentational ideas without dogma

The old “container vs presentational component” rule can still be useful as a mental model, but modern React mixes Hooks and composition more naturally.

Useful separation:

```text
feature orchestration
vs
reusable rendering primitive
```

Not every component must fit a rigid category.

## Custom Hooks as behavior boundaries

A custom Hook can package reusable React behavior:

```js
function useCheckoutDraft(orderId) {
  // state, subscriptions, actions
}
```

Good custom Hooks usually expose a small domain-oriented API.

Prefer:

```js
const { draft, updateQuantity, submit } = useCheckoutDraft(orderId);
```

over exposing every internal setter and ref.

## Context as dependency propagation

Use Context when a dependency belongs to a subtree and prop drilling would obscure the API.

Examples:

- theme;
- authenticated session;
- feature-scoped reducer state;
- locale;
- design-system configuration.

Context is not automatically the state owner.

It can propagate a value owned elsewhere.

## Split read/write APIs when useful

For reducer architecture:

```text
CartStateContext
CartDispatchContext
```

This can clarify dependencies and reduce accidental coupling.

Consumers that only dispatch do not need to read the whole state value.

## URL as architecture

Route-relevant state belongs in navigation when users expect it to be shareable.

Examples:

```text
/search?q=react&page=3
/dashboard?range=30d
/products?sort=price
```

Treating this purely as component state can break back/forward behavior and deep links.

## Server state architecture

Remote data should usually have a clear owner responsible for:

- fetching;
- caching;
- retries;
- invalidation;
- optimistic updates;
- consistency.

Do not let every component invent its own fetch/cache protocol.

Framework data layers, RSC, or dedicated server-state libraries can provide a consistent model.

## Async boundaries

Map asynchronous behavior to UI boundaries deliberately.

```text
Page
 ├── Header
 └── Suspense boundary
      └── Results
```

A Suspense boundary defines a reveal unit.

An Error Boundary defines a failure unit.

A Transition defines an update-priority unit.

Architecture improves when these boundaries match user experience.

## Server and client boundaries

With React Server Components, decide which code truly needs the client runtime.

Server-friendly responsibilities:

- data access;
- secret-bearing integrations;
- heavy transformation;
- non-interactive rendering.

Client responsibilities:

- stateful interaction;
- browser APIs;
- event handlers;
- layout measurements;
- client subscriptions.

Keep `'use client'` boundaries narrow when practical.

## Avoid accidental client expansion

If a high-level file is marked `'use client'`, everything imported through that client module graph may become part of the client bundle.

Better architecture often moves the interactive island deeper:

```text
Server Page
 ├── Server ProductDetails
 └── Client AddToCartButton
```

rather than making the entire page a Client Component.

## State machine thinking

Complex UI often becomes clearer when states are explicit.

Bad booleans:

```js
isLoading
isError
isSuccess
isSaving
```

Impossible combinations may occur.

Prefer a discriminated model:

```ts
type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: Data }
  | { type: 'error'; message: string };
```

Reducers work well when transitions matter.

## Event-driven APIs

Components are easier to reuse when APIs express user intent.

Prefer:

```jsx
<Dialog onClose={handleClose} />
```

over leaking internal implementation details:

```jsx
<Dialog setInternalOpenState={setOpen} />
```

Prefer domain actions:

```js
addItem(productId)
removeItem(productId)
checkout()
```

over raw setters:

```js
setCart(...)
```

## Avoid prop tunneling via giant objects

Bad:

```jsx
<Checkout config={appEverything} />
```

The component becomes coupled to unrelated fields.

Prefer smaller explicit contracts.

This also improves memoization and testing.

## Boundaries for third-party integrations

Wrap imperative libraries behind one React boundary.

Example:

```text
MapPanel
  ↓
useMapInstance
  ↓
third-party map SDK
```

Keep lifecycle, refs, cleanup, and synchronization centralized.

Do not scatter imperative calls across unrelated components.

## Error architecture

Errors should fail at meaningful product boundaries.

Possible structure:

```text
AppErrorBoundary
 └── Route
      ├── Sidebar
      └── WidgetErrorBoundary
           └── AnalyticsWidget
```

A chart failure should not necessarily destroy the entire application shell.

## Loading architecture

Likewise, loading boundaries should match reveal expectations.

Do not place one giant Suspense boundary around the whole app if independent areas can reveal separately.

Do not scatter dozens of tiny boundaries that create visual noise.

## Data transformation placement

Ask where expensive transformations belong.

Options:

- database query;
- server function;
- Server Component;
- cached server layer;
- client calculation;
- worker.

The nearest code location is not always the right execution location.

## Dependency direction

Feature code should usually depend on lower-level shared primitives, not the reverse.

```text
shared/button
   ↑
checkout/payment-form
```

Avoid shared primitives importing product-specific feature logic.

This keeps reuse real.

## Architecture smells

### Giant Context

One provider owns unrelated state and updates everything.

### Prop drilling through many components that do not care

May indicate Context/composition boundary is missing.

### Context for one local child

May be unnecessary abstraction.

### Many Effects syncing React state to React state

Often duplicated/derived state.

### Components importing each other's internals

Feature boundaries are leaking.

### Shared folder becoming a dumping ground

Only move code to shared when multiple consumers have a stable common abstraction.

## Architecture review checklist

For a feature, verify:

1. state owners are clear;
2. server/URL/local/external state are distinguished;
3. domain logic can be tested independently;
4. Context values are scoped by domain and frequency;
5. async/loading/error boundaries match UX;
6. client boundaries are no broader than necessary;
7. third-party imperative code is isolated;
8. component APIs express intent;
9. no duplicated source of truth exists;
10. shared abstractions are actually shared.

## Exercise

Design architecture for an ecommerce product page containing:

- server-rendered product data;
- image gallery interaction;
- cart state shared with header;
- URL-selected variant;
- reviews loaded later;
- recommendation carousel;
- analytics integration;
- Add to Cart optimistic state.

For each responsibility, define:

- owner;
- state category;
- server/client boundary;
- Suspense/Error Boundary placement;
- public component API.

## Interview questions

### What determines where state should live?

The lowest owner that must coordinate all components reading or writing that state, while respecting its lifetime and category such as local, URL, server, or external state.

### Why are narrow Client Component boundaries useful?

They can reduce client JavaScript and keep server-only work out of the client module graph while preserving interactivity where needed.

### When is a custom Hook a good abstraction?

When multiple components need the same React behavior or when complex feature behavior benefits from a small domain-oriented API boundary.

### What is an architecture smell involving Effects?

Using Effects to synchronize duplicated React state that could be derived directly or updated at the event/reducer source.
