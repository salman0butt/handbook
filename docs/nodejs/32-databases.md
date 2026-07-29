---
title: Databases
---

# Databases

Database integration is mostly capacity, correctness, transaction, cancellation, and failure-boundary engineering—not “await a query.”

## Connection pools

```text
many HTTP requests
      ↓
application concurrency
      ↓
bounded DB connection pool
      ↓
database connection/session capacity
```

A pool is a semaphore around a scarce remote resource. If request concurrency exceeds pool capacity, callers queue. If the pool is oversized across many replicas, the database can be overwhelmed.

## Transaction ownership

Keep a transaction scoped to one business unit of work and one acquired connection/session where required by the driver.

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await saveOrder(client, order);
  await reserveInventory(client, order.items);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

Never return a pooled connection without cleanup. A leaked client is capacity loss.

## Timeouts and cancellation

Set deadlines at application and database layers where supported. A timed-out HTTP request whose query keeps running still consumes DB resources. Propagate cancellation carefully and understand the driver's guarantees.

## Prepared statements

Parameterized queries separate data from SQL syntax and are the default defense against SQL injection. Prepared execution may also improve parse/plan costs depending on driver/database behavior.

## ORM vs query builder vs raw SQL

Choose based on domain complexity, SQL capability, migrations, observability, team expertise, and escape hatches. No abstraction removes the need to understand indexes, transactions, isolation, locking, query plans, and pool saturation.

## N+1

A loop that performs one query per row can turn a 10 ms endpoint into hundreds of network round trips. Batch/join/preload based on access patterns.

## Retries

Retry only transient failures, only with bounded backoff/jitter, and only when the operation is safe to repeat or protected by idempotency/transaction semantics.
