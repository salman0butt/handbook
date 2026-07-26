---
title: Client-side Data Fetching
description: Choose browser-owned fetching deliberately, integrate live data without duplicating server ownership, and understand when SWR or other client caches are appropriate.
---

# Client-side Data Fetching

App Router is server-first, not server-only.

Client-side fetching is useful when the **browser** genuinely owns the lifecycle of the data.

Examples:

- rapidly updating dashboards after initial render
- polling/live status
- browser-only APIs
- user-triggered secondary data
- client cache libraries shared across interactive widgets
- data that does not need to participate in initial server rendering

The question is not “is client fetching allowed?”

It is:

> **Does this data need browser ownership?**

## Avoid duplicating server ownership

Bad architecture:

```text
Server Component fetches projects
  ↓ renders table
Client Component mounts
  ↓ fetches same projects again
```

You now have two owners and two requests.

Prefer one clear model:

```text
initial server-owned read
+ client mutation/live refresh only when needed
```

or

```text
client-owned remote state
with deliberate loading/cache policy
```

## Basic client fetch

```tsx
'use client'

import { useEffect, useState } from 'react'

export function StatusPanel() {
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch('/api/status', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Status request failed: ${response.status}`)
        }

        setStatus(await response.json())
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error as Error)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [])

  if (error) return <p>Unable to load status.</p>
  if (!status) return <p>Loading…</p>

  return <StatusView status={status} />
}
```

This is valid, but a hand-written effect is not automatically the best solution for sophisticated remote state.

## Client data libraries

Next.js documentation points to community libraries such as SWR for browser fetching.

A client data library can add:

- cache
- request deduplication
- revalidation
- focus revalidation
- polling
- mutation integration
- race handling

Example shape:

```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url).then(async response => {
    if (!response.ok) throw new Error('Request failed')
    return response.json()
  })

export function LiveStatus() {
  const { data, error, isLoading } = useSWR('/api/status', fetcher)

  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading…</p>

  return <StatusView status={data} />
}
```

TanStack Query, RTK Query, and similar libraries can also be valid choices when their broader state/mutation model fits the app.

## Server cache vs client cache

These are different systems:

```text
SERVER
Next.js data/output caches
React request memoisation

BROWSER
SWR / TanStack Query / RTK Query cache
browser HTTP cache
local component state
```

Do not assume invalidating one automatically invalidates the others.

Later mutation/caching phases cover coordination in depth.

## Initial server data + client live updates

A common pattern:

```text
Server Component
  ↓ initial authoritative snapshot
Client island
  ↓ live/polling/subscription updates
```

Example:

```tsx
export default async function Page() {
  const initial = await getSystemStatus()
  return <LiveStatus initialStatus={initial} />
}
```

The client component can then use the initial value while taking ownership of live updates.

Be explicit about which source wins if the client refetches immediately.

## Avoid instant duplicate refetch

If the server just fetched data and the client library refetches on mount, you may pay twice.

Possible strategies depend on the library:

- seed initial/fallback data
- configure stale time/revalidation policy
- defer live refresh until needed

Do not blindly disable refetching globally. Choose from freshness requirements.

## Polling

```text
poll every 5s
```

is simple but can become expensive at scale.

Estimate:

```text
10,000 active users × 12 requests/minute
= 120,000 requests/minute
```

Ask whether you need:

- slower interval
- visibility-aware polling
- backoff
- SSE/WebSocket
- server push/event architecture

## Browser visibility

For background tabs, continuous polling may waste resources.

Many client libraries support focus/visibility-aware refresh behavior.

If implementing manually, understand the Page Visibility API and product expectations.

## Race conditions

User changes a filter quickly:

```text
request A: q=react
request B: q=next
```

If A finishes after B, naive state updates can display stale results.

Use:

- abort signals
- request identity
- a client library with race handling

Do not assume response order equals request order.

## Authentication

Browser requests may use cookies automatically for same-origin requests depending on cookie settings.

Never send server secrets to the browser so it can call a private upstream directly.

If the browser needs access to protected application data:

```text
browser
  ↓ authenticated app endpoint / Server Function
server
  ↓ authorize
upstream/database
```

The server remains authoritative.

## Client data is untrusted too

A client cache containing:

```ts
{ canDelete: true }
```

is not an authorization decision.

Mutations must re-check permissions on the server.

## SEO and first-load trade-off

If critical public content is fetched only after mount:

```text
HTML shell
  ↓ JS
hydrate
  ↓ fetch
  ↓ render content
```

That can delay useful content and may be worse for indexing/first-load experience.

Prefer server rendering for content needed in the initial document when possible.

## Client fetching does not require a global store

Remote state and global UI state are different concerns.

A query cache can own server-derived browser data without copying every result into Redux/Zustand.

Avoid duplicate caches unless there is a clear synchronization contract.

## Offline requirements

If product requirements include offline support, browser persistence, queued mutations, or background sync, the architecture becomes more client-centric.

Treat that as an explicit product capability, not a default reason to fetch everything in the browser.

## Common mistakes

### Fetching server-renderable data only in effects

Adds a client waterfall unnecessarily.

### Server fetch + immediate client fetch of the same resource

Duplicate work and ownership.

### Polling every second without scale analysis

Can overwhelm your backend.

### Treating client cache as authorization

Browser state is user-controlled.

### Storing query data in multiple client stores

Creates synchronization problems.

## Debugging checklist

1. Determine why the browser owns this data.
2. Check whether the server already fetched the same resource.
3. Inspect duplicate mount/focus refetches.
4. Check race cancellation.
5. Check polling frequency and background-tab behavior.
6. Verify HTTP status/error handling.
7. Measure payload size and request frequency.
8. Confirm secrets stay on the server.
9. Confirm server mutations re-authorize.
10. Test slow network, offline, and tab refocus if relevant.

## Interview questions

**When is client-side fetching appropriate in App Router?**  
When the data lifecycle is genuinely browser-owned: live updates, polling, user-triggered secondary data, or client cache behavior that does not need to block initial server rendering.

**Why not fetch everything in `useEffect`?**  
It adds JavaScript and a browser-side waterfall for data the server could have rendered directly.

**How are SWR and the Next.js Data Cache different?**  
SWR is a browser/client remote-state cache; Next.js server caching operates in the server/framework rendering layer.

**Why can server initial data plus client refetch duplicate work?**  
Because the same resource may be requested once during server render and again immediately after hydration unless the client cache is seeded/configured deliberately.

## Exercise

For each feature classify the data owner:

```text
marketing article
live stock ticker
admin table filters
current user permissions
chat presence
checkout totals
```

Choose:

- server read
- client read
- hybrid initial server + live client
- URL state
- local UI state

Then document loading, error, freshness, security, and duplication risks.