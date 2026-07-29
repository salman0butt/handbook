---
title: TCP, UDP & Networking
---

# TCP, UDP & Networking

Node's `node:net` module exposes TCP sockets; `node:dgram` exposes UDP datagrams. HTTP libraries sit above these transport concepts.

## TCP mental model

```text
listen(address, port)
      ↓
accept connection
      ↓
byte stream in both directions
      ↓
application framing decides message boundaries
```

TCP provides an ordered byte stream, **not messages**. One `socket.write()` is not guaranteed to equal one `'data'` event at the receiver.

```js
import net from 'node:net';

const server = net.createServer((socket) => {
  socket.setTimeout(30_000);
  socket.on('data', chunk => consumeBytes(chunk));
  socket.on('timeout', () => socket.destroy());
  socket.on('error', err => report(err));
});
server.listen(9000);
```

Design framing explicitly: newline-delimited data, length prefixes, or a protocol parser. Enforce maximum frame sizes before allocation.

## Half-open and close behavior

One TCP direction can close while the other remains open. Protocols need explicit lifecycle rules so a half-closed socket does not become leaked capacity.

## Backpressure

`socket.write()` is Writable-stream behavior. If it returns `false`, wait for `'drain'`; otherwise a fast producer can create large user-space buffers.

## Keepalive and timeouts

TCP keepalive helps detect dead peers over long-lived connections; it is not an application deadline. Configure connect, request/message, idle, and shutdown timeouts separately.

## UDP

UDP is datagram-oriented and does not provide connection ordering, retransmission, or congestion guarantees like TCP. Applications must tolerate loss, duplication, reordering, and size constraints where relevant.

## Failure modes

Expect DNS failure, connection refused, timeout, reset, broken pipe, route loss, NAT/load-balancer idle expiry, partial reads, backpressure, and peer disappearance. Network code is correct only when those paths are designed, tested, and observable.
