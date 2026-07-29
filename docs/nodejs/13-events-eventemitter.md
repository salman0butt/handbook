---
title: Events & EventEmitter
---

# Events & EventEmitter

`EventEmitter` is synchronous publish-to-listener dispatch inside a process. It is not a durable queue, broker, or distributed event system.

```js
import { EventEmitter, once } from 'node:events';

const bus = new EventEmitter();
bus.on('order.created', order => audit(order));
bus.emit('order.created', { id: 'o_1' });
```

Listeners run synchronously in registration order unless they schedule async work themselves. A slow listener therefore slows the emitter call.

## The special `error` event

An emitted `'error'` without an appropriate listener can terminate normal execution by throwing. Design error ownership explicitly.

## Listener lifecycle

Leaks often come from repeatedly attaching listeners without removing them when requests/sockets/jobs end. The max-listener warning is a diagnostic signal, not a request to raise the limit blindly.

```js
const onAbort = () => cleanup();
signal.addEventListener('abort', onAbort, { once: true });
```

## EventTarget vs EventEmitter

Modern Node also supports web-compatible `EventTarget`. Choose based on ecosystem/API contract, not fashion. `EventEmitter` provides Node conventions and rich event tooling; `EventTarget` improves web-platform compatibility.

## Architecture trade-off

Events decouple caller from listener names but can hide control flow, error propagation, transaction boundaries, and ordering. For domain workflows, prefer explicit application orchestration plus durable messaging/outbox when delivery must survive process failure.
