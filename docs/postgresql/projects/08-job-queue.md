---
id: project-08-job-queue
title: "Project 8 — Job Queue"
---

# Project 8 — Job Queue

## Requirements

Build a concurrent worker queue with scheduling, priority, retries, leases, idempotency, dead-letter/final failure handling, and observability. Multiple workers must claim disjoint jobs without a coordinator.

## ER diagram

```text
Job 1──< JobAttempt
Job → optional Tenant
Job → optional IdempotencyKey
```

## Schema

```sql
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  tenant_id uuid,
  queue text NOT NULL,
  status text NOT NULL CHECK (status IN ('ready','running','succeeded','failed','dead')),
  priority integer NOT NULL DEFAULT 0,
  run_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts integer NOT NULL CHECK (max_attempts > 0),
  lease_expires_at timestamptz,
  idempotency_key text,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (queue, idempotency_key)
);
CREATE INDEX jobs_claim_idx
ON jobs(queue, priority DESC, run_at, id)
WHERE status = 'ready';
```

## Claim transaction

```sql
WITH picked AS (
  SELECT id
  FROM jobs
  WHERE queue = $1
    AND status = 'ready'
    AND run_at <= now()
  ORDER BY priority DESC, run_at, id
  FOR UPDATE SKIP LOCKED
  LIMIT $2
)
UPDATE jobs j
SET status = 'running',
    attempts = attempts + 1,
    lease_expires_at = now() + interval '2 minutes'
FROM picked
WHERE j.id = picked.id
RETURNING j.*;
```

Commit immediately after claiming; do not hold DB row locks during minutes of external work.

## Seed / SQL / concurrency

Seed 100k jobs across priorities/queues/tenants. Run 20 workers and prove unique claims. Implement retry backoff, expired lease recovery, dead queue, queue depth, oldest-ready age, success rate, and per-tenant fairness queries.

## EXPLAIN

Verify partial claim index, impact of priority ordering, bloat after high churn, and cleanup/archive plans. Compare one hot queue to partitioned/separate queues only after measurement.

## Tests/security/failures

Worker crash after claim, crash after external side effect before success mark, duplicate enqueue, poison job, lease expiry race, retry storm, starvation, DB restart, blocked worker transaction. Workers receive DML only on queue tables; admin/requeue privileges separate.

## Acceptance criteria

No job is concurrently leased to two healthy workers; duplicate external effects are prevented by idempotency at the effect boundary; queue metrics/cleanup/vacuum plan documented; concurrency load test passes.

## Interview / senior review

Why `SKIP LOCKED` is appropriate here but not for a financial report? How do leases differ from locks? When should this queue move to a broker? What table/index churn and autovacuum settings would you monitor?