---
title: Matchers, Conditions & Prefetch Filtering
description: Design precise Proxy matchers with path patterns, has/missing conditions, negative matching, and prefetch-aware request filtering.
---

# Matchers, Conditions & Prefetch Filtering

Proxy is powerful enough to run in front of many requests.

That means the first performance optimization is often not faster code. It is **running Proxy less often**.

## Matcher basics

Use `config.matcher` to select routes:

```ts
export const config = {
  matcher: '/dashboard/:path*',
}
```

Multiple matchers:

```ts
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
  ],
}
```

## Matcher values must be static

Matcher configuration is analyzed at build time.

Good:

```ts
export const config = {
  matcher: ['/dashboard/:path*'],
}
```

Bad:

```ts
const protectedPrefix = process.env.PROTECTED_PREFIX

export const config = {
  matcher: [protectedPrefix],
}
```

Dynamic matcher values may be ignored because Next.js cannot statically analyze them.

## Path parameters

Matcher patterns support named parameters.

```text
/about/:path
```

matches one segment after `/about`.

```text
/about/:path*
```

matches zero or more segments.

Useful modifiers:

```text
* → zero or more
? → zero or one
+ → one or more
```

## Regex matching

Regular expressions can express exclusions:

```ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

This is useful, but complex negative lookaheads are easy to break.

Treat matcher regex as production routing code:

```text
review it
test it
comment exclusions
avoid unnecessary cleverness
```

## Why exclude static assets

If Proxy performs session parsing, logging, or header work for every asset request, one page view can trigger many extra executions.

Typical exclusions include:

```text
_next/static
_next/image
favicon.ico
robots.txt
sitemap.xml
known public asset extensions
```

Only exclude paths when your policy truly does not need them.

## Metadata and assets

A common broad matcher:

```ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

This is a starting point, not a universal security policy.

If an API route needs Proxy auth or CORS logic, excluding `api` would be wrong.

## Object matchers

Matchers can use objects:

```ts
export const config = {
  matcher: [
    {
      source: '/api/:path*',
      locale: false,
      has: [
        { type: 'header', key: 'authorization' },
      ],
    },
  ],
}
```

Supported condition sources include request information such as:

```text
headers
query parameters
cookies
```

## `has`

Use `has` when Proxy should run only if a value is present or matches.

```ts
export const config = {
  matcher: [
    {
      source: '/internal/:path*',
      has: [
        { type: 'header', key: 'x-internal-request' },
      ],
    },
  ],
}
```

Important:

> Matching a header is not authorization.

Clients can often forge headers.

Use matcher conditions for routing/optimization, not as proof of identity.

## `missing`

Use `missing` when Proxy should run only when a condition is absent.

Example: skip certain prefetch requests:

```ts
export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

## Prefetch requests matter

App Router navigation can issue prefetch traffic before a user clicks.

If Proxy performs expensive work on every prefetch:

```text
page render
+ prefetches
+ navigation requests
+ bots
```

can multiply cost.

For logic that is unnecessary during prefetch, use precise `missing` conditions.

But do not skip prefetches when doing so would produce inconsistent route behavior.

## Auth + prefetch subtlety

Suppose `/dashboard` is protected.

If Proxy redirects unauthorized normal navigations but ignores prefetches, test that:

```text
<Link> prefetch
soft navigation
hard reload
back/forward
```

all converge on the same security outcome.

The authoritative authorization check must still exist in the protected data/mutation path.

## Negative matching

A negative lookahead can exclude groups of routes:

```ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

Write the exclusion list next to a comment explaining *why* each entry is excluded.

## `_next/data` special behavior

Next.js intentionally preserves Proxy execution for corresponding `_next/data` requests even when a negative matcher appears to exclude `_next/data`.

This exists to reduce security mistakes where a page is protected but its data route is not.

Do not design a security model around bypassing this behavior.

## Locale matching

Object matchers can set:

```ts
locale: false
```

when locale-aware routing should not affect matcher interpretation.

Use this intentionally in applications with custom locale prefixes or domain routing.

## Matching by query parameter

```ts
export const config = {
  matcher: [
    {
      source: '/preview/:path*',
      has: [
        { type: 'query', key: 'mode', value: 'preview' },
      ],
    },
  ],
}
```

Again, query state is client-controlled.

It may select behavior, but it cannot establish permission.

## Matching by cookie

```ts
export const config = {
  matcher: [
    {
      source: '/beta/:path*',
      has: [
        { type: 'cookie', key: 'beta' },
      ],
    },
  ],
}
```

A cookie may represent a signed session or a user preference.

The matcher only sees the condition; your code still owns validation and trust semantics.

## Matcher vs conditional logic

Two layers exist:

```text
matcher
→ should Proxy execute at all?

function body
→ what should Proxy do for this request?
```

Prefer matcher filtering for broad static route selection.

Use function conditionals for request-dependent decisions that cannot be expressed safely in static config.

## Avoid route lists duplicated everywhere

Bad:

```text
Proxy protected list
navigation protected list
auth library protected list
test protected list
```

These drift.

Prefer one domain routing model where possible, then test Proxy behavior against it.

But remember the `matcher` itself must remain statically analyzable.

## Matcher design review

For each matcher, document:

```text
included routes
excluded routes
asset behavior
API behavior
prefetch behavior
locale behavior
Server Function implications
security assumptions
```

## Common mistakes

### Running Proxy globally by accident

No matcher means broad execution.

### Using matcher conditions as authorization

Presence of a cookie/header is not proof of permission.

### Excluding APIs blindly

Some applications need Proxy CORS/routing/auth prefiltering on APIs.

### Forgetting prefetch traffic

Expensive Proxy work may execute more often than expected.

### Dynamic matcher config

Matcher values must be compile-time constants.

### Regex without tests

Negative lookaheads can silently change coverage.

## Testing matrix

A matcher suite should include:

```text
protected page
protected nested page
public page
API route
static JS/CSS
next/image request
favicon/metadata
prefetch request
query-condition request
cookie-condition request
locale-prefixed request
```

## Interview questions

**Why use matchers instead of checking pathname only inside Proxy?**  
Matchers can prevent Proxy from executing at all for irrelevant traffic, reducing cost and complexity.

**Are `has` and `missing` authorization features?**  
No. They are request-matching features. Authorization still requires trusted identity and permission validation.

**Why care about prefetches?**  
App Router may issue requests before navigation; expensive or side-effecting Proxy logic can otherwise run unexpectedly often.

## Exercise

Design matchers for an app with:

```text
/public/*
/dashboard/*
/api/public/*
/api/private/*
_next assets
locale prefixes
```

Requirements:

- dashboard receives optimistic auth gating
- private API receives request correlation headers
- public API avoids Proxy
- static assets avoid Proxy
- locale redirects apply only to pages
- prefetches avoid unnecessary analytics

Write the matcher set and a test matrix.