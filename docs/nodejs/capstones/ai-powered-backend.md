---
title: Capstone 10 — AI-Powered Backend Application
description: A complete Node.js capstone architecture guide covering runtime boundaries, data, APIs, security, reliability, testing, deployment, observability and scaling.
---

# Capstone 10 — AI-Powered Backend Application

## Requirements

Build a tenant-safe AI support assistant with streaming responses, retrieval, tool calling, provider abstraction, background ingestion, evaluations, cost controls and human escalation.

The system must expose documented interfaces, enforce tenant and object-level authorization, validate all external data, propagate request and job identifiers, use bounded resources, support graceful shutdown, and retain enough evidence to recover from partial failure.

## Architecture

```mermaid
flowchart LR
  C1["Chat and streaming API"]
  C2["Context and policy service"]
  C3["Retrieval and vector store"]
  C4["LLM provider adapter"]
  C5["Tool gateway and job queues"]
  C6["Evals and observability"]
  C1 --> C2
  C2 --> C3
  C3 --> C4
  C4 --> C5
  C5 --> C6
```

### Components

- `Chat and streaming API`
- `Context and policy service`
- `Retrieval and vector store`
- `LLM provider adapter`
- `Tool gateway and job queues`
- `Evals and observability`

## Directory Structure

```text
src/
  app/
    bootstrap.ts
    config.ts
  modules/
    domain/
    application/
    adapters/
    transport/
  platform/
    database/
    cache/
    queue/
    telemetry/
  tests/
    unit/
    integration/
    contract/
    e2e/
```

The directory names are examples, not a universal rule. The important contract is dependency direction: transport calls application use cases; application code depends on ports; infrastructure implements those ports; domain rules do not import the HTTP framework or provider SDK.

## Runtime Boundaries

The HTTP or message handler runs JavaScript on the main thread. Network and database operations wait asynchronously. Validation, JSON parsing, serialization, policy evaluation, and domain computation run on the main JavaScript thread. CPU-heavy work must use a bounded worker pool or external service. Every remote call receives a deadline and AbortSignal where supported.

## Database Design

Store conversations, messages, citations, tool calls, retrieval versions, prompts, model/provider metadata, feedback and evaluation results. Keep tenant document indexes isolated.

Use migrations, constraints, indexes driven by query patterns, bounded connection pools, explicit transaction boundaries, and an outbox when a committed business change must cause a reliable asynchronous side effect.

## API Design

Expose conversation, streaming generation, feedback, ingestion and admin evaluation APIs. Use resumable event IDs and explicit model/tool policies.

Use Problem Details-compatible errors, request and correlation IDs, documented pagination, stable error codes, size limits, OpenAPI or equivalent contracts, and idempotency for retryable writes.

## Authentication

Authenticate users and service jobs, authorize every document and tool scope, and require human approval for high-impact actions.

Authentication establishes the principal. Never accept identity, tenant, role, price, entitlement, or ownership merely because a client sent it.

## Authorization

Perform role or permission checks plus resource and tenant checks inside the owning use case. Background jobs and webhooks must carry or reconstruct an authorized system context rather than bypassing policy.

## Validation

Validate HTTP parameters, bodies, files, provider responses, queue messages, database-decoded JSON, configuration, and environment variables. Convert unknown input into domain-specific values before business logic.

## Error Handling

Classify validation, authentication, authorization, conflict, not-found, rate-limit, timeout, transient dependency, and programmer errors. Return safe public errors, preserve internal causes, retry only safe transient failures, and terminate the process when an unknown programmer error leaves state untrustworthy.

## Caching

Cache embeddings, retrieval results and safe deterministic responses with tenant/model/index-version keys; never cache private output across users.

Cache keys must include every dimension that changes visibility or value, including tenant and user scope where relevant. Define TTL, invalidation, stampede protection, stale policy, and cache-outage behavior.

## Background Jobs

Ingest documents, chunk/embed/index, run offline evaluations, retry provider calls, summarize long histories and escalate to humans through durable workflows.

Consumers are idempotent, use bounded concurrency, record attempts, propagate correlation identifiers, acknowledge only after the durable success boundary, and move poison work to a dead-letter or operator workflow.

## Security

Threat-model injection, SSRF, traversal, prototype pollution, mass assignment, broken object authorization, secret leakage, replay, unsafe uploads, dependency compromise, and denial of service. Use least-privilege database, broker, storage, and provider credentials. Redact logs and protect diagnostic artifacts.

## Testing

- unit tests for domain policies and deterministic transformations;
- integration tests against real database, cache, queue, and storage behavior;
- API or message-contract tests for validation, authorization and errors;
- end-to-end tests for critical user journeys;
- duplicate, timeout, cancellation, crash and recovery tests;
- load and soak tests with representative data and dependency latency;
- security tests for negative authorization and malicious input.

## Deployment

Build an immutable artifact on Node.js 24 LTS, run as a non-root process, expose readiness and liveness, handle SIGTERM, stop new work, drain requests and consumers, close pools, and exit within a defined budget. Use expand-contract migrations, canary or rolling rollout, smoke tests, backups and rollback.

## Observability

Emit structured logs, RED metrics, pool and queue saturation, event-loop delay, memory, provider and database latency, business outcome counters, and distributed traces. Define SLOs for the critical journey and alert on user impact rather than every internal fluctuation.

## Failure Scenarios

- provider times out after partial stream
- tool call repeats
- prompt injection attempts data exfiltration
- vector index is stale
- model output violates schema
- cost spike
- tenant document leak

For every scenario, state detection, timeout, retry or no-retry decision, idempotency boundary, degraded behavior, operator action, and recovery verification.

## Scaling Strategy

Apply provider rate and cost budgets, queue ingestion, stream without buffering full output, partition indexes, route models by workload and scale tool execution independently.

Scale only after measuring the first constrained resource. Include database and provider capacity, not only Node replicas.

## Extensions

- Add multi-provider fallback
- Add red-team and regression eval suites
- Add human-in-the-loop approvals and audit replay

## Design Review Questions

- Which invariant must be atomic?
- Where can duplicate execution occur?
- What blocks the main JavaScript thread?
- Which resource saturates first under ten times the load?
- How is tenant isolation enforced at every storage and messaging boundary?
- How does the system recover after a crash between state change and side effect?
