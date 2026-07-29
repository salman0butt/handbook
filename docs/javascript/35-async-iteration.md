---
title: 35 — Async Iteration
---

# 35 — Async Iteration

Async iteration represents sequences where obtaining each next value may require asynchronous work. An async iterable exposes `Symbol.asyncIterator`; its iterator's `next()` returns a Promise for an iterator result.

```js
const source = {
  async *[Symbol.asyncIterator]() {
    yield await loadPage(1);
    yield await loadPage(2);
  },
};

for await (const page of source) {
  consume(page);
}
```

Async generator functions (`async function*`) combine generator suspension with Promise-aware yielding.

## Custom async iterator

```js
function paginated(fetchPage) {
  return {
    async *[Symbol.asyncIterator]() {
      let cursor;
      do {
        const page = await fetchPage(cursor);
        for (const item of page.items) yield item;
        cursor = page.nextCursor;
      } while (cursor != null);
    },
  };
}
```

## `for await...of`

`for await...of` consumes async iterables and can also adapt synchronous iterables. It waits for each next result in sequence.

```js
for await (const chunk of streamLikeSource) {
  await processChunk(chunk);
}
```

This is naturally suitable for streams/backpressure-like flows: the producer/adapter need not advance until the consumer requests the next item. Exact backpressure mechanics depend on the host API that the iterator wraps.

## Cancellation and cleanup

Breaking a `for await...of` loop triggers iterator-closing behavior. Async generators can use `try/finally` for cleanup.

```js
async function* rows(resource) {
  try {
    while (true) {
      const row = await resource.next();
      if (!row) return;
      yield row;
    }
  } finally {
    await resource.close();
  }
}
```

Cancellation of underlying host operations is separate. If `resource.next()` wraps `fetch`, a stream, or I/O, pass an AbortSignal or the host-specific cancellation mechanism so early iterator closure can stop real work.

## Sequential vs concurrent consumption

Async iteration is usually sequential by design. If items can be processed concurrently, introduce an explicit bounded-concurrency layer rather than assuming `for await` is “slow.” Sequential flow can be the correct way to respect ordering, rate limits, or backpressure.

## Interview checks

- How does an async iterator differ from a sync iterator?
- What does `for await...of` await?
- Does breaking a loop automatically cancel arbitrary network I/O?
- Why is async iteration useful for streaming data?
