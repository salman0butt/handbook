---
title: Buffers & Binary Data
---

# Buffers & Binary Data

`Buffer` represents bytes and is a Node-specific subclass of `Uint8Array` behavior. Text is an interpretation of bytes using an encoding.

```js
const buf = Buffer.from('hello', 'utf8');
console.log(buf.length);          // bytes, not characters in general
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));
```

## Relationship

```text
ArrayBuffer = raw memory region
Uint8Array  = typed byte view
Buffer      = Node byte view + Node conveniences
```

Slicing/view operations may share memory depending on API semantics; copying allocates independent storage. Know which behavior you need when parsing protocols or retaining chunks.

## Allocation

```js
Buffer.alloc(1024);       // zero-filled
Buffer.allocUnsafe(1024); // faster allocation path; contents must be overwritten before exposure
```

`allocUnsafe` is not “unsafe Node code” by itself; the risk is accidentally reading/exposing uninitialized bytes before fully writing them.

## Memory implications

Large buffers may contribute to external/native memory that is not represented by V8 heap size alone. Diagnose with the full `process.memoryUsage()` breakdown, not only `heapUsed`.

```text
10,000 requests × 5 MB buffered body
≈ 50 GB theoretical payload retention
```

Streaming and backpressure exist partly to prevent this shape of failure.

## Security

- cap payload sizes before buffering;
- validate binary framing and lengths;
- do not decode attacker-controlled data into unbounded strings;
- avoid exposing uninitialized memory;
- use constant-time comparison where cryptographic equality requires it.
