---
title: Testing Fundamentals
---

# Testing Fundamentals

A backend test strategy verifies pure logic, integration boundaries, protocols, concurrency, and production lifecycle.

## Layers

- **unit:** domain/application behavior in memory;
- **integration:** real DB/cache/filesystem/HTTP adapter behavior;
- **end-to-end:** deployed-ish entrypoint through meaningful dependencies;
- **contract:** compatibility between service/provider/consumer boundaries.

## Determinism

Control time, randomness, IDs, external services, and mutable global state. Prefer dependency injection/fakes over patching implementation details.

## Test database

Use isolated schemas/databases/containers or rollback strategies that match real semantics. Mocking SQL cannot prove migrations, indexes, constraints, type mapping, or transaction behavior.

## Fake timers

Fake timers make time-dependent unit tests fast and deterministic, but they can hide event-loop/network behavior. Use them for scheduler logic, then include real integration tests for actual timeouts/cancellation.

## Network tests

Use in-process injection when validating handlers quickly, plus selected real-socket tests for headers, streaming, disconnects, TLS/proxy behavior, and graceful shutdown.

## Subprocess tests

CLI/process code should be tested as a child process to verify exit codes, signals, stdout/stderr, and environment handling.

## Failure paths

Every important feature deserves dependency timeout, malformed input, unauthorized caller, concurrent update, duplicate request/job, cancellation, and shutdown tests where relevant.
