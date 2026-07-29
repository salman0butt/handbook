---
title: HTTP Fundamentals
---

# HTTP Fundamentals

Node's built-in HTTP module exposes streaming request/response primitives. Frameworks add routing and middleware but ultimately operate on the same network/lifecycle concerns.

```js
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify({ok: true}));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.listen(3000);
```

## Bodies are streams

Do not concatenate arbitrary request bodies without a size limit. Stream large uploads or stop reading once the configured maximum is exceeded.

## Keep-alive and connection reuse

HTTP connection reuse avoids repeated TCP/TLS setup, but idle/open sockets consume resources. Timeouts and agent/pool configuration are capacity controls, not mere tuning knobs.

## Timeout taxonomy

A service may need different limits for headers, request body, application operation, upstream connection, upstream response, idle keep-alive, and shutdown drain. One “timeout = 30s” setting does not model all failure modes.

## Abort propagation

If the client disconnects, cancel expensive owned downstream work where safe. If your service deadline expires, abort the fetch/DB/queue operation rather than only rejecting the outer Promise.

## Graceful shutdown

```text
SIGTERM
  ↓
mark unready
  ↓
stop accepting new work
  ↓
drain in-flight requests
  ↓
close pools/consumers
  ↓
flush telemetry
  ↓
exit before orchestrator deadline
```

## HTTP correctness

Use methods, status codes, caching headers, conditional requests, content types, idempotency, authentication, and authorization according to semantics. Frameworks cannot rescue a broken HTTP contract.
