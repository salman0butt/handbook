---
title: Project Structure, Colocation, Route Groups & Vertical Slices
sidebar_position: 2
description: Organize a large App Router codebase with route ownership, safe colocation, private folders, route groups, vertical slices, and explicit module APIs.
---

# Project Structure, Colocation, Route Groups & Vertical Slices

Next.js intentionally does not prescribe one application folder architecture.

That freedom is useful, but large repositories need a consistent local rule.

The official App Router project-structure guidance establishes several important facts:

- folders under `app` define route segments;
- a route does not become publicly routable until a `page` or `route` file exists;
- implementation files can therefore be safely colocated in route segments;
- private folders opt a subtree out of routing;
- route groups organise routes without changing the URL;
- `src` is optional.

Use those primitives to express product ownership instead of fighting them.

## 1. Three common organisation strategies

### Strategy A — route-first colocation

```text
app/
  dashboard/
    projects/
      page.tsx
      _components/
      _queries/
      _actions/
```

Good when a feature exists only for one route subtree.

### Strategy B — feature-first modules outside `app`

```text
app/
  dashboard/projects/page.tsx

features/
  projects/
    ui/
    server/
    commands/
    dto/
    index.ts
```

Good when a capability spans many routes or entry points.

### Strategy C — hybrid

```text
app/
  (app)/
    projects/
      page.tsx
      _components/

features/
  projects/
    server/
    domain/
    commands/
```

Route-specific UI stays close to the route, while durable business ownership lives in the feature module.

For large applications, the hybrid is often practical.

## 2. Keep the route tree readable

The `app` tree should primarily communicate:

```text
URL structure
layout structure
loading/error boundaries
public HTTP endpoints
route ownership
```

If the route tree is dominated by hundreds of generic utility modules, navigation becomes harder.

Private folders can make internal implementation explicit:

```text
app/
  dashboard/
    projects/
      _components/
      _lib/
      page.tsx
```

The underscore is an organisational signal, not a security boundary.

## 3. Route groups are architecture tools

Route groups such as:

```text
(marketing)
(app)
(admin)
```

can organise routes by:

```text
product surface
team
layout requirement
authentication context
shell
```

Because the group name is not part of the URL, it can reflect internal ownership.

Example:

```text
app/
  (marketing)/
    pricing/page.tsx
    blog/page.tsx
  (app)/
    dashboard/page.tsx
    projects/page.tsx
  (admin)/
    admin/users/page.tsx
```

But do not create conflicting paths in multiple groups.

## 4. Multiple root layouts are deployment-like boundaries

Different root layouts can be useful for genuinely separate application surfaces.

However, navigation between different root layouts performs a full page load.

That means the boundary affects user experience and should not be introduced only for folder aesthetics.

Ask:

```text
Do these surfaces need independent document shells?
Do they share navigation state?
Are users expected to move between them frequently?
```

## 5. Route ownership should be obvious

A route directory should make it clear which capability owns it.

Good:

```text
app/(app)/billing/
app/(app)/projects/
app/(app)/reports/
```

Less clear:

```text
app/(app)/misc/
app/(app)/common/
```

The same rule applies outside `app`.

## 6. Vertical slice structure

A feature module can contain all layers needed for one capability:

```text
features/projects/
  domain/
    policy.ts
    types.ts
  server/
    dal.ts
    queries.ts
  commands/
    create-project.ts
    archive-project.ts
  ui/
    project-card.tsx
    rename-project-form.tsx
  dto/
    project.dto.ts
  telemetry/
    events.ts
  index.ts
```

This does not mean every feature must have every folder.

Create structure only when the feature needs it.

## 7. Avoid architecture-by-template

A common failure mode:

```text
every feature
  repositories/
  services/
  managers/
  factories/
  use-cases/
  presenters/
```

before any real complexity exists.

Architecture should remove ambiguity, not manufacture ceremony.

Start with the minimum stable boundary and evolve when pressure appears.

## 8. Use feature entry points

Instead of cross-feature deep imports:

```ts
import { buildInvoiceRows } from '@/features/billing/internal/table/buildRows'
```

prefer:

```ts
import { getInvoiceSummary } from '@/features/billing'
```

The feature's `index.ts` or package `exports` becomes its supported public surface.

Internal files stay changeable.

## 9. Route-specific modules should stay local

If a component is used by exactly one route, placing it in a global `components/` folder makes ownership less clear.

Prefer:

```text
app/(app)/projects/[id]/_components/project-header.tsx
```

Promote it only when another owner genuinely needs it.

## 10. Global component folders should be narrow

Reasonable global UI categories:

```text
components/ui/       → design-system primitives
components/layout/   → cross-product shell
components/providers/→ truly global providers
```

Avoid putting feature-specific components there.

## 11. Keep server code visibly server-owned

Use naming/folder signals plus `server-only` for privileged modules where appropriate.

```text
features/projects/server/dal.ts
features/projects/server/queries.ts
```

```ts
import 'server-only'
```

This reduces accidental imports from Client Components.

## 12. Keep browser-only implementation explicit

Likewise, browser-dependent modules can live under an obvious client boundary:

```text
features/editor/client/
```

or behind a Client Component entry point.

Do not make server-owned modules import browser utilities.

## 13. Separate primitives from product components

A design-system button:

```text
packages/ui/button.tsx
```

should not know about:

```text
billing plan
project permission
analytics business event
router path
```

A product-specific component can compose the primitive:

```tsx
export function UpgradePlanButton() {
  return <Button>Upgrade</Button>
}
```

This keeps the design system reusable and stable.

## 14. Organise by change coupling

Files that usually change together should often live near each other.

If adding a project field always requires touching:

```text
project validator
project DTO
project form
project command
```

putting those modules under one capability makes the change easier to understand.

## 15. Avoid a global `utils` graveyard

`utils` tends to mix unrelated abstractions.

Prefer meaningful owners:

```text
lib/date/
lib/http/
lib/ids/
features/projects/slug.ts
features/billing/money.ts
```

A generic helper should be generic in semantics, not merely small in size.

## 16. Define import direction

Example policy:

```text
app → features → core/infrastructure
features → shared primitives
features ✗ other feature internals
ui primitives ✗ product features
```

Use tooling to enforce it when repository scale warrants it.

## 17. Avoid accidental client dependency expansion

A Client Component entry point can pull imported modules into the client graph.

If a feature barrel exports both server and client modules indiscriminately:

```ts
export * from './server/dal'
export * from './ui/client-widget'
```

client imports can become confusing or invalid.

Prefer environment-specific entry points:

```text
features/projects/server
features/projects/client
features/projects/types
```

or carefully separated exports.

## 18. Types can still leak architecture

A shared TypeScript type that directly exposes a database entity can couple every layer to the database schema.

Prefer deliberate contracts:

```ts
export type ProjectSummary = {
  id: string
  name: string
  canEdit: boolean
}
```

rather than exporting the complete ORM record everywhere.

## 19. Project structure should support deletion

A strong feature boundary should be removable with a bounded change.

Ask:

> If we delete Reports, how many unrelated folders must we inspect?

If the answer is “the whole repository,” the feature is too entangled.

## 20. Example large-app structure

```text
src/
  app/
    (marketing)/
    (app)/
      dashboard/
      projects/
      billing/
    api/
  features/
    identity/
    projects/
    billing/
    reporting/
  core/
    config/
    db/
    observability/
    queue/
  components/
    ui/
    shell/
```

This is an example, not a Next.js requirement.

The correct structure is the one that makes ownership and dependency direction obvious for your product.

## 21. Senior review questions

### Should all code live under `app`?

No. Next.js supports colocation there, but durable product modules can live outside the route tree when that makes ownership clearer.

### Why use route groups if they do not affect the URL?

They let the repository express internal product/team/layout organisation independently from public URL design.

### Are private folders required for non-routable code?

No. Colocated files are not automatically routes. Private folders are an explicit organisational convention that opts their subtree out of routing.

## Production checklist

- [ ] route tree communicates URL and layout structure clearly
- [ ] route-specific code stays local where useful
- [ ] feature-wide business code has a durable owner
- [ ] private folders and route groups are used intentionally
- [ ] multiple root layouts justify full-page navigation cost
- [ ] deep cross-feature imports are avoided
- [ ] server/client entry points are separated
- [ ] generic folders have narrow definitions
- [ ] module deletion has a bounded blast radius
- [ ] import-direction rules are documented/enforced

## Exercise

Refactor a hypothetical SaaS repository currently organised as:

```text
components/
services/
hooks/
utils/
```

into a hybrid route + vertical-slice architecture for:

- identity
- projects
- billing
- reporting

Explain why each file belongs to its owner.
