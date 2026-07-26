---
title: Revalidation, Refresh, Redirects & Cookies After Mutations
description: Choose the correct post-mutation update primitive and order revalidation, refresh, cookie writes, returned state, and redirects safely.
---

# Revalidation, Refresh, Redirects & Cookies After Mutations

A successful database write is only part of a mutation.

The UI still needs a consistency plan.

```text
mutation commits
  ↓
what server cache changed?
  ↓
what current route should update?
  ↓
should the user stay or navigate?
```

Next.js gives you several different tools. They are not interchangeable.

## `updateTag`

Use `updateTag(tag)` inside a Server Action when the current user should immediately read their own write from tagged cache data.

```ts
'use server'

import { updateTag } from 'next/cache'

export async function renameProject(...) {
  await updateProject(...)
  updateTag(`project:${projectId}`)
}
```

Mental model:

```text
write
  ↓
immediately expire tagged entry
  ↓
next read blocks for fresh value
```

This fits read-your-own-writes flows.

## `revalidateTag(tag, 'max')`

Use stale-while-revalidate when a slight delay is acceptable:

```ts
revalidateTag('catalog', 'max')
```

Mental model:

```text
mark stale
  ↓
next consumer may receive stale value
  ↓
refresh in background
```

Good for:

- catalogs
- blog indexes
- public content
- shared lists where immediate consistency is unnecessary

Do not use the deprecated single-argument form as your modern default.

## `revalidatePath`

Use when a route path should be invalidated as a unit:

```ts
revalidatePath('/dashboard')
```

It is broader than a domain tag.

Prefer tags when you know which data changed; path invalidation is useful when the route is the natural invalidation boundary.

## `refresh()` from `next/cache`

Inside a Server Action:

```ts
import { refresh } from 'next/cache'

export async function updateProfile(formData: FormData) {
  // mutate
  refresh()
}
```

`refresh()` refreshes the client router so the current UI receives a new server render.

Important:

```text
refresh()
  ≠ invalidate server cache
```

If the server render still reads cached stale data, refresh alone cannot fix that. Pair it with appropriate cache invalidation where needed.

## Client `router.refresh()` is also not cache invalidation

From a Client Component:

```ts
router.refresh()
```

requests a fresh server-rendered payload for the current route and merges it with preserved client/browser state.

It does not invalidate the server-side cache by itself.

Use server cache APIs for server cache invalidation.

## Redirect after mutation

A common create flow:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await insertPost(formData)

  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}
```

`redirect()` is control flow: it throws a framework-handled redirect signal.

Code after it will not execute.

Therefore order matters:

```text
mutate
  ↓
invalidate/update cache
  ↓
redirect
```

not:

```text
mutate
  ↓
redirect
  ↓
revalidate   ← unreachable
```

## Redirects and `try/catch`

Do not swallow redirect control flow:

```ts
try {
  await create()
  redirect('/success')
} catch (error) {
  return { message: 'Failed' }
}
```

A broad catch can intercept the redirect signal.

Safer:

```ts
let id: string

try {
  id = await create()
} catch (error) {
  return toExpectedError(error)
}

revalidatePath('/items')
redirect(`/items/${id}`)
```

Catch only the work you intend to convert into returned state.

## Returned state vs redirect

Choose one primary success UX.

Stay on page:

```ts
return { status: 'success', message: 'Saved' }
```

Navigate:

```ts
redirect(`/projects/${id}`)
```

Returning a success object immediately before redirect is meaningless because redirect ends the current action flow.

## Cookie writes in Server Actions

Current Next.js lets Server Actions set/delete cookies:

```ts
'use server'

import { cookies } from 'next/headers'

export async function setTheme(formData: FormData) {
  const store = await cookies()
  store.set('theme', String(formData.get('theme')))
}
```

When a Server Action changes cookies, Next.js can re-render the current page/layout tree so UI depending on the cookie reflects the new value.

Client state in preserved components can remain intact, while effects may re-run if dependencies change.

## Cookie mutation is not cache invalidation

If server output is also cached, changing the cookie does not automatically invalidate unrelated tagged cache entries.

Separate:

```text
request state change
from
cache freshness change
```

Use cache APIs where needed.

## Authentication mutations

Login/logout/session rotation often combine:

```text
verify credentials
update session/cookie
re-render or redirect
invalidate user-specific derived data if relevant
```

Do not cache authentication state broadly.

After logout, make sure UI no longer exposes stale private state from client caches or optimistic state.

## Mutation consistency matrix

| Requirement | Typical primitive |
| --- | --- |
| User must immediately see tagged write | `updateTag` |
| Shared data may refresh in background | `revalidateTag(tag, 'max')` |
| Route output as a whole should revalidate | `revalidatePath` |
| Current route should request fresh RSC payload | `refresh()` |
| Move user to another route | `redirect()` |
| Request/session preference changed | `cookies()` + rerender/redirect as needed |

These can be combined deliberately.

## Avoid over-invalidation

Bad:

```ts
revalidatePath('/')
```

for every mutation.

This turns caching into expensive global churn.

Prefer domain scope:

```text
project:p1
projects:org-7
invoice:42
catalog
```

Then invalidate the smallest data graph required by the write.

## Related cache entries

If an action changes one entity, ask where it appears:

```text
product detail
category list
search results
admin dashboard
recommendations
```

A correct invalidation design may require multiple tags or an aggregate tag.

Do not rely on one page refresh if the same cached data appears elsewhere.

## Transactions before invalidation

Only invalidate after the authoritative write succeeds.

Bad sequence:

```text
invalidate
  ↓
write fails
```

Now consumers may refetch unchanged/partial state unnecessarily.

Prefer:

```text
transaction commits
  ↓
invalidate/update
  ↓
return/redirect
```

## Side effects and redirect ordering

Suppose create order needs:

```text
DB transaction
email
analytics
cache invalidation
redirect
```

Do not put fragile non-critical side effects before the user can complete the request if they can be processed durably elsewhere.

The mutation should define which work is required before success and which can be asynchronous/durable.

## Common mistakes

### `refresh()` after stale cached read

Refresh does not invalidate server cache.

### Redirect before revalidation

Code after redirect does not run.

### Catching redirect as an error

Keep framework control flow outside broad catches.

### Revalidating the entire site

Use domain-scoped invalidation.

### Changing cookies and assuming every cache updated

Request state and cache state are different layers.

## Debugging checklist

When UI is stale after a mutation:

1. Confirm the database write committed.
2. Identify the server cache entry used by the read.
3. Confirm the mutation invalidated the correct tag/path.
4. Distinguish `refresh` from server cache invalidation.
5. Check redirect ordering.
6. Check broad catch blocks around redirect.
7. Inspect Client Router Cache behaviour.
8. Check whether another page uses a related tag.
9. Check cookie/session change separately from cached data.
10. Test a second browser/session to distinguish client cache from server cache.

## Interview questions

**`refresh()` vs `revalidateTag`?**  
`refresh()` refreshes the current client router/server render; `revalidateTag` changes freshness of server cache entries associated with a tag.

**When would you prefer `updateTag`?**  
When a Server Action needs immediate read-your-own-writes semantics for tagged data.

**Why call `redirect` last?**  
It terminates action control flow through a framework-handled redirect signal, so required mutation/revalidation work must happen first.

**Does setting a cookie invalidate cached data?**  
Not generally. Cookie/request-state changes and server cache invalidation are separate concerns.

## Exercise

For each mutation below, choose post-write behaviour:

```text
rename project
publish blog post
change theme cookie
logout
add catalog product
edit inventory
```

Specify tags/paths, refresh needs, redirects, and consistency requirement.
