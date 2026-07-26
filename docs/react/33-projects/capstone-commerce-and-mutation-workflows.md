---
title: Capstone — Commerce and Mutation Workflows
description: A React capstone for forms, actions, optimistic UI, server authority, accessibility, caching, SSR/RSC boundaries, and failure recovery.
sidebar_position: 3
---

# Capstone — commerce and mutation workflows

This capstone focuses on one of the hardest real product problems: **interactive mutation flows where the server remains authoritative but the UI must feel immediate**.

Use an ecommerce domain because it naturally creates realistic constraints around inventory, pricing, permissions, validation, failures, and stale data.

## Product brief

Build a storefront with:

- product listing;
- product details;
- variant selection;
- cart;
- quantity updates;
- promo code;
- checkout details;
- stock validation;
- optimistic cart interactions;
- authentication-aware actions;
- server-rendered product pages;
- accessible loading/error/success states.

The objective is not to build a payment processor. The objective is to design the frontend/server interaction correctly.

## Core authority model

```text
Browser intent
   ↓
optimistic projection
   ↓
server mutation
   ↓
validation + authorization
   ↓
canonical result
   ↓
UI reconciliation
```

Do not let optimistic UI become a second source of truth.

## State categories

### Product catalog

Server state.

The server owns:

- price;
- stock;
- availability;
- SKU/variant data;
- promotion eligibility.

### Cart draft

The exact ownership can vary.

Possible architectures:

- server-owned authenticated cart;
- local guest cart synchronized later;
- hybrid cart with server reconciliation.

Document the choice and trade-offs.

### Form drafts

Usually local/uncontrolled client state until submission.

### Search/filter state

Often URL state if users benefit from shareability/history.

### Authentication/authorization

Authentication state may be represented in the UI, but **authorization is enforced server-side**.

## Server-rendered product page

If using an RSC/SSR-capable framework, create a product page where server-owned data is loaded on the server.

A conceptual split:

```text
ProductPage (Server)
├── ProductMedia (Server or Client)
├── ProductInformation (Server)
├── VariantPicker (Client)
└── AddToCart (Client)
```

`'use client'` marks a client module boundary. It does not mean the component can never participate in server pre-rendering.

## Serialization boundary exercise

Try to pass only serializable props across the Server → Client boundary.

Good:

```ts
{
  productId: 'p_123',
  variants: [
    { id: 'v_1', label: 'Black', available: true }
  ]
}
```

Not a valid boundary design:

```ts
{
  databaseConnection,
  onSecureServerMutation,
  classInstanceWithMethods
}
```

Keep server-only capabilities on the server.

## Add-to-cart Action

Implement a mutation with a form Action, Server Function, or equivalent server mutation boundary.

The server must validate:

- product exists;
- variant exists;
- requested quantity is allowed;
- current stock permits the operation;
- authenticated user/cart relationship is valid;
- price is calculated from trusted server data.

Never trust a client-submitted price.

## `useActionState` exercise

Model a mutation response explicitly:

```ts
type CartActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; cartVersion: string };
```

Avoid a bag of unrelated booleans such as:

```ts
{
  loading: boolean,
  error: boolean,
  success: boolean
}
```

when those combinations can represent impossible states.

## `useFormStatus`

Use a descendant submit component to surface pending state without manually wiring a loading boolean through the whole form.

Be able to explain:

- why it must be used from a descendant of the relevant form;
- what `pending` represents;
- why pending UI should not remove essential labels or context.

## Optimistic cart update

Use `useOptimistic` or an equivalent optimistic projection.

Example intent:

```text
Current canonical cart quantity: 1
User clicks +
Optimistic UI: 2
Server result: accepted → canonical becomes 2
Server result: rejected → projection rolls back to 1
```

### Required failure case

Simulate inventory changing between render and mutation.

The UI displays:

```text
2 available
```

but another customer buys the last item before this user submits.

Your server must reject the mutation correctly.

The frontend must recover gracefully.

This demonstrates why client state and TypeScript cannot enforce inventory truth.

## Concurrent mutation challenge

Test rapid quantity updates:

```text
1 → 2 → 3 → 4
```

Questions to solve:

- are mutations serialized?
- can responses complete out of order?
- does the framework/action layer preserve ordering?
- can optimistic state become inconsistent?
- should the UI coalesce changes?

Document the chosen behavior rather than assuming request order.

## Promo code workflow

This is a good place for server authority.

The client can submit:

```text
SUMMER20
```

but the server determines:

- whether the code exists;
- whether it is expired;
- whether the user/cart qualifies;
- the actual discount;
- whether the code can combine with another promotion.

The frontend should display a human-readable result without calculating trusted discount values itself.

## Checkout form architecture

Build a checkout form with:

- shipping address;
- contact details;
- delivery selection;
- optional notes;
- server validation;
- error summary;
- field-level errors;
- focus movement on failed submit.

Use visible labels and native input semantics.

Runtime validation is required even with perfect TypeScript types.

## Progressive enhancement exercise

If your framework supports form Actions with progressive enhancement, test what happens before the client JavaScript fully initializes.

The project should answer:

- can the form still submit?
- what changes after hydration?
- where does optimistic behavior require client JavaScript?
- how are server validation errors represented?

## Suspense architecture

Do not put the entire store under one fallback.

Possible hierarchy:

```text
Store shell
├── product information
├── recommendation boundary
├── reviews boundary
└── cart summary boundary
```

Independent content should be allowed to reveal independently when the UX benefits from it.

## Error architecture

Different failures require different UI.

### Product not found

Routing/data error.

### Recommendation service fails

Local optional-feature failure.

### Add-to-cart fails

Mutation feedback near the user action.

### Unexpected render failure

Error Boundary.

### Whole app cannot initialize

Root-level fallback/observability path.

Do not use one generic "Something went wrong" strategy for every class of failure.

## Cache architecture

Document each cache separately.

Possible layers:

```text
CDN / page cache
server request cache
application data cache
data-fetching library cache
browser HTTP cache
```

React `cache()` in an RSC environment is not equivalent to Redis or a durable application cache.

Mutation invalidation is a data-layer/framework concern that must be designed explicitly.

## Security review

Threat-model at least:

- price manipulation;
- forged product IDs;
- unauthorized cart access;
- redirect URL abuse;
- raw HTML product descriptions;
- third-party analytics/payment scripts;
- telemetry containing addresses or tokens;
- Server Function arguments;
- replay/double-submit behavior.

## Accessibility requirements

The primary shopping and checkout workflow must work with:

- keyboard only;
- meaningful button names;
- product variant labels;
- stock/error announcements;
- visible input labels;
- error summary links/focus;
- correct dialog behavior if the cart uses an overlay;
- reduced-motion preferences where animation is used.

## Testing portfolio

### Component/integration

Test:

- variant selection;
- quantity validation;
- pending add-to-cart;
- optimistic success;
- optimistic rollback;
- promo validation;
- checkout errors;
- focus after failed submit.

### Server mutation tests

Test:

- unauthorized cart access;
- tampered price ignored;
- invalid product ID;
- stale inventory;
- invalid promo;
- duplicate mutation semantics.

### E2E

Protect:

```text
Browse → select variant → add to cart → update quantity → checkout validation
```

and at least one failure flow.

## Performance exercise

Measure:

- product page initial load;
- client JavaScript size;
- cart interaction responsiveness;
- recommendation waterfall;
- hydration cost;
- image/resource loading behavior.

Then make one measured improvement.

Possible improvements:

- move server-only rendering out of client bundle;
- lazy-load an optional feature;
- preload a critical resource;
- remove a request waterfall;
- narrow a broad state update.

## Architecture review questions

1. Which values can the client trust?
2. Which values must be recalculated on the server?
3. Why is a specific component a Client Component?
4. What crosses the serialization boundary?
5. What happens when inventory changes during a mutation?
6. How does optimistic UI roll back?
7. Which failures are Error Boundary concerns vs expected mutation errors?
8. What is cached, where, and for how long?
9. How does the page behave before hydration completes?
10. How would you prevent sensitive customer data from leaking into logs?

## Completion standard

The capstone is complete when the UI is not only pleasant in the happy path, but also correct under stale inventory, invalid input, unauthorized actions, slow networks, server errors, and partial loading.