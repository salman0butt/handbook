---
title: Async Request APIs, React 19, Types & Rendering Migration
sidebar_position: 3
description: Migrate async request APIs, route props, React 19 integration, generated route types, and rendering assumptions safely across modern Next.js versions.
---

# Async Request APIs, React 19, Types & Rendering Migration

Next.js 15 introduced async request-bound APIs with temporary compatibility. Next.js 16 removes synchronous access.

The affected model is broader than adding `await`.

```text
request-owned value
→ asynchronous boundary
→ server render / route handler / metadata consumer
```

## 1. APIs that are now asynchronous

Modern App Router code must treat the following as async where applicable:

```text
cookies()
headers()
draftMode()
params
searchParams
```

`params` applies across pages, layouts, handlers and several metadata/file conventions. `searchParams` is request-owned page input.

## 2. Server Component migration

Old conceptual code:

```tsx
export default function Page({ params }) {
  return <h1>{params.slug}</h1>
}
```

Modern shape:

```tsx
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

The important change is ownership: route params are resolved by the framework and exposed as a Promise-backed request value.

## 3. Request helpers must also become async

Old helper:

```ts
export function getTheme() {
  return cookies().get('theme')?.value
}
```

Modern helper:

```ts
export async function getTheme() {
  const store = await cookies()
  return store.get('theme')?.value
}
```

Every caller must now handle the async boundary.

## 4. Do not hide async behavior with unsafe casts

Avoid migration shortcuts such as:

```ts
const params = props.params as unknown as { slug: string }
```

That only silences the type system while preserving a broken runtime model.

Use types to expose the real lifecycle.

## 5. `use()` is not a generic replacement for `await`

React `use()` can consume a Promise during rendering where appropriate, especially in components that cannot become `async` for architectural reasons.

But use normal `await` in ordinary async Server Components when it is clearer.

Decision rule:

```text
server async function available?
→ await

render-time Promise passed to component that remains sync?
→ consider React use()
```

## 6. Client Components should not receive raw request stores

Do not pass `cookies()` or `headers()` stores across the RSC boundary.

Project only safe data:

```tsx
const locale = (await headers()).get('x-locale') ?? 'en'
return <ClientWidget locale={locale} />
```

This keeps request/server objects and secrets out of the browser boundary.

## 7. Generate route-aware helper types

Current Next.js supports:

```bash
npx next typegen
```

This generates route-aware global helpers such as:

```text
PageProps
LayoutProps
RouteContext
```

Use them to reduce hand-written route parameter drift.

## 8. Metadata functions inherit the async route model

`generateMetadata` may receive async route values.

Migration review should include:

```text
generateMetadata
generateViewport
opengraph-image
twitter-image
icon/apple-icon handlers
```

These paths are often missed because they live outside the main page component.

## 9. Route Handlers

Handler route context follows the modern Promise-based parameter model.

Test:

```text
params resolve correctly
invalid inputs fail safely
auth and tenant scope remain intact
response status/body unchanged
```

Do not let a type migration weaken validation.

## 10. React 19 integration

When moving from older Next/React combinations, review React 19 changes together with Next.js migration guidance.

Important application-level areas include:

```text
Actions / form actions
useActionState
useFormStatus
useOptimistic
ref behavior
types
hydration/error diagnostics
```

Use the React handbook for full React semantics; this phase focuses on framework migration impact.

## 11. `useFormState` to `useActionState`

React 19 recommends `useActionState` for the modern Action state model.

Migration should preserve:

```text
returned state
pending UI
validation messages
progressive enhancement
redirect/revalidation behavior
```

Do not mechanically rename without testing the form contract.

## 12. Type packages must move with React

When React is upgraded, update:

```text
@types/react
@types/react-dom
```

and compile the entire monorepo.

Common breakage appears in:

```text
component props
refs
JSX namespace assumptions
third-party component declarations
old testing helpers
```

## 13. Hydration warnings may become more actionable

Newer React/Next versions improve diagnostics, but an upgrade can also surface previously hidden hydration problems.

Do not suppress them.

Classify mismatches by source:

```text
Date/randomness
timezone/locale
browser-only condition
invalid DOM nesting
extension injection
stale HTML/assets
```

## 14. Server/client ownership may shift during migration

A client-heavy legacy component might call browser APIs and fetch data in effects.

Do not move it server-side just to satisfy a migration checklist.

Instead separate concerns:

```text
server-owned read
→ Server Component

interactive state/browser APIs
→ Client Component island
```

## 15. Async migration can expose waterfalls

Adding `await` everywhere can accidentally serialize work.

Bad:

```ts
const user = await getUser()
const plan = await getPlan()
const notices = await getNotices()
```

when calls are independent.

Prefer:

```ts
const [user, plan, notices] = await Promise.all([
  getUser(),
  getPlan(),
  getNotices(),
])
```

where concurrency is safe and bounded.

## 16. Async does not mean dynamic by itself

Do not infer rendering mode from the presence of `async`.

The relevant questions are:

```text
what data is read?
what is cached?
which request APIs are used?
where are Suspense boundaries?
what does the build report?
```

## 17. Update mocks and tests

Legacy tests may mock route props synchronously.

Update fixtures to match production contracts.

Example conceptual fixture:

```ts
const props = {
  params: Promise.resolve({ slug: 'hello' }),
  searchParams: Promise.resolve({ page: '2' }),
}
```

Do not create tests that pass only because they use an obsolete shape.

## 18. Check shared utility boundaries

A utility used by both server and client code must not suddenly import `next/headers` because of a migration.

Keep request-aware helpers explicitly server-owned.

Useful package structure:

```text
feature/core
feature/server
feature/client
```

## 19. Search strategy

During migration, search for:

```text
cookies(
headers(
draftMode(
params.
searchParams.
useFormState
ReactDOM.render
hydrateRoot wrappers
legacy ref patterns
```

Then classify each occurrence by environment and lifecycle.

## 20. Validate behavior, not only TypeScript

Passing `tsc` cannot prove:

```text
streaming behavior
cache freshness
hydration
form submission
redirects
cookies
headers
metadata
```

Use production build + browser tests for these.

## Migration checklist

- [ ] all request APIs use supported async access
- [ ] params/searchParams types match runtime
- [ ] no unsafe sync compatibility casts remain
- [ ] metadata/file conventions were reviewed
- [ ] shared helpers preserve server/client boundaries
- [ ] React/types versions are compatible
- [ ] form Action behavior is regression tested
- [ ] async refactor did not create waterfalls
- [ ] production build and E2E are green

The goal is not “make the compiler quiet.” It is to adopt the real modern request/render lifecycle.