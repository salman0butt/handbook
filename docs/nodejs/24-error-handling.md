---
title: Error Handling
---

# Error Handling

Errors are part of API design. A robust Node service distinguishes invalid input, expected business outcomes, dependency failures, programmer defects, cancellation, and process-level corruption.

```js
class DependencyError extends Error {
  constructor(message, { cause, dependency }) {
    super(message, { cause });
    this.name = 'DependencyError';
    this.dependency = dependency;
  }
}
```

Use `cause` to preserve the original failure while adding context. `AggregateError` represents multiple failures where the aggregate is meaningful.

## Operational vs programmer error

The terms are heuristics, not a perfect taxonomy:

- expected/operational: timeout, validation failure, remote 503, missing file;
- programmer/invariant: impossible state, undefined access, broken assumption.

Do not catch a programmer defect and return “500 but continue forever” if application state may be invalid.

## Async propagation

Return or await Promises. Detached work needs explicit ownership and reporting.

```js
try {
  await repository.save(order);
} catch (cause) {
  throw new DependencyError('saving order failed', {cause, dependency: 'postgres'});
}
```

## Central HTTP mapping

Domain/application errors should be mapped to HTTP at the transport boundary, not created as `res.status(409)` deep inside repositories.

## Process-level strategy

For an uncaught exception, record minimal reliable diagnostics, mark unhealthy if possible, terminate, and let a supervisor restart. Do not attempt complex asynchronous recovery from unknown state.

## Never swallow

```js
try { await importantWork(); }
catch (err) { console.log(err); } // failure vanished from caller
```

Either handle the failure fully, translate it, retry under policy, or rethrow/return it.
