---
title: REST API Engineering
---

# REST API Engineering

Build the contract first, framework second.

```text
HTTP request
   ↓ routing + transport validation
controller/handler
   ↓
application service / use case
   ↓
domain rules
   ↓
repository / external adapters
   ↓
DB / APIs / queue
```

Controllers translate HTTP concerns; services coordinate use cases; repositories/adapters own infrastructure interaction. DTOs are transport contracts, not automatically domain entities.

## HTTP semantics

Use method semantics intentionally. `GET` should not mutate. `PUT`/idempotent operations support safer retries. `POST` workflows that may be retried can use idempotency keys tied to authenticated caller + operation scope.

## Collections

Pagination must have deterministic ordering. Cursor/keyset pagination usually scales better than deep offset for changing large datasets. Define filter/sort allow-lists and index them intentionally.

## Middleware

Middleware is appropriate for cross-cutting transport concerns such as request IDs, authentication parsing, rate limiting, body limits, and telemetry. Avoid hiding domain workflow in a long global middleware chain.

## Versioning

Prefer backward-compatible evolution when feasible. Breaking changes need explicit contract/version/deprecation strategy and consumer observability.

## Security

Authenticate, authorize at resource/action level, validate bodies/query/path parameters, cap request size, use timeouts, prevent injection, protect secrets, and log safely.

## Test matrix

Happy path is insufficient. Test validation, authn/authz, not-found/conflict, dependency timeout, idempotent retry, concurrent update, payload limits, disconnect/cancellation, and shutdown behavior.
