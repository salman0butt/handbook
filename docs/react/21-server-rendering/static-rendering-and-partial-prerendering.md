---
title: Static Rendering, Resume APIs, and Partial Pre-rendering
description: Understand prerender, prerenderToNodeStream, postponed state, resume APIs, static generation, and React 19.2 partial pre-rendering architecture.
sidebar_position: 3
---

# Static rendering, resume APIs, and partial pre-rendering

Streaming SSR optimizes **request-time progressive delivery**.

Static rendering solves a different problem:

> Generate reusable HTML ahead of time, often at build time or in a cached prerendering phase.

React's modern static APIs are Suspense-aware and can wait for data before completing static output.

## Mental model

```text
Streaming SSR
request arrives
render now
send shell early
stream more HTML later

Static rendering
render ahead of time
wait for static content
store/cache HTML
serve reusable result later
```

React 19.2 also supports a more advanced bridge between static and dynamic rendering: **partial pre-rendering**.

```text
prerender as much as possible
   ↓
store completed HTML + postponed state
   ↓
request arrives later
   ↓
resume unfinished regions
   ↓
stream dynamic remainder
```

## `react-dom/static`

React exposes static APIs from:

```jsx
import { prerender } from 'react-dom/static';
```

For Node.js streams, use:

```jsx
import { prerenderToNodeStream } from 'react-dom/static';
```

Just like server streaming, the API choice should match the runtime.

## `prerender`

Basic shape:

```jsx
import { prerender } from 'react-dom/static';

const { prelude, postponed } = await prerender(<App />, {
  bootstrapScripts: ['/main.js'],
});
```

`prelude` is a Web Stream containing static HTML.

`postponed` is either:

- `null` when the prerender completed fully;
- an opaque, serializable postponed state when rendering was stopped before everything finished.

That postponed state can later be resumed.

## Static rendering waits for Suspense data

This is a major difference from old string rendering.

Suppose:

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

If `Reviews` suspends on a Suspense-enabled data source, `prerender` waits for the data to resolve before completing the static output.

This makes it suitable for static generation where the final HTML should include the resolved content.

## Static rendering does not stream progressively to the user

Even though `prelude` is a stream object, the prerender Promise waits for the prerendering phase to finish before resolving normally.

That means:

```text
prerender
wait for static render completion
   ↓
receive prelude
   ↓
serve/store output
```

If your goal is to show a user a shell immediately while data is still loading, use streaming SSR instead.

## Node: `prerenderToNodeStream`

```jsx
import { prerenderToNodeStream } from 'react-dom/static';

const { prelude, postponed } = await prerenderToNodeStream(
  <App />,
  {
    bootstrapScripts: ['/main.js'],
  }
);
```

The returned `prelude` is a Node.js stream.

Use the dedicated Node API rather than Web Streams when running in Node for the intended performance model.

## Aborting prerendering

Static generation sometimes needs a time budget.

```jsx
const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 5000);

const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
});
```

When aborted, React can preserve what finished and represent unfinished work through postponed state.

That enables partial pre-rendering workflows.

## What is partial pre-rendering?

Partial pre-rendering, or PPR, combines reusable static work with request-time dynamic completion.

Imagine an ecommerce page:

```text
Product layout       static
Product description  static
Reviews summary      static/cached
User cart count      request-specific
Inventory message    request-specific
Recommendation feed  request-specific
```

A pure static page may be too stale.

A pure request-time SSR page repeats work that could have been done ahead of time.

PPR aims for:

```text
static shell + static regions
prepared ahead of time

request arrives
resume only postponed/dynamic work
stream remaining output
```

## Postponed state

The `postponed` value is deliberately opaque.

Do not inspect or mutate it.

Treat it as React-owned continuation state:

```text
prerender
returns postponed state
   ↓
store safely
   ↓
resume API receives it later
```

Your infrastructure decides where to store it, but React decides its internal representation.

## `resume`

For Web Stream environments, React server APIs can resume a previously postponed prerender:

```jsx
import { resume } from 'react-dom/server';

const stream = await resume(<App />, postponedState, options);
```

The resumed render produces the remaining request-time HTML as a Web Stream.

## `resumeToPipeableStream`

Node.js uses the dedicated Node stream API:

```jsx
import { resumeToPipeableStream } from 'react-dom/server';

const { pipe, abort } = await resumeToPipeableStream(
  <App />,
  postponedState,
  options
);
```

The same high-level idea applies:

- reuse completed prerendered work;
- continue unfinished work;
- stream the dynamic remainder.

## Bootstrap options belong to prerender

Resume APIs do not simply repeat all prerender options.

For example, bootstrap script configuration belongs to the prerender phase so the static output and resumed output remain consistent.

This is a reminder that prerender/resume are two stages of one rendering contract.

## Identifier consistency

Generated IDs and other render-level identifiers must remain consistent across prerender and resume.

Do not treat resumed rendering as an unrelated second render.

The resumed work must match the original prerendered tree and configuration.

## Stable tree requirement

A PPR architecture assumes the logical React tree matches between prerender and resume.

If application code, feature flags, locale, route configuration, or build artifacts change incompatibly, resuming old postponed state may become unsafe.

Infrastructure therefore needs versioning and invalidation policy.

Example:

```text
build version A
prerender + postponed state A

new deployment version B

Do not blindly resume state A with tree B
```

Treat postponed artifacts like versioned build outputs.

## Experimental continuation APIs

React also exposes experimental static continuation APIs such as:

- `resumeAndPrerender`;
- `resumeAndPrerenderToNodeStream`.

These continue a previously postponed prerender into further static output rather than immediately switching to request-time streaming.

Because the official React docs label these APIs experimental, this handbook treats them as **architecture awareness**, not default stable production APIs.

Do not build a portability-critical abstraction on experimental APIs without pinning versions and understanding framework support.

## PPR vs streaming SSR

```text
Streaming SSR
all rendering starts at request time
can stream shell early

PPR
some rendering happened earlier
request resumes postponed work
can avoid repeating completed static work
```

They can work together.

PPR may prepare the static shell ahead of time, then a resume API streams the remaining dynamic work on request.

## PPR vs client-side fetching

Another common architecture is:

```text
serve static HTML
hydrate
fetch dynamic data in browser
```

PPR instead allows more dynamic work to happen on the server and arrive as server-rendered HTML.

Potential benefits include:

- less client data orchestration;
- useful HTML earlier;
- reduced duplicate client/server fetching;
- better integration with Suspense and streaming.

Trade-offs include:

- more sophisticated server infrastructure;
- postponed-state storage/versioning;
- tighter framework/runtime integration.

## `renderToString`

Legacy non-streaming rendering still exists:

```jsx
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

It returns a string immediately based on what React can render in that model.

It does not provide the modern Suspense-aware progressive/static behavior of the newer APIs.

Use it for compatibility cases, not as the first choice for modern Suspense architecture.

## `renderToStaticMarkup`

```jsx
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Email />);
```

This is for **non-interactive HTML**.

The result is not intended to be hydrated into an interactive React app.

Typical use cases:

- emails;
- static documents;
- HTML generation where React is only a templating/render layer.

Do not use it for an app you plan to hydrate.

## Static generation and caching

Static HTML is only useful if your invalidation strategy matches the data.

Questions to answer:

- how often does content change?
- what makes a page stale?
- can pages be regenerated incrementally?
- is output personalized?
- are locale and tenant part of the cache key?
- do authorization rules permit sharing the cached output?

React generates output; your application/framework decides cache policy.

## Security and personalization

Never accidentally cache personalized HTML as public static output.

Inputs that often affect cache safety include:

- authenticated user;
- organization/tenant;
- locale;
- currency;
- feature flags;
- permissions;
- request headers;
- geolocation;
- AB-test assignment.

Static rendering is an infrastructure decision, not merely a rendering API choice.

## Common mistakes

### Mistake: call `prerender` expecting progressive browser loading

Use streaming SSR for request-time progressive loading.

### Mistake: inspect postponed state

It is opaque React-owned continuation data.

### Mistake: resume old postponed state after incompatible deployment

Version your render artifacts.

### Mistake: use `renderToStaticMarkup` for a page that must hydrate

Static markup is non-interactive output.

### Mistake: publicly cache personalized output

Cache keys and privacy boundaries must be designed explicitly.

### Mistake: treat experimental continuation APIs as stable portability contracts

Label them experimental and isolate usage behind framework/runtime support.

## Production decision matrix

| Goal | API direction |
| --- | --- |
| interactive request-time HTML with progressive loading | streaming SSR |
| static Suspense-aware HTML generation | `prerender` / `prerenderToNodeStream` |
| resume postponed static work on request | `resume` / `resumeToPipeableStream` |
| non-interactive HTML | `renderToStaticMarkup` |
| old compatibility path | `renderToString` |

## Exercise

Design three rendering strategies for a product page:

1. fully static catalog page;
2. streaming SSR product page;
3. PPR page with static product content and request-time user cart/inventory.

For each strategy, identify:

- what runs ahead of time;
- what runs per request;
- what can be cached;
- what must never be shared between users;
- how hydration occurs.

## Interview questions

**Junior:** What is the difference between static rendering and streaming SSR?

**Mid-level:** Why does `prerender` wait for Suspense data instead of streaming fallbacks progressively?

**Senior:** Explain how postponed state, resume APIs, cache invalidation, deployment versioning, and personalization affect a production partial pre-rendering architecture.

## Summary

```text
prerender
build static HTML and wait for Suspense data

abort + postponed state
preserve unfinished render continuation

resume
finish postponed work later

PPR
reuse static work + complete dynamic work per request
```

## References

- https://react.dev/reference/react-dom/static
- https://react.dev/reference/react-dom/static/prerender
- https://react.dev/reference/react-dom/static/prerenderToNodeStream
- https://react.dev/reference/react-dom/server/resume
- https://react.dev/reference/react-dom/server/resumeToPipeableStream
- https://react.dev/blog/2025/10/01/react-19-2
