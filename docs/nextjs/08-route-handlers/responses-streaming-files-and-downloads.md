---
title: Responses, Streaming, Files & Downloads
description: Return JSON, text, XML, binary files, downloads, redirects, and streaming bodies from Route Handlers with correct headers and failure handling.
---

# Responses, Streaming, Files & Downloads

A Route Handler can return any HTTP response your runtime can produce.

That includes:

```text
JSON
plain text
HTML
XML
CSV
images
binary files
downloads
redirects
streams
empty responses
```

The core primitive is the Web `Response` API.

## JSON

```ts
export async function GET() {
  return Response.json({
    ok: true,
    version: 1,
  })
}
```

With status and headers:

```ts
return Response.json(
  { project },
  {
    status: 200,
    headers: {
      'X-Request-Id': requestId,
    },
  },
)
```

## Plain text

```ts
return new Response('OK', {
  status: 200,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  },
})
```

## XML

```ts
return new Response(xml, {
  headers: {
    'Content-Type': 'application/xml; charset=utf-8',
  },
})
```

Custom XML endpoints might include:

```text
/rss.xml
/feed.xml
/.well-known/*
```

But remember that Next.js has built-in metadata conventions for several common files such as sitemap, robots, icons, and Open Graph images.

## CSV

```ts
return new Response(csv, {
  headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="report.csv"',
  },
})
```

For very large exports, prefer streaming generation rather than constructing a huge string in memory.

## Downloads

A download response typically needs:

```text
Content-Type
Content-Disposition
Content-Length (when known)
Cache-Control (when appropriate)
```

Example:

```ts
return new Response(bytes, {
  status: 200,
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="invoice.pdf"',
  },
})
```

## Safe filenames

Do not insert raw user input into `Content-Disposition`.

Dangerous:

```ts
`attachment; filename="${request.nextUrl.searchParams.get('name')}"`
```

Normalize or generate server-owned filenames.

Header injection and malformed filenames should not become part of the public response.

## Browser display vs forced download

Inline:

```text
Content-Disposition: inline
```

Download:

```text
Content-Disposition: attachment
```

The browser can still apply its own behaviour depending on type and security policy.

## Streaming mental model

A stream allows the server to send data progressively:

```text
producer
  ↓ chunk
Response stream
  ↓ chunk
client begins consuming
  ↓ chunk
producer continues
```

This can improve:

- time to first byte
- memory usage
- perceived latency
- long generated responses

It does not make slow work disappear.

## Web `ReadableStream`

Example:

```ts
const encoder = new TextEncoder()

const stream = new ReadableStream({
  async start(controller) {
    controller.enqueue(encoder.encode('first\n'))
    controller.enqueue(encoder.encode('second\n'))
    controller.close()
  },
})

return new Response(stream, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  },
})
```

This is standard Web Streams behaviour.

## Streaming from an upstream response

Often the best approach is to avoid buffering:

```ts
const upstream = await fetch(upstreamUrl)

if (!upstream.ok || !upstream.body) {
  return Response.json(
    { error: 'UPSTREAM_FAILED' },
    { status: 502 },
  )
}

return new Response(upstream.body, {
  status: 200,
  headers: {
    'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
  },
})
```

Do not blindly copy every upstream header.

Build an allow-list.

## Why not copy all upstream headers?

Upstream headers may include:

- hop-by-hop values
- internal server metadata
- cookies you do not intend to expose
- cache policy unsuitable for your public endpoint
- private infrastructure information

Treat proxy response headers as a deliberate API contract.

## Streaming AI or generated output

LLM and other generated-content endpoints often return incrementally.

Architecture:

```text
client
  ↓ request
Route Handler
  ↓ upstream/model
stream chunks
  ↓
client renders incrementally
```

Use maintained streaming libraries when they correctly model cancellation, backpressure, provider errors, and framing.

The important Next.js concept is that Route Handlers can return Web streams.

## Framing streamed data

Raw chunks need a protocol.

Possible formats:

```text
newline-delimited JSON
Server-Sent Events
plain text chunks
binary framing
vendor SDK protocol
```

Do not invent ambiguous chunk boundaries.

## Server-Sent Events

An SSE response typically uses headers such as:

```text
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

But deployment environment matters. Some serverless platforms have execution-duration limits that make long-lived streams unsuitable.

Evaluate the host before choosing SSE/WebSocket-like architectures.

## WebSockets are not equivalent to Route Handler streaming

Streaming an HTTP response is:

```text
one request
→ one response stream
```

WebSockets are:

```text
long-lived bidirectional connection
```

Some Next.js hosting models cannot keep arbitrary WebSocket connections alive through Route Handler compute.

Use dedicated realtime infrastructure when needed.

## Stream failure after headers commit

Before response starts:

```text
error
→ choose 500/502/etc
```

After bytes are sent:

```text
status already committed
```

You cannot suddenly change the HTTP status to 500 after streaming has begun.

Therefore your stream protocol needs an application-level error strategy when late failures are possible.

## Cookies and streaming

HTTP headers, including `Set-Cookie`, must be established before body streaming starts.

Do not attempt to modify cookies after chunks have already been sent.

## Backpressure

A producer can generate data faster than the client can consume it.

A correct streaming design should respect the stream abstraction instead of accumulating unlimited pending chunks in memory.

Libraries and platform adapters may handle some details, but you still need to measure memory behaviour under slow clients.

## Abort/cancellation

If the client disconnects, use request/stream cancellation signals where your upstream supports them.

Conceptually:

```text
client aborts
  ↓
request.signal aborts
  ↓
upstream fetch/model work cancelled
```

This protects wasted compute.

## Range requests

Large media/file systems may require HTTP Range semantics.

That involves:

```text
Range
Accept-Ranges
Content-Range
206 Partial Content
```

Do not implement partial-content semantics casually. Prefer object storage/CDN features when serving large media.

## Object storage for large downloads

Instead of proxying every byte through Next.js:

```text
client
  ↓ authenticated request
Next.js
  ↓ short-lived signed URL
object storage/CDN
  ↓ file bytes
client
```

This can reduce app compute and improve global delivery.

## Response caching

A response body and a server data cache are different layers.

HTTP headers such as:

```text
Cache-Control
ETag
Last-Modified
Vary
```

control HTTP/proxy/browser/CDN semantics.

Next.js server caching/prerendering is a separate concern.

Phase 6 covers the broader cache layer model.

## `Vary`

If a response representation changes based on a request header, caches need to know.

Example:

```text
Vary: Accept-Encoding
```

For custom negotiation, choose `Vary` carefully because high-cardinality headers can destroy cache efficiency.

Never vary on arbitrary identifiers unless that is truly part of the cache design.

## ETags and conditional requests

For stable resources, HTTP conditional requests may use:

```text
ETag
If-None-Match
304 Not Modified
```

Whether you implement this yourself depends on the hosting/CDN layer and content type.

Do not duplicate platform caching logic without a concrete need.

## Empty responses

```ts
return new Response(null, { status: 204 })
```

Good for operations where no response body is needed.

## Error downloads/streams

Do not return an HTML framework error page from an API that promises JSON or binary data.

Catch known boundary failures and map them to the endpoint contract.

Example:

```ts
try {
  const file = await loadFile(id)
  return new Response(file.bytes, {
    headers: { 'Content-Type': file.type },
  })
} catch (error) {
  if (error instanceof MissingFileError) {
    return Response.json(
      { error: 'NOT_FOUND' },
      { status: 404 },
    )
  }

  throw error
}
```

Unexpected failures should still reach observability.

## Common mistakes

### Buffering huge exports

Stream or offload them.

### Reflecting user-controlled filenames

Normalize server-side.

### Copying all upstream headers

Use an allow-list.

### Treating HTTP streaming as WebSocket transport

They solve different problems.

### Assuming status can change after streaming starts

Headers/status are already committed.

### Proxying large static files through app compute unnecessarily

Use storage/CDN/signed URLs where appropriate.

## Debugging checklist

1. Inspect `Content-Type`.
2. Inspect `Content-Disposition`.
3. Verify status before body consumption.
4. Confirm streamed chunks use a clear framing protocol.
5. Test slow-client/backpressure behaviour.
6. Test client cancellation.
7. Check late-stream error handling.
8. Check cookie/header mutations happen before streaming.
9. Compare local vs deployed buffering behaviour.
10. Measure memory for large exports/downloads.

## Interview questions

**Can a Route Handler return non-JSON data?**  
Yes. It can return any HTTP content type supported by the runtime, including text, XML, binary files, and streams.

**Why can’t you set a cookie after streaming begins?**  
Because cookies are response headers and HTTP headers are committed before body bytes are sent.

**Why use signed object-storage URLs for large files?**  
They avoid routing large byte transfers through application compute and usually provide better scalability/CDN integration.

**What happens if a stream fails after the first chunk?**  
The HTTP status is already committed, so the stream protocol needs a late-error strategy.

## Exercise

Build two endpoints:

```text
GET /api/reports/:id.csv
GET /api/reports/:id/download
```

The first streams CSV rows. The second returns a short-lived storage download URL after authorization. Document headers, error contract, cancellation, and why the two transfer strategies differ.