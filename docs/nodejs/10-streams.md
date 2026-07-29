---
title: Streams
---

# Streams

Streams let producers and consumers process data incrementally rather than materializing an entire payload in memory. The central concept is **backpressure**.

```text
producer
   ↓
stream buffer
   ↓
consumer
```

If the consumer is slower, the producer must slow down or memory grows without bound.

## Stream classes

- `Readable`: source of chunks.
- `Writable`: destination for chunks.
- `Duplex`: readable + writable sides.
- `Transform`: duplex stream whose output derives from input.

Object mode changes chunks from byte/string data to arbitrary JS values and therefore changes buffering semantics.

## Prefer `pipeline()` for composed flows

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('input.log'),
  createGzip(),
  createWriteStream('input.log.gz'),
);
```

`pipeline()` coordinates errors and teardown better than a chain of bare `.pipe()` calls.

## Backpressure

For a Writable, `.write(chunk)` returning `false` means its internal buffer crossed the pressure threshold. Stop writing until `'drain'`.

```js
if (!destination.write(chunk)) {
  await new Promise(resolve => destination.once('drain', resolve));
}
```

`highWaterMark` is a buffering threshold, not necessarily a hard byte cap. Raising it may increase throughput for some workloads while also increasing memory and latency.

## Flowing vs paused mode

Attaching certain consumers can put a Readable into flowing mode. Async iteration provides straightforward pull-style consumption:

```js
for await (const chunk of readable) {
  await consume(chunk);
}
```

The `await` naturally slows consumption and can cooperate with stream backpressure.

## Cancellation and cleanup

A disconnected HTTP client should not leave a file read, upstream fetch, transform, and DB cursor alive. Propagate `AbortSignal` and destroy/close owned resources.

## Web Streams interop

Modern Node supports Web Streams and conversion/interoperability APIs. Use them when integrating web-compatible APIs such as `fetch`; avoid gratuitous conversion in hot paths.

## Failure modes

- buffering whole files before responding;
- ignoring Writable return values;
- missing error handlers in hand-built pipelines;
- mixing multiple consumption modes on one Readable;
- retaining chunks after they could be released;
- assuming stream completion means durable persistence;
- forgetting cancellation on client disconnect.

## Why streams reduce memory

A 20 GB file does not need a 20 GB heap if the application processes bounded chunks and honors backpressure. Memory becomes roughly proportional to pipeline buffering/concurrency, not total payload size.
