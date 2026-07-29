---
title: 60-Minute Senior Next.js Round
sidebar_position: 3
description: A complete senior Next.js technical round across rendering, data, caching, mutations, security, performance, testing, deployment, and debugging.
---

# 60-Minute Senior Next.js Round

## 0–5 — Architecture walkthrough

**Prompt:** Draw the lifecycle for an authenticated dashboard route from browser request to interactive UI.

Expected areas:

```text
reverse proxy/CDN
Proxy if matched
route-tree match
session/authz
DAL/cache/data
RSC render
Suspense/streaming
HTML initial load
client chunks/hydration
Router Cache on later navigation
```

## 5–12 — Rendering and RSC

Questions:

1. Server Component vs SSR?
2. What does `'use client'` change in the module graph?
3. How can server-produced children appear inside a Client Component?
4. What is RSC/Flight conceptually?
5. Why should applications not parse private Flight payloads?

Strong answer distinguishes public mental models from private wire details.

## 12–20 — Data and cache

**Scenario:** A project dashboard reads profile, projects, plan and analytics.

Ask candidate to design:

```text
parallel vs sequential reads
DAL boundaries
React cache/preload
Cache Components
request-time authenticated work
Suspense placement
```

Follow-up:

> A tenant changes plan and only some screens update. How do you design invalidation?

Score for semantic tags/freshness ownership and Router Cache awareness.

## 20–28 — Mutations

**Prompt:** Design “invite member” and “change role.”

Expected:

```text
Server Action as UI adapter
schema validation
session
role/tenant authorization
transaction
idempotency where relevant
audit/outbox
cache invalidation
expected UI error
```

Follow-up: What changes for a public REST/mobile endpoint?

## 28–35 — Security

Rapid scenarios:

```text
valid user changes project ID to another tenant
remote image URL is attacker-controlled
webhook is replayed
redirect target comes from query string
admin support bypass exists
```

Candidate should identify IDOR, SSRF, replay/idempotency, open redirect and explicit auditable admin capabilities.

## 35–42 — Performance

**Scenario:** p50 is fine, p99 is terrible under load.

Ask:

```text
Where do you look?
What evidence?
Could Promise.all be responsible?
Could cache changes be responsible?
How do DB pools affect tail latency?
```

Strong answer mentions traces, pool wait, fan-out, upstream tail latency, stampedes and backpressure.

## 42–48 — Testing

Ask candidate to place tests for:

```text
authorization policy
DAL query
Server Action
Route Handler webhook
Proxy matcher
streaming route
parallel/intercepting route modal
```

Strong answer chooses the cheapest reliable layer and real browser for framework behavior.

## 48–54 — Deployment

**Scenario:** self-hosted containers behind nginx, three replicas, shared DB and Redis.

Ask about:

```text
standalone output
assets
streaming buffering
graceful shutdown
cache coordination
Server Action keys/version skew
health/readiness
rolling rollout
```

## 54–58 — Debugging

**Prompt:** Only soft navigation shows stale data; hard refresh is correct.

Expected reasoning:

```text
classify Router Cache/client navigation
check mutation invalidation/refresh contract
inspect network/RSC request
compare hard vs soft lifecycle
add regression E2E
```

## 58–60 — Reflection

**Prompt:** Name one Next.js optimization you would refuse until you had evidence.

Strong answers could discuss:

```text
broad caching
Edge migration
memoization
global dynamic imports
microservices/Multi-Zones
```

## Scorecard

0–3 each:

```text
rendering/RSC
data/cache
mutations
security
performance
testing
deployment
debugging
communication
```

### Senior pass
Average ≥ 2.2, no correctness/security category below 2.

### Excellent
Average ≥ 2.6 and candidate consistently explains trade-offs, failure behavior and evidence rather than framework slogans.