---
title: Node.js Test Runner
---

# Node.js Test Runner

✅ `node:test` is a stable built-in test framework in current Node. It supports tests/subtests, `describe`, hooks, assertions via `node:assert`, filtering, concurrency/isolation controls, mocking, reporters, and programmatic execution.

```js
import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

describe('tax', () => {
  beforeEach(() => {});
  test('calculates total', () => {
    assert.equal(10 + 2, 12);
  });
});
```

```bash
node --test
node --test --test-name-pattern="tax"
node --test --test-reporter=spec
```

## Mocking

The runner includes mock functions/methods and ✅ stable mock timers in current docs. Prefer mocking owned boundaries rather than every internal function.

```js
test('deadline', (t) => {
  t.mock.timers.enable({apis: ['setTimeout', 'Date']});
  let fired = false;
  setTimeout(() => { fired = true; }, 1000);
  t.mock.timers.tick(1000);
  assert.equal(fired, true);
});
```

## Version-sensitive capabilities

As of the Node v26.5.0 docs audited for this handbook:

- ✅ core test runner is stable;
- ✅ `MockTimers` is stable;
- 🧪 `--watch` test mode is marked experimental;
- 🧪 built-in test coverage via `--experimental-test-coverage` is marked experimental;
- 🧪 some newer global setup/randomization/tag/module-mocking features carry early-development/experimental stability labels.

Do not teach an experimental CLI flag as a permanent contract; pin CI Node versions if you depend on it.

## Jest/Vitest still make sense when

Existing ecosystem plugins, browser/jsdom integration, snapshots, transform pipelines, framework tooling, or organization standards provide enough value. “Built in” is a trade-off, not a command to rewrite every suite.
