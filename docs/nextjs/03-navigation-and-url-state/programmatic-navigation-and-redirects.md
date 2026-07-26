---
title: Programmatic Navigation & Redirects
description: Learn useRouter, redirect, permanentRedirect, refresh, history semantics, server-first navigation, and safe URL handling.
---

# Programmatic Navigation & Redirects

`<Link>` is the default navigation primitive, but applications also need navigation triggered by logic: after a workflow completes, when a user chooses an option, when authorization sends someone elsewhere, or when canonical URLs change.

The key decision is not “which API exists?” It is:

> Where should the navigation decision live: browser interaction, server rendering, mutation logic, or request routing?

## Decision map

```text
normal visible link
  → <Link>

client-only event with no natural link
  → useRouter()

server render decides destination
  → redirect() / permanentRedirect()

large static redirect table
  → next.config redirects or request-pipeline architecture
```

Do not move navigation to the client merely because you know `router.push()`.

## `useRouter`

In App Router Client Components:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function OpenDashboardButton() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Open dashboard
    </button>
  )
}
```

Import from:

```ts
next/navigation
```

not the Pages Router's `next/router`.

## `router.push()`

```ts
router.push('/checkout')
```

Performs client-side navigation and adds a new history entry.

Use it when the new destination represents forward progress that the Back button should reverse.

## `router.replace()`

```ts
router.replace('/search?query=coffee')
```

Performs client navigation without adding another history entry.

Good cases include:

- continuously updated search state
- replacing an obsolete intermediate URL
- canonicalizing client state when Back should not revisit the old representation

Do not replace meaningful user navigation merely to keep history “clean.”

## Scroll control

```ts
router.push('/reports', { scroll: false })
```

or:

```ts
router.replace('/products?sort=price', { scroll: false })
```

Use this when a URL update should preserve the current reading position, such as filter or pagination state in a long results view.

## `router.back()` and `router.forward()`

```tsx
<button onClick={() => router.back()}>Back</button>
<button onClick={() => router.forward()}>Forward</button>
```

These operate on browser history.

They are not guaranteed to stay within your application. The previous history entry may belong to another site.

If your product requires a deterministic destination, navigate to that explicit URL instead of assuming `back()` means “previous page in this workflow.”

## `router.refresh()`

```ts
router.refresh()
```

Requests a fresh server-rendered view of the current route and merges the result into the existing client tree while preserving unaffected client/browser state.

Use it when the current route's server-derived representation needs to be refreshed.

But understand the limitation:

> `refresh()` does not automatically mean “ignore every cache.”

If underlying data requests are still satisfied by caches, the refreshed result can look unchanged.

Caching and revalidation belong in Phase 6; mutation-specific refresh behavior belongs in Phase 7.

## `router.prefetch()`

Programmatic prefetch is available when you have a measured reason to preload a route outside normal visible `<Link>` behavior.

```ts
router.prefetch('/dashboard')
```

Current App Router also supports an `onInvalidate` callback for a prefetch request, allowing code to learn that prefetched data became stale and may need a new prefetch.

Treat manual prefetch as an optimization, not application correctness logic.

## Security: never navigate to unsanitized input

This is dangerous:

```ts
router.push(userSuppliedUrl)
```

The router can receive executable URL schemes such as `javascript:` if you pass untrusted values blindly.

Prefer application-owned route construction:

```ts
const allowedTabs = new Set(['profile', 'billing', 'security'])

if (allowedTabs.has(tab)) {
  router.push(`/settings/${tab}`)
}
```

For return URLs, validate that the destination is an allowed internal path.

```ts
function safeReturnPath(value: string | null) {
  if (!value) return '/dashboard'
  if (!value.startsWith('/')) return '/dashboard'
  if (value.startsWith('//')) return '/dashboard'
  return value
}
```

Security-sensitive redirect validation deserves a reusable, tested policy rather than ad hoc string checks scattered across components.

## Prefer server redirects for server decisions

Suppose a protected page discovers that the user is not signed in.

A weak architecture renders a client component and then redirects after hydration.

That can cause:

- content flashes
- unnecessary client JavaScript
- delayed navigation
- incorrect security assumptions

If the server already knows the destination, redirect from the server-side path.

## `redirect()`

```tsx
import { redirect } from 'next/navigation'

export default async function BillingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <Billing user={user} />
}
```

`redirect()` terminates the current rendering path by throwing Next.js's redirect control-flow signal.

You do not need:

```ts
return redirect('/login')
```

## Do not swallow redirect control flow

A subtle mistake:

```ts
try {
  if (!user) redirect('/login')
} catch (error) {
  console.error(error)
}
```

Because redirecting is implemented through framework control flow, an overly broad catch can interfere with the intended behavior.

Keep redirect/not-found control flow outside broad catch blocks unless you understand and preserve Next.js framework errors.

Deep error handling is covered later.

## Temporary vs permanent redirect

Use `redirect()` when the redirect is not a permanent statement about the resource's canonical URL.

Use `permanentRedirect()` when the resource has permanently moved.

```tsx
import { permanentRedirect } from 'next/navigation'

export default async function OldProfile({ params }: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  permanentRedirect(`/people/${username}`)
}
```

Current stable behavior uses a permanent HTTP redirect status outside specialized contexts.

This distinction matters for clients, caches, and search engines.

## Redirect after mutation

After creating a record, the natural outcome may be its new canonical page.

Conceptually:

```ts
create record
  ↓
validate + authorize
  ↓
persist
  ↓
revalidate affected data if needed
  ↓
redirect to canonical destination
```

The mutation details are Phase 7 material, but the routing principle is important now: redirect to a meaningful URL, not to an implementation artifact.

## Server vs client navigation example

Client choice:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function PlanChooser() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/pricing/pro')}>
      View Pro plan
    </button>
  )
}
```

Server decision:

```tsx
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const account = await getAccount()

  if (!account) redirect('/onboarding')

  return <Account account={account} />
}
```

The distinction is architectural: browser event vs server-known routing result.

## Redirect loops

A production redirect loop often comes from two rules that disagree.

```text
/login → /dashboard
/dashboard → /login
```

Debug by recording:

- requested URL
- auth/session state
- redirect rule selected
- destination URL
- request pipeline stage

Do not debug redirects from the final browser error alone.

## Canonicalization

Redirects are useful for normalizing URLs:

```text
/products/ABC
→ /products/abc
```

or moving a resource:

```text
/docs/old-path
→ /guides/new-path
```

But do not add server redirects for trivial client-only view preferences when query state would be enough.

## `transitionTypes` with programmatic navigation

Stable Next.js 16.2 supports transition type options on App Router programmatic navigation.

```ts
router.push('/gallery/next', {
  transitionTypes: ['forward'],
})
```

As with `<Link>`, distinguish this stable routing prop from the broader experimental Next.js View Transition integration.

## Common mistakes

### Using `router.push()` for a normal link

You lose semantic simplicity and often make accessibility worse.

### Redirecting in `useEffect()` when the server already knows

This delays a decision that belongs earlier in the lifecycle.

### Trusting `returnTo` query parameters

Unvalidated redirect destinations can create open redirect or script-navigation risks.

### Calling `refresh()` as a universal cache invalidator

It refreshes the route representation; it does not erase every cache policy.

### Treating permanent redirects as temporary workflow control

Permanent redirect semantics can affect caching and indexing. Use them only when the move is truly canonical.

## Debugging checklist

When programmatic navigation behaves incorrectly:

1. Confirm whether the code runs in a Client Component.
2. Confirm imports come from `next/navigation`.
3. Check whether `push` vs `replace` matches desired history.
4. Check scroll options.
5. Validate the destination URL.
6. Determine whether the decision should happen on the server instead.
7. For `refresh()`, inspect caching before assuming refresh failed.
8. For redirects, look for loops and broad catch blocks.

## Interview questions

**When should you use `useRouter` instead of `<Link>`?**  
When navigation is triggered by imperative client logic rather than a normal navigational anchor.

**Why is `redirect()` often preferable to client redirect logic for auth flow?**  
If the server already knows the routing result, it can avoid delayed hydration-dependent navigation and content flashes.

**Does `router.refresh()` clear all cached data?**  
No. It requests a fresh route result, but cached underlying data may still be reused according to its cache policy.

**What security risk exists with `router.push(untrustedValue)`?**  
Untrusted URL schemes or destinations can create XSS/open-navigation vulnerabilities.

## Exercise

Build a post-login routing flow that supports a `returnTo` parameter.

Requirements:

- validate the return destination
- default to `/dashboard`
- use a server redirect when authentication succeeds
- reject external/scheme-relative values
- document whether the redirect should add or replace a history entry
- write tests for malicious values such as `javascript:...` and `//evil.example`
