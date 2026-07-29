---
title: Fastify Integration
---

# Fastify Integration

Fastify emphasizes plugin encapsulation, schemas, serialization, and a performance-conscious request lifecycle.

```js
import Fastify from 'fastify';

const app = Fastify({logger: true});
app.get('/orders/:id', {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {id: {type: 'string'}},
    },
  },
}, async request => orderService.get(request.params.id));
```

## Plugins and encapsulation

Plugins form scopes for decorators, hooks, and registrations. Use this to model module boundaries rather than one giant bootstrap file.

## Schemas

Validation and serialization schemas can improve correctness and performance, but only if they match actual contracts. Do not expose DB objects blindly because the serializer accepts them.

## Hooks

Hooks are powerful lifecycle extension points. Keep them for cross-cutting request concerns; domain business workflows remain explicit services/use cases.

## Performance model

Fastify can reduce framework overhead, but backend latency is often dominated by DB/network/serialization/application behavior. Benchmark realistic workloads with logging, validation, auth, and dependencies enabled.

## Testing

Fastify's injection model enables HTTP-like integration tests without binding a real port for many cases. Still run selected real-network tests for socket/proxy/TLS/shutdown behavior.
