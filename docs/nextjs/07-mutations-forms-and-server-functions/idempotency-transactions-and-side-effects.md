---
title: Idempotency, Transactions & Side Effects
description: Design reliable Server Actions for duplicate requests, transactional integrity, external side effects, retries, and durable mutation workflows.
---

# Idempotency, Transactions & Side Effects

A mutation is reliable only if it behaves correctly when the network, user, database, or downstream services behave imperfectly.

The happy path is not enough.

```text
submit once
  ↓
server succeeds
  ↓
UI updates
```

Production reality includes:

```text
double click
browser retry
proxy retry
network timeout after server commit
multiple tabs
concurrent users
partial downstream failure
```

## Idempotency

An operation is idempotent when repeating the same logical request does not create additional unintended effects.

Naturally idempotent-ish:

```text
set project name to "Alpha"
mark task completed
set preference = dark
```

Not naturally idempotent:

```text
charge card £25
create order
send invitation
append audit event
provision VM
```

These need explicit duplicate protection.

## UI disabling is not idempotency

This helps UX:

```tsx
<button disabled={pending}>Pay</button>
```

But it does not stop:

- repeated HTTP requests
- another browser tab
- scripted calls
- retries after timeout

Server-side guarantees are still required.

## Idempotency keys

For high-impact create operations:

```text
client creates logical operation ID
  ↓
action submits ID
  ↓
server stores/claims key
  ↓
repeated same key returns same result
```

Example shape:

```ts
type CreatePaymentInput = {
  idempotencyKey: string
  invoiceId: string
}
```

The key must be scoped to the correct actor/resource and protected by server constraints.

## Database unique constraints

Sometimes the database can enforce the invariant directly.

Example:

```text
one membership per (userId, organisationId)
```

Use a unique constraint so two concurrent actions cannot create duplicate memberships.

Application checks alone can race.

## Transactions

Use transactions when several writes form one logical invariant.

```text
create order
reserve inventory
create order items
record payment intent reference
```

If these must succeed/fail together inside one database, wrap them transactionally.

But a database transaction cannot atomically include arbitrary external services.

## External side effects

Consider:

```text
DB write
+ payment provider
+ email
+ analytics
```

There is no ordinary cross-system ACID transaction across all of these.

Define ordering and recovery explicitly.

## Outbox pattern

For important downstream events:

```text
DB transaction
  ├── domain state write
  └── outbox event write
          ↓
background worker
          ↓
email / webhook / queue / search index
```

This ensures the durable intent to perform the side effect commits with the database state.

A Server Action can complete after the transaction while a worker handles downstream delivery.

## Do not hold user requests open for durable work unnecessarily

Bad:

```text
form submit
  ↓
15 external calls
  ↓
30-second response
```

If only the core write is required for user success, move secondary work into a queue/durable workflow.

## Retry safety

Before retrying a failed mutation, ask:

```text
Did the server definitely fail before commit?
Or did the client merely fail to receive the success response?
```

If uncertain, blind retry can duplicate effects.

That is why idempotency keys matter for payments/orders/provisioning.

## State-machine guards

For workflows:

```text
draft → submitted → approved → fulfilled
```

Actions should enforce valid transitions.

Bad:

```ts
await db.order.update({ data: { status: requestedStatus } })
```

Better:

```text
approveOrder
cancelOrder
fulfillOrder
```

Each action verifies current state and permission.

## Conditional updates

Prevent stale mutation:

```ts
const result = await db.document.updateMany({
  where: {
    id,
    version: expectedVersion,
  },
  data: {
    body,
    version: { increment: 1 },
  },
})

if (result.count === 0) {
  return { status: 'conflict' }
}
```

This detects concurrent edits instead of silently overwriting them.

## Pessimistic locking

For some critical invariants, lock rows/resources during the transaction.

Trade-offs:

- stronger serialization
- longer lock duration
- deadlock risk
- reduced throughput

Use only where domain correctness requires it.

## Side effect ordering

Example purchase:

```text
validate
  ↓
authorize
  ↓
create payment intent
  ↓
commit order state
  ↓
queue email
  ↓
invalidate cache
  ↓
redirect
```

The exact order depends on provider guarantees and your compensation strategy.

Do not copy a generic sequence without understanding failure cases.

## Compensation

When a distributed workflow partially succeeds:

```text
inventory reserved
payment failed
```

Possible compensation:

```text
release reservation
```

For workflows where rollback is impossible, model reconciliation instead.

## Audit before/after state

For important mutations, logs may need:

```text
actor
resource
operation
old state summary
new state summary
result
correlation ID
```

Keep sensitive fields out of logs.

## Cache invalidation after transaction

Invalidate only after committed state is authoritative.

```text
transaction commit
  ↓
updateTag / revalidateTag / revalidatePath
```

If invalidation occurs before commit and the write later fails, consumers can refetch misleading state.

## Redirect after required work

Likewise:

```text
required write
  ↓
required invalidation
  ↓
redirect
```

Non-critical side effects can be asynchronous.

## File-processing mutations

For uploaded files:

```text
receive metadata/upload reference
  ↓
validate ownership/type
  ↓
store durable record
  ↓
queue virus scan/processing
  ↓
state = processing
```

Avoid making a single action synchronously decode/transform huge files unless that is truly appropriate for the runtime/deployment.

## Common mistakes

### “User can only click once”

False assumption.

### Check-then-insert without unique constraint

Two requests can race.

### Retrying non-idempotent external calls blindly

Can duplicate real-world effects.

### Treating DB transaction as distributed transaction

External services are outside it.

### Doing all side effects before responding

Hurts latency and reliability if those effects are not required for core success.

## Mutation failure matrix

For every high-value action, write:

| Failure point | State after failure | Safe retry? | Recovery |
| --- | --- | --- | --- |
| validation | no write | yes after fix | user corrects input |
| DB before commit | none | usually | retry/idempotency |
| DB committed, response lost | committed | only if idempotent | return prior result |
| email failed | core state committed | yes via queue | retry worker |
| cache invalidation failed | DB fresh, cache stale | yes | repair invalidation |

This design work prevents incident-time guesswork.

## Debugging checklist

1. Reproduce double submission.
2. Simulate timeout after commit.
3. Submit same idempotency key twice.
4. Race two conflicting updates.
5. Fail downstream email/payment/search integration independently.
6. Confirm transaction rollback behaviour.
7. Confirm cache invalidation occurs after commit.
8. Confirm audit logs identify operation without secrets.
9. Confirm retries cannot duplicate irreversible effects.
10. Confirm state-machine transitions reject invalid current states.

## Interview questions

**Why isn't disabling the submit button enough for payments?**  
Because duplicate requests can still occur outside that UI path; idempotency must be enforced server-side/provider-side.

**What does a database transaction solve?**  
Atomicity and consistency for operations inside that database transaction; it does not automatically cover external providers.

**What is the outbox pattern?**  
Commit domain state and an event record together, then have a durable worker deliver downstream side effects.

**How would you avoid lost updates?**  
Use version checks/conditional writes, transactions, locks, or domain-specific merge rules.

## Exercise

Design the mutation lifecycle for:

```text
checkout order
invite member
publish article
upload invoice
provision workspace
```

Document transaction scope, idempotency key, side effects, retry policy, cache invalidation, and failure recovery.
