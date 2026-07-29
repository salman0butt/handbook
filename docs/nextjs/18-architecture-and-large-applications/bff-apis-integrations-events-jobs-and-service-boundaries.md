---
title: BFF, APIs, Integrations, Events, Jobs & Service Boundaries
sidebar_position: 6
description: Decide what stays in one Next.js application, what becomes an HTTP API, what moves to background processing, and when a separate service boundary is justified.
---

# BFF, APIs, Integrations, Events, Jobs & Service Boundaries

Next.js can serve UI, Server Components, Server Actions, and Route Handlers in one application.

That does not mean every backend responsibility belongs inside the same runtime forever.

The official Backend-for-Frontend guide frames Next.js server capabilities as an API layer, not a full replacement for every backend architecture.

The senior design question is:

> Which responsibility should remain in-process, which should cross HTTP, and which should run asynchronously?

## 1. Default to in-process when ownership is shared

If one Next.js deployment owns both a Server Component and its data-access layer:

```text
Server Component
→ DAL/query
→ database
```

is usually simpler than:

```text
Server Component
→ HTTP Route Handler
→ same application
→ DAL
→ database
```

The extra HTTP hop adds serialization, latency, failure handling, tracing, and authentication complexity without creating a real ownership boundary.

## 2. Use Route Handlers when HTTP is the product contract

A Route Handler is appropriate when the consumer is genuinely outside the in-process call graph:

```text
mobile app
browser client polling
partner integration
webhook provider
public API
another service
```

Route Handlers are public endpoints and need normal API security assumptions.

## 3. Server Actions are UI mutation adapters

Server Actions are useful for mutations initiated from the Next.js UI.

They are not automatically the canonical integration API for every consumer.

A good pattern:

```text
form / client event
→ Server Action
→ application command
```

A mobile/public API can reuse the same command through a Route Handler:

```text
HTTP request
→ Route Handler
→ application command
```

The command is the reusable business boundary.

## 4. Separate transport from business semantics

Example product operation:

```text
invite member
```

Possible transports:

```text
Server Action
REST Route Handler
admin CLI
background reconciliation job
```

Do not reimplement invite policy in every transport.

## 5. Internal APIs need explicit trust too

“Internal” does not mean trusted by default.

A service-to-service API may still require:

```text
service authentication
authorization
mTLS/network policy where appropriate
request validation
rate/capacity limits
idempotency
tracing
```

Network location is not a sufficient security boundary.

## 6. Use adapters around third-party providers

Provider SDK code should not spread across the feature graph.

```text
billing command
→ PaymentGateway interface
→ provider adapter
```

Example:

```ts
export interface PaymentGateway {
  charge(input: ChargeRequest): Promise<ChargeResult>
}
```

The adapter can translate provider-specific responses into application-level outcomes.

## 7. Preserve provider details only when they matter

Over-abstraction can hide useful semantics.

If the product genuinely needs:

```text
payment requires 3DS
provider rate limit
provider retry-after
webhook event ID
```

model those explicitly rather than forcing every provider into an unrealistically generic interface.

## 8. Timeouts are architecture, not helper functions

Every external synchronous dependency should have a latency budget.

```text
request budget 2.5s
├─ auth 100ms
├─ DB 300ms
├─ provider 1s
└─ render/network margin
```

An unbounded provider call can consume the whole user request.

## 9. Classify dependencies as required or optional

Required:

```text
payment authorization during checkout
```

Optional:

```text
recommendations
CRM enrichment
analytics write
```

Optional dependencies should not automatically fail the entire page/command.

Use degraded UI or asynchronous delivery where product semantics allow it.

## 10. Move non-critical side effects off the critical path

Example:

```text
create order transaction
→ commit
→ durable event/outbox
→ worker sends email / syncs CRM / analytics
```

Do not make order creation depend synchronously on four unrelated SaaS providers unless those calls are actually required for correctness.

## 11. `after()` is not a durable queue

A post-response hook can be useful for lightweight non-blocking work tied to the request lifecycle.

Durable business work that must survive process termination belongs in queue/worker infrastructure.

Use the right delivery guarantee.

## 12. Events describe facts

Good event names describe completed business facts:

```text
project.created
member.invited
invoice.paid
```

Avoid event names that merely expose implementation details:

```text
database_row_updated
button_clicked_on_server
```

Event schemas are contracts.

## 13. Commands and events are different

```text
command → please do something
event   → something happened
```

Example:

```text
SendInvoice command
InvoiceSent event
```

A consumer of an event should not have to guess whether it is being asked to perform the original transaction.

## 14. Use idempotent event consumers

At-least-once delivery can produce duplicates.

Consumers should use:

```text
event ID
processed-event table
idempotent upsert
business idempotency key
```

according to the operation.

## 15. Avoid synchronous distributed transactions

Trying to make one request atomically commit across:

```text
primary DB
payment provider
CRM
email provider
analytics
```

creates brittle failure semantics.

Keep the authoritative transaction small, then coordinate secondary systems through durable events/workflows.

## 16. Service boundaries should follow independent ownership

A separate service is justified when it needs real independence such as:

```text
separate scale profile
separate availability target
separate data/regulatory boundary
separate team ownership
independent release lifecycle
different runtime/technology
```

Do not split a service merely because a folder has many files.

## 17. Distributed systems add costs

A new service creates:

```text
network latency
partial failure
service authentication
API versioning
observability correlation
deployment coordination
retry/idempotency concerns
local development complexity
```

A modular monolith is often the correct intermediate architecture.

## 18. Define data ownership before service extraction

Before extracting Billing, answer:

```text
Which tables does Billing own?
Who may write them?
How do other capabilities read billing state?
What events are emitted?
What is the migration plan?
```

If every service still directly writes the same shared tables, the service boundary is mostly cosmetic.

## 19. API contracts need compatibility rules

For independently deployed consumers/providers, prefer additive evolution:

```text
add optional field
support old + new during rollout
version only when semantics truly diverge
```

Avoid coordinated “deploy both at exactly the same second” requirements.

## 20. Event contracts need compatibility too

Do not rename/remove fields from an event while old consumers may still be processing them.

Use:

```text
schema version
defaults
additive fields
consumer tolerance
migration window
```

according to your event system.

## 21. API aggregation belongs close to the consumer

A BFF can aggregate several backend capabilities into the exact UI shape needed by one frontend.

```text
browser
→ Next.js BFF
→ account service
→ billing service
→ reporting service
```

But a Server Component can often perform this aggregation directly on the server without exposing a browser-facing HTTP endpoint.

The BFF pattern is about ownership, not requiring JSON for every server read.

## 22. Avoid N+1 across services

A distributed version of N+1 is especially expensive:

```text
list 100 projects
→ 100 billing HTTP requests
```

Use:

```text
batch APIs
bulk reads
precomputed read models
service-owned joins where possible
eventually consistent projection
```

## 23. Read models can cross ownership without write coupling

A reporting dashboard may need data from several domains.

Instead of giving Reporting write access to every source database, build a read model through:

```text
batch query APIs
events into warehouse/projection
analytics pipeline
```

Keep write authority with source domains.

## 24. Webhooks need an ingress boundary

Webhook Route Handler responsibilities:

```text
raw-body/signature verification
size/content checks
replay/idempotency
provider event mapping
enqueue/dispatch internal work
fast response
```

Do not put an entire long-running workflow inside the webhook HTTP request.

## 25. Job payloads are contracts

Queue messages should be stable, minimal, and versionable.

Prefer:

```json
{
  "type": "generate_export",
  "jobVersion": 2,
  "tenantId": "t_1",
  "exportId": "x_1"
}
```

rather than serializing a huge mutable database object.

The worker can load current authoritative data using stable IDs.

## 26. Workflow orchestration vs choreography

### Choreography

```text
OrderCreated
→ billing consumer
→ email consumer
→ analytics consumer
```

Simple for independent reactions.

### Orchestration

```text
workflow owner
→ reserve inventory
→ charge payment
→ create shipment
→ compensate on failure
```

Better when sequence, state, retries, and compensation are part of one business process.

Choose deliberately.

## 27. Cross-service tracing

Carry correlation context through:

```text
HTTP headers
queue metadata
event envelope
```

so a production incident can trace:

```text
browser → Next.js → service → queue → worker → provider
```

Do not log sensitive payloads to achieve correlation.

## 28. Senior review questions

### Why not use Route Handlers for every data read?

Because Server Components can call server data sources directly. HTTP should represent a real transport/consumer boundary, not an internal ceremony tax.

### When does a module deserve a service boundary?

When independent scaling, failure isolation, ownership, data, compliance, or release lifecycle justify distributed-system complexity.

### Should emails run in `after()`?

Only if losing the work is acceptable under that platform/process lifecycle. Required durable delivery belongs in queue/workflow infrastructure.

## Production checklist

- [ ] in-process calls remain in-process when no real transport boundary exists
- [ ] Route Handlers represent genuine HTTP contracts
- [ ] Actions/HTTP/jobs reuse application commands rather than duplicate policy
- [ ] provider SDKs are isolated where useful
- [ ] external dependencies have timeout/failure budgets
- [ ] non-critical side effects leave the user critical path
- [ ] durable work uses durable infrastructure
- [ ] service extraction has explicit data and ownership reasons
- [ ] API/event/job schemas have compatibility rules
- [ ] distributed calls avoid N+1/fan-out explosions
- [ ] traces correlate across network and async boundaries

## Exercise

Design an order workflow involving:

```text
Next.js storefront
inventory
payments
email
analytics
shipping
```

Classify each interaction as:

1. in-process call
2. synchronous API
3. command
4. event
5. durable job/workflow

and justify every boundary.
