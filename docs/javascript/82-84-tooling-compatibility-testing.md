---
title: 82–84 · Tooling, Compatibility & Testing
description: JavaScript phases 82–84 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 82-84-tooling-compatibility-testing
---

# 82–84 · Tooling, Compatibility & Testing

## 82 · Tooling
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Tooling transforms, bundles, checks, formats, maps, serves, and polyfills JavaScript, but none of those tools change what ECMA-262 itself means. Separate syntax transformation from runtime feature support.

### Mental model / runnable experiment

```js
// 82: Tooling
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **ESLint**
- **Prettier**
- **Babel**
- **bundlers**
- **transpilation**
- **polyfills**
- **source maps**
- **package managers conceptually**
- **development servers**
- **browser compatibility tooling**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Tooling** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 83 · Feature Detection and Compatibility
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

A feature can be standardized before a target runtime implements it. Syntax may need transpilation; built-ins may need polyfills; host APIs may need alternatives. Feature detection and target policy are more robust than user-agent guessing.

### Mental model / runnable experiment

```js
// 83: Feature Detection and Compatibility
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **standards vs implementations**
- **browser compatibility**
- **Baseline-style compatibility concepts**
- **feature detection**
- **polyfills**
- **transpilation**
- **progressive enhancement**
- **graceful degradation**
- **unsupported syntax vs unsupported runtime API**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Feature Detection and Compatibility** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 84 · Testing JavaScript
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Testing combines fast unit tests with integration/browser/end-to-end tests at meaningful boundaries. Determinism requires control over clocks, random data, network, global state, cleanup, and asynchronous completion.

### Mental model / runnable experiment

```js
// 84: Testing JavaScript
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **unit tests**
- **integration tests**
- **browser tests**
- **end-to-end tests**
- **pure function testing**
- **async testing**
- **timers**
- **mocks**
- **spies**
- **test doubles**
- **DOM testing**
- **network mocking**
- **deterministic tests**
- **test isolation**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Testing JavaScript** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
