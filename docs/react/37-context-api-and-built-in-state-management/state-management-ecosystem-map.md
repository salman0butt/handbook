---
title: State Management Ecosystem Map
description: Classify React state before choosing Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, URL state, or local state.
sidebar_position: 1
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramRow,
  DiagramStack,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

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

<VisualDiagram
  title="React state taxonomy"
  subtitle="Classify ownership before choosing a library."
>
  <DiagramStack align="center">
    <DiagramNode title="React application" tone="purple" wide>
      Different categories can coexist without competing for ownership.
    </DiagramNode>
    <DiagramArrow label="classify by source of truth + lifetime" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Local UI state" tone="blue" eyebrow="React-owned">
        `useState` / `useReducer`
      </DiagramNode>
      <DiagramNode title="Shared React-owned state" tone="cyan" eyebrow="Tree-scoped">
        lifted state / Context / reducer + Context
      </DiagramNode>
      <DiagramNode title="Shared client state" tone="green" eyebrow="External store">
        Redux Toolkit / Zustand
      </DiagramNode>
      <DiagramNode title="Server state" tone="orange" eyebrow="Remote authority">
        TanStack Query
      </DiagramNode>
      <DiagramNode title="Form state" tone="red" eyebrow="Workflow draft">
        React Hook Form
      </DiagramNode>
      <DiagramNode title="Navigation state" tone="slate" eyebrow="Shareable">
        URL / router
      </DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Context follows the provider tree">
  <DiagramStack align="center">
    <DiagramNode title="CartProvider" tone="cyan" wide>
      Makes cart state available only to the subtree that needs it.
    </DiagramNode>
    <DiagramArrow label="provides value" />
    <DiagramRow>
      <DiagramNode title="Header → CartCount" tone="blue">
        Reads cart information without prop drilling.
      </DiagramNode>
      <DiagramNode title="Shop → CartDrawer" tone="blue">
        Reads the same provider value deeper in the tree.
      </DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

The provider makes a value available to descendants without forwarding that value through every intermediate component.

Context does not itself create state.

<VisualDiagram title="Ownership vs distribution" compact>
  <DiagramStack align="center">
    <DiagramNode title="useState / useReducer" tone="green">
      **Owns the state** and defines how it changes.
    </DiagramNode>
    <DiagramArrow label="provider publishes current value" />
    <DiagramNode title="Context" tone="cyan">
      **Distributes access** to descendants.
    </DiagramNode>
    <DiagramArrow label="consumers read" />
    <DiagramNode title="Component subtree" tone="blue">
      Uses the value without prop drilling.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

Use Context when the value represents a subtree-wide environment or feature dependency such as:

- theme;
- locale;
- session metadata;
- feature permissions;
- cart state for a storefront subtree;
- reducer state/dispatch for one feature.

## Structured shared client state: Redux Toolkit

Redux Toolkit is appropriate when state transitions, traceability, tooling, middleware, normalized state, and predictable cross-feature ownership matter.

<VisualDiagram title="Redux Toolkit event flow">
  <DiagramStack align="center">
    <DiagramNode title="UI event" tone="blue">A user or system event triggers an action.</DiagramNode>
    <DiagramArrow label="dispatch(action)" />
    <DiagramNode title="Redux Toolkit store" tone="purple">Central external store receives the event.</DiagramNode>
    <DiagramArrow label="slice reducers calculate next state" />
    <DiagramNode title="New store state" tone="green">Immutable next state becomes authoritative.</DiagramNode>
    <DiagramArrow label="selectors read focused slices" />
    <DiagramNode title="Subscribed components" tone="orange">Only selector consumers whose result changed need to update.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Redux is not automatically the right place for:

- every input value;
- every modal;
- raw API cache data;
- temporary component state.

## Lightweight external client state: Zustand

Zustand provides a store outside React with selector-based subscriptions.

<VisualDiagram title="Zustand selector subscriptions">
  <DiagramStack align="center">
    <DiagramNode title="Zustand store" tone="green" wide>
      cart + userPreferences + named actions
    </DiagramNode>
    <DiagramArrow label="components subscribe to selected results" />
    <DiagramRow>
      <DiagramNode title="CartBadge" tone="blue">Selects only cart-derived state.</DiagramNode>
      <DiagramNode title="SettingsPanel" tone="cyan">Selects only preferences.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Server state cache ownership">
  <DiagramStack align="center">
    <DiagramNode title="Database / API" tone="orange">Authoritative remote data source.</DiagramNode>
    <DiagramArrow label="fetch / mutate" />
    <DiagramNode title="QueryClient cache" tone="purple" wide>
      `['products']` · `['user', 42]` · `['orders', filters]`
    </DiagramNode>
    <DiagramArrow label="query observers subscribe" />
    <DiagramNode title="React UI" tone="blue">Receives pending, error, fresh, stale, and updated data states.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="React Hook Form owns the form workflow">
  <DiagramStack align="center">
    <DiagramNode title="useForm()" tone="red" wide>Creates the form control and subscription model.</DiagramNode>
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="Field values" tone="blue">Current local draft values.</DiagramNode>
      <DiagramNode title="Validation + errors" tone="red">Field and form validation results.</DiagramNode>
      <DiagramNode title="Dirty + touched" tone="orange">Interaction and change metadata.</DiagramNode>
      <DiagramNode title="Submission state" tone="purple">Pending / submitted / success lifecycle.</DiagramNode>
      <DiagramNode title="Dynamic fields" tone="green">Arrays and conditional form structure.</DiagramNode>
      <DiagramNode title="Subscriptions" tone="cyan">Components observe only what they need.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram
  title="One application, multiple owners"
  subtitle="The architecture is healthy when each tool owns a distinct category."
>
  <DiagramStack align="center">
    <DiagramNode title="E-commerce application" tone="purple" wide>Different lifecycles are intentionally separated.</DiagramNode>
    <DiagramArrow label="assign state to its natural owner" />
    <DiagramGrid columns={3}>
      <DiagramNode title="useState" tone="blue">Open cart drawer.</DiagramNode>
      <DiagramNode title="Context" tone="cyan">Currency / locale.</DiagramNode>
      <DiagramNode title="Redux Toolkit" tone="purple">Long-lived checkout workflow.</DiagramNode>
      <DiagramNode title="Zustand" tone="green">Design/editor interaction state.</DiagramNode>
      <DiagramNode title="TanStack Query" tone="orange">Products / inventory / orders.</DiagramNode>
      <DiagramNode title="React Hook Form" tone="red">Shipping and billing form.</DiagramNode>
      <DiagramNode title="URL" tone="slate">Search / filters / pagination.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Anti-pattern: one universal global bucket">
  <DiagramStack align="center">
    <DiagramNode title="GlobalStore" tone="red" wide>
      Server responses + dialog state + form drafts + URL params + theme + notifications + everything else.
    </DiagramNode>
    <DiagramArrow label="creates competing lifecycles and ownership" />
    <DiagramNode title="Symptoms" tone="orange" wide>
      Synchronization bugs, broad updates, hard migrations, unclear persistence, and accidental coupling.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

Better:

<VisualDiagram title="Better decision flow" compact>
  <DiagramStack align="center">
    <DiagramNode title="1 · Classify state" tone="blue" />
    <DiagramArrow />
    <DiagramNode title="2 · Choose source of truth" tone="cyan" />
    <DiagramArrow />
    <DiagramNode title="3 · Define scope + lifetime" tone="green" />
    <DiagramArrow />
    <DiagramNode title="4 · Define subscription model" tone="purple" />
    <DiagramArrow />
    <DiagramNode title="5 · Choose the smallest fitting tool" tone="orange" />
  </DiagramStack>
</VisualDiagram>

<DecisionTree
  question="Fast first-pass state decision"
  items={[
    { label: 'Only local UI interaction?', value: 'useState / useReducer' },
    { label: 'Shared subtree dependency?', value: 'Context' },
    { label: 'Structured shared client state?', value: 'Redux Toolkit / Zustand' },
    { label: 'Remote authoritative data?', value: 'TanStack Query' },
    { label: 'Complex form lifecycle?', value: 'React Hook Form' },
    { label: 'Bookmarkable/shareable navigation state?', value: 'URL / router' },
  ]}
/>

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
