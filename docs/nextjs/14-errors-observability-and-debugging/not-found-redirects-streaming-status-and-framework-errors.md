---
title: Not Found, Redirects, Streaming Status & Framework Errors
description: Understand notFound, redirect control flow, streamed status behavior, noindex semantics, and how to avoid swallowing framework-managed errors.
---

# Not Found, Redirects, Streaming Status & Framework Errors

Some of the most confusing "errors" in a Next.js application are not bugs at all.

They are **framework control-flow signals**.

The key examples are:

```text
notFound()
redirect()
permanentRedirect()
```

These APIs intentionally terminate the current rendering path so Next.js can produce a different response or UI.

## 1. `notFound()` is a route outcome

Use `notFound()` when the requested route resource does not exist.

```tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return <h1>{product.name}</h1>
}
```

This is different from:

```ts
throw new Error('database offline')
```

The first is an expected route result. The second is an unexpected system failure.

## 2. `not-found.tsx` owns the missing-resource UI

A segment can define:

```text
app/products/[id]/not-found.tsx
```

Example:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <h1>Product not found</h1>
      <p>This product may have been removed.</p>
      <Link href="/products">Browse products</Link>
    </main>
  )
}
```

The UI should help the user recover from a missing resource, not pretend a server outage occurred.

## 3. `notFound()` injects `noindex`

When Next.js handles `notFound()`, it injects:

```html
<meta name="robots" content="noindex" />
```

This matters because a streamed not-found response may already have committed an HTTP `200` status before the missing condition is discovered.

Search engines still receive a strong signal not to index the response.

## 4. Streaming changes status-code timing

HTTP status is part of the response headers.

Once the response body starts streaming, headers may already be committed.

Therefore:

```text
resource known missing before stream starts
→ server can send 404

resource discovered missing after stream starts
→ HTTP status may remain 200
→ Next.js injects noindex metadata
```

This is one of the reasons status code and rendered outcome are not always identical in a streaming architecture.

## 5. Suspense can start the stream

A response may begin streaming when:

```text
loading.tsx fallback renders
or
Server Component suspends under <Suspense>
```

If compliance, monitoring, or downstream infrastructure requires a literal `404` status, determine existence **before** committing the response body.

## 6. Do not move expensive existence checks into Proxy casually

One possible way to guarantee early routing decisions is to check before route rendering.

But putting a database lookup in Proxy for every request can create a new latency bottleneck.

Use the narrowest layer that satisfies the status requirement.

```text
fast routing metadata
→ Proxy may be appropriate

full business data
→ route/data layer is usually better
```

## 7. Redirects are also thrown control flow

Example:

```tsx
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return <Dashboard />
}
```

Do not structure it like this:

```ts
try {
  if (!session) redirect('/login')
} catch (error) {
  console.error('page failed', error)
}
```

The catch can intercept the redirect signal.

## 8. Keep catch blocks narrow

Safer:

```ts
let result

try {
  result = await callVendor()
} catch (error) {
  return { ok: false, message: 'Vendor unavailable' }
}

if (result.redirectTo) {
  redirect(result.redirectTo)
}
```

This keeps framework control flow outside application exception handling.

## 9. Do not inspect internal error strings

Avoid application logic based on private implementation details such as:

```text
NEXT_REDIRECT
NEXT_HTTP_ERROR_FALLBACK
```

Those are framework internals, not a public domain-error protocol.

Use public Next.js APIs instead.

## 10. `unstable_rethrow` exists for mixed catches

There are cases where application code must catch a broad set of errors and framework-controlled signals may be among them.

Next.js exposes `unstable_rethrow` for this scenario.

Its name is deliberate: it is unstable.

The production-first recommendation remains:

```text
refactor code so framework control flow is not inside a broad catch
```

Use the unstable helper only when the structure genuinely requires it and you accept the stability risk.

## 11. Redirect destination safety is still security-sensitive

This is unsafe:

```ts
redirect(searchParams.returnTo)
```

If the value is attacker-controlled, you may create an open redirect.

Prefer an internal destination policy:

```ts
function safeReturnTo(value: string | null) {
  if (!value) return '/'
  if (!value.startsWith('/')) return '/'
  if (value.startsWith('//')) return '/'
  return value
}
```

For more complex cases, parse the URL and compare against an explicit allow-list.

## 12. Redirects after mutations need ordering discipline

A mutation flow often looks like:

```text
validate
→ authorize
→ transaction
→ invalidate cache
→ redirect
```

If you redirect too early, later cleanup or revalidation code will not run because redirect terminates control flow.

## 13. `notFound()` is not an authorization mechanism

Do not confuse:

```text
resource does not exist
```

with:

```text
resource exists but caller is forbidden
```

Sometimes a product intentionally returns a 404 to avoid resource enumeration.

That is a security policy decision, not proof that authorization is unnecessary.

The protected query must still enforce access.

## 14. Unmatched routes and segment not-found are related but distinct

The root `app/not-found.tsx` can handle unmatched URLs for the application.

A nested `not-found.tsx` handles `notFound()` within its segment context.

There is also an experimental `global-not-found` convention for routing-level global 404 handling.

Because it remains experimental, this handbook does not treat it as the stable production baseline.

## 15. `not-found.tsx` is a Server Component by default

That means it can fetch server data when useful.

Example:

```tsx
export default async function NotFound() {
  const support = await getSupportLinks()

  return (
    <main>
      <h1>Not found</h1>
      <a href={support.helpCenter}>Help center</a>
    </main>
  )
}
```

But keep fallback dependencies modest.

A missing-resource page should not become fragile because it calls five unrelated services.

## 16. Status semantics affect monitoring

If your monitoring counts only HTTP status codes, streamed not-found outcomes can be undercounted.

Observability may need multiple signals:

```text
HTTP 404 count
notFound outcome event
route-level missing-resource metric
crawler/indexing checks
```

Do not assume one infrastructure metric tells the full product story.

## 17. Soft navigation changes debugging context

A route transition can fail after the application shell is already interactive.

When debugging, distinguish:

```text
hard navigation
→ full document request

soft navigation
→ RSC/navigation request inside existing app
```

The visible URL, network request type, route boundary, and status behavior may differ.

## 18. Control-flow errors should not create outage alerts

A healthy application may legitimately produce many:

```text
404s
redirects
validation failures
```

Your error reporter should not page engineers for every framework control-flow signal.

Use instrumentation context and event classification.

## 19. Preserve cause when wrapping application errors

If you do need to wrap a dependency failure, preserve the original cause:

```ts
try {
  return await sdk.loadAccount(id)
} catch (cause) {
  throw new Error('Account provider failed', { cause })
}
```

This makes internal diagnostics more useful without exposing the cause to users.

## 20. Avoid catch-and-rethrow noise

This adds little value:

```ts
try {
  await doWork()
} catch (error) {
  console.error(error)
  throw error
}
```

If global instrumentation already captures the uncaught failure, duplicate logs can create two or more events for one incident.

Catch only when you add meaningful context, cleanup, translation, or recovery.

## Debugging matrix

| Symptom | Investigate |
| --- | --- |
| `not-found.tsx` never appears | broad catch swallowing `notFound()` |
| redirect silently fails | redirect executed inside catch or invalid destination logic |
| user sees 404 UI with HTTP 200 | stream committed before missing condition |
| error dashboard flooded with redirects | framework control flow misclassified as exceptions |
| status monitoring misses missing routes | streamed 200 + `noindex` behavior |
| fallback has no route context | boundary/telemetry correlation missing |

## Senior interview questions

**Why can a not-found UI return HTTP 200?**  
If streaming has already started, response headers are committed. Next.js can still render a not-found result and inject `noindex`, but cannot retroactively change the status line.

**Why shouldn't you catch `redirect()`?**  
Redirect uses a thrown framework signal to terminate the current path. Catching it can prevent Next.js from emitting the redirect response.

**Is `notFound()` a security check?**  
No. It is a route outcome. Authorization must still be enforced by the protected data/operation layer even if the product chooses to present unauthorized resources as not found.

## Exercise

Design the failure flow for a private invoice route where:

- unknown invoice IDs should be 404;
- invoices from another tenant must not leak existence;
- the DB may time out;
- the page has a Suspense boundary;
- monitoring requires accurate missing-resource counts.

Describe authorization, not-found timing, user fallback, HTTP status expectations, and telemetry signals separately.
