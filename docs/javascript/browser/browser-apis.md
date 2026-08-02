---
title: Browser APIs
description: Networking, storage, workers, realtime channels, files, crypto, permissions and compatibility.
slug: /javascript/browser/browser-apis
---

# Browser APIs

Web APIs are host capabilities with security, permission, lifecycle and compatibility rules. Always check secure-context requirements, user activation, origin boundaries and cancellation.

## Networking

Fetch uses Request, Response and Headers objects and supports streaming bodies. Validate status, content type and schema; use AbortSignal; do not automatically retry non-idempotent requests.

```javascript
async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new TypeError('Expected JSON response')
  }
  return response.json()
}
```

WebSocket offers bidirectional messages but application-level reconnect, authentication, ordering and backpressure. Server-Sent Events provide server-to-client text events with browser reconnection behavior.

## Storage

`localStorage` and `sessionStorage` are synchronous string stores and can block; they are unsuitable for secrets. IndexedDB is transactional asynchronous storage for structured data. Cache API stores Request/Response pairs and is often coordinated by a Service Worker. Define schema migrations, quotas, eviction behavior and cross-tab coordination.

## Workers and service workers

Dedicated and Shared Workers run in separate global contexts without DOM access. Use structured cloning or transfer ownership of supported objects. Service Workers intercept requests and enable offline strategies, but updates, cache versioning and stale data require explicit design.

## Files and binary data

File and Blob expose byte data; FormData builds multipart payloads; Streams allow incremental processing. Validate type and size on both client and server. Object URLs retain resources until revoked.

## Navigation and communication

URL and URLSearchParams provide parsing and encoding. History and Navigation APIs affect session navigation. BroadcastChannel coordinates same-origin contexts. `postMessage` requires exact target origins and strict origin/source validation on receive.

## Sensitive capabilities

Clipboard, notifications, geolocation, media capture, fullscreen, Web Share and some file APIs require permission or user activation. Explain the value before prompting, handle denial, and request the minimum capability at the moment of need.

## Web Crypto

Use `crypto.getRandomValues`, `randomUUID` and SubtleCrypto algorithms according to protocol guidance. Do not invent encryption formats or store long-lived secrets in frontend JavaScript.

## Capability pattern

```javascript
export function supportsOfflineSearch() {
  return 'indexedDB' in globalThis && 'Worker' in globalThis
}
```

Feature detection proves presence, not complete correctness. Test real supported browsers and use progressive enhancement.

## Primary references

- [MDN Web APIs](https://developer.mozilla.org/docs/Web/API)
- [Fetch standard](https://fetch.spec.whatwg.org/)
- [Web Cryptography](https://www.w3.org/TR/WebCryptoAPI/)
