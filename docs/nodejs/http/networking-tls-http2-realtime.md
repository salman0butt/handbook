---
title: Networking, TLS, HTTP/2 and Realtime Transports
description: Node supports TCP, DNS, TLS, HTTP/2, WebSockets through libraries, Server-Sent Events, and long polling with different framing, flow-control, and operational properties.
---

# Networking, TLS, HTTP/2 and Realtime Transports

## Concept

Node supports TCP, DNS, TLS, HTTP/2, WebSockets through libraries, Server-Sent Events, and long polling with different framing, flow-control, and operational properties.

## Why It Exists

Transport choice affects connection count, proxies, authentication, ordering, backpressure, retries, and horizontal scaling.

## Mental Model

```mermaid
flowchart LR
  A["Client"]
  B["DNS and TLS"]
  C["Transport connection"]
  D["Application messages"]
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

createServer((request, response) => {
  if (request.url !== '/events') return response.writeHead(404).end();
  response.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  });
  const timer = setInterval(() => response.write(`data: ${Date.now()}\n\n`), 1_000);
  request.once('close', () => clearInterval(timer));
}).listen(3000);
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use TLS termination ownership, heartbeat and reconnect policies, message IDs, authorization per channel, and a shared broker or adapter for multi-replica fan-out.

## Security

Authenticate connections and every privileged action, prevent cross-tenant subscriptions, validate frames, rotate certificates, and limit connection/message rates.

## Performance

Long-lived connections consume file descriptors and memory. Measure fan-out, buffered bytes, reconnect storms, and load-balancer idle timeouts.

## Common Mistakes

- Treating one TCP chunk as one message.
- Assuming WebSocket delivery is durable.
- Ignoring proxy and load-balancer timeout settings.

## Debugging

Inspect DNS, TLS negotiation, socket states, heartbeat latency, buffered amount, close codes, and per-node connection distribution.

## Testing

Test reconnects, duplicate messages, ordering, slow consumers, proxy restarts, certificate rotation, and horizontal scaling.

## When Not to Use It

Do not choose WebSockets when one-way server updates through SSE are simpler and sufficient.

## Interview Questions

- WebSocket vs SSE: how do you choose?
- How does HTTP/2 multiplexing differ from WebSocket messaging?
- How do you scale realtime connections across replicas?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
