---
title: Combining State Tools Without Duplicating State
description: Compose React state tools by ownership boundaries, avoid duplicate sources of truth, and migrate between Context, Redux, Zustand, TanStack Query, and React Hook Form safely.
sidebar_position: 2
---

import {
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramRow,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Combining state tools without duplicating state

Large React applications often use more than one state tool.

That is healthy when each tool owns a different category.

It becomes dangerous when the same value is copied into several stores.

## The ownership rule

For every value, choose one authoritative owner.

<VisualDiagram title="One value, one authoritative owner">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server record" tone="orange">Authoritative on the server; the query cache holds a snapshot.</DiagramNode>
    <DiagramNode title="Form draft" tone="red">Authoritative in the form control while the user is editing.</DiagramNode>
    <DiagramNode title="URL filter" tone="slate">Authoritative in the URL when navigation/shareability matters.</DiagramNode>
    <DiagramNode title="Local dialog" tone="blue">Authoritative in component state.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Other layers may derive or display the value, but they should not silently become competing owners.

## Good composition

<VisualDiagram title="Product edit page: clear ownership by lifecycle">
  <DiagramGrid columns={3}>
    <DiagramNode title="URL" tone="slate">Owns `productId`.</DiagramNode>
    <DiagramNode title="TanStack Query" tone="orange">Owns the saved Product snapshot from the server.</DiagramNode>
    <DiagramNode title="React Hook Form" tone="red">Owns the unsaved product draft.</DiagramNode>
    <DiagramNode title="Context" tone="cyan">Provides locale / permissions environment.</DiagramNode>
    <DiagramNode title="useState" tone="blue">Owns delete-confirmation dialog state.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Each layer has a distinct responsibility.

## Bad composition: copying server data everywhere

<VisualDiagram title="Anti-pattern: serially copying one value into multiple owners">
  <DiagramStack align="center">
    <DiagramNode title="TanStack Query cache" tone="orange" />
    <DiagramArrow label="copy" />
    <DiagramNode title="Redux" tone="purple" />
    <DiagramArrow label="copy" />
    <DiagramNode title="Component state" tone="blue" />
    <DiagramArrow label="copy" />
    <DiagramNode title="Form" tone="red" />
  </DiagramStack>
</VisualDiagram>

Now four versions may disagree.

Better:

<VisualDiagram title="Better: derive for display, fork only when lifecycle changes">
  <DiagramStack align="center">
    <DiagramNode title="TanStack Query cache" tone="orange" wide>Saved server snapshot remains the authoritative remote value.</DiagramNode>
    <DiagramArrow label="read directly for display OR initialize an edit draft" />
    <DiagramNode title="React Hook Form draft" tone="red" wide>Unsaved edits are intentionally separate because they have a different lifecycle.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<LifecycleBar
  items={[
    { label: 'saved profile snapshot', tone: 'orange' },
    { label: 'form default values', tone: 'red' },
    { label: 'user edits independent draft', tone: 'blue' },
  ]}
/>

Do not automatically reset the form every time the query background-refetches while the user is typing.

You need a product rule for reconciling remote changes with local unsaved edits.

## React Hook Form + TanStack Query mutation

<VisualDiagram title="Clean form + server mutation hand-off">
  <DiagramStack align="center">
    <DiagramNode title="React Hook Form validates" tone="red" />
    <DiagramArrow label="submit values" />
    <DiagramNode title="TanStack mutation" tone="purple" />
    <DiagramArrow label="server validates + persists" />
    <DiagramRow>
      <DiagramNode title="Error" tone="red">Map domain/server errors back to the form UI.</DiagramNode>
      <DiagramNode title="Success" tone="green">Update/invalidate query cache and reset the form to saved values.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

This is a common and clean separation.

## Redux Toolkit + TanStack Query

If Redux owns shared client workflow state and TanStack Query owns server state:

<VisualDiagram title="Redux + TanStack Query without duplication">
  <DiagramGrid columns={2}>
    <DiagramNode title="Redux Toolkit" tone="purple">
      Checkout step · client-side workflow flags · unsaved cross-route decisions.
    </DiagramNode>
    <DiagramNode title="TanStack Query" tone="orange">
      Products · inventory · orders.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Avoid copying every query result into Redux.

If the application already uses Redux extensively, evaluate RTK Query as an alternative server-state layer before adding a second query cache.

## Zustand + TanStack Query

A diagram/editor application might use:

<VisualDiagram title="Zustand + TanStack Query in an editor">
  <DiagramGrid columns={2}>
    <DiagramNode title="Zustand" tone="green">
      Selected nodes · zoom · active tool · drag state · unsaved interaction state.
    </DiagramNode>
    <DiagramNode title="TanStack Query" tone="orange">
      Document record · collaborators · server history.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The UI can combine both without one replacing the other.

## Context + external store

Context can inject a specific store instance into a subtree.

<VisualDiagram title="Provider-scoped external store instance" compact>
  <DiagramStack align="center">
    <DiagramNode title="Store factory" tone="green" />
    <DiagramArrow label="creates instance" />
    <DiagramNode title="Provider chooses instance" tone="cyan" />
    <DiagramArrow label="scopes instance" />
    <DiagramNode title="Feature subtree" tone="blue" />
    <DiagramArrow label="components subscribe" />
    <DiagramNode title="External store selectors" tone="purple" />
  </DiagramStack>
</VisualDiagram>

This is useful when you want external-store selector semantics but still need provider-scoped instances, testing isolation, or SSR request isolation.

## URL + store

Do not keep two synchronized copies of a filter unless necessary.

Bad:

<VisualDiagram title="Anti-pattern: URL/store synchronization bridge" compact>
  <DiagramRow>
    <DiagramNode title="URL page=2" tone="slate" />
    <DiagramNode title="Effect sync ↔" tone="red">Every bridge creates another failure mode.</DiagramNode>
    <DiagramNode title="Redux page=2" tone="purple" />
  </DiagramRow>
</VisualDiagram>

Every synchronization bridge introduces failure modes.

If the page number is navigable/shareable, read/write the URL as the source of truth.

A client store may still own temporary UI that does not belong in navigation history.

## Persistence + server state

Persisting a query result or global store does not make it authoritative.

<VisualDiagram title="Persistence does not change authority">
  <DiagramGrid columns={2}>
    <DiagramNode title="localStorage" tone="slate">Client-controlled cached/persisted snapshot.</DiagramNode>
    <DiagramNode title="Server" tone="orange">Authoritative domain record.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

When restoring persisted state:

- validate shape/version;
- consider expiration;
- avoid secrets;
- reconcile with current server state when required.

## Migration: Context → Zustand

A safe migration can use an adapter period.

<VisualDiagram title="Context → Zustand migration without dual ownership">
  <DiagramStack align="center">
    <DiagramNode title="Old Context consumers" tone="cyan" />
    <DiagramArrow label="temporary compatibility provider" />
    <DiagramNode title="Provider reads the Zustand store" tone="purple" />
    <DiagramArrow label="Zustand is the only new owner" />
    <DiagramNode title="Consumers migrate gradually" tone="green" />
  </DiagramStack>
</VisualDiagram>

Important: do not let Context and Zustand independently mutate separate copies.

One owner; temporary adapters only.

## Migration: Context → Redux Toolkit

<LifecycleBar
  items={[
    { label: 'define target Redux domain slice', tone: 'purple' },
    { label: 'migrate transition logic', tone: 'blue' },
    { label: 'expose selectors/actions', tone: 'green' },
    { label: 'old provider adapts to Redux', tone: 'cyan' },
    { label: 'migrate consumers', tone: 'orange' },
    { label: 'delete adapter state', tone: 'red' },
  ]}
/>

Avoid a dual-write period where both stores pretend to be authoritative.

## Migration: Redux → Zustand

Do not translate slices mechanically.

First classify state again.

You may discover:

<VisualDiagram title="Reclassify before migrating Redux">
  <DiagramGrid columns={4}>
    <DiagramNode title="Server records" tone="orange">→ TanStack Query</DiagramNode>
    <DiagramNode title="URL filters" tone="slate">→ router</DiagramNode>
    <DiagramNode title="Form draft" tone="red">→ React Hook Form</DiagramNode>
    <DiagramNode title="Shared client state" tone="green">→ Zustand</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A migration is an opportunity to fix ownership, not merely change syntax.

## Migration: manual API state → TanStack Query

Legacy architecture:

<VisualDiagram title="Legacy manual API lifecycle">
  <DiagramNode title="useEffect" tone="red" wide>
    Request + loading + error + retry + stale flag + refresh function.
  </DiagramNode>
</VisualDiagram>

Migration:

<LifecycleBar
  items={[
    { label: 'define query key', tone: 'purple' },
    { label: 'define query function', tone: 'blue' },
    { label: 'move cache/freshness policy', tone: 'orange' },
    { label: 'migrate mutation/invalidation', tone: 'green' },
    { label: 'delete duplicated loading/cache state', tone: 'red' },
  ]}
/>

Do one domain at a time.

## Migration: global form draft → React Hook Form

If Redux/Zustand currently owns every field:

<LifecycleBar
  items={[
    { label: 'identify why form data was global', tone: 'slate' },
    { label: 'keep only state that must outlive form', tone: 'purple' },
    { label: 'move active draft into RHF', tone: 'red' },
    { label: 'initialize from authoritative workflow state', tone: 'blue' },
    { label: 'write back only at explicit save boundaries', tone: 'green' },
  ]}
/>

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

<VisualDiagram title="Review every synchronization edge">
  <DiagramGrid columns={2}>
    <DiagramNode title="Owner A changes, B does not" tone="red" />
    <DiagramNode title="Hydration restores stale B" tone="orange" />
    <DiagramNode title="Background refetch arrives during editing" tone="purple" />
    <DiagramNode title="Navigation changes the URL" tone="slate" />
    <DiagramNode title="Server rejects optimistic client state" tone="red" />
  </DiagramGrid>
</VisualDiagram>

If the answer requires many synchronization Effects, reconsider ownership.

## Staff-level decision framework

A strong architecture minimizes synchronization edges.

<VisualDiagram title="Why fewer sources of truth are easier to operate" compact>
  <DiagramStack align="center">
    <DiagramNode title="Fewer sources of truth" tone="green" />
    <DiagramArrow />
    <DiagramNode title="Fewer synchronization bridges" tone="cyan" />
    <DiagramArrow />
    <DiagramNode title="Fewer race conditions" tone="purple" />
    <DiagramArrow />
    <DiagramNode title="Easier debugging" tone="blue" />
  </DiagramStack>
</VisualDiagram>

The goal is not to minimize the number of libraries at all costs.

The goal is to make ownership obvious.

## Interview questions

**Mid-level:** Is using Redux and TanStack Query together automatically redundant?

**Senior:** Why is copying query data into a global client store often a smell?

**Senior:** How would you migrate Context state to Zustand without dual ownership?

**Staff:** You inherit an app where URL params, Redux, Zustand, and component state all contain the same filters. How do you redesign it while keeping the product working during migration?

## Summary

<VisualDiagram title="State composition summary" compact>
  <DiagramStack align="center">
    <DiagramNode title="Classify state" tone="blue" />
    <DiagramArrow />
    <DiagramNode title="Choose one owner" tone="green" />
    <DiagramArrow />
    <DiagramNode title="Other tools derive or observe" tone="cyan" />
    <DiagramArrow />
    <DiagramNode title="Synchronize only where necessary" tone="orange" />
    <DiagramArrow />
    <DiagramNode title="Avoid dual writes" tone="red" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/learn/choosing-the-state-structure
- https://redux.js.org/style-guide
- https://zustand.docs.pmnd.rs
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://react-hook-form.com/docs
