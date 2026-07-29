---
title: Fetch & Modern Web APIs in Node
---

# Fetch & Modern Web APIs in Node

Modern Node implements a growing set of web-platform APIs, reducing the gap between browser and server code while preserving different host capabilities.

```js
const controller = new AbortController();
const deadline = setTimeout(() => controller.abort(), 2_000);
try {
  const response = await fetch('https://api.example.com/orders', {
    headers: {accept: 'application/json'},
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
} finally {
  clearTimeout(deadline);
}
```

## Core web-compatible APIs

Current Node includes `fetch`, `Request`, `Response`, `Headers`, `FormData`, `Blob`, `URL`, `URLSearchParams`, `AbortController`, `EventTarget`, Web Streams, and related primitives.

## Same API, different environment

Server code has no browser origin sandbox, DOM, user navigation lifecycle, or browser credential store. CORS is mainly a browser enforcement mechanism; a Node server can still make cross-origin network requests unless its own network/security controls prevent them.

## Body lifecycle

Fetch bodies are streams. For large payloads, process incrementally. Do not `await response.arrayBuffer()` for unbounded content merely because the API makes it convenient.

## Connection behavior

HTTP client implementations pool/reuse connections according to runtime implementation and configuration. Correctness should rely on API contracts; performance tuning should be measured against the Node version in production rather than assuming browser behavior.

## Cancellation

`AbortSignal` is the common cancellation contract across modern APIs. Propagate a request deadline through fetch, stream, timer, and application layers where supported.

**Architecture rule:** web-compatible APIs improve portability of concepts, not necessarily portability of deployment behavior.
