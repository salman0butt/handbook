---
title: Streaming SSR with React DOM Server APIs
description: Learn renderToPipeableStream, renderToReadableStream, Suspense streaming, shell timing, aborts, status codes, and production SSR architecture.
sidebar_position: 2
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

# Streaming SSR with React DOM server APIs

Streaming SSR lets React send useful HTML progressively instead of waiting for the entire server tree to finish before sending the first byte.

## The streaming pipeline

<VisualDiagram title="Streaming SSR separates shell readiness from complete page readiness">
  <LifecycleBar
    items={[
      { label: 'Request arrives', tone: 'blue' },
      { label: 'React renders server tree', tone: 'purple' },
      { label: 'Shell becomes ready', tone: 'green' },
      { label: 'Server starts sending HTML', tone: 'teal' },
      { label: 'Suspense regions finish later', tone: 'orange' },
      { label: 'Completed HTML streams into boundaries', tone: 'green' },
      { label: 'Client hydrates interactive regions', tone: 'purple' },
    ]}
  />
</VisualDiagram>

The benefit is **progressive delivery**, not faster databases or APIs.

## Server API families

<VisualDiagram title="Choose the stream family for the runtime">
  <DiagramGrid columns={2}>
    <DiagramNode title="Web Streams" tone="blue" eyebrow="EDGE / WEB STREAM RUNTIMES">
      <code>renderToReadableStream</code>
      <br />Produces a Web ReadableStream.
    </DiagramNode>
    <DiagramNode title="Node.js Streams" tone="purple" eyebrow="NODE RUNTIME">
      <code>renderToPipeableStream</code>
      <br />Produces a Node pipeable stream interface.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Node also exposes Web Stream compatibility APIs, but the dedicated Node server APIs are the intended performance path for Node environments.

## `renderToPipeableStream`

```jsx
import { renderToPipeableStream } from 'react-dom/server';

function handleRequest(req, res) {
  let didError = false;

  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],

    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },

    onShellError(error) {
      console.error(error);
      res.statusCode = 500;
      res.end('<h1>Server error</h1>');
    },

    onError(error) {
      didError = true;
      console.error(error);
    },
  });

  setTimeout(() => abort(), 10000);
}
```

This single example exposes the major production boundaries: shell readiness, status/header timing, fatal shell failure, observability, and abort policy.

## What is the shell?

```jsx
function App() {
  return (
    <html>
      <body>
        <Header />
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />
        </Suspense>
      </body>
    </html>
  );
}
```

If `Feed` suspends, React can still produce document structure, header, fallback UI, and bootstrap resources.

<VisualDiagram title="The shell is the useful page React can send before slow boundaries finish">
  <DiagramGrid columns={2}>
    <DiagramNode title="Ready shell" tone="green">Document · navigation · stable layout · fallbacks · bootstrap resources</DiagramNode>
    <DiagramNode title="Pending boundary" tone="orange">Slow data/code continues rendering behind its Suspense boundary</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## `onShellReady` vs `onAllReady`

<VisualDiagram title="These callbacks represent different delivery strategies">
  <DiagramGrid columns={2}>
    <DiagramNode title="onShellReady" tone="green" eyebrow="PROGRESSIVE USER PATH">
      Start streaming when the shell is usable.
      <br />Better time-to-first-content, later boundaries continue arriving.
    </DiagramNode>
    <DiagramNode title="onAllReady" tone="blue" eyebrow="WAIT-FOR-COMPLETE PATH">
      Wait until all rendering completes before piping.
      <br />Useful for special complete-output cases, but removes most progressive benefit.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Once bytes are sent, HTTP status and headers may already be committed. Decide required status/headers before starting the stream.

## Shell failure vs later boundary failure

<VisualDiagram title="Failure timing changes what the server can still control">
  <DiagramGrid columns={2}>
    <DiagramNode title="Before shell is sent" tone="red">`onShellError` can return a completely different server response and status.</DiagramNode>
    <DiagramNode title="After streaming starts" tone="orange">Response may already be committed; later region errors need boundary/recovery architecture rather than a new HTTP response.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Use `onError` for logging, tracing, request IDs, and status decisions that are still possible before the shell is emitted.

## Suspense enables progressive HTML

```jsx
<Suspense fallback={<ProfileSkeleton />}>
  <Profile />
</Suspense>
```

<VisualDiagram title="Suspense turns server readiness into user-visible regions">
  <DiagramStack align="center">
    <DiagramNode title="Shell contains fallback" tone="orange" />
    <DiagramArrow label="Profile becomes ready" />
    <DiagramNode title="Server emits completed boundary HTML" tone="blue" />
    <DiagramArrow label="browser receives placement instructions" />
    <DiagramNode title="Completed profile replaces fallback" tone="green" />
  </DiagramStack>
</VisualDiagram>

## Non-streaming vs streaming waterfall

<VisualDiagram title="Streaming overlaps delivery with unfinished server work">
  <DiagramGrid columns={2}>
    <DiagramNode title="Traditional blocking SSR" tone="orange">
      Fetch everything → render everything → send HTML → load JS → hydrate
    </DiagramNode>
    <DiagramNode title="Streaming SSR" tone="green">
      Render shell → send shell → continue server work → stream completed regions → hydrate progressively
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Streaming changes **when useful output arrives**. It does not make a five-second query complete in one second.

## Avoid server waterfalls

Bad architecture serializes independent work:

<VisualDiagram title="Sequential discovery wastes server time">
  <LifecycleBar
    items={[
      { label: 'Load A', tone: 'orange' },
      { label: 'Then load B', tone: 'orange' },
      { label: 'Then load C', tone: 'orange' },
      { label: 'Only then render', tone: 'red' },
    ]}
  />
</VisualDiagram>

When dependencies allow, start independent work early and let meaningful Suspense regions resolve independently.

<VisualDiagram title="Parallel work gives streaming something useful to coordinate">
  <DiagramGrid columns={3}>
    <DiagramNode title="Start A" tone="blue" />
    <DiagramNode title="Start B" tone="blue" />
    <DiagramNode title="Start C" tone="blue" />
  </DiagramGrid>
  <DiagramArrow label="render shell while work progresses" />
  <DiagramNode title="Boundaries complete progressively" tone="green" wide />
</VisualDiagram>

## Abort and request lifetime

```jsx
const { abort } = renderToPipeableStream(<App />, options);

setTimeout(() => {
  abort();
}, 10000);
```

A render should not consume server resources indefinitely.

<VisualDiagram title="Request lifetime should bound server work lifetime">
  <DiagramStack align="center">
    <DiagramNode title="HTTP request" tone="blue" />
    <DiagramArrow label="owns" />
    <DiagramNode title="Server render + data work" tone="purple" />
    <DiagramArrow label="timeout / disconnect" />
    <DiagramNode title="Abort unnecessary unfinished work" tone="orange" />
  </DiagramStack>
</VisualDiagram>

Connect client disconnect/cancellation to rendering and data work where the runtime/framework supports it.

## `renderToReadableStream`

Web Stream runtimes use the Promise-based API:

```jsx
import { renderToReadableStream } from 'react-dom/server';

const stream = await renderToReadableStream(<App />, {
  bootstrapScripts: ['/main.js'],
});

return new Response(stream, {
  headers: {
    'content-type': 'text/html',
  },
});
```

The server runtime decides how that stream becomes an HTTP response.

## Bootstrap scripts and hydration

Server HTML is not automatically interactive.

```jsx
renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
});
```

A real framework/bundler usually owns hashed asset URLs. Avoid hardcoding generated production filenames.

<VisualDiagram title="Streaming and hydration are separate but coordinated stages">
  <DiagramGrid columns={2}>
    <DiagramNode title="Streaming" tone="blue">Server progressively delivers HTML.</DiagramNode>
    <DiagramNode title="Hydration" tone="purple">Client React connects behavior to delivered HTML.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A page can stream excellent HTML and still need JavaScript for interactive Client Components.

## Status-code trade-off

<DecisionTree
  question="When should the server start streaming?"
  items={[
    { label: 'Need more render certainty before committing status/headers', value: 'Wait longer, accepting slower first byte' },
    { label: 'Shell is valid and early delivery matters', value: 'Start at shell readiness' },
    { label: 'Later regions can fail independently', value: 'Use Suspense/error recovery inside the committed response' },
    { label: 'Special complete-output consumer', value: 'Consider waiting for all-ready behavior' },
  ]}
/>

Framework conventions often make not-found/error/status behavior safer than hand-rolling this logic.

## SSR and Server Components are different axes

<VisualDiagram title="A framework may combine RSC, SSR, streaming, and hydration">
  <LifecycleBar
    items={[
      { label: 'Server Components produce server component output', tone: 'purple' },
      { label: 'React composes Client Component boundaries', tone: 'blue' },
      { label: 'SSR turns the result into HTML', tone: 'teal' },
      { label: 'Suspense streams progressive regions', tone: 'orange' },
      { label: 'Client Components hydrate', tone: 'green' },
    ]}
  />
</VisualDiagram>

SSR asks **how output reaches the browser as HTML**. Server Components ask **where component code executes and what crosses boundaries**.

## Legacy string APIs

`renderToString` still exists for compatibility/non-streaming cases, but modern Suspense-heavy applications generally benefit from framework-supported streaming or the current streaming APIs.

`renderToStaticMarkup` is for non-interactive HTML and is covered with static rendering.

## Production checklist

- identify a meaningful shell;
- place slow independent UI behind meaningful Suspense boundaries;
- start independent data work in parallel where possible;
- decide status/headers before piping;
- log server-render errors;
- maintain a shell-level failure response;
- define abort/disconnect policy;
- let build tooling own generated asset URLs;
- measure server latency, TTFB, LCP, and hydration cost separately.

## Exercise

Design an SSR dashboard with an immediate navigation shell, independently streaming profile/chart/activity regions, one failing region, and a ten-second abort budget.

Explain which output can be sent first, which work can run in parallel, and which failures can still change the HTTP response.

## Interview questions

**Junior:** What does streaming SSR improve compared with returning one final HTML string?

**Mid-level:** What is the difference between `onShellReady` and `onAllReady`?

**Senior:** How do Suspense placement, HTTP status timing, server waterfalls, abort policy, and hydration interact in a production streaming route?

## Summary

<VisualDiagram title="Streaming SSR is progressive delivery architecture">
  <LifecycleBar
    items={[
      { label: 'Render useful shell', tone: 'blue' },
      { label: 'Commit status + start stream', tone: 'purple' },
      { label: 'Continue slow work', tone: 'orange' },
      { label: 'Stream completed boundaries', tone: 'teal' },
      { label: 'Hydrate interactive regions', tone: 'green' },
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/server/renderToPipeableStream
- https://react.dev/reference/react-dom/server/renderToReadableStream
