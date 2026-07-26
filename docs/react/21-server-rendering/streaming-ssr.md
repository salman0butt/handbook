---
title: Streaming SSR with React DOM Server APIs
description: Learn renderToPipeableStream, renderToReadableStream, Suspense streaming, shell timing, aborts, status codes, and production SSR architecture.
sidebar_position: 2
---

# Streaming SSR with React DOM server APIs

Modern React server rendering is not limited to producing one complete HTML string and sending it after the whole tree finishes.

Streaming SSR lets React send useful HTML progressively.

## Mental model

```text
request arrives
   ↓
React renders server tree
   ↓
shell becomes ready
   ↓
server starts sending HTML
   ↓
Suspense fallbacks may be visible
   ↓
more data/code becomes ready
   ↓
React streams additional HTML
   ↓
browser fills completed boundaries
   ↓
client hydration attaches behavior
```

The main architectural benefit is **progressive delivery**.

The user can receive meaningful page structure before every slow dependency finishes.

## Server API families

React exposes two streaming families:

### Web Streams

```jsx
import { renderToReadableStream } from 'react-dom/server';
```

Good for environments built around Web Streams, such as many edge runtimes.

### Node.js Streams

```jsx
import { renderToPipeableStream } from 'react-dom/server';
```

Use the dedicated Node.js stream API in Node environments.

The official docs also expose Web Stream methods in Node for compatibility, but recommend the dedicated Node APIs for performance.

## `renderToPipeableStream`

Basic shape:

```jsx
import { renderToPipeableStream } from 'react-dom/server';

function handleRequest(req, res) {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],

    onShellReady() {
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },

    onShellError(error) {
      res.statusCode = 500;
      res.end('<h1>Server error</h1>');
    },

    onError(error) {
      console.error(error);
    },
  });

  setTimeout(() => abort(), 10000);
}
```

This example demonstrates four production concerns:

- stream only after the shell is ready;
- retain a shell-level failure path;
- log rendering errors;
- abort work that exceeds a timeout.

## What is the shell?

The shell is the part of the page React can render before unresolved Suspense boundaries complete.

Example:

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

If `Feed` suspends, the shell can still contain:

- document structure;
- header;
- fallback UI;
- bootstrap scripts/resources.

That shell can be sent before the feed finishes.

## `onShellReady`

`onShellReady` fires when React has enough HTML to start streaming the shell.

For normal interactive users, this is usually the place to begin streaming.

```jsx
onShellReady() {
  res.statusCode = didError ? 500 : 200;
  res.setHeader('content-type', 'text/html');
  pipe(res);
}
```

Once bytes are sent, changing HTTP status becomes much harder or impossible depending on the server stack.

Therefore error and status handling before `pipe` matters.

## `onAllReady`

`onAllReady` fires when all rendering is complete.

If you wait for it before piping, the response loses progressive streaming behavior.

That can still be useful for cases such as:

- crawlers that prefer complete output;
- static generation workflows;
- environments where progressive delivery is not useful.

Conceptually:

```text
onShellReady
start early
progressive loading
best for users

onAllReady
wait for everything
complete HTML stream
less progressive
```

## `onShellError`

If the initial shell cannot render, no useful shell bytes have been emitted yet.

This is your opportunity to return a different fallback response.

```jsx
onShellError(error) {
  console.error(error);
  res.statusCode = 500;
  res.end('<!doctype html><h1>Something went wrong</h1>');
}
```

Once streaming has started, later boundary-level failures are handled differently.

## `onError`

`onError` can run for recoverable and fatal server-render errors.

Use it for:

- logging;
- observability;
- deciding a status code before the shell is emitted;
- attaching request IDs or traces.

Do not swallow server errors silently.

## Suspense enables progressive HTML

```jsx
<Suspense fallback={<ProfileSkeleton />}>
  <Profile />
</Suspense>
```

If `Profile` suspends, React can stream the fallback in the shell.

When the profile later becomes ready, React can stream additional HTML plus the instructions needed for the browser to place the completed content.

This changes the traditional waterfall:

```text
Traditional non-streaming SSR
fetch everything
   ↓
render everything
   ↓
send HTML
   ↓
load JS
   ↓
hydrate
```

into:

```text
Streaming SSR
render shell
   ↓
send shell
   ↓
continue server work
   ↓
stream completed boundaries
   ↓
hydrate progressively
```

## Streaming does not make slow data fast

Streaming improves **delivery timing**.

It does not reduce the latency of the underlying database, API, or computation.

If a query takes five seconds, streaming cannot make that query finish in one second.

It can make the rest of the page useful while waiting.

## Streaming and data architecture

Good streaming architecture usually requires:

- Suspense-aware data reads;
- boundaries placed around meaningful UI regions;
- parallel data loading where possible;
- avoiding unnecessary serial fetch chains;
- stable server caches within a request where appropriate.

Bad architecture:

```text
load page data A
   ↓
then load B
   ↓
then load C
   ↓
then render
```

Better when dependencies permit:

```text
start A
start B
start C
   ↓
render shell
   ↓
individual boundaries resolve progressively
```

## Abort long renders

A server render should not consume resources forever.

```jsx
const { abort } = renderToPipeableStream(<App />, options);

setTimeout(() => {
  abort();
}, 10000);
```

Aborting tells React to stop waiting for unfinished server work and let the remaining experience continue through client rendering/fallback behavior as supported by the render flow.

Use timeouts deliberately based on product and infrastructure requirements.

## Disconnect handling

If the client disconnects, the server should stop unnecessary work when the runtime/framework allows it.

This may involve connecting request cancellation to rendering/data-fetch cancellation.

The deeper principle is:

> request lifetime should bound server work lifetime.

This becomes especially relevant later with `cacheSignal` in Server Components.

## `renderToReadableStream`

Web Stream environments use a Promise-based API:

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

The surrounding server runtime determines how the stream becomes an HTTP response.

Do not write application code that assumes Node streams if the deployment target uses Web Streams.

## `bootstrapScripts`

Server-rendered HTML is initially non-interactive.

Bootstrap scripts load the client entry point used for hydration.

```jsx
renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
});
```

A real bundler/framework usually generates these asset paths.

Hardcoding them in production can break when filenames are hashed.

## Full-document rendering

Modern React server APIs can render the complete document:

```jsx
function App() {
  return (
    <html lang="en">
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <AppShell />
      </body>
    </html>
  );
}
```

This works naturally with React 19 metadata/resource behavior covered earlier.

## Status codes and streamed errors

Before the shell is sent, you can still choose an HTTP status based on rendering results.

After streaming begins, the response may already be committed.

This produces an architectural trade-off:

```text
wait longer
more certainty before status is sent
but slower first byte

stream earlier
faster shell
but less ability to change response status later
```

Frameworks often provide conventions around not-found and error handling because this becomes subtle quickly.

## SEO and crawlers

Streaming HTML is still HTML.

However, crawler behavior, caching layers, and infrastructure can differ.

Some server setups may prefer `onAllReady` for specific bot traffic, while normal users receive the shell as soon as possible.

Treat this as infrastructure policy, not a universal React rule.

## Streaming + hydration

Streaming and hydration are separate stages:

```text
streaming
server progressively delivers HTML

hydration
client React attaches behavior to delivered HTML
```

They cooperate, but one does not replace the other.

A page can stream HTML and still require JavaScript to hydrate interactive Client Components.

## Streaming + Server Components

Server Components are not the same as streaming SSR.

You can think of them as different axes:

```text
SSR
How React output becomes HTML for the browser

RSC
Where component code executes and what crosses server/client boundaries
```

A framework may combine both.

For example:

1. Server Components render a server component payload;
2. React composes that with Client Components;
3. SSR turns the result into HTML;
4. Suspense enables progressive streaming;
5. Client Components hydrate in the browser.

## Legacy `renderToString`

`renderToString` still exists for non-streaming environments, but it has important limitations compared with modern streaming APIs.

Do not choose it simply because returning a string looks easier.

Production apps that benefit from Suspense and progressive rendering should usually use framework-supported streaming architecture or the modern streaming server APIs directly.

## Common mistakes

### Mistake: one giant Suspense boundary

The shell is not useful if almost the whole page is hidden behind one fallback.

### Mistake: starting every fetch after another finishes

Streaming cannot fix an avoidable server waterfall.

### Mistake: start streaming before deciding required status/headers

Once bytes are committed, HTTP decisions become constrained.

### Mistake: treat `onAllReady` as the normal user path

That often defeats progressive loading.

### Mistake: forget timeouts/cancellation

Long-running renders can waste server resources.

### Mistake: assume SSR means no client JavaScript

Interactive client code still needs to load and hydrate unless the architecture keeps that work server-only through Server Components.

## Production checklist

- identify a meaningful shell;
- put slow independent regions behind sensible Suspense boundaries;
- start independent data work in parallel where possible;
- set status/headers before piping;
- log render errors;
- provide shell-level error fallback;
- define abort policy;
- connect request cancellation where possible;
- let the bundler/framework own hashed asset URLs;
- measure TTFB, LCP, server latency, and hydration cost separately.

## Exercise

Design an SSR dashboard with:

- immediate header/navigation shell;
- profile summary boundary;
- analytics chart boundary;
- activity feed boundary;
- one region that intentionally fails;
- a 10-second abort policy.

Explain which HTML can be sent first and which server work can proceed independently.

## Interview questions

**Junior:** What problem does streaming SSR solve compared with returning one final HTML string?

**Mid-level:** What is the difference between `onShellReady` and `onAllReady`?

**Senior:** Explain how Suspense placement, HTTP status timing, cancellation, data waterfalls, and hydration all affect a production streaming SSR architecture.

## Summary

```text
streaming SSR
send shell early
continue rendering pending Suspense regions
stream completed HTML later
hydrate interactive UI on the client

Node: renderToPipeableStream
Web Streams: renderToReadableStream
```

## References

- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/server/renderToPipeableStream
- https://react.dev/reference/react-dom/server/renderToReadableStream
- https://react.dev/reference/react/Suspense
