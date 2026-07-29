---
title: Static Rendering, Resume APIs, and Partial Pre-rendering
description: Understand prerender, prerenderToNodeStream, postponed state, resume APIs, static generation, and React 19.2 partial pre-rendering architecture.
sidebar_position: 3
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

# Static rendering, resume APIs, and partial pre-rendering

Streaming SSR optimizes **request-time progressive delivery**.

Static rendering optimizes a different problem: **do reusable rendering work ahead of the request**.

React 19.2 also provides a bridge between those models: partial pre-rendering (PPR), where completed static work is stored and unfinished work can be resumed later.

## Rendering strategy mental model

<VisualDiagram title="Static rendering and streaming SSR start at different times">
  <DiagramGrid columns={2}>
    <DiagramNode title="Streaming SSR" tone="blue" eyebrow="REQUEST TIME">
      Request arrives → render now → send useful shell early → stream remaining regions later
    </DiagramNode>
    <DiagramNode title="Static rendering" tone="green" eyebrow="AHEAD OF TIME">
      Render before request → wait for static result → store/cache output → serve reusable result later
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## PPR bridges static and dynamic work

<VisualDiagram title="Partial pre-rendering reuses completed work and resumes unfinished regions later">
  <LifecycleBar
    items={[
      { label: 'Prerender ahead of time', tone: 'blue' },
      { label: 'Abort/postpone unfinished regions', tone: 'orange' },
      { label: 'Store prelude + opaque postponed state', tone: 'purple' },
      { label: 'Request arrives', tone: 'teal' },
      { label: 'Resume unfinished work', tone: 'orange' },
      { label: 'Stream dynamic remainder', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Static API families

```jsx
import { prerender } from 'react-dom/static';
```

For Node.js streams:

```jsx
import { prerenderToNodeStream } from 'react-dom/static';
```

<VisualDiagram title="Match the static API to the runtime">
  <DiagramGrid columns={2}>
    <DiagramNode title="Web Streams" tone="blue"><code>prerender</code> → Web ReadableStream</DiagramNode>
    <DiagramNode title="Node Streams" tone="purple"><code>prerenderToNodeStream</code> → Node.js stream</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## `prerender`

```jsx
import { prerender } from 'react-dom/static';

const { prelude, postponed } = await prerender(<App />, {
  bootstrapScripts: ['/main.js'],
});
```

`prelude` contains the static HTML stream.

`postponed` is:

- `null` when prerendering completed fully;
- an opaque serializable continuation state when unfinished work was postponed.

## Static rendering waits for Suspense data

```jsx
function ProductPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  );
}
```

For a Suspense-enabled data source, `prerender` normally waits for the suspended content before resolving the completed static result.

<VisualDiagram title="prerender is not progressive browser streaming">
  <DiagramStack align="center">
    <DiagramNode title="Start static render" tone="blue" />
    <DiagramArrow label="wait for static work" />
    <DiagramNode title="Suspense-enabled data resolves" tone="purple" />
    <DiagramArrow label="prerender completes" />
    <DiagramNode title="Receive prelude for storage/serving" tone="green" />
  </DiagramStack>
</VisualDiagram>

If the product goal is to show a user a shell while request-time work is still loading, use streaming SSR instead.

## Aborting creates a PPR continuation boundary

```jsx
const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 5000);

const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
});
```

When a prerender stops before every Suspense region completes, React can preserve the finished output and return postponed continuation state for unfinished work.

## What PPR is buying you

Imagine an ecommerce page:

<VisualDiagram title="Static and request-specific regions have different reuse rules">
  <DiagramGrid columns={2}>
    <DiagramNode title="Reusable static work" tone="green">
      Product layout · description · public cached content · stable marketing copy
    </DiagramNode>
    <DiagramNode title="Request-specific work" tone="orange">
      User cart · permissions · personalized inventory/message · recommendations · request-bound data
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A pure static page may be too stale or unsafe. A pure request-time page may repeat work that could be reused. PPR lets the architecture preserve that distinction.

## Postponed state is opaque React-owned continuation data

<VisualDiagram title="Do not inspect or mutate postponed state">
  <DiagramStack align="center">
    <DiagramNode title="Prerendered tree" tone="blue" />
    <DiagramArrow label="unfinished work remains" />
    <DiagramNode title="Opaque postponed state" tone="purple">Serialize/store it as an artifact; do not depend on its internals.</DiagramNode>
    <DiagramArrow label="later request" />
    <DiagramNode title="Resume API receives the state" tone="green" />
  </DiagramStack>
</VisualDiagram>

Your infrastructure owns storage/versioning. React owns the continuation representation.

## Resume APIs

Web Stream environments:

```jsx
import { resume } from 'react-dom/server';

const stream = await resume(<App />, postponedState, options);
```

Node.js:

```jsx
import { resumeToPipeableStream } from 'react-dom/server';

const { pipe, abort } = await resumeToPipeableStream(
  <App />,
  postponedState,
  options
);
```

The goal is the same: skip completed prerendered work where React can, continue unfinished work, and stream the request-time remainder.

## Prerender and resume are one contract

Some configuration belongs to the original prerender so the resumed render remains consistent with the static output. For example, bootstrap resource configuration belongs to the prerender stage rather than being independently reinvented during resume.

<VisualDiagram title="Resume is not an unrelated second render">
  <DiagramGrid columns={2}>
    <DiagramNode title="Prerender stage" tone="blue">Tree shape · build version · identifiers · bootstrap resources · completed static work</DiagramNode>
    <DiagramNode title="Resume stage" tone="purple">Must continue a compatible logical tree and rendering configuration</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Versioning postponed artifacts

A deployment can make old continuation state incompatible.

<VisualDiagram title="Treat postponed state like versioned build output">
  <LifecycleBar
    items={[
      { label: 'Build A prerenders', tone: 'blue' },
      { label: 'Store prelude + postponed A', tone: 'purple' },
      { label: 'Deploy build B', tone: 'orange' },
      { label: 'Invalidate incompatible A continuation', tone: 'red' },
      { label: 'Generate/resume with matching version', tone: 'green' },
    ]}
  />
</VisualDiagram>

Do not blindly resume state from an incompatible tree, locale/configuration contract, or deployment version.

## Experimental continuation APIs

React also documents experimental static continuation APIs such as:

- `resumeAndPrerender`;
- `resumeAndPrerenderToNodeStream`.

They continue postponed work into further static output rather than switching immediately to request-time SSR streaming.

Because they are marked experimental, treat them as architecture awareness rather than a portability-critical stable contract.

## PPR vs streaming SSR

<VisualDiagram title="PPR can feed into streaming rather than compete with it">
  <DiagramGrid columns={2}>
    <DiagramNode title="Streaming SSR" tone="blue">
      All render work starts at request time.
      <br />Useful shell can stream early.
    </DiagramNode>
    <DiagramNode title="PPR" tone="purple">
      Some rendering happened earlier.
      <br />Request resumes only unfinished/dynamic work.
    </DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="PPR can resume into a streaming SSR response" />
  <DiagramNode title="Reuse static work + progressively deliver dynamic remainder" tone="green" wide />
</VisualDiagram>

## PPR vs browser fetching

<VisualDiagram title="Dynamic work can finish on the server or after hydration in the browser">
  <DiagramGrid columns={2}>
    <DiagramNode title="Static HTML + client fetch" tone="orange">Serve static page → hydrate → browser requests dynamic data.</DiagramNode>
    <DiagramNode title="PPR resume" tone="green">Serve/reuse static work → server resumes dynamic regions → stream server-rendered remainder.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

PPR can reduce client orchestration, but it requires stronger server infrastructure, storage/versioning, and framework/runtime integration.

## Legacy/non-interactive rendering APIs

```jsx
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);
```

`renderToString` is a compatibility path with limited Suspense/progressive behavior compared with modern APIs.

```jsx
import { renderToStaticMarkup } from 'react-dom/server';
const html = renderToStaticMarkup(<Email />);
```

`renderToStaticMarkup` is for **non-interactive HTML** such as emails or generated documents. Do not use it for a page you intend to hydrate.

## Static generation is also a cache/security decision

Static output is only reusable when every input that affects correctness is represented in the cache/invalidation contract.

Important dimensions can include:

- authenticated user;
- organization/tenant;
- locale and currency;
- permissions;
- feature flags;
- request headers/geography;
- AB-test assignment;
- content version and freshness.

Never publish personalized HTML as globally shared static output by accident.

## Rendering strategy decision

<DecisionTree
  question="Which rendering direction fits the output contract?"
  items={[
    { label: 'Interactive request-time HTML with progressive loading', value: 'Streaming SSR' },
    { label: 'Reusable Suspense-aware HTML generated ahead of time', value: 'prerender / prerenderToNodeStream' },
    { label: 'Reuse static work but finish dynamic work per request', value: 'PPR with postponed state + resume' },
    { label: 'Non-interactive HTML document', value: 'renderToStaticMarkup' },
  ]}
/>

## Common mistakes

- calling `prerender` expecting user-facing progressive streaming before prerender completion;
- inspecting or mutating postponed state;
- resuming old continuation state after an incompatible deployment;
- using `renderToStaticMarkup` for an app that must hydrate;
- publicly caching personalized output;
- treating experimental continuation APIs as stable portability contracts.

## Exercise

Design three versions of a product page:

1. fully static catalog page;
2. request-time streaming SSR page;
3. PPR page with static product content and request-time cart/inventory.

For each, document what runs ahead of time, what runs per request, what can be cached, what must never be shared, and where hydration begins.

## Interview questions

**Junior:** What is the difference between static rendering and streaming SSR?

**Mid-level:** Why does `prerender` normally wait for Suspense data instead of progressively revealing it to a current user?

**Senior:** How do postponed state, deployment versioning, cache keys, personalization, and resume APIs shape a safe production PPR architecture?

## Summary

<VisualDiagram title="Static rendering and PPR in one lifecycle">
  <LifecycleBar
    items={[
      { label: 'Prerender reusable work', tone: 'blue' },
      { label: 'Store static prelude', tone: 'green' },
      { label: 'Preserve opaque postponed state when needed', tone: 'purple' },
      { label: 'Resume on matching request/build', tone: 'orange' },
      { label: 'Stream dynamic remainder', tone: 'teal' },
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react-dom/static
- https://react.dev/reference/react-dom/static/prerender
- https://react.dev/reference/react-dom/static/prerenderToNodeStream
- https://react.dev/reference/react-dom/server/resume
- https://react.dev/reference/react-dom/server/resumeToPipeableStream
- https://react.dev/blog/2025/10/01/react-19-2
