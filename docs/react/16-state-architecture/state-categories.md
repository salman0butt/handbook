---
title: State Architecture — Local, Shared, Server, and External State
description: Classify state before choosing tools. Separate local UI state, lifted/shared client state, server state, URL state, and external-store state.
sidebar_position: 1
---

# State architecture: local, shared, server, and external state

A large React application becomes easier to design when you stop asking:

> Which state library should we use?

and ask first:

> What kind of state is this, who owns it, and what lifetime/subscription model does it need?

Tool choice comes after classification.

## The main categories

A practical model is:

```text
Local UI state
Shared client state
Server state
URL/navigation state
External store state
Derived state
```

These categories can overlap at boundaries, but they produce better questions than putting every value into one global store.

## 1. Local UI state

Examples:

- accordion open/closed;
- selected tab;
- input draft;
- tooltip visibility;
- local sort option;
- wizard step.

Usually:

```jsx
const [open, setOpen] = useState(false);
```

Local state should stay local unless another component genuinely needs to coordinate with it.

### Why locality matters

State close to its consumers gives you:

- clear ownership;
- smaller update scope;
- easier deletion/refactoring;
- less global coupling;
- simpler testing.

Do not lift state just because it may be needed someday.

## 2. Shared client state

Shared client state is React-owned application state needed by multiple components.

Examples:

- current cart draft;
- selected project in a workspace;
- editor state;
- feature preferences;
- authenticated client session metadata;
- cross-component form workflow state.

Possible tools:

```text
lifted useState
useReducer
Context
reducer + Context
external store
```

Choose based on scope, update complexity, frequency, and subscriber needs.

## 3. Server state

Server state originates outside the client and represents remote authoritative data.

Examples:

- products;
- user profile fetched from API;
- invoices;
- inventory levels;
- search results;
- order status.

This state has concerns such as:

```text
loading
cache lifetime
staleness
request deduplication
refetching
retries
pagination
invalidating
optimistic mutation
background refresh
```

React Context can carry server data, but Context is not a cache strategy.

In framework/application ecosystems, server-state libraries or framework data APIs often solve these concerns more completely.

Always label those as ecosystem/framework tools, not React core.

## 4. URL/navigation state

Some application state belongs in the URL because it should survive refresh, support linking, or participate in browser navigation.

Examples:

```text
/search?q=react&page=2
/products?category=lights&sort=price
/dashboard/projects/42
```

Candidates include:

- search query;
- page number;
- filters;
- selected resource identifier;
- active route/tab when navigation semantics matter.

If a user should be able to copy a URL and reproduce the view, the URL may be the right source of truth.

Do not duplicate URL state into local React state unless synchronization is intentional and necessary.

## 5. External store state

An external store lives outside React's state system.

Examples:

- a custom JavaScript store object;
- browser subscription APIs;
- state shared with non-React code;
- a third-party state management store;
- mutable data source with subscribe/getSnapshot semantics.

React provides `useSyncExternalStore` to subscribe safely to these stores.

External state is not automatically “global state.” It means React does not own the underlying storage mechanism.

## 6. Derived state

Derived values can be calculated from existing inputs.

```jsx
const completed = tasks.filter(task => task.done).length;
```

Do not create another state variable unless the value must evolve independently.

Bad:

```jsx
const [completed, setCompleted] = useState(0);
```

if `completed` is always determined by `tasks`.

Derived state should usually remain calculation, not synchronized duplicate state.

## A classification example

Consider an ecommerce page:

```text
Product data from API            → server state
Current route product ID         → URL state
Quantity input                   → local UI state
Cart draft across shop subtree   → shared client state
Cart total                       → derived state
Online/offline browser status    → external subscription state
```

Different values deserve different ownership models even though they appear on the same screen.

## The source-of-truth question

For every value, ask:

```text
Where is the authoritative version?
```

Examples:

```text
input draft             → React component state
order status            → server
search query in URL     → router/browser URL
online status           → browser platform
cart total              → derived from cart items
```

Many bugs come from creating multiple competing sources of truth.

## State lifetime

Ask how long the value should live.

```text
component lifetime
route lifetime
feature-provider lifetime
application lifetime
browser session
server/cache lifetime
```

A modal's `open` state usually should not outlive the modal feature.

A route filter may need to survive component remounts by living in the URL.

A store shared with non-React code may need a lifetime independent of any React root.

## State scope

```text
one component
siblings
feature subtree
multiple distant branches
multiple React roots
React + non-React consumers
```

Scope often tells you whether props/lifting, Context, or an external store is appropriate.

## Update frequency

A theme may change a few times per session.

Pointer coordinates may change dozens of times per second.

A Context solution that is fine for theme data may be poor for a high-frequency shared signal with many consumers.

Always consider:

```text
frequency × number of subscribers × render cost
```

before choosing an architecture.

## Subscription granularity

Context consumers subscribe to the Context value.

External stores may support more fine-grained selectors/subscriptions depending on the store design/library.

If different components need tiny slices of rapidly changing shared data, subscription granularity matters.

## State transitions vs synchronization

Two different problems:

### State transition

```text
user clicks Add
current cart + action
→ next cart
```

Reducer territory.

### External synchronization

```text
current roomId
→ connect to chat server
```

Effect territory.

Do not use reducers to perform synchronization and do not use Effects as state transition engines.

## Client state vs server state example

Suppose a customer profile is loaded from `/api/customer/42`.

Server state:

```js
customer.name
customer.plan
customer.updatedAt
```

Local draft state while editing:

```js
draftName
draftPlan
```

These may intentionally differ while the user edits.

After save, the remote cache/source may be refreshed or updated.

Do not treat the local draft and server record as the same lifecycle problem.

## Avoid the “global store by default” architecture

Bad mental model:

```text
Anything used by two components
      ↓
put it in global store
```

Better:

```text
Can state stay local?
      ↓ no
Can parent own it and pass props?
      ↓ awkward
Is it a subtree-wide dependency?
      ↓ yes
Context / reducer + Context
      ↓
Need independent lifetime or fine-grained external subscriptions?
      ↓ yes
external store
```

## Context is distribution, not ownership

This distinction is important enough to repeat:

```text
useState/useReducer owns React state
Context distributes access
```

A provider can combine both, but those are still separate responsibilities.

## External libraries are ecosystem choices

Examples include Redux Toolkit, Zustand, Jotai, MobX, XState, TanStack Query, and others.

They solve different problems and have different models.

The React handbook should teach their **decision space** without presenting any one library as part of React core.

## Server-state ecosystem tools

TanStack Query, SWR, framework loaders/caches, and similar systems focus on remote data lifecycle.

They are not equivalent to a client-state store.

A mature application may use both:

```text
TanStack Query → server cache
Context/reducer → feature interaction state
local useState → component UI state
URL → navigable filters
```

That is not duplication if each tool owns a different category.

## Persistence does not define ownership

Saving state to `localStorage` does not automatically make `localStorage` the best live source of truth.

You might:

1. initialize React state from storage;
2. let React own the active state;
3. synchronize changes back to storage.

Or you may build a true external-store abstraction around storage events and subscriptions.

Be explicit about which model you are using.

## Questions before introducing global/shared state

Ask:

1. Who writes this value?
2. Who reads it?
3. What is the authoritative source?
4. How long should it live?
5. Does it need browser navigation semantics?
6. Does it come from a server?
7. How often does it update?
8. Do consumers need separate slices?
9. Must non-React code read/write it?
10. What failure mode are we solving with a new tool?

## Architecture example

```text
React application
│
├── URL/router
│   └── projectId, filters, page
│
├── server cache
│   └── projects, users, activity
│
├── feature providers
│   └── editor reducer, checkout workflow
│
├── local component state
│   └── open menus, drafts, focused row
│
└── external store
    └── cross-root/non-React subscription data
```

This is usually more maintainable than one universal store containing every category.

## Exercise

Classify each value:

- current search query;
- modal visibility;
- logged-in user's API profile;
- unsaved editor text;
- theme;
- browser online status;
- selected page number;
- cart total;
- notifications received through a shared external store.

For each, identify source of truth, lifetime, scope, and likely React tool.

## Interview questions

**Mid-level:** What is the difference between client state and server state?

**Senior:** Why might URL state be preferable to Context for filters?

**Staff:** How do lifetime, source of truth, update frequency, and subscription granularity influence state architecture?

## Summary

```text
classify first
   ↓
identify source of truth
   ↓
choose scope + lifetime
   ↓
choose React primitive or ecosystem tool
   ↓
avoid duplicating ownership
```

## References

- https://react.dev/learn/managing-state
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/useSyncExternalStore

## Next

Continue with **useSyncExternalStore and External Subscriptions**.