---
title: Full-Stack Next.js, Node & Data Round
sidebar_position: 4
description: A full-stack mock round covering Next.js UI/server boundaries, database correctness, HTTP APIs, jobs, integrations, concurrency, and operations.
---

# Full-Stack Next.js, Node & Data Round

## 0–10 — Feature design

**Prompt:** Design a team project feature where users create projects, invite collaborators, upload files and generate reports.

Expected:

```text
App Router routes
Server Components for reads
Server Actions for app-owned mutations
Route Handlers for upload callbacks/public HTTP
DAL/commands
DB
object storage
queue/worker
telemetry
```

## 10–20 — Data model and transactions

Ask candidate to model:

```text
User
Tenant
Membership
Project
ProjectMember
File
ReportJob
```

Follow-ups:

- How do you prevent cross-tenant reads?
- Which unique constraints matter?
- Where do transactions start/end?
- What happens if two admins invite the same user concurrently?

## 20–30 — HTTP and integration boundaries

**Prompt:** The product integrates with an external document processor.

Ask:

```text
synchronous API or job?
timeouts/retries?
idempotency?
webhook verification?
provider adapter?
reconciliation?
```

Strong answer separates external transport from canonical business state.

## 30–40 — Node/runtime concerns

Questions:

1. How should DB clients/pools behave in a long-lived Node process?
2. Why is process-local memory unsafe for shared distributed state?
3. What can native dependencies change about deployment?
4. What is `serverExternalPackages` for?
5. How do graceful shutdown and connection draining interact?

## 40–50 — Failure drill

**Scenario:** Report requests spike 20× and the DB pool saturates.

Expected reasoning:

```text
contain/load shed
inspect queue/request rate
bound worker concurrency
separate interactive from batch capacity
optimize queries
backpressure
SLO/alert
```

## 50–60 — Release design

Ask candidate to explain:

```text
DB expand/contract migration
immutable Next build
worker rollout
queue compatibility
cache versioning
canary metrics
rollback
```

## Scorecard

0–3 each:

```text
frontend/server ownership
data model
transactions/concurrency
HTTP/integrations
Node/runtime
jobs/resilience
security/tenancy
release/operations
```

Strong full-stack candidates connect browser UX to canonical backend invariants and operational consequences.