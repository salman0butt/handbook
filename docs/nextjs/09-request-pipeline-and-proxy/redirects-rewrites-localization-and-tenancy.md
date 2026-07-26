---
title: Redirects, Rewrites, Localization & Tenancy
description: Use Proxy for request-based redirects, rewrites, locale routing, host-based tenancy, and legacy URL migration without creating routing loops.
---

# Redirects, Rewrites, Localization & Tenancy

Proxy is strongest when the decision is about **where this request should go**.

## Redirect vs rewrite

A redirect changes the browser-visible URL.

```ts
return NextResponse.redirect(new URL('/login', request.url))
```

A rewrite keeps the browser URL while serving another destination.

```ts
return NextResponse.rewrite(new URL('/internal/dashboard', request.url))
```

Mental model:

```text
redirect
browser learns destination

rewrite
server changes destination internally
```

## Prefer static redirects when possible

If the mapping never depends on request state, use `redirects()` in `next.config.js`.

Proxy is more appropriate when the decision depends on:

```text
cookie
header
host
locale
session hint
request pathname
feature rollout
```

## Safe redirects

Never redirect directly to an arbitrary user-provided URL.

Bad:

```ts
const next = request.nextUrl.searchParams.get('next')
return NextResponse.redirect(next!)
```

Prefer allow-listed internal paths or validated origins.

## Avoid redirect loops

Before redirecting, detect whether the request is already at the destination.

```ts
if (pathname.startsWith('/login')) {
  return NextResponse.next()
}
```

A common failure is:

```text
/dashboard → /login
/login → /login
```

or locale logic that repeatedly adds a prefix.

## Locale routing

A typical locale flow:

```text
request /products
      ↓
read Accept-Language / locale cookie
      ↓
select supported locale
      ↓
redirect /en-US/products
```

Check whether a supported locale already exists in the pathname before redirecting.

## Locale precedence

Define precedence explicitly, for example:

```text
explicit locale in URL
> user locale cookie
> Accept-Language
> product default locale
```

Avoid silently changing rules across routes.

## Locale is not country authorization

Language preference and geographic permission are different concerns.

Do not infer legal eligibility, account region, or tenant access merely from `Accept-Language`.

## Domain-based tenancy

Proxy can inspect the host and route to a tenant-aware destination.

Conceptually:

```text
acme.example.com/dashboard
      ↓
Proxy resolves host → tenant slug
      ↓
rewrite /_sites/acme/dashboard
```

Keep the visible hostname while routing internally.

## Host header trust

When self-hosted behind a reverse proxy/CDN, understand which host/forwarded headers are authoritative.

Do not blindly trust arbitrary forwarded headers from the public internet.

Your infrastructure should normalize trusted forwarding metadata.

## Tenant existence vs authorization

Proxy can resolve:

```text
host → tenant candidate
```

But authorization still belongs near the protected data:

```text
current identity
+ tenant membership
+ requested resource
→ authoritative permission
```

A valid subdomain does not prove the user belongs to that tenant.

## Rewrite-based multi-tenancy

Example:

```ts
export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const tenant = resolveTenant(host)

  if (!tenant) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/_tenants/${tenant}${url.pathname}`

  return NextResponse.rewrite(url)
}
```

The internal tenant route should not itself re-trigger the same rewrite loop.

## Legacy migrations

Proxy can help during gradual URL migrations:

```text
legacy path
→ request-dependent mapping
→ modern route
```

For large static redirect maps, prefer a dedicated redirect store or static configuration rather than embedding thousands of conditions in the Proxy source.

## A/B and feature routing

Proxy can route requests into different URL destinations based on a stable experiment bucket.

Be explicit about:

```text
bucketing key
persistence
analytics attribution
cache interaction
SEO behavior
bot behavior
```

Avoid random per-request routing that causes users to oscillate between variants.

## Rewrites and cache keys

When visible URL and internal destination differ, reason about caching separately:

```text
browser URL
rewrite destination
server cache key
CDN cache key
```

Unexpected cache sharing can occur if tenant/locale/variant dimensions are not represented where required.

## RSC navigation compatibility

Use `NextResponse.rewrite()` for framework rewrites so Next.js can maintain the internal metadata App Router navigation requires.

Manual fetch-based proxying is a different architecture and needs protocol-aware handling.

## Advanced URL normalization flags

Next.js exposes advanced configuration such as:

```text
skipTrailingSlashRedirect
skipProxyUrlNormalize
```

Use these only when migration/interoperability requires preserving legacy URL behavior.

They change low-level routing assumptions and deserve dedicated tests.

## Redirect status semantics

Temporary redirects should preserve intent appropriately; permanent redirects communicate a durable URL move.

Do not use permanent redirects for authentication or temporary experiments.

## Common mistakes

### Using rewrite when user should see canonical URL

Use redirect for canonical URL changes.

### Using redirect when browser URL must remain stable

Use rewrite for internal routing/BFF tenancy patterns.

### Tenant authorization only in Proxy

Re-check permission at data/action/API boundaries.

### Locale redirect loop

Detect existing prefixes and unsupported values.

### Trusting arbitrary `Host`/forwarded headers

Define trusted infrastructure boundaries.

## Debugging checklist

1. Log original pathname/host safely.
2. Record Proxy decision: next/rewrite/redirect.
3. Inspect browser-visible URL.
4. Inspect internal destination in server logs.
5. Test soft navigation and hard reload.
6. Test locale/tenant cookie changes.
7. Test unknown tenant and unsupported locale.
8. Test canonical redirect loops.
9. Test CDN cache behavior for host/locale variants.

## Interview questions

**Redirect vs rewrite?**  
A redirect tells the client to navigate to another URL; a rewrite serves another destination while retaining the visible URL.

**Can Proxy establish tenant authorization?**  
It can establish routing context, but sensitive authorization must still validate membership and resource scope near the data/operation.

**When should locale selection live in Proxy?**  
When request headers/cookies/URL need to determine a locale route before rendering.

## Exercise

Design routing for:

```text
acme.example.com/
fr.example.com/products
example.com/products
```

Support:

- tenant subdomains
- locale prefixes
- default-locale redirects
- canonical URL rules
- no redirect loops
- authoritative tenant authorization downstream

Draw the visible URL, rewrite destination, and permission boundary for each flow.