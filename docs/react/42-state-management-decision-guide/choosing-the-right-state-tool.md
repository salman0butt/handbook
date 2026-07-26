---
title: Choosing the Right State Tool
description: Compare local state, Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, and URL state by ownership, lifetime, subscriptions, and failure modes.
sidebar_position: 1
---

# Choosing the right state tool

The right state tool depends on the state category.

Do not begin architecture by choosing a library.

Begin by identifying ownership.

## The decision tree

```text
What kind of state is this?
          │
          ├── local interaction/UI?
          │       └── useState / useReducer
          │
          ├── shared subtree environment/feature state?
          │       └── Context (+ reducer when useful)
          │
          ├── structured shared client state?
          │       ├── Redux Toolkit
          │       └── Zustand
          │
          ├── remote/server-owned data?
          │       └── TanStack Query / framework server cache
          │
          ├── complex form lifecycle?
          │       └── React Hook Form
          │
          └── shareable navigation state?
                  └── URL/router
```

## Comparison matrix

| Tool | Best fit | Source of truth | Subscription model | Main risk |
|---|---|---|---|---|
| `useState` | local UI state | component | React render tree | lifting too early |
| `useReducer` | local/feature transition model | component/provider | React render tree | using reducer for side effects |
| Context | subtree-wide dependency/state access | provider owner | Context value | giant broad providers |
| Redux Toolkit | structured shared client state | Redux store | selectors | global dumping ground |
| Zustand | lightweight external client state | Zustand store | selectors | hidden module-global coupling |
| TanStack Query | server state/cache lifecycle | server + query cache snapshot | query observers | treating cache as client-owned truth |
| React Hook Form | form values/validation metadata | form control | field/form subscriptions | duplicating values into global state |
| URL/router | navigable/shareable state | URL | router/location | syncing duplicate client state |

## Question 1: Who owns the authoritative value?

Examples:

```text
modal open        → component
cart draft        → client feature/store
product inventory → server
search page       → URL
checkout fields   → form draft
```

If you cannot name the authoritative owner, adding a library usually makes the ambiguity worse.

## Question 2: How long should it live?

```text
render/component lifetime
route lifetime
feature lifetime
application lifetime
browser session
persisted local lifetime
server/cache lifetime
```

A tooltip should not accidentally live for the whole application.

A multi-route checkout draft may intentionally outlive one screen.

## Question 3: Who needs it?

```text
one component
siblings
one feature subtree
many distant features
multiple React roots
React + non-React code
```

Scope strongly influences the architecture.

## Question 4: How often does it change?

```text
theme: rarely
form input: every keystroke
pointer position: many times per second
server inventory: whenever backend changes
```

High-frequency shared data makes subscription granularity more important.

## Question 5: Is the data remote?

If the authoritative data lives on a server, ask whether you need:

- caching;
- freshness/staleness;
- background refetch;
- retries;
- invalidation;
- pagination;
- optimistic reconciliation.

If yes, this is server-state territory.

Do not rebuild these semantics in Context, Redux, or Zustand unless you have a deliberate custom requirement.

## Question 6: Does it belong in the URL?

If users should be able to:

- bookmark it;
- share it;
- refresh without losing it;
- use back/forward navigation;

then URL state may be the correct source.

Examples:

```text
/search?q=react&page=2
/dashboard?team=payments&range=30d
```

## Context vs Redux Toolkit

Choose Context when:

- tree scope is meaningful;
- state is coherent within one feature/environment;
- event/middleware/devtools requirements are low;
- subscriber granularity is acceptable.

Choose Redux Toolkit when:

- state spans many domains/features;
- action-driven transitions matter;
- middleware/traceability matters;
- normalized data or strong public selector APIs matter;
- teams benefit from explicit store conventions.

## Context vs Zustand

Choose Context when provider placement clearly expresses ownership.

Choose Zustand when:

- external store lifetime matters;
- non-React access matters;
- selector-level subscriptions are valuable;
- a lightweight multiple-store architecture fits.

## Redux Toolkit vs Zustand

```text
Redux Toolkit
→ stronger conventions + event/reducer model + middleware/tooling

Zustand
→ lighter store API + actions + selector subscriptions
```

A team that needs strict shared conventions may value Redux's structure.

A focused client-side feature may benefit from Zustand's smaller API surface.

## Redux Toolkit vs TanStack Query

Redux Toolkit core is for client state.

RTK Query/TanStack Query are server-state tools.

If an application already uses Redux extensively, RTK Query may integrate naturally.

If Redux is otherwise unnecessary, TanStack Query can provide server-state behavior without adding Redux architecture.

## Zustand vs TanStack Query

Do not ask "which is better?"

Ask:

```text
Who owns the data?

client → Zustand may fit
server → TanStack Query may fit
```

A UI can use both.

## React Hook Form vs global store

Form input values are usually a local workflow draft.

```text
React Hook Form
→ values + validation + dirty/touched + dynamic fields
```

Do not mirror every keystroke into Redux/Zustand unless another part of the product genuinely requires live shared ownership.

## Example: SaaS dashboard

```text
URL
├── selected workspace ID
├── date range
└── filters

TanStack Query
├── workspace
├── analytics
└── users

Context
└── locale / feature environment

Zustand
└── dashboard editor layout interactions

React Hook Form
└── report configuration form

useState
└── local popover open/closed
```

No single store owns everything.

## Example: ecommerce

```text
TanStack Query
├── catalogue
├── inventory
└── account orders

Redux Toolkit or Zustand
└── client-owned cart/checkout workflow if requirements justify it

React Hook Form
└── shipping + billing draft

URL
└── search filters / category / page

Context
└── currency / locale
```

## Red flags

A state architecture needs review when:

- one tool owns every category;
- the same data exists in two stores;
- API data is copied into Redux/Zustand after every query;
- form fields are mirrored into a global store without reason;
- URL filters are duplicated and synchronized manually;
- authorization depends on client state;
- state lifetime is longer than the feature that owns it.

## Interview framework

When asked "Which state library would you use?", do not answer with a brand first.

A senior answer sounds like:

```text
1. classify the state
2. identify source of truth
3. define lifetime and scope
4. inspect update frequency/subscriptions
5. identify persistence/navigation/server requirements
6. then choose the smallest tool that fits
```

## Interview questions

**Mid-level:** Why is URL state different from global client state?

**Senior:** How do you decide between Context and Zustand?

**Senior:** Why should server state usually not be copied into Redux/Zustand?

**Staff:** How would you audit a large application that uses Redux, Zustand, TanStack Query, Context, and React Hook Form simultaneously?

## References

- https://react.dev/learn/managing-state
- https://redux.js.org/tutorials/index
- https://zustand.docs.pmnd.rs
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://react-hook-form.com/docs
