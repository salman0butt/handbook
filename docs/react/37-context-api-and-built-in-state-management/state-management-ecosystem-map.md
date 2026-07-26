---
title: State Management Ecosystem Map
description: Classify React state before choosing Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, URL state, or local state.
sidebar_position: 1
---

# State management ecosystem map

React applications do not have one kind of state.

The most important question is not:

> Which state library is best?

It is:

> What kind of state is this, who owns it, how long should it live, and who needs to subscribe to it?

This chapter is the map for the ecosystem sections that follow.

## Version snapshot

This handbook currently targets these stable package lines:

| Tool | Stable line | Primary purpose |
|---|---:|---|
| React | 19.2 docs line | UI/state primitives and rendering model |
| Redux Toolkit | 2.12.0 | structured shared client state and app-wide state transitions |
| Zustand | 5.0.14 | lightweight external store with selector subscriptions |
| TanStack Query | 5.101.4 | server-state fetching, caching, synchronization, and mutations |
| React Hook Form | 7.82.0 | form values, validation, form metadata, and submission workflows |

React Hook Form 8 is still beta at this audit point, so v7 remains the production baseline.

Always re-check package releases before copying version-sensitive APIs into production.

## The state taxonomy

```text
React application
│
├── Local UI state
│   └── useState / useReducer
│
├── Shared React-owned state
│   ├── lifted state
│   ├── Context
│   └── reducer + Context
│
├── Shared external client state
│   ├── Redux Toolkit
│   └── Zustand
│
├── Server state
│   └── TanStack Query
│
├── Form state
│   └── React Hook Form
│
└── Navigation/shareable state
    └── URL / router
```

These categories can work together in the same application.

## Local UI state

Use local state for values whose lifetime and ownership are naturally local.

```tsx
function Dialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </>
  )
}
```

Examples:

- dialog visibility;
- accordion state;
- unsaved input draft;
- selected row;
- hover/focus coordination;
- local wizard step.

Do not move state into a global store only because two descendants may eventually need it.

## Shared subtree state: Context

Context is best understood as a **tree-scoped distribution mechanism**.

```text
CartProvider
│
├── Header
│   └── CartCount
│
└── Shop
    └── CartDrawer
```

The provider makes a value available to descendants without forwarding that value through every intermediate component.

Context does not itself create state.

```text
useState / useReducer
        │
        ▼
     OWNS STATE
        │
        ▼
      Context
        │
        ▼
DISTRIBUTES ACCESS
```

Use Context when the value represents a subtree-wide environment or feature dependency such as:

- theme;
- locale;
- session metadata;
- feature permissions;
- cart state for a storefront subtree;
- reducer state/dispatch for one feature.

## Structured shared client state: Redux Toolkit

Redux Toolkit is appropriate when state transitions, traceability, tooling, middleware, normalized state, and predictable cross-feature ownership matter.

```text
Component
   │
   │ dispatch(action)
   ▼
Redux Toolkit Store
   │
   ▼
Slice reducers
   │
   ▼
New state
   │
   ▼
Selectors
   │
   ▼
Subscribed components
```

Redux is not automatically the right place for:

- every input value;
- every modal;
- raw API cache data;
- temporary component state.

## Lightweight external client state: Zustand

Zustand provides a store outside React with selector-based subscriptions.

```text
Zustand store
├── cart
├── userPreferences
└── actions
      │
      ├── selector → CartBadge
      └── selector → SettingsPanel
```

Use it when you want:

- an external store;
- low ceremony;
- independent selector subscriptions;
- state access outside React;
- middleware such as persistence/devtools;
- multiple stores with focused ownership.

A small API does not remove the need for architecture.

## Server state: TanStack Query

Server state is different because the client is not authoritative.

```text
Database / API
      │
      ▼
 Query Client
      │
      ├── ['products']
      ├── ['user', 42]
      └── ['orders', filters]
      │
      ▼
 React observers
```

Server state involves concerns such as:

- freshness;
- caching;
- stale data;
- refetching;
- retries;
- invalidation;
- pagination;
- optimistic mutations;
- background synchronization.

TanStack Query is not just another Redux replacement. It solves a different lifecycle problem.

## Form state: React Hook Form

A complex form has its own state model:

```text
useForm()
│
├── field values
├── validation
├── errors
├── dirty state
├── touched state
├── pending/submission state
└── dynamic fields
```

React Hook Form focuses on forms rather than general application state.

Do not put an entire form into Redux or Zustand by default merely because it has many fields.

## URL state

State belongs in the URL when users should be able to refresh, bookmark, share, or navigate through it.

```text
/products?category=lights&sort=price&page=2
```

Candidates include:

- search query;
- filters;
- page number;
- selected resource ID;
- route-level tab;
- sort order.

Duplicating URL state into a client store creates synchronization work and can produce competing sources of truth.

## One application can use several tools

A mature application might intentionally use all of these:

```text
E-commerce application
│
├── useState
│   └── open cart drawer
│
├── Context
│   └── currency / locale
│
├── Redux Toolkit
│   └── long-lived checkout workflow
│
├── Zustand
│   └── design/editor interaction state
│
├── TanStack Query
│   └── products / inventory / orders
│
├── React Hook Form
│   └── shipping and billing form
│
└── URL
    └── search / filters / pagination
```

This is not duplication when each tool owns a distinct category.

## Decision questions

For each value, ask:

1. What is the authoritative source?
2. Who writes it?
3. Who reads it?
4. How long should it live?
5. How frequently does it update?
6. Does it need independent subscriptions?
7. Does it come from a server?
8. Should users be able to share it in a URL?
9. Is it specifically form lifecycle state?
10. Must non-React code access it?

## Common architecture mistake: one global bucket

Bad:

```text
GlobalStore
├── server responses
├── dialog state
├── user form drafts
├── search URL params
├── theme
├── notifications
└── every other value
```

Better:

```text
classify state
    ↓
choose source of truth
    ↓
choose scope/lifetime
    ↓
choose subscription model
    ↓
choose the smallest appropriate tool
```

## Interview questions

**Junior:** What is the difference between local state and shared state?

**Mid-level:** Why is TanStack Query not equivalent to Redux or Zustand?

**Senior:** How do source of truth, lifetime, update frequency, and subscriber granularity affect state architecture?

**Staff:** How would you migrate a large application away from a single universal store without creating duplicate ownership during the transition?

## References

- https://react.dev/learn/managing-state
- https://react.dev/reference/react/useContext
- https://redux.js.org/tutorials/quick-start
- https://zustand.docs.pmnd.rs/reference/apis/create
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://react-hook-form.com/docs
