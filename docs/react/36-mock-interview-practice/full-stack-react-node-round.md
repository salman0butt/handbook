---
title: Full-Stack React + Node Interview
sidebar_position: 5
description: A full-stack mock interview spanning React, APIs, Node.js, databases, auth, async workflows, testing, deployment, and architecture.
---

# Full-Stack React + Node Interview

This round is for full-stack roles where React is only one half of the system.

## Interview plan

```text
0–15 min   React/frontend
15–30 min  Node/API design
30–45 min  database/auth/security
45–60 min  full-stack debugging
60–80 min  system design
80–90 min  behavioral + candidate questions
```

## Frontend questions

1. How do you choose between local state, URL state, server state, Context, and an external store?
2. Why is an Effect not the default place to fetch or derive data?
3. How do optimistic mutations work, and what happens on failure?
4. How do Suspense and Transitions improve user experience without replacing network control?
5. How would you build a reusable form flow with pending, validation, success, and server errors?

## Backend questions

### API design

Design endpoints for:

- list projects;
- fetch one project;
- create project;
- update project;
- archive project;
- add/remove members;
- stream project activity.

Strong answers discuss:

- resource boundaries;
- HTTP semantics where appropriate;
- idempotency;
- pagination;
- filtering/sorting;
- validation;
- authorization;
- error shape;
- versioning/evolution.

### Async work

**When should a request do work inline vs enqueue a background job?**

Expected reasoning:

- latency tolerance;
- durability;
- retries;
- user feedback;
- duplicate execution/idempotency;
- observability;
- failure recovery.

## Database questions

### Scenario

You need to model:

- users;
- organizations;
- organization memberships;
- projects;
- project members;
- tasks;
- comments;
- audit events.

Ask:

- what are the primary relationships?
- where are unique constraints needed?
- what should be indexed?
- how do you prevent cross-tenant reads?
- how would soft deletion affect queries?
- where would transactions matter?

## Authentication vs authorization

**Question:** A user is logged in. Can they call any Server Function/API route?

Expected: no.

Authentication proves identity. Authorization checks whether that identity may perform the specific operation on the specific resource.

Strong candidates also mention:

- tenant scoping;
- role/permission checks;
- runtime validation;
- server-side enforcement;
- never trusting hidden buttons or client state as authorization.

## Full-stack debugging scenario

A user clicks **Save**. Sometimes:

- UI shows success;
- database still contains old data;
- retrying creates duplicate audit events.

Ask the candidate to investigate.

Good reasoning may cover:

- optimistic UI incorrectly treated as authoritative;
- request timeout after backend commit;
- retry without idempotency;
- transaction boundaries;
- stale cache invalidation;
- race between concurrent updates;
- telemetry/request IDs.

## System design prompt: multi-tenant workflow SaaS

Requirements:

- React frontend;
- Node API;
- PostgreSQL;
- role-based access;
- realtime notifications;
- file uploads;
- background processing;
- audit log;
- search;
- billing integration;
- 100k organizations;
- gradual rollout of new features.

Candidate should discuss:

### Frontend

- route/module boundaries;
- state ownership;
- server-state caching;
- forms/mutations;
- optimistic UI;
- accessibility;
- error boundaries;
- observability.

### Backend

- service/module boundaries;
- validation;
- authorization;
- queues/jobs;
- idempotency;
- rate limiting;
- logs/traces;
- API compatibility.

### Database

- tenant keys;
- indexes;
- migrations;
- transactions;
- audit immutability trade-offs;
- pagination strategy.

### Realtime

- websocket/SSE choice;
- reconnect;
- missed-event recovery;
- ordering;
- duplicate events;
- client subscription ownership.

### Security

- secrets;
- uploads;
- unsafe URLs;
- XSS;
- CSRF/session model where applicable;
- authorization on every resource mutation.

## Coding task

Implement or sketch a mutation flow that:

- submits a project rename;
- shows pending state;
- prevents accidental duplicate submission;
- validates on the server;
- handles authorization failure;
- reports errors accessibly;
- updates the UI after success;
- remains correct if the request is retried.

The strongest answers connect frontend pending/optimistic state with backend idempotency and authoritative server response.

## Scoring

### Mid full-stack

Can implement normal React + API + database workflows correctly.

### Senior full-stack

Can reason about races, authorization, transactions, queues, cache consistency, observability, and frontend UX together.

### Lead full-stack

Can design boundaries that multiple teams can own, evolve APIs safely, reduce blast radius, and plan migrations/rollbacks.