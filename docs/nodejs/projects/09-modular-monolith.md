---
title: Project 9 — Modular Monolith
---

# Project 9 — Modular Monolith

Build the same commerce domain as one deployable Node application with strict identity, catalog, orders, billing, and fulfillment module boundaries.

## Requirements

Each module exposes a public API, owns persistence access, has domain/application layers, and cannot import another module's private repository. Use one DB deployment but enforce logical schema/table ownership. Coordinate local transactions where appropriate and internal events/outbox for looser coupling.

## Architecture

```text
Node process
 ├─ identity module
 ├─ catalog module
 ├─ orders module
 ├─ billing module
 └─ fulfillment module
        ↓
 PostgreSQL (module-owned tables)
```

## Runtime model

One event loop/process per replica; in-process calls are cheap; modules share process fate and deployment but can keep code/data ownership independent.

## Milestones

Boundary map → import rules → module public APIs → transaction ownership → internal events → architecture tests → extraction exercise.

## Acceptance criteria

Build/lint prevents private cross-module import; orders cannot query billing tables directly; domain tests run without HTTP framework; one workflow uses a transaction where single-DB atomicity is valuable; an extraction plan exists for one module.

## Security

Central authentication with module-local authorization policies; tenant context required by repositories; secrets/config scoped where feasible.

## Performance

Measure in-process call/DB overhead and prove no premature network boundaries are needed. Scale whole app horizontally first.

## Testing

Architecture/import tests, module integration tests, cross-module workflow, transaction rollback, internal event failure, extraction contract.

## Failure modes

Shared utility creep, direct table access, global mutable state, mega-service layer, circular module dependencies.

## Observability

Tag logs/spans with module/use case; track module-level latency/errors even in one process.

## Deployment

One immutable artifact; rolling deploy; migrations grouped by module with compatibility sequencing.

## Common mistakes

Folders without enforced boundaries, sharing ORM models, “common” package containing domain logic, extracting service before contract stabilizes.

## Stretch goals

Run one module asynchronously via outbox worker; extract it to a service without changing callers' application contract.

## Interview questions

Why can a monolith be modular? When does extraction become justified? How do transactions change after extraction?

## Design review

Compare this project with Project 8 in operational cost, consistency, latency, deploy independence, and team ownership.
