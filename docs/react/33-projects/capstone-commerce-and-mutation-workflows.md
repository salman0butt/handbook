---
title: Capstone — Commerce and Mutation Workflows
description: A React capstone for forms, actions, optimistic UI, server authority, accessibility, caching, SSR/RSC boundaries, and failure recovery.
sidebar_position: 3
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Capstone — commerce and mutation workflows

Build a storefront whose product data, inventory, pricing, cart mutations, promo rules, and checkout validation make the **server-authority vs immediate-UI** problem explicit.

## Core authority model

<VisualDiagram title="Optimistic UI is a temporary projection around server authority">
  <LifecycleBar items={[
    { label: 'Browser intent', tone: 'blue' },
    { label: 'Optimistic projection', tone: 'purple' },
    { label: 'Server mutation', tone: 'orange' },
    { label: 'Validate + authorize', tone: 'red' },
    { label: 'Canonical result', tone: 'green' },
    { label: 'UI reconciliation', tone: 'cyan' },
  ]} />
</VisualDiagram>

Do not let optimistic state become a second permanent source of truth.

## State categories

<DecisionTree
  question="Who owns this commerce value?"
  items={[
    { label: 'Price, stock, availability, promotion eligibility', value: 'Server authority' },
    { label: 'Authenticated cart', value: 'Often server-owned with client projection/cache' },
    { label: 'Guest cart', value: 'May be local/persisted, with explicit later reconciliation' },
    { label: 'Form draft before submit', value: 'Form/local owner' },
    { label: 'Shareable search/filter/product options', value: 'URL when navigation semantics matter' },
    { label: 'Permission to mutate', value: 'Server authorization, never client UI state' },
  ]}
/>

Document a hybrid cart deliberately if you use one.

## Server and Client Component split

<VisualDiagram title="Keep server-owned reads on the server and interaction in narrow client islands">
  <DiagramStack>
    <DiagramNode title="ProductPage — Server" tone="green">authoritative read + server-friendly structure</DiagramNode>
    <DiagramGrid columns={4}>
      <DiagramNode title="Media" tone="cyan">server or client as needed</DiagramNode>
      <DiagramNode title="Information" tone="green">server read-only</DiagramNode>
      <DiagramNode title="VariantPicker" tone="blue">client interaction</DiagramNode>
      <DiagramNode title="AddToCart" tone="purple">client interaction + mutation intent</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Only serializable data needed by the client should cross the boundary. Database connections, privileged SDKs, and normal functions stay server-side unless represented through supported Server Function transport.

## Add-to-cart mutation

The server validates product/variant existence, quantity, current stock, authenticated cart relationship, and server-owned pricing.

<VisualDiagram title="Never trust client-calculated commerce authority">
  <DiagramRow>
    <DiagramNode title="Client submits" tone="blue">productId · variantId · quantity</DiagramNode>
    <DiagramArrow direction="right" label="server" />
    <DiagramNode title="Trusted calculation" tone="red">stock · price · permissions · promotion</DiagramNode>
    <DiagramArrow direction="right" label="result" />
    <DiagramNode title="Canonical cart" tone="green">versioned/authoritative state</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Model Action state explicitly

```ts
type CartActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; cartVersion: string };
```

Prefer mutually exclusive states over unrelated `loading/error/success` booleans that permit contradictions.

## Optimistic quantity updates

<VisualDiagram title="Optimistic projection must converge or roll back">
  <DiagramRow>
    <DiagramNode title="Canonical quantity 1" tone="green">server-confirmed</DiagramNode>
    <DiagramArrow direction="right" label="user clicks +" />
    <DiagramNode title="Projected quantity 2" tone="purple">immediate UI</DiagramNode>
    <DiagramArrow direction="right" label="server result" />
    <DiagramNode title="2 or rollback to 1" tone="orange">reconcile truth</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Simulate inventory changing between render and mutation to prove that client state and TypeScript do not enforce real stock truth.

## Concurrent mutation challenge

Test rapid updates such as `1 → 2 → 3 → 4`.

<DecisionTree
  question="How are concurrent cart mutations coordinated?"
  items={[
    { label: 'Requests are serialized', value: 'Document queue/order semantics' },
    { label: 'Requests may complete out of order', value: 'Use versions/request ordering and canonical reconciliation' },
    { label: 'Rapid UI changes can be coalesced', value: 'Define debounce/coalescing semantics deliberately' },
    { label: 'Unknown framework ordering behavior', value: 'Do not assume; test and document it' },
  ]}
/>

## Promo code workflow

The client submits a code; the server decides existence, expiry, eligibility, combinability, and actual discount.

<VisualDiagram title="The browser expresses intent; the server computes trusted business value">
  <DiagramRow>
    <DiagramNode title="SUMMER20" tone="blue">untrusted intent</DiagramNode>
    <DiagramArrow direction="right" label="policy" />
    <DiagramNode title="Promotion service" tone="red">eligibility + discount rules</DiagramNode>
    <DiagramArrow direction="right" label="safe result" />
    <DiagramNode title="UI feedback" tone="green">human-readable outcome</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Checkout form architecture

Build shipping/contact/delivery/notes with visible labels, runtime server validation, field errors, an error summary, pending state, and deliberate focus movement after failure.

<LifecycleBar items={[
  { label: 'Edit draft', tone: 'blue' },
  { label: 'Client UX validation', tone: 'cyan' },
  { label: 'Submit', tone: 'purple' },
  { label: 'Server trust validation', tone: 'red' },
  { label: 'Accessible error or success', tone: 'green' },
]} />

If the framework supports progressive enhancement, test behavior before hydration and identify which optimistic enhancements require client JavaScript.

## Suspense and failure architecture

<VisualDiagram title="Keep the store shell stable while independent regions reveal">
  <DiagramStack>
    <DiagramNode title="Store shell" tone="blue">navigation + primary context</DiagramNode>
    <DiagramGrid columns={4}>
      <DiagramNode title="Product info" tone="green">primary data</DiagramNode>
      <DiagramNode title="Recommendations" tone="cyan">optional boundary</DiagramNode>
      <DiagramNode title="Reviews" tone="purple">independent boundary</DiagramNode>
      <DiagramNode title="Cart summary" tone="orange">mutation-aware boundary</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Classify product-not-found routing errors, optional recommendation failure, mutation feedback, unexpected render errors, and whole-app initialization failures separately.

## Cache layers are not interchangeable

<VisualDiagram title="Name each cache and its authority/lifetime">
  <DiagramGrid columns={3}>
    <DiagramNode title="CDN/page" tone="slate">response/static layer</DiagramNode>
    <DiagramNode title="Server request/render" tone="green">request/render lifetime</DiagramNode>
    <DiagramNode title="Application data" tone="purple">domain freshness/invalidation</DiagramNode>
    <DiagramNode title="Client data library" tone="blue">browser server-state cache</DiagramNode>
    <DiagramNode title="HTTP browser" tone="cyan">protocol cache</DiagramNode>
    <DiagramNode title="React cache()" tone="orange">render-lifetime RSC memoization, not durable Redis-equivalent storage</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Mutation invalidation and revalidation belong to the data/framework architecture, not optimistic UI alone.

## Security review

Threat-model client-submitted prices/IDs, authorization, promo abuse, duplicate checkout, cross-user cart access, CSRF/framework transport, XSS in product content, unsafe redirects, logging, and third-party payment/provider boundaries.

## Testing portfolio

<DiagramGrid columns={3}>
  <DiagramNode title="Domain/unit" tone="blue">pricing/promo validation adapters · reducers · parsers</DiagramNode>
  <DiagramNode title="Integration" tone="purple">forms · pending · optimistic success/rollback · cache refresh · a11y</DiagramNode>
  <DiagramNode title="E2E" tone="green">product → cart → checkout · stale inventory · unauthorized/duplicate mutation</DiagramNode>
</DiagramGrid>

A strong commerce capstone shows that immediate UX, server authority, accessibility, caching, and failure recovery can coexist without duplicating truth.
