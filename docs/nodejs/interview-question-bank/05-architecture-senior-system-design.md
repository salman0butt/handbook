---
title: Q257–Q320 — Architecture, Senior Reasoning & System Design
---

# Q257–Q320 — Architecture, Senior Reasoning & System Design

## Important question cards

### Q257. Microservices or modular monolith?

**Expected answer:** choose based on domain/team/deploy/scale boundaries, not trend. A modular monolith preserves in-process calls/transactions and lower operational cost; microservices add independent deployment/ownership at network/distributed-systems cost.

**Senior answer:** identify current constraints, enforce module/data ownership first, extract only where independent scaling/release/ownership justifies it, and explain migration path.

**Weak answer:** “Microservices scale better.”

**Follow-up:** What evidence would make you extract the billing module?

### Q258. How do you diagnose event-loop lag vs CPU saturation vs dependency latency?

**Expected answer:** correlate event-loop metrics, process CPU, profiles, spans, pool wait, DNS/connect, and downstream latency.

**Senior answer:** construct competing hypotheses from p99 timeline, deployment changes, per-endpoint load, GC/memory, thread-pool signals, and dependency telemetry; profile only after narrowing.

**Weak answer:** “Check logs.”

**Follow-up:** CPU is low but event-loop delay is high—what possibilities remain?

### Q259. What should be validated at runtime in a TypeScript Node service?

**Expected answer:** all external/untrusted boundaries: HTTP, env, parsed JSON, queues/events, DB values when guarantees are insufficient, third-party APIs, files, CLI args, IPC.

**Senior answer:** normalize into trusted domain types, bound size/depth before expensive validation, preserve stable validation errors, and enforce critical invariants again in DB/security boundaries.

**Weak answer:** “Nothing if interfaces are typed.”

**Follow-up:** Can a generated API client remove response validation?

### Q260. How would you design a Node platform standard across many teams?

**Expected answer:** runtime LTS policy, service template, config/logging/telemetry/security/shutdown defaults, CI/base image, dependency policy, SLOs, upgrade automation.

**Senior answer:** keep domain logic out of platform libraries, add escape hatches, measure developer experience/adoption, canary platform changes, version contracts, and turn incidents into shared guardrails.

**Weak answer:** “Make one company framework everyone must use.”

**Follow-up:** Which defaults would you enforce centrally and which remain team-owned?

## Questions

**Q261.** What does partial failure mean in a distributed Node system?

**Q262.** Why can a timeout not tell you whether a remote side effect occurred?

**Q263.** How do idempotency keys reduce ambiguity after a lost response?

**Q264.** What consistency/availability trade-offs can replicated storage expose?

**Q265.** Why are wall-clock timestamps insufficient to establish causality across machines?

**Q266.** How should a consumer handle out-of-order versions/events?

**Q267.** What is a saga, and why is compensation not the same as rollback?

**Q268.** What problem does two-phase commit solve, and what costs does it introduce?

**Q269.** What is layered architecture, and where can it become ceremony?

**Q270.** What is a vertical slice architecture?

**Q271.** What are ports and adapters?

**Q272.** Why should dependency direction point toward domain/application policies where practical?

**Q273.** What makes a useful repository abstraction vs a useless pass-through wrapper?

**Q274.** What is a domain entity?

**Q275.** What is a value object?

**Q276.** What is an invariant, and where should it be enforced?

**Q277.** What is an aggregate conceptually?

**Q278.** What are commands, queries, and domain events?

**Q279.** Why should persistence concerns not define the entire domain model?

**Q280.** What operational costs appear when an in-process call becomes a microservice network call?

**Q281.** What does service-owned data mean?

**Q282.** What does deployment independence require beyond separate repositories?

**Q283.** Why can a shared database undermine microservice boundaries?

**Q284.** What benefits does a modular monolith preserve?

**Q285.** How do you enforce module boundaries inside one Node application?

**Q286.** How would you extract one modular-monolith capability into a service?

**Q287.** Vertical vs horizontal scaling: what changes for a Node service?

**Q288.** How should Node replica count, worker count, and CPU limits interact?

**Q289.** Why can adding replicas overload the database?

**Q290.** How do sessions affect stateless horizontal scaling?

**Q291.** What are scaling hot spots that replicas cannot fix?

**Q292.** How do you scale WebSockets while preserving broadcasts and reconnect correctness?

**Q293.** What is the difference between an open and closed load model?

**Q294.** Why does load-test warmup matter?

**Q295.** Where is the useful capacity point relative to total collapse?

**Q296.** How would you investigate a sudden CPU spike after a deployment?

**Q297.** How would you investigate growing RSS with stable request volume?

**Q298.** How would you investigate DB pool acquisition wait increasing while DB CPU is low?

**Q299.** How would you investigate DNS failures affecting only some replicas?

**Q300.** How would you investigate a queue whose depth and oldest-message age are both increasing?

**Q301.** Why is synchronous fs in a request path an anti-pattern but sometimes acceptable at process startup?

**Q302.** Why is a giant global `utils` folder an ownership smell?

**Q303.** Why is global mutable in-memory state a scaling/testing risk?

**Q304.** Why are framework-driven folders not automatically architecture?

**Q305.** What is the Result pattern, and when can exceptions be clearer?

**Q306.** What is command/query separation without full CQRS infrastructure?

**Q307.** What is a graceful-shutdown manager pattern?

**Q308.** What should a structured backend error taxonomy include?

**Q309.** What belongs in organization-wide Node runtime governance?

**Q310.** What belongs in a shared service template?

**Q311.** How should a staff engineer govern API/event schema compatibility?

**Q312.** What are performance budgets for a Node platform?

**Q313. Coding:** Implement a concurrency limiter that runs at most N async jobs and preserves result order. What failure/cancellation semantics will you define?

**Q314. Coding:** Implement a Transform stream that rejects lines larger than a configured size without buffering the entire file.

**Q315. Coding:** Implement idempotent graceful shutdown that handles SIGINT/SIGTERM, an HTTP server, DB pool, and queue consumer with a hard deadline.

**Q316. Output reasoning:** Given nested `nextTick`, Promise microtasks, timers, and immediates, identify guaranteed ordering vs context-dependent ordering and explain why.

**Q317. Trick/misconception:** If an API returns a Promise, does that prove it uses a background thread? Explain with examples.

**Q318. Trick/misconception:** If TypeScript compiles without errors, can you trust a queue message as your interface type? Why not?

**Q319. System design:** Design a multi-tenant order API in Node for 20k RPS with PostgreSQL, Redis, queue workers, idempotent payments, observability, and rolling deployments. Identify first likely bottlenecks and failure modes.

**Q320. System design:** Design a globally used real-time collaboration/operations system with Node WebSocket gateways, reconnect/resync, durable events, horizontal scaling, authorization, backpressure, and incident recovery. Defend where state lives and how upgrades remain compatible.
