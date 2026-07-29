---
title: Q129–Q192 — Backend, Data, Auth & Security
---

# Q129–Q192 — Backend, Data, Auth & Security

## Important question cards

### Q129. Why can a DB pool exhaust even when the database is healthy?

**Expected answer:** connections may be leaked, transactions/queries may be slow, request concurrency may exceed pool size, or replica count may multiply total connections.

**Senior answer:** inspect active/idle/waiting, query/lock duration, pool acquisition latency, autoscaling math, cancellation, and database max connection capacity. Do not reflexively increase the pool.

**Weak answer:** “The DB needs more connections.”

**Follow-up:** What happens if 50 replicas each configure a pool of 30?

### Q130. Authentication vs authorization?

**Expected answer:** authentication establishes identity; authorization decides what that identity can do on a resource/action.

**Senior answer:** explain trusted identity derivation, tenant/resource policy, data-layer enforcement, denial testing, and why a valid JWT is insufficient.

**Weak answer:** “JWT is authentication and roles are authorization.”

**Follow-up:** Where would you enforce tenant isolation?

### Q131. Why can retries make an outage worse?

**Expected answer:** retries multiply traffic when a dependency is already failing/slow.

**Senior answer:** transient-only policy, exponential backoff + jitter, attempt/time budgets, idempotency, circuit breaking/load shedding, and retry telemetry.

**Weak answer:** “Retry three times.”

**Follow-up:** How do you retry a payment request safely?

### Q132. Why is the Node Permission Model not a sandbox?

**Expected answer:** it restricts selected runtime capabilities for trusted code but Node explicitly does not position it as protection from malicious code.

**Senior answer:** layer with OS users, containers, filesystem/network policy, secret isolation, dependency controls, and version-specific permission auditing.

**Weak answer:** “Enable `--permission` and dependencies cannot escape.”

**Follow-up:** What boundary would you rely on for hostile code?

## Questions

**Q133.** What makes a useful structured log event?

**Q134.** Why should logs use request/correlation IDs?

**Q135.** Which secrets/PII should never be logged by default?

**Q136.** Why are metrics better than one log line per repeated high-volume event?

**Q137.** How should a service parse and validate environment variables?

**Q138.** Why is `Boolean(process.env.FLAG)` usually incorrect?

**Q139.** What built-in `.env` capabilities does modern Node expose?

**Q140.** Why should config normally be parsed once and injected instead of reading `process.env` everywhere?

**Q141.** Why is configuration hot reload a distributed-systems concern?

**Q142.** At which boundaries should runtime validation occur?

**Q143.** Why doesn't a TypeScript assertion validate JSON?

**Q144.** How can validation itself become a denial-of-service vector?

**Q145.** Controllers, application services, domain logic, repositories: what does each own?

**Q146.** Why should database rows/models not automatically be API DTOs?

**Q147.** What makes cursor pagination safer/more scalable than deep offset pagination for many APIs?

**Q148.** What does idempotency mean for an HTTP operation?

**Q149.** How would you implement an idempotency key safely under concurrent requests?

**Q150.** What concerns belong in HTTP middleware and what should remain explicit application logic?

**Q151.** How should API versioning/deprecation be approached?

**Q152.** What does Express add on top of Node HTTP?

**Q153.** Why can huge Express controllers become an architectural problem?

**Q154.** What does proxy trust mean in Express-like deployments?

**Q155.** What are Fastify's plugin encapsulation and schema concepts useful for?

**Q156.** Why can Fastify injection tests be useful, and what do they not test?

**Q157.** What do NestJS modules/providers/controllers model?

**Q158.** Compare Nest guards, pipes, interceptors, and exception filters.

**Q159.** What trade-offs come with dependency-injection containers/framework metadata?

**Q160.** Why should a DB pool be long-lived rather than created per request?

**Q161.** What transaction boundary should a repository/application use case own?

**Q162.** Why are parameterized SQL queries important beyond convenience?

**Q163.** ORM vs query builder vs raw SQL: how do you choose?

**Q164.** What is the N+1 query problem?

**Q165.** Why should a timed-out request try to cancel a still-running DB query where supported?

**Q166.** How can PostgreSQL `bigint` or `numeric` values surprise JavaScript code?

**Q167.** Why should PostgreSQL migrations prefer expand/contract during rolling deployments?

**Q168.** What locking/transaction issues can long PostgreSQL transactions create?

**Q169.** How should MongoDB client/pool lifecycle be managed?

**Q170.** Why does a flexible document model still require indexes and schema discipline?

**Q171.** When are MongoDB transactions useful, and when can document design avoid them?

**Q172.** What production failures should a MongoDB client be prepared for?

**Q173.** Explain cache-aside.

**Q174.** Why is cache invalidation an ownership problem?

**Q175.** What is a cache stampede and how can you mitigate it?

**Q176.** Why are distributed locks/leases dangerous without stale-owner protection/fencing?

**Q177.** Why is Redis pub/sub different from a durable queue?

**Q178.** What are acknowledgements in a job queue?

**Q179.** Why must at-least-once consumers be idempotent?

**Q180.** What belongs in a dead-letter handling process?

**Q181.** How do ordering requirements affect queue concurrency/partitioning?

**Q182.** Command vs event: what semantic difference matters?

**Q183.** Why is “exactly once” often a misleading business guarantee?

**Q184.** What problem does the transactional outbox pattern solve?

**Q185.** How should event schemas evolve over time?

**Q186.** How do WebSocket heartbeats and reconnect/resynchronization differ?

**Q187.** How do you scale WebSocket rooms/topics across Node replicas?

**Q188.** How do you handle a slow WebSocket client safely?

**Q189.** Compare server sessions and JWT-based access tokens.

**Q190.** What security properties should API keys have over their lifecycle?

**Q191.** What are RBAC, ABAC, ownership checks, and resource-level authorization?

**Q192.** Explain SQL/NoSQL injection, path traversal, command injection, SSRF, CSRF, CORS, XSS, prototype pollution, TLS, secret handling, and supply-chain risk as separate threat classes.
