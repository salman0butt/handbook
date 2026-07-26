---
title: Dynamic Request APIs & connection()
description: Understand request-time rendering triggers, cookies and headers boundaries, and how connection() explicitly opts work into runtime rendering.
---

# Dynamic Request APIs & `connection()`

Caching and rendering decisions are closely related to **when request-specific information becomes necessary**.

Modern App Router applications should distinguish:

```text
build/prerender-time information
cacheable shared information
request-time information
```

Request APIs move work into the request-time category.

## Common request-time inputs

Examples include:

- `cookies()`
- `headers()`
- authenticated identity
- tenant derived from request
- page `searchParams`
- request-specific authorization

These values can vary between incoming requests, so they cannot be treated as universally stable build-time inputs.

## Cache Components mental model

With Cache Components enabled:

```text
static/cacheable parent
  ↓
Suspense boundary
  ↓
request-time dynamic subtree
```

A request API should not force the entire route into one undifferentiated dynamic block when the dynamic work can be isolated.

## Read runtime state outside normal `use cache`

Normal `use cache` scopes cannot directly read request APIs such as cookies and headers.

Preferred shape:

```ts
const cookieStore = await cookies()
const locale = cookieStore.get('locale')?.value ?? 'en'

return <CachedContent locale={locale} />
```

and inside the cached function/component:

```ts
async function getLocalizedContent(locale: string) {
  'use cache'
  return cms.getContent({ locale })
}
```

The normalized locale becomes an explicit input and therefore part of cache identity.

## Do not pass raw request objects as cache keys

Bad:

```ts
getCachedData(await headers())
```

Better:

```text
request headers
  ↓
extract one required value
  ↓
validate/normalize
  ↓
pass safe primitive
```

For example:

```ts
const country = normalizeCountry((await headers()).get('x-country'))
```

Then cache only if country-specific output is safe to share across users with the same normalized country.

## Personalized content

Suppose a dashboard needs current user identity.

```text
request
  ↓
session cookie
  ↓
current user
  ↓
permissions
  ↓
private dashboard
```

This is naturally request-time work.

Do not force it into a shared cache merely to reduce queries.

Instead cache public or tenant-safe sub-data where appropriate.

## `connection()`

Sometimes a component does not read cookies, headers, or another Dynamic API, but you still need its output to wait for a real incoming request.

Use:

```ts
import { connection } from 'next/server'

export default async function Page() {
  await connection()

  const now = new Date()
  return <time>{now.toISOString()}</time>
}
```

`connection()` tells Next.js:

> Do not prerender the work below this point; wait for a real request.

## Why `connection()` exists

Consider:

```ts
const value = Math.random()
```

If this executes during prerendering, the generated value may become part of reusable output.

If the requirement is:

```text
new value for each request
```

then:

```ts
await connection()
const value = Math.random()
```

makes the runtime intent explicit.

## `connection()` is not a cache clear

It does not mean:

```text
purge every cache
```

It means:

```text
execution below this point requires an incoming request
```

A nested data call may still have its own explicit cache policy.

## `connection()` replaces old `unstable_noStore`

Current stable Next.js documents `connection()` as the replacement for `unstable_noStore` when you intentionally need dynamic rendering without a normal Dynamic API.

Do not teach `unstable_noStore` as the primary modern API.

## `connection()` and normal `use cache`

A cache scope and `connection()` represent conflicting intentions at the same direct boundary:

```text
use cache
  → reusable output

connection()
  → wait for request-specific execution
```

Keep the responsibilities separate.

Normal and private cache scopes also prohibit `connection()` because connection-specific runtime behavior is not safely cacheable.

## Date/time example

Wrong if you need current request time:

```tsx
export default function Page() {
  return <p>{new Date().toISOString()}</p>
}
```

The framework may prerender it depending on the route.

Explicit runtime version:

```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  return <p>{new Date().toISOString()}</p>
}
```

## Cache the stable part, render time dynamically

```tsx
export default function Page() {
  return (
    <>
      <CachedArticle />
      <Suspense fallback={<ClockSkeleton />}>
        <CurrentRequestTime />
      </Suspense>
    </>
  )
}
```

```tsx
async function CurrentRequestTime() {
  await connection()
  return <time>{new Date().toISOString()}</time>
}
```

This preserves a stable shell while isolating truly dynamic work.

## Request APIs and security

A cookie value is not trustworthy merely because it came from `cookies()`.

Treat values such as:

```text
tenant ID
role
theme
locale
feature flag
```

according to their security meaning.

A user-controlled cookie cannot be the sole authority for access control.

Use trusted session/authorization logic for sensitive decisions.

## Cache key cardinality

Passing runtime-derived values into caches can explode cache cardinality.

Example:

```text
locale → 5 values
currency → 4 values
country → 200 values
userId → 10 million values
```

A cache keyed by `userId` may become enormous and may be inappropriate even if technically safe.

Think about:

- number of possible keys
- reuse per key
- memory/storage cost
- invalidation cost
- privacy/compliance

## Search params and caching

Search params often describe shareable URL state:

```text
?category=lights&sort=price
```

But they are request-specific inputs.

Normalize them first:

```text
raw query
  ↓
validate
  ↓
canonical representation
  ↓
cache safe result if useful
```

Do not allow arbitrary query strings to create unbounded cache keys without controls.

## Tenant-aware caches

If tenant content is cacheable:

```ts
getTenantCatalog(tenantId)
```

ensure:

1. tenant ID is derived from trusted request context
2. caller is authorized for tenant
3. tenant ID is included in cache identity
4. invalidation tags include tenant scope

Example tags:

```text
tenant:t_42:catalog
tenant:t_42:product:p_9
```

Avoid global tags for tenant-private content unless global invalidation is truly intended.

## Common mistakes

### Making root layout dynamic unnecessarily

A tiny cookie-dependent widget should not automatically own the whole application shell.

### Calling `connection()` as a debugging hammer

Use it only when request-time execution is the actual requirement.

### Caching raw user input

Normalize and bound cache key space.

### Using cookies as authorization

Cookies carry data; trusted authorization logic determines access.

### Treating every request-time value as uncacheable

Some normalized values, such as locale or currency, may safely key reusable output.

## Debugging checklist

When a route unexpectedly prerenders or becomes dynamic:

1. inspect request APIs
2. inspect `connection()` calls
3. inspect Suspense placement
4. inspect `use cache` boundaries
5. identify which value truly requires request-time state
6. move runtime reads closer to the dynamic subtree
7. normalize values passed into cache scopes
8. inspect key cardinality
9. verify authorization is separate from cache reuse
10. test build output and request-time behavior

## Interview questions

**What does `connection()` do?**  
It tells Next.js to wait for an incoming request before continuing rendering below that point, opting that work out of prerendering.

**Why would you use `connection()` if you do not use cookies or headers?**  
For values such as request-time randomness or current time that must be produced at runtime rather than during prerendering.

**Can a normal `use cache` scope call `cookies()`?**  
No. Read request data outside and pass safe normalized arguments into the cached scope.

**Why is user ID a dangerous cache key even when isolation is correct?**  
It can create very high cardinality with little reuse, large storage cost, complex invalidation, and privacy concerns.

## Exercise

Take a route that reads locale, tenant, feature flags, user permissions, and current time.

For each value, classify:

```text
request source
trust level
cache key candidate?
cardinality
shareability
runtime boundary
```

Then design a static/cached shell with the smallest possible dynamic subtree.
