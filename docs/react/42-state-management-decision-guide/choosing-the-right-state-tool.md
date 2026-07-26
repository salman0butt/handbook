---
title: Choosing the Right State Tool
description: Compare local state, Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, and URL state by ownership, lifetime, subscriptions, and failure modes.
sidebar_position: 1
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramStack,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Choosing the right state tool

The right state tool depends on the state category.

Do not begin architecture by choosing a library.

Begin by identifying ownership.

## The decision tree

<DecisionTree
  question="What kind of state is this?"
  items={[
    { label: 'Local interaction / UI?', value: 'useState / useReducer' },
    { label: 'Shared subtree environment or feature state?', value: 'Context (+ reducer when useful)' },
    { label: 'Structured shared client state?', value: 'Redux Toolkit / Zustand' },
    { label: 'Remote or server-owned data?', value: 'TanStack Query / framework server cache' },
    { label: 'Complex form lifecycle?', value: 'React Hook Form' },
    { label: 'Shareable navigation state?', value: 'URL / router' },
  ]}
/>

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

<VisualDiagram title="Name the source of truth first">
  <DiagramGrid columns={3}>
    <DiagramNode title="Modal open" tone="blue">Component.</DiagramNode>
    <DiagramNode title="Cart draft" tone="green">Client feature/store.</DiagramNode>
    <DiagramNode title="Product inventory" tone="orange">Server.</DiagramNode>
    <DiagramNode title="Search page" tone="slate">URL.</DiagramNode>
    <DiagramNode title="Checkout fields" tone="red">Form draft.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If you cannot name the authoritative owner, adding a library usually makes the ambiguity worse.

## Question 2: How long should it live?

<VisualDiagram title="State lifetime spectrum">
  <DiagramGrid columns={4}>
    <DiagramNode title="Component lifetime" tone="blue" />
    <DiagramNode title="Route lifetime" tone="cyan" />
    <DiagramNode title="Feature lifetime" tone="green" />
    <DiagramNode title="Application lifetime" tone="purple" />
    <DiagramNode title="Browser session" tone="orange" />
    <DiagramNode title="Persisted local" tone="slate" />
    <DiagramNode title="Server/cache lifetime" tone="red" />
  </DiagramGrid>
</VisualDiagram>

A tooltip should not accidentally live for the whole application.

A multi-route checkout draft may intentionally outlive one screen.

## Question 3: Who needs it?

<VisualDiagram title="Consumer scope changes the architecture">
  <DiagramGrid columns={3}>
    <DiagramNode title="One component" tone="blue" />
    <DiagramNode title="Siblings" tone="cyan" />
    <DiagramNode title="Feature subtree" tone="green" />
    <DiagramNode title="Distant features" tone="purple" />
    <DiagramNode title="Multiple React roots" tone="orange" />
    <DiagramNode title="React + non-React" tone="slate" />
  </DiagramGrid>
</VisualDiagram>

Scope strongly influences the architecture.

## Question 4: How often does it change?

<VisualDiagram title="Update frequency affects subscription needs">
  <DiagramGrid columns={4}>
    <DiagramNode title="Theme" tone="cyan">Rarely.</DiagramNode>
    <DiagramNode title="Form input" tone="red">Every keystroke.</DiagramNode>
    <DiagramNode title="Pointer position" tone="orange">Many times per second.</DiagramNode>
    <DiagramNode title="Server inventory" tone="green">Whenever backend state changes.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Redux Toolkit vs Zustand">
  <DiagramGrid columns={2}>
    <DiagramNode title="Redux Toolkit" tone="purple">
      Stronger conventions · event/reducer model · middleware · DevTools · public selector APIs.
    </DiagramNode>
    <DiagramNode title="Zustand" tone="green">
      Lighter store API · actions · selector subscriptions · lower ceremony.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Ownership decides the category" compact>
  <DiagramStack align="center">
    <DiagramNode title="Who owns the data?" tone="purple" />
    <DiagramArrow />
    <DiagramGrid columns={2}>
      <DiagramNode title="Client" tone="green">Zustand may fit.</DiagramNode>
      <DiagramNode title="Server" tone="orange">TanStack Query may fit.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

A UI can use both.

## React Hook Form vs global store

Form input values are usually a local workflow draft.

<VisualDiagram title="Form-specific ownership" compact>
  <DiagramNode title="React Hook Form" tone="red" wide>
    Values + validation + dirty/touched + dynamic fields.
  </DiagramNode>
</VisualDiagram>

Do not mirror every keystroke into Redux/Zustand unless another part of the product genuinely requires live shared ownership.

## Example: SaaS dashboard

<VisualDiagram title="SaaS dashboard state ownership">
  <DiagramGrid columns={3}>
    <DiagramNode title="URL" tone="slate">Workspace ID · date range · filters.</DiagramNode>
    <DiagramNode title="TanStack Query" tone="orange">Workspace · analytics · users.</DiagramNode>
    <DiagramNode title="Context" tone="cyan">Locale / feature environment.</DiagramNode>
    <DiagramNode title="Zustand" tone="green">Dashboard editor layout interactions.</DiagramNode>
    <DiagramNode title="React Hook Form" tone="red">Report configuration form.</DiagramNode>
    <DiagramNode title="useState" tone="blue">Local popover open/closed.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

No single store owns everything.

## Example: ecommerce

<VisualDiagram title="E-commerce state ownership">
  <DiagramGrid columns={3}>
    <DiagramNode title="TanStack Query" tone="orange">Catalogue · inventory · account orders.</DiagramNode>
    <DiagramNode title="Redux Toolkit / Zustand" tone="green">Client-owned cart / checkout workflow when justified.</DiagramNode>
    <DiagramNode title="React Hook Form" tone="red">Shipping + billing draft.</DiagramNode>
    <DiagramNode title="URL" tone="slate">Search filters · category · page.</DiagramNode>
    <DiagramNode title="Context" tone="cyan">Currency / locale.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Senior state-tool answer framework" compact>
  <DiagramStack align="center">
    <DiagramNode title="1 · Classify the state" tone="blue" />
    <DiagramArrow />
    <DiagramNode title="2 · Identify source of truth" tone="cyan" />
    <DiagramArrow />
    <DiagramNode title="3 · Define lifetime + scope" tone="green" />
    <DiagramArrow />
    <DiagramNode title="4 · Inspect update frequency + subscriptions" tone="purple" />
    <DiagramArrow />
    <DiagramNode title="5 · Check persistence / URL / server requirements" tone="orange" />
    <DiagramArrow />
    <DiagramNode title="6 · Choose the smallest tool that fits" tone="red" />
  </DiagramStack>
</VisualDiagram>

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
