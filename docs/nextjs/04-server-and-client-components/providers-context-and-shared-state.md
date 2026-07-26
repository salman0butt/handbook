---
title: Providers, Context & Shared State
description: Place client providers deliberately, share server-started data safely, and avoid turning the whole application into a client tree.
---

# Providers, Context & Shared State

React context is a client-side state-sharing mechanism.

In App Router, this creates an important architecture rule:

> Server Components cannot directly use React context as a general server-state mechanism. Put context providers in Client Components and render them from Server Components.

## Basic provider pattern

Create a provider:

```tsx
'use client'

import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}
```

Render it from a Server Component layout:

```tsx
import { ThemeProvider } from './theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

The layout remains a Server Component.

The provider creates a client boundary around only the subtree that needs context.

## Render providers as deep as practical

Less deliberate:

```tsx
<ThemeProvider>
  <html>
    <body>{children}</body>
  </html>
</ThemeProvider>
```

Better when possible:

```tsx
<html>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```

And even deeper if only part of the application needs the provider:

```tsx
<html>
  <body>
    <Header />
    <main>
      <DashboardProvider>{children}</DashboardProvider>
    </main>
    <Footer />
  </body>
</html>
```

A provider does not automatically turn all server-rendered descendants into client modules, but its own client runtime boundary still has cost and determines where client state is available.

## Context is not a replacement for server data ownership

Bad mental model:

```text
Server fetches user
→ serialize entire user into global context
→ every component reads context
```

Ask first:

- Which components need server data only?
- Which components need interactive client access?
- Which data should stay server-only?
- Which state truly needs global browser lifetime?

Often:

```text
Server Components read user directly
Client Provider receives only minimal client-needed user state
```

is cleaner.

## Separate server identity from client presentation state

Example:

```text
Server session/user
  → authentication/authorization source

Client theme/sidebar/preferences
  → browser interaction state
```

Do not put authoritative security state in client context.

Client context can carry:

```ts
{
  displayName,
  avatarUrl,
  uiRoleLabel
}
```

but the server must re-resolve and re-authorize sensitive operations independently.

## Passing server-started promises into context

A modern pattern can start a request on the server and pass the Promise into a Client Context provider.

Server data function:

```ts
import 'server-only'
import { cache } from 'react'

export const getUser = cache(async () => {
  const user = await readCurrentUser()
  return {
    id: user.id,
    name: user.name,
  }
})
```

Provider:

```tsx
'use client'

import { createContext } from 'react'

type User = {
  id: string
  name: string
}

export const UserContext = createContext<Promise<User> | null>(null)

export function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User>
}) {
  return (
    <UserContext.Provider value={userPromise}>
      {children}
    </UserContext.Provider>
  )
}
```

Layout:

```tsx
import { UserProvider } from './user-provider'
import { getUser } from './lib/user'

export default function Layout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser()

  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

Client consumer:

```tsx
'use client'

import { use, useContext } from 'react'
import { UserContext } from './user-provider'

export function UserBadge() {
  const userPromise = useContext(UserContext)
  if (!userPromise) throw new Error('Missing UserProvider')

  const user = use(userPromise)
  return <span>{user.name}</span>
}
```

Wrap the consumer with an appropriate Suspense boundary when the Promise may still be pending.

## Understand the scope of React `cache`

When `getUser` is wrapped with React `cache`, current Next.js guidance treats that memoization as **request-scoped**.

This helps repeated server reads in one render/request share the same result.

Do not confuse it with:

- persistent Next.js data cache
- CDN cache
- cross-request application cache
- database cache

Those belong to later phases.

## Context vs props

Prefer props when the ownership path is simple:

```tsx
<Sidebar user={user} />
```

Use context when many client descendants need shared interactive state:

```text
DashboardProvider
├── Toolbar
├── Filters
├── TableControls
└── Inspector
```

Context should solve a real propagation problem, not replace component design.

## Context value stability still matters

Client performance rules remain normal React rules.

Bad:

```tsx
<Context.Provider value={{ theme, setTheme, modal, setModal, user, setUser }}>
```

Every unrelated state change can create broad consumer updates.

Consider separate contexts by responsibility:

```text
ThemeContext
ModalContext
SelectionContext
```

or another state architecture when the client state model becomes large.

The React handbook owns deeper context performance patterns. In Next.js, the additional concern is where the client boundary starts.

## Provider placement and static/server optimization

A provider high in the tree may be convenient, but it can make client concerns global.

Prefer:

```text
Root Server Layout
├── Server Header
├── Server Marketing Content
└── Dashboard subtree
    └── Client DashboardProvider
```

rather than:

```text
Root Client Provider
└── entire application
```

unless the provider truly applies everywhere.

## Third-party providers

Many libraries expose providers that use context internally:

```tsx
<QueryClientProvider>
<AuthClientProvider>
<ThemeProvider>
```

Wrap them in your own Client Component when necessary:

```tsx
'use client'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SomeClientProvider>{children}</SomeClientProvider>
    </ThemeProvider>
  )
}
```

Then render `<AppProviders>` from a Server Component layout.

Do not mark the layout `'use client'` merely to host providers.

## Avoid provider dumping grounds

A file called:

```text
providers.tsx
```

can gradually accumulate every library in the application.

That creates:

- difficult startup cost attribution
- global client dependencies
- broad rerender domains
- harder test setup
- unclear feature ownership

Group providers by scope where possible:

```text
app/layout.tsx
  → global theme provider

app/dashboard/layout.tsx
  → dashboard selection provider

app/editor/layout.tsx
  → editor provider
```

## Server-rendered children remain server-owned

A useful nuance:

```tsx
<AppProviders>
  {children}
</AppProviders>
```

This does **not** mean every `children` Server Component implementation becomes part of the client bundle.

The server can render those children and compose them into the client provider slot.

Do not confuse visual ancestry with module-graph ancestry.

## Authentication provider caution

A client auth provider can improve UX:

```text
avatar
signed-in navigation
client refresh state
```

but should not become the authoritative permission source.

Never implement:

```ts
if (authContext.role === 'admin') {
  deleteUser()
}
```

as the only enforcement.

The mutation/server layer must validate current identity and permission again.

## Debugging provider problems

Symptom: `createContext` or provider library fails in a Server Component.

Check:

1. Is the provider file a Client Component?
2. Does the third-party package correctly expose a client entry point?
3. Can you create a small `'use client'` wrapper?
4. Is the provider mounted too high?
5. Is a server-only value being passed into context?
6. Is a Promise missing Suspense where it is consumed with `use()`?
7. Is hydration state different between server prerender and browser?

## Production checklist

- Keep authoritative server state on the server.
- Send only browser-needed view data into providers.
- Place providers at the narrowest meaningful scope.
- Do not make layouts client-side solely to host providers.
- Audit provider dependencies for bundle cost.
- Separate unrelated contexts.
- Test direct page loads and client navigations.
- Re-authorize mutations server-side.

## Interview questions

**Can Server Components consume normal React context?**  
React context is a client-side sharing mechanism in this App Router model. Use a Client Component provider for client consumers.

**Should the root layout be marked `'use client'` to use a provider?**  
Usually no. Create a Client Component provider and render it from the Server Component layout.

**Why render providers deep in the tree?**  
It keeps client concerns scoped and preserves more of the surrounding tree as server/static work.

**Can server-rendered children appear inside a Client Provider?**  
Yes. A Server Component can create those children and pass them into the provider as ReactNode content.

**Is client auth context enough for authorization?**  
No. It is presentation state. Sensitive operations must authorize on the server.

## Exercise

Create a dashboard with:

- a Server Component root layout
- a global ThemeProvider
- a dashboard-only SelectionProvider
- server-owned current-user lookup
- a minimal user Promise exposed to one client badge
- server authorization that does not depend on context

Then explain why each provider is mounted at its chosen depth.
