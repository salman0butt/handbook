---
title: Server Components and Client Boundaries
description: Understand React Server Components, client boundaries, async components, serializable props, bundle impact, and how RSC differs from SSR.
sidebar_position: 1
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

# Server Components and client boundaries

React Server Components (RSC) change **where component code executes**. They are not simply another name for server-side rendering.

<VisualDiagram title="RSC and SSR answer different questions">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server Components" tone="purple" eyebrow="EXECUTION">Which component implementation runs on the server, and which code crosses into the client module graph?</DiagramNode>
    <DiagramNode title="Server Rendering" tone="blue" eyebrow="DELIVERY">How does React produce HTML before the browser becomes interactive?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A framework can combine both:

<VisualDiagram title="How RSC, SSR, streaming, and hydration fit together">
  <LifecycleBar items={[
    { label: 'Server Components execute', tone: 'purple' },
    { label: 'RSC payload references Client Components', tone: 'teal' },
    { label: 'SSR produces initial HTML', tone: 'blue' },
    { label: 'Suspense may stream regions', tone: 'orange' },
    { label: 'Client Components hydrate', tone: 'green' },
  ]} />
</VisualDiagram>

## Server Components are infrastructure-aware

A normal client-only Vite build does not become an RSC application by importing one React API. An RSC-capable framework/bundler must understand:

- server and client module graphs;
- RSC payloads and client references;
- serialization;
- Server Functions;
- routing, data, and bundling boundaries.

Use an RSC-capable framework instead of inventing this transport inside a normal SPA build.

## There is no `'use server'` marker for Server Components

<VisualDiagram title="Directives mark boundaries, not component categories">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server Component" tone="purple">No special directive is required merely because the component runs on the server.</DiagramNode>
    <DiagramNode title="'use server'" tone="orange">Marks a Server Function that can be invoked through the server-function transport.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`'use client'` is the directive that creates a **client module boundary**.

```jsx
'use client';

import { useState } from 'react';

export default function Expandable({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button onClick={() => setOpen(v => !v)}>Toggle</button>
      {open && children}
    </section>
  );
}
```

## The module graph and render tree are different

<VisualDiagram title="'use client' affects imports, not every descendant in the render tree">
  <DiagramGrid columns={2}>
    <DiagramNode title="Module graph" tone="orange">
      A client module and modules it imports must be client-evaluable.
    </DiagramNode>
    <DiagramNode title="Render tree" tone="green">
      A Client Component may still receive already-rendered Server Component output as children or props.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

For example, server-rendered content can be composed through an interactive client wrapper:

```jsx
// Server Component
export default function Page() {
  return (
    <InteractivePanel>
      <ServerRenderedReport />
    </InteractivePanel>
  );
}
```

The client wrapper does not need to import and execute `ServerRenderedReport` in the browser.

## Server Components can be async

```jsx
export default async function Product({ id }) {
  const product = await db.products.get(id);
  return <h1>{product.name}</h1>;
}
```

Server Components can directly access server resources such as databases, files, internal services, and server-only SDKs—subject to your framework and runtime.

<VisualDiagram title="Server-only work can stay off the browser bundle">
  <DiagramStack align="center">
    <DiagramNode title="Server Component" tone="purple">Database SDK · markdown parser · secret-backed service</DiagramNode>
    <DiagramArrow label="render safe result" />
    <DiagramNode title="RSC output" tone="teal">Serializable UI/data references</DiagramNode>
    <DiagramArrow label="only required client code crosses" />
    <DiagramNode title="Browser" tone="green">Interactive Client Components + rendered output</DiagramNode>
  </DiagramStack>
</VisualDiagram>

This can reduce client JavaScript, but it does not make slow queries or bad architecture disappear.

## When do you need a Client Component?

<DecisionTree
  question="What does this component require?"
  items={[
    { label: 'State, Effects, browser APIs, event handlers, DOM refs', value: 'Client Component boundary' },
    { label: 'Server data/content only', value: 'Prefer Server Component' },
    { label: 'Only one small interactive widget', value: 'Keep the boundary narrow' },
    { label: 'Imports a server-only SDK', value: 'Keep it outside the client module graph' },
  ]}
/>

Do not mark an entire page `'use client'` because one button needs state.

## Serializable values cross server → client

Anything crossing into a Client Component must fit React's supported serialization model and be safe for browser exposure.

<VisualDiagram title="Crossing the boundary is both serialization and trust">
  <DiagramGrid columns={2}>
    <DiagramNode title="Usually appropriate" tone="green">Primitives · arrays · supported objects/iterables · Dates · Promises · React elements · Server Function references</DiagramNode>
    <DiagramNode title="Do not cross" tone="red">Secrets · database connections · arbitrary class instances · ordinary server closures · privileged internal objects</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Wrong:

```jsx
<ClientPanel databaseConnection={db} apiSecret={process.env.SECRET_KEY} />
```

Pass the minimum safe data the browser actually needs.

## Promise handoff and Suspense

A Server Component can start work early and pass a Promise to a Client Component, where `use` can suspend on it.

```jsx
// Server Component
export default async function Page({ id }) {
  const product = await getProduct(id);
  const reviewsPromise = getReviews(id);

  return (
    <>
      <ProductDetails product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews reviewsPromise={reviewsPromise} />
      </Suspense>
    </>
  );
}
```

```jsx
'use client';

import { use } from 'react';

export default function Reviews({ reviewsPromise }) {
  const reviews = use(reviewsPromise);
  return reviews.map(review => <p key={review.id}>{review.text}</p>);
}
```

<VisualDiagram title="Start on the server, coordinate readiness at the client boundary">
  <DiagramStack align="center">
    <DiagramNode title="Server starts async work" tone="purple" />
    <DiagramArrow label="passes supported Promise" />
    <DiagramNode title="Client boundary reads with use" tone="blue" />
    <DiagramArrow label="pending?" />
    <DiagramNode title="Suspense coordinates reveal" tone="orange" />
  </DiagramStack>
</VisualDiagram>

## RSC does not eliminate APIs or client state

Server Components can remove some browser-to-server read endpoints from a React web app's internal render path, but systems may still need APIs for mobile clients, integrations, webhooks, SDKs, and jobs.

Client state still owns browser-local interaction such as drafts, menus, drag state, optimistic projections, and media controls.

## Performance and freshness still belong to architecture

A Server Component may run at build time, per request, after revalidation, during navigation, or as part of cached work. React provides the component model; your framework defines route/cache/revalidation policy.

You can still create server waterfalls, oversized client bundles, excessive serialization, poor Suspense boundaries, and slow data access.

## Security boundary

<VisualDiagram title="Everything crossing into the client should be treated as browser-visible">
  <DiagramStack align="center">
    <DiagramNode title="Server resources" tone="purple">Secrets · privileged data · internal objects</DiagramNode>
    <DiagramArrow label="authorize + select + serialize" />
    <DiagramNode title="Boundary payload" tone="orange">Only safe minimum data</DiagramNode>
    <DiagramArrow label="browser can inspect" />
    <DiagramNode title="Client Component" tone="green" />
  </DiagramStack>
</VisualDiagram>

Authorization, validation, tenant isolation, and secret handling remain backend responsibilities.

## Testing strategy

Use the layer that actually models the boundary:

- pure server helper/data-access tests;
- Server Component integration tests supported by the framework;
- Client Component interaction tests;
- end-to-end route tests for real server/client composition.

Do not force an RSC tree into a client-only harness that cannot represent the module boundary.

## Common mistakes

- treating `'use server'` as a Server Component directive;
- putting `'use client'` at page/root level unnecessarily;
- importing server-only code from the client module graph;
- passing arbitrary server objects through props;
- confusing RSC execution with SSR HTML generation;
- assuming Server Components run on every request;
- assuming RSC automatically makes an application fast.

## Architecture checklist

1. Does this component need browser interaction APIs?
2. Can its data read stay on the server?
3. Is the client boundary as narrow as practical?
4. Are all client-bound props serializable and safe to expose?
5. Are server-only imports excluded from the client graph?
6. Are authorization and tenant boundaries enforced where data is read?
7. Does the framework's cache/revalidation policy match freshness needs?

## Interview questions

**Junior:** What is a Server Component?

**Mid-level:** What does `'use client'` actually mark?

**Senior:** Explain the difference between the render tree and module graph, then describe how RSC, SSR, Suspense streaming, serialization, and hydration can work together on one route.

## Summary

<VisualDiagram title="Server Components in one picture">
  <DiagramRow>
    <DiagramNode title="Server execution" tone="purple">Data + server-only dependencies</DiagramNode>
    <DiagramArrow direction="right" label="serialize" />
    <DiagramNode title="RSC boundary" tone="teal">Server output + client references</DiagramNode>
    <DiagramArrow direction="right" label="hydrate interactivity" />
    <DiagramNode title="Client execution" tone="green">Only browser-required code</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/use-client
- https://react.dev/reference/rsc/directives
