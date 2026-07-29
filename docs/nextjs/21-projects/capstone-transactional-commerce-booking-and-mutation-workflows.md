---
title: Capstone — Transactional Commerce, Booking & Mutation Workflows
sidebar_position: 3
description: Build a transactional product that proves forms, Server Actions, transactions, idempotency, optimistic UI, external integrations, webhooks, and failure recovery.
---

# Capstone — Transactional Commerce, Booking & Mutation Workflows

Build a product with real state transitions, for example:

```text
commerce checkout
appointment booking
travel reservation
subscription purchase
marketplace order flow
```

The domain can vary, but the project must include money-like or scarce-resource semantics where duplicate writes and races matter.

## Core journey

Example booking flow:

```text
browse availability
→ choose option
→ enter details
→ validate
→ reserve
→ external payment/provider step
→ confirmation
→ webhook reconciliation
```

## Route structure

Suggested routes:

```text
/catalog
/item/[id]
/checkout
/order/[id]
/account/orders
/api/webhooks/provider
```

Use Server Components for read-heavy screens and narrow Client Components for interactive forms/optimistic UX.

## Mutation architecture

Business writes should live in application commands, not directly inside UI adapters.

```text
Server Action
→ validate input
→ authenticate
→ command
→ transaction
→ outbox/event
→ cache invalidation
→ return/redirect
```

Route Handlers remain appropriate for public/provider HTTP contracts.

## Required mutation cases

Implement at least:

```text
create reservation/order
update customer details
cancel before cutoff
confirm after provider callback
retry/reconcile failed external state
```

## Idempotency

Every operation that may be retried must define idempotency.

Use a stable idempotency key for operations such as payment/order creation.

Test:

```text
same request twice
network retry
browser double submit
provider webhook replay
worker retry
```

Correct result:

```text
one canonical business transition
```

not “two successful API calls.”

## Transaction boundaries

Document which invariants require one database transaction.

Example:

```text
create order
reserve inventory/slot
persist idempotency record
write outbox event
```

Do not perform long external network calls inside DB transactions unless absolutely necessary.

## External provider pattern

Use an adapter boundary:

```ts
interface PaymentProvider {
  createIntent(input: CreateIntentInput): Promise<CreateIntentResult>
  refund(input: RefundInput): Promise<RefundResult>
}
```

This keeps provider SDK details out of domain policy and makes failure testing easier.

## Webhook endpoint

Required behavior:

```text
raw/request body handling as provider requires
signature verification
timestamp/replay protection
idempotent processing
bounded body size
safe failure response
telemetry
```

Do not trust webhook JSON merely because it came from a known URL.

## Progressive enhancement

At least one critical form should remain meaningfully submit-capable without depending on a complex client state machine.

Use Server Actions/forms where appropriate.

## Form state

Use modern React/Next patterns for:

```text
pending state
expected validation errors
field-level feedback
success state
optimistic projection where safe
```

Do not use optimistic UI for irreversible state that the server has not accepted unless rollback is robust.

## Optimistic UI

Good candidates:

```text
quantity change
draft note
wishlist toggle
non-scarce preference
```

Riskier candidates:

```text
payment captured
seat definitively reserved
inventory guaranteed
```

For risky state, communicate “pending confirmation” rather than pretending success is final.

## Concurrency

Simulate races:

```text
two users reserve final slot
same user clicks submit twice
cancel and confirm happen concurrently
webhook arrives before browser redirect
```

Define canonical outcomes.

## State machine

Model order/reservation states explicitly.

Example:

```text
draft
→ pending_payment
→ confirmed
→ cancelled
→ refunded
```

Reject invalid transitions.

## Cache policy

Public catalog/availability may be cached, but scarce availability needs a freshness strategy aligned with correctness.

Never let a cached “available” result become the sole source of truth for the transaction.

The command must re-check the invariant against canonical storage.

## Authorization

Required checks:

```text
user can view own order
user cannot view another user's order
user can cancel only allowed state
admin/support capability is explicit
webhook bypasses user auth but requires provider authenticity
```

## CSRF and origin safety

Use framework-supported Server Action protections and secure cookies/session behavior.

For Route Handler mutations, define CSRF/origin/auth strategy explicitly.

## PII/data minimization

Store only necessary customer information.

Logs must not contain:

```text
full payment credentials
session secrets
raw sensitive provider payloads unless strictly controlled
```

## Failure scenarios

Implement UX/system handling for:

```text
provider timeout
payment declined
DB transaction conflict
slot gone
webhook delayed
webhook duplicated
confirmation email failure
queue unavailable
```

Distinguish expected business failures from infrastructure exceptions.

## Durable side effects

Secondary work such as:

```text
email
analytics
CRM sync
invoice generation
```

should not necessarily block the primary transaction.

Use outbox/event/queue architecture where durability matters.

## Reconciliation

Include a reconciliation job or admin action that can compare:

```text
internal order state
vs
provider state
```

and safely repair mismatches.

This is a strong production-engineering signal.

## Observability

Track:

```text
order/reservation state transition
idempotency result
provider request latency
provider error class
webhook processing outcome
queue lag
reconciliation discrepancies
release ID
```

Use business identifiers carefully; avoid leaking sensitive data.

## Testing

### Unit

```text
state transitions
pricing/fee policy
cancellation rules
idempotency decision logic
```

### Integration

```text
transaction behavior
unique constraints
outbox writes
provider adapter fake
webhook verification
```

### E2E

```text
successful checkout
validation failure
provider decline
double submit
account order view
cancel/refund path
```

### Concurrency

At least one automated test should prove the scarce-resource race is resolved correctly.

## Performance

Measure:

```text
checkout route client JS
mutation latency
DB query count
provider latency contribution
post-submit navigation freshness
```

Do not over-cache correctness-critical transaction reads.

## Deployment

Document:

```text
provider sandbox/production config
secret rotation
webhook URL rollout
DB migration compatibility
worker deployment
queue DLQ
rollback
```

## Required ADRs

```text
ADR: Server Actions vs Route Handlers
ADR: idempotency key design
ADR: transaction/outbox boundary
ADR: optimistic UI policy
ADR: provider reconciliation strategy
```

## Stretch goals

```text
multi-currency display without storing unsafe floating money math
partial refunds
promo rules
inventory holds with expiry
admin reconciliation dashboard
fraud/risk provider adapter
```

## Interview story

Explain one race condition end to end:

```text
request
→ auth
→ invariant check
→ transaction/constraint
→ external side effect
→ idempotency
→ UI reconciliation
```

If you can defend that flow, you are demonstrating production full-stack engineering rather than CRUD.