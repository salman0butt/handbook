---
title: Combining State Tools Without Duplicating State
description: Compose React state tools by ownership boundaries, avoid duplicate sources of truth, and migrate between Context, Redux, Zustand, TanStack Query, and React Hook Form safely.
sidebar_position: 2
---

# Combining state tools without duplicating state

Large React applications often use more than one state tool.

That is healthy when each tool owns a different category.

It becomes dangerous when the same value is copied into several stores.

## The ownership rule

For every value, choose one authoritative owner.

```text
server record
   │
   └── authoritative on server / server-state cache snapshot

form draft
   │
   └── authoritative in form control while editing

URL filter
   │
   └── authoritative in URL

local dialog
   │
   └── authoritative in component state
```

Other layers may derive or display the value, but they should not silently become competing owners.

## Good composition

```text
Product edit page
│
├── URL
│   └── productId
│
├── TanStack Query
│   └── saved Product from server
│
├── React Hook Form
│   └── unsaved product draft
│
├── Context
│   └── locale / permissions environment
│
└── useState
    └── delete-confirmation dialog
```

Each layer has a distinct responsibility.

## Bad composition: copying server data everywhere

```text
TanStack Query cache
       │
       ▼
copy into Redux
       │
       ▼
copy into component state
       │
       ▼
copy into form
```

Now four versions may disagree.

Better:

```text
TanStack Query cache
       │
       ├── read directly for display
       └── initialize form draft when edit begins
                    │
                    ▼
             React Hook Form draft
```

The form draft is intentionally separate because unsaved edits are a different lifecycle.

## Query data → form defaults

A common pattern:

```tsx
const profileQuery = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => getProfile(userId),
})
```

When the edit workflow starts, initialize the form from the saved record.

```text
saved profile snapshot
       │
       ▼
form default values
       │
       ▼
user edits independent draft
```

Do not automatically reset the form every time the query background-refetches while the user is typing.

You need a product rule for reconciling remote changes with local unsaved edits.

## React Hook Form + TanStack Query mutation

```text
form validates
    │
    ▼
submit values
    │
    ▼
TanStack mutation
    │
    ▼
server validates + persists
    │
    ├── error → map to form/server error UI
    └── success
          │
          ├── update/invalidate query cache
          └── reset form to saved values
```

This is a common and clean separation.

## Redux Toolkit + TanStack Query

If Redux owns shared client workflow state and TanStack Query owns server state:

```text
Redux Toolkit
├── checkout step
├── client-side workflow flags
└── unsaved cross-route decisions

TanStack Query
├── products
├── inventory
└── orders
```

Avoid copying every query result into Redux.

If the application already uses Redux extensively, evaluate RTK Query as an alternative server-state layer before adding a second query cache.

## Zustand + TanStack Query

A diagram/editor application might use:

```text
Zustand
├── selected nodes
├── zoom
├── active tool
├── drag state
└── unsaved local interaction state

TanStack Query
├── document record
├── collaborators
└── server history
```

The UI can combine both without one replacing the other.

## Context + external store

Context can inject a specific store instance into a subtree.

```text
Store factory
    │
    ▼
Provider chooses instance
    │
    ▼
feature subtree
    │
    ▼
components subscribe to store
```

This is useful when you want external-store selector semantics but still need provider-scoped instances, testing isolation, or SSR request isolation.

## URL + store

Do not keep two synchronized copies of a filter unless necessary.

Bad:

```text
URL page=2
   ↕ Effect sync
Redux page=2
```

Every synchronization bridge introduces failure modes.

If the page number is navigable/shareable, read/write the URL as the source of truth.

A client store may still own temporary UI that does not belong in navigation history.

## Persistence + server state

Persisting a query result or global store does not make it authoritative.

```text
localStorage
→ client-controlled cached/persisted snapshot

server
→ authoritative domain record
```

When restoring persisted state:

- validate shape/version;
- consider expiration;
- avoid secrets;
- reconcile with current server state when required.

## Migration: Context → Zustand

A safe migration can use an adapter period.

```text
old Context consumers
        │
        ▼
compatibility provider reads Zustand store
        │
        ▼
Zustand becomes new owner
        │
        ▼
consumers migrate gradually
```

Important: do not let Context and Zustand independently mutate separate copies.

One owner; temporary adapters only.

## Migration: Context → Redux Toolkit

```text
1. define target Redux domain slice
2. migrate transition logic
3. expose selectors/actions
4. make old provider read/write the Redux source temporarily
5. migrate consumers
6. delete adapter/provider state
```

Avoid a dual-write period where both stores pretend to be authoritative.

## Migration: Redux → Zustand

Do not translate slices mechanically.

First classify state again.

You may discover:

```text
old Redux slice
├── server records       → TanStack Query
├── URL filters          → router
├── form draft           → React Hook Form
└── actual shared client state → Zustand
```

A migration is an opportunity to fix ownership, not merely change syntax.

## Migration: manual API state → TanStack Query

Legacy architecture:

```text
useEffect
├── request
├── loading
├── error
├── retry
├── stale flag
└── refresh function
```

Migration:

```text
1. define query key
2. define query function
3. move freshness/cache policy to query options
4. migrate mutation/invalidation paths
5. delete duplicated loading/cache state
```

Do one domain at a time.

## Migration: global form draft → React Hook Form

If Redux/Zustand currently owns every field:

```text
1. identify why form data was global
2. keep only state that must outlive the form
3. move active form draft into RHF
4. initialize from authoritative workflow state
5. write back only at explicit save/step boundaries
```

This often reduces update volume and coupling.

## State ownership document

For complex systems, maintain a small architecture table:

| State | Owner | Lifetime | Persistence | Consumers |
|---|---|---|---|---|
| product record | TanStack Query/server | cache/server | server | product UI |
| edit draft | RHF | edit session | optional draft | form |
| active workspace | URL | navigation | URL | route/page |
| editor selection | Zustand | editor session | no | canvas/sidebar |
| locale | Context | app/subtree | preference | many descendants |

This is more useful than a generic rule saying "we use Redux for state."

## Failure-mode review

For every bridge between tools, ask:

```text
What if owner A changes but B does not?
What if hydration restores stale B?
What if background refetch arrives during local editing?
What if navigation changes the URL?
What if server rejects optimistic client state?
```

If the answer requires many synchronization Effects, reconsider ownership.

## Staff-level decision framework

A strong architecture minimizes synchronization edges.

```text
fewer sources of truth
        ↓
fewer synchronization bridges
        ↓
fewer race conditions
        ↓
easier debugging
```

The goal is not to minimize the number of libraries at all costs.

The goal is to make ownership obvious.

## Interview questions

**Mid-level:** Is using Redux and TanStack Query together automatically redundant?

**Senior:** Why is copying query data into a global client store often a smell?

**Senior:** How would you migrate Context state to Zustand without dual ownership?

**Staff:** You inherit an app where URL params, Redux, Zustand, and component state all contain the same filters. How do you redesign it while keeping the product working during migration?

## Summary

```text
classify state
    ↓
choose one owner
    ↓
allow other tools to derive/observe
    ↓
make synchronization explicit only where necessary
    ↓
avoid dual writes
```

## References

- https://react.dev/learn/choosing-the-state-structure
- https://redux.js.org/style-guide
- https://zustand.docs.pmnd.rs
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://react-hook-form.com/docs
