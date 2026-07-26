---
title: server-only, client-only & Environment Poisoning
description: Prevent accidental cross-environment imports, protect secrets, and make server and browser module intent explicit.
---

# `server-only`, `client-only` & Environment Poisoning

A module can look reusable while secretly depending on one environment.

That creates **environment poisoning**: code intended for the server leaks into the client graph, or browser-only code is imported into server execution.

## The accidental server-to-client import

Consider:

```ts
// lib/data.ts
export async function getData() {
  const res = await fetch('https://internal.example.com/data', {
    headers: {
      authorization: process.env.INTERNAL_API_KEY,
    },
  })

  return res.json()
}
```

Later, another developer writes:

```tsx
'use client'

import { getData } from '@/lib/data'
```

That import is architecturally wrong.

The module depends on a server secret and should never be part of the client graph.

## Mark sensitive modules with `server-only`

```ts
import 'server-only'

export async function getData() {
  const res = await fetch('https://internal.example.com/data', {
    headers: {
      authorization: process.env.INTERNAL_API_KEY,
    },
  })

  return res.json()
}
```

Now an accidental import from a Client Component produces a build-time error instead of silently creating a dangerous dependency path.

## Mark browser-dependent modules with `client-only`

```ts
import 'client-only'

export function readStoredTheme() {
  return localStorage.getItem('theme')
}
```

This documents that the module requires a browser/client environment.

It also helps Next.js give clearer errors if server code imports it in the wrong place.

## These markers are architecture contracts

Use them for modules with strong environment assumptions:

### Good `server-only` candidates

```text
database access
session verification
private service credentials
filesystem access
email provider private SDK
admin APIs
server-only observability exporters
```

### Good `client-only` candidates

```text
localStorage adapters
DOM measurement
browser event subscriptions
Web Bluetooth wrappers
window/document utilities
browser analytics adapters
```

## Shared modules should remain truly shared

A pure formatter can be shared:

```ts
export function formatProjectName(name: string) {
  return name.trim()
}
```

A module that imports both environments is suspicious:

```ts
import { db } from './db'
import { localStorageAdapter } from './storage'
```

Split responsibilities instead.

## Suggested structure

```text
lib/
├── shared/
│   ├── validation.ts
│   ├── formatting.ts
│   └── domain-types.ts
├── server/
│   ├── db.ts
│   ├── auth.ts
│   └── projects.ts
└── client/
    ├── storage.ts
    └── viewport.ts
```

Folders alone do not enforce the boundary, but they improve discoverability.

Combine naming/structure with explicit markers for important modules.

## Environment variables are not enough protection

Current Next.js behavior only exposes browser-bundled environment variables intentionally prefixed with `NEXT_PUBLIC_`.

Unprefixed variables are not meant for client use.

But relying on that alone is weak architecture.

Bad reasoning:

```text
If someone imports this server module client-side,
the secret becomes empty anyway,
so we are safe.
```

The function may still fail unpredictably, and future refactors may change what data is exposed.

Prefer preventing the invalid import entirely.

## `NEXT_PUBLIC_` means intentionally public

```env
NEXT_PUBLIC_ANALYTICS_ID=abc123
```

should be treated as browser-visible configuration.

Never place privileged credentials behind that prefix.

Unsafe:

```env
NEXT_PUBLIC_DATABASE_PASSWORD=...
NEXT_PUBLIC_STRIPE_SECRET_KEY=...
NEXT_PUBLIC_INTERNAL_ADMIN_TOKEN=...
```

The prefix is not a convenience switch. It changes the exposure model.

## Server Components still need data minimization

Even when a secret-bearing function stays server-only, its returned data can cross into a Client Component.

Example:

```tsx
const account = await getAccount()
return <ClientProfile account={account} />
```

If `account` contains sensitive fields, the server-only import is correct but the boundary payload is still unsafe.

Security requires both:

```text
server-only implementation
+
minimal client-visible data
```

## Use public view models

```ts
import 'server-only'

export async function getPublicAccountView() {
  const account = await db.account.findUnique(/* ... */)

  return {
    id: account.id,
    displayName: account.displayName,
    avatarUrl: account.avatarUrl,
  }
}
```

Then:

```tsx
<ClientProfile account={await getPublicAccountView()} />
```

The client receives only fields it needs.

## Secret access should happen near the server integration

Prefer:

```text
lib/server/payments.ts
  → reads payment secret
  → calls provider
  → returns domain result
```

rather than:

```text
page.tsx
  → reads secret
  → passes secret into generic helper
  → helper imported in many places
```

Keep privileged dependencies concentrated.

## `server-only` does not replace authorization

```ts
import 'server-only'

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } })
}
```

The function is server-only, but still insecure if arbitrary callers can invoke it through an exposed server boundary without authorization.

Environment isolation answers:

```text
Where can this implementation execute?
```

Authorization answers:

```text
Who is allowed to perform this operation?
```

You need both.

## Client-side validation is not enough

A Client Component may validate:

```tsx
if (!projectId.match(/^p_/)) return
```

for UX.

The server still validates before trusted data access.

Never let “it came from our client code” weaken server trust rules.

## Preventing cross-environment package imports

In a monorepo, shared packages can accidentally blur boundaries.

Example:

```text
packages/data
packages/ui
apps/web
```

If `packages/ui` imports `packages/data/db`, an interactive UI export may transitively pull server dependencies toward the client graph.

Design packages with explicit entry points:

```text
@company/data/server
@company/browser/storage
@company/shared/types
```

and mark environment-specific modules.

## Barrel files can hide poisoning

Dangerous barrel:

```ts
// lib/index.ts
export * from './formatting'
export * from './db'
export * from './browser-storage'
```

Now importing one shared utility may cause confusing graph analysis or make dangerous exports easy to reach.

Prefer environment-specific barrels:

```text
lib/shared/index.ts
lib/server/index.ts
lib/client/index.ts
```

## Side effects during module evaluation

Environment poisoning is not only about API calls inside functions.

This browser module is unsafe on server import:

```ts
const width = window.innerWidth

export function getWidth() {
  return width
}
```

The failure occurs as soon as the module is evaluated.

Likewise, a server module can create sensitive side effects at import time.

Keep top-level module work predictable.

## TypeScript does not enforce runtime environment

This typechecks:

```ts
export function getToken(): string {
  return localStorage.getItem('token') ?? ''
}
```

TypeScript cannot prove whether the function executes in a browser.

Environment boundaries require framework/module architecture, not only types.

## Build-time errors are a feature

If `server-only` causes CI to fail after someone imports the module from a Client Component, that is success.

The build caught a trust-boundary regression before deployment.

Treat production builds as architectural validation.

## Debugging environment poisoning

Symptom:

```text
module can only be used from Server Components
window is not defined
server-only import from client
client-only import from server
secret-dependent function returns empty/invalid value
```

Debug:

1. Find the failing module.
2. Identify its true environment requirement.
3. Trace who imports it.
4. Find the nearest `'use client'` boundary.
5. Split shared and environment-specific logic.
6. Add `server-only` / `client-only` markers.
7. Re-run the production build.

## Security review checklist

For server modules:

- [ ] secrets never use `NEXT_PUBLIC_`
- [ ] sensitive integration modules use `server-only`
- [ ] database modules are not exposed through client-facing barrels
- [ ] return values are minimized before crossing to client
- [ ] authorization is enforced separately

For client modules:

- [ ] browser-only code is isolated
- [ ] no server credentials are imported
- [ ] privileged SDKs are not initialized client-side
- [ ] client-visible config is intentionally public
- [ ] user-controlled data remains untrusted

## Interview questions

**What is environment poisoning?**  
Accidentally using a module in the wrong runtime graph, such as importing secret-bearing server code into a Client Component or browser-only code into server execution.

**What does `server-only` do?**  
It marks a module as server-only so Next.js can fail invalid client imports with a clearer build-time error.

**Does hiding environment variables automatically make a server module safe to import client-side?**  
No. Prevent the invalid import rather than relying on missing values to fail later.

**Does `server-only` enforce user permissions?**  
No. It enforces environment intent, not authorization.

**Why can barrel files be dangerous?**  
They can mix shared, server, and client exports, making cross-environment imports easier and dependency graphs harder to audit.

## Exercise

Create three modules:

```text
lib/shared/format-project.ts
lib/server/get-project.ts
lib/client/project-history.ts
```

Requirements:

- server module uses `server-only` and reads the database
- client module uses `client-only` and reads browser storage
- shared module uses neither
- a Client Component cannot import the database module
- a Server Component does not import browser storage
- only a minimal public project DTO crosses into the client

Intentionally violate each boundary once and confirm the production build catches the invalid architecture.
