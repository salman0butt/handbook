---
title: HTTP Server with Node.js Core
description: The core HTTP server exposes request and response streams, socket lifecycle, headers, methods, status, timeouts, and connection control without framework abstraction.
---

# HTTP Server with Node.js Core

## Concept

The core HTTP server exposes request and response streams, socket lifecycle, headers, methods, status, timeouts, and connection control without framework abstraction.

## Why It Exists

Building one small core server makes framework behavior and production tuning understandable.

## Mental Model

```mermaid
flowchart LR
  A["Client socket"]
  B["HTTP parser"]
  C["Route and body boundary"]
  D["Response stream"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import { createServer } from 'node:http';

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  if (request.method === 'GET' && url.pathname === '/api/time') {
    response.writeHead(200, {'content-type': 'application/json; charset=utf-8'});
    response.end(JSON.stringify({time: new Date().toISOString()}));
    return;
  }
  response.writeHead(404, {'content-type': 'application/problem+json'});
  response.end(JSON.stringify({title: 'Not Found', status: 404}));
});
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.listen(3000);
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Add routing, body limits, validation, authentication, request IDs, structured errors, observability, and graceful shutdown deliberately before calling a core server production-ready.

## Security

Set header/body/time limits, validate every request, prevent request smuggling through correct proxy topology, and never trust forwarded headers without a trusted proxy.

## Performance

Stream bodies, reuse outbound connections, avoid synchronous parsing hotspots, and measure active sockets plus p95/p99 latency.

## Common Mistakes

- Reading an unlimited body into memory.
- Using request URL directly without a base.
- Leaving default timeout behavior unreviewed.

## Debugging

Capture method, route, status, duration, bytes, socket state, aborts, and timeout reason.

## Testing

Test malformed requests, slow headers/body, aborts, keep-alive reuse, oversized payloads, and shutdown with in-flight requests.

## When Not to Use It

Do not hand-build a large router or middleware ecosystem when a maintained framework provides the needed controls.

## Interview Questions

- What are IncomingMessage and ServerResponse?
- Which HTTP server timeouts matter?
- How do you handle client disconnects?

## Official References

- [nodejs.org](https://nodejs.org/api/http.html)
