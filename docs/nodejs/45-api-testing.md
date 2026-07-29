---
title: API Testing
---

# API Testing

API tests verify contracts and failure behavior, not just controller functions.

## Real server vs injection

Framework injection is fast and deterministic for routing, validation, auth, serialization, and handlers. Real bound-port tests are necessary for selected behaviors involving sockets, keep-alive, streaming, disconnect, timeouts, TLS, proxies, and shutdown.

## Representative matrix

For `POST /orders` test:

1. valid authenticated request;
2. malformed body/type/size;
3. missing/invalid credentials;
4. authenticated but unauthorized tenant/resource;
5. duplicate idempotency key;
6. DB constraint conflict;
7. DB timeout/cancellation;
8. concurrent duplicate creation;
9. client abort during work;
10. graceful shutdown while request is in flight.

## Fixtures

Create explicit builders/factories with meaningful defaults. Avoid a giant shared fixture whose mutation leaks between tests.

## Contracts

Validate response status, headers, schema, and semantics. For events/webhooks, version schemas and test consumer/provider compatibility.

## Authentication

Test real credential verification in integration coverage, but generate test credentials through supported application helpers rather than copying production secrets.

## Idempotency

Send the same request twice and under concurrent delivery. Verify the promised side effect count, response consistency, and conflict semantics.
