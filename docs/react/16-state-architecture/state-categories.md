---
title: State Architecture — Local, Shared, Server, and External State
description: Classify state before choosing tools. Separate local UI state, lifted/shared client state, server state, URL state, and external-store state.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# State architecture: local, shared, server, and external state

Large React applications become easier to design when you stop asking **“Which state library should we use?”** and first ask:

> What kind of state is this, who owns it, what lifetime should it have, and what subscription model does it need?

Tool choice comes after classification.

## The main categories

<VisualDiagram title="Classify state before choosing a tool">
  <DiagramGrid columns={3}>
    <DiagramNode title="Local UI state" tone="blue">One component / nearby subtree owns interaction state.</DiagramNode>
    <DiagramNode title="Shared client state" tone="purple">React-owned state coordinated across multiple consumers.</DiagramNode>
    <DiagramNode title="Server state" tone="orange">Remote authoritative data with fetch/cache lifecycle.</DiagramNode>
    <DiagramNode title="URL state" tone="cyan">Navigable, shareable state owned by browser/router semantics.</DiagramNode>
    <DiagramNode title="External store state" tone="green">Underlying mutable source lives outside React state.</DiagramNode>
    <DiagramNode title="Derived state" tone="slate">Calculated from existing sources rather than owned independently.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

These categories can meet at boundaries, but they lead to better architecture than putting every value into one universal store.

## 1. Local UI state

Examples include accordion open/closed, selected tab, input draft, tooltip visibility, local sorting, and wizard steps.

```jsx
const [open, setOpen] = useState(false);
```

Keep state local until another owner genuinely needs to coordinate with it.

<VisualDiagram title="Why state locality is valuable" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="Clear owner" tone="blue">You know who writes the value.</DiagramNode>
    <DiagramNode title="Small update scope" tone="green">Unrelated parts of the app do not depend on it.</DiagramNode>
    <DiagramNode title="Low coupling" tone="purple">Feature deletion/refactoring stays easier.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## 2. Shared client state

Shared client state is React/application-owned data that several components must coordinate around, such as a cart draft, selected project, editor model, preferences, or a multi-step client workflow.

Possible tools include lifted `useState`, `useReducer`, Context, reducer + Context, or an external store.

<DecisionTree
  question="How should shared client state scale?"
  items={[
    {label: 'A common parent can own it clearly', value: 'Lift state and pass props'},
    {label: 'A feature subtree needs broad access', value: 'Consider Context / reducer + Context'},
    {label: 'Lifetime/subscription requirements exceed the React tree', value: 'Consider an external store'},
  ]}
/>

Choose based on scope, update complexity, frequency, and subscriber needs—not library popularity.

## 3. Server state

Server state originates outside the client and represents remote authoritative data such as products, invoices, inventory, search results, profiles, and order status.

<VisualDiagram title="Server state has a remote-data lifecycle" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="Fetch" tone="blue">loading · request deduplication · pagination</DiagramNode>
    <DiagramNode title="Cache" tone="purple">lifetime · staleness · background refresh</DiagramNode>
    <DiagramNode title="Change" tone="orange">mutations · optimistic updates · invalidation · retries</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Context can transport server data, but Context is not a server cache strategy. Framework data APIs and server-state libraries solve a different lifecycle problem.

## 4. URL/navigation state

Some state belongs in the URL because it should survive refresh, support copy/paste links, and participate in browser navigation.

```text
/search?q=react&page=2
/products?category=lights&sort=price
/dashboard/projects/42
```

The examples are literal URLs, so text is the most useful representation here.

Good candidates include search queries, page numbers, filters, selected resource IDs, and tabs that have navigation semantics.

<VisualDiagram title="When the URL should own the value" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="Refresh" tone="blue">The same view should reappear after reload.</DiagramNode>
    <DiagramNode title="Share" tone="green">Copying the URL should reproduce the view.</DiagramNode>
    <DiagramNode title="History" tone="purple">Back/forward navigation should represent state transitions.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not mirror URL state into local React state unless you intentionally need a second editing/draft lifecycle.

## 5. External store state

An external store owns data outside `useState`/`useReducer` in the component tree.

Examples include custom store objects, browser subscription APIs, third-party state libraries, or data shared with non-React code.

React provides `useSyncExternalStore` to integrate that source safely with rendering.

<VisualDiagram title="External does not mean global" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="External" tone="green">The storage/subscription source lives outside React.</DiagramNode>
    <DiagramNode title="Global" tone="red">A separate question about scope and number of consumers.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

An external store can still be scoped to one feature instance.

## 6. Derived state

Derived values can be calculated from existing inputs:

```jsx
const completed = tasks.filter(task => task.done).length;
```

Do not create a second state owner when a value is completely determined by another source.

<VisualDiagram title="Derived value vs duplicated state">
  <DiagramGrid columns={2}>
    <DiagramNode title="Derive" tone="green">tasks → calculate completed count during render</DiagramNode>
    <DiagramNode title="Duplicate" tone="red">tasks + completed state must now be manually synchronized</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Classifying one screen

An ecommerce page can contain several state categories at once.

<VisualDiagram title="One screen, different owners">
  <DiagramGrid columns={3}>
    <DiagramNode title="Product data" tone="orange">server state</DiagramNode>
    <DiagramNode title="Route product ID" tone="cyan">URL state</DiagramNode>
    <DiagramNode title="Quantity input" tone="blue">local UI state</DiagramNode>
    <DiagramNode title="Cart draft" tone="purple">shared client state</DiagramNode>
    <DiagramNode title="Cart total" tone="slate">derived state</DiagramNode>
    <DiagramNode title="Online status" tone="green">external browser subscription</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The fact that values appear on the same page does not mean they should share one owner.

## The source-of-truth question

For every value, ask where the authoritative version lives.

<VisualDiagram title="Examples of source of truth">
  <DiagramGrid columns={3}>
    <DiagramNode title="Input draft" tone="blue">React component / feature owner</DiagramNode>
    <DiagramNode title="Order status" tone="orange">server</DiagramNode>
    <DiagramNode title="Search query" tone="cyan">URL/router</DiagramNode>
    <DiagramNode title="Online status" tone="green">browser platform</DiagramNode>
    <DiagramNode title="Cart total" tone="slate">derived from cart items</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Many state bugs are really **multiple competing sources of truth**.

## State lifetime

<VisualDiagram title="State lifetime should match ownership">
  <LifecycleBar
    items={[
      {label: 'component lifetime', tone: 'blue'},
      {label: 'route lifetime', tone: 'cyan'},
      {label: 'feature-provider lifetime', tone: 'purple'},
      {label: 'application lifetime', tone: 'green'},
      {label: 'browser/session lifetime', tone: 'orange'},
      {label: 'server/cache lifetime', tone: 'slate'},
    ]}
  />
</VisualDiagram>

A modal `open` flag usually should not outlive the feature. A URL filter may need to survive remounts. A store used by non-React code may need to live independently of any React root.

## State scope

Scope can range from one component to siblings, a feature subtree, distant branches, multiple React roots, or React + non-React consumers.

Scope often tells you whether lifting state, Context, or an external store is appropriate.

## Update frequency and subscription granularity

A useful performance model is:

<VisualDiagram title="Shared-state pressure" compact>
  <DiagramNode title="update frequency × subscriber count × render cost" tone="orange" wide>
    Higher values make ownership and subscription granularity more important.
  </DiagramNode>
</VisualDiagram>

Context may be perfect for a theme that changes rarely and a poor fit for high-frequency signals consumed by many expensive components.

## State transitions vs external synchronization

<VisualDiagram title="Reducers and Effects solve different problems">
  <DiagramGrid columns={2}>
    <DiagramNode title="State transition" tone="purple">current cart + action → next cart · reducer territory</DiagramNode>
    <DiagramNode title="External synchronization" tone="orange">current roomId → connect external chat system · Effect territory</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not use reducers to perform synchronization and do not use Effects as a general state-transition engine.

## Client draft vs server record

Suppose `/api/customer/42` returns a customer record while the user edits a local form draft.

<VisualDiagram title="Remote record and local draft have different lifecycles">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server state" tone="orange">authoritative persisted customer record</DiagramNode>
    <DiagramNode title="Local draft" tone="blue">unsaved editing state that may intentionally differ</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

After saving, the server/cache may be updated or refreshed. Do not force these two lifecycles into one state object simply because their fields look similar.

## Avoid “global store by default”

<DecisionTree
  question="Two components need this value—what now?"
  items={[
    {label: 'State can stay with one nearby owner', value: 'Keep it local / lift to common parent'},
    {label: 'A coherent subtree needs broad access', value: 'Context or reducer + Context may fit'},
    {label: 'Independent lifetime, non-React access, or fine-grained subscriptions are required', value: 'Evaluate an external store'},
    {label: 'The authoritative source is server or URL', value: 'Keep that source of truth instead of creating generic global client state'},
  ]}
/>

## Context is distribution, not ownership

<VisualDiagram title="Do not confuse the transport with the owner" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="useState / useReducer" tone="blue">Own React state.</DiagramNode>
    <DiagramNode title="Context" tone="purple">Distributes access through a subtree.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A provider can use both, but they remain different responsibilities.

## Ecosystem tools own different categories

Redux Toolkit, Zustand, Jotai, MobX, XState, TanStack Query, SWR, router state, and framework caches are not interchangeable merely because they all involve “state.”

<VisualDiagram title="A mature app can use multiple tools without duplicating ownership">
  <DiagramGrid columns={4}>
    <DiagramNode title="Server cache" tone="orange">TanStack Query / framework data layer</DiagramNode>
    <DiagramNode title="Feature client state" tone="purple">Context / reducer / store</DiagramNode>
    <DiagramNode title="Local UI" tone="blue">useState</DiagramNode>
    <DiagramNode title="Navigable filters" tone="cyan">URL/router</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

That is healthy when each value has one authoritative owner.

## Persistence does not define ownership

Saving data to `localStorage` does not automatically make storage the live source of truth.

You might initialize React state from storage, let React own the active session state, then synchronize durable changes back. Or you might deliberately wrap storage as an external store with subscription semantics.

Be explicit about which model you are using.

## Architecture example

<VisualDiagram title="State architecture by ownership category">
  <DiagramGrid columns={2}>
    <DiagramNode title="URL/router" tone="cyan">projectId · filters · page</DiagramNode>
    <DiagramNode title="Server cache" tone="orange">projects · users · activity</DiagramNode>
    <DiagramNode title="Feature providers" tone="purple">editor reducer · checkout workflow</DiagramNode>
    <DiagramNode title="Local component state" tone="blue">menus · drafts · focused row</DiagramNode>
    <DiagramNode title="External store" tone="green">cross-root / non-React subscription data</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This is usually more maintainable than one universal store containing every category.

## Questions before introducing shared/global state

Ask who writes it, who reads it, the authoritative source, required lifetime, whether browser navigation semantics matter, whether it comes from a server, update frequency, subscription granularity, non-React consumers, and what concrete failure mode a new tool solves.

## Exercise

Classify search query, modal visibility, API profile, unsaved editor text, theme, browser online status, page number, cart total, and shared external notifications. For each identify source of truth, lifetime, scope, and likely React/ecosystem tool.

## Interview questions

**Mid-level:** What is the difference between client state and server state?

**Senior:** Why might URL state be preferable to Context for filters?

**Staff:** How do lifetime, source of truth, update frequency, and subscription granularity influence state architecture?

## Summary

<VisualDiagram title="State architecture sequence">
  <LifecycleBar
    items={[
      {label: 'classify the value', tone: 'blue'},
      {label: 'identify source of truth', tone: 'cyan'},
      {label: 'choose scope + lifetime', tone: 'purple'},
      {label: 'consider frequency + subscribers', tone: 'orange'},
      {label: 'choose smallest fitting primitive/tool', tone: 'green'},
      {label: 'avoid duplicated ownership', tone: 'red'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/learn/managing-state
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/useSyncExternalStore

## Next

Continue with **useSyncExternalStore and External Subscriptions**.
