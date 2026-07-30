---
title: 51–53 · DOM Model, Selection & Manipulation
description: JavaScript phases 51–53 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 51-53-dom-model-selection-manipulation
---

# 51–53 · DOM Model, Selection & Manipulation

## 51 · DOM Mental Model
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

The DOM is a browser host model of document nodes, not part of ECMAScript. HTML parsing creates a DOM tree; JavaScript calls Web APIs to observe or mutate it; the browser then schedules style/layout/paint work.

### Mental model / runnable experiment

```text
HTML source → parser → DOM tree → DOM APIs → mutation → style/layout/paint
```

### Coverage contract

- **Core concept**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **DOM Mental Model** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 52 · DOM Selection and Traversal
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

DOM selection returns Nodes/Elements or collections whose liveness differs by API. Traversal should distinguish element-only relationships from all node types, and selectors should be scoped to the smallest stable root.

### Mental model / runnable experiment

```js
// 52: DOM Selection and Traversal
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **document**
- **Element**
- **Node**
- **querySelector**
- **querySelectorAll**
- **getElementById**
- **children**
- **childNodes**
- **parentElement**
- **siblings**
- **closest**
- **matches**
- **DOM collections**
- **live vs static collections**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **DOM Selection and Traversal** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 53 · DOM Manipulation
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

DOM mutation changes a live document. Prefer text APIs for untrusted content, batch work when measurement proves layout cost, and use fragments/templates for structured creation. `innerHTML` is a parsing sink and can create XSS risk.

### Mental model / runnable experiment

```js
// 53: DOM Manipulation
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **textContent**
- **innerHTML**
- **createElement**
- **append**
- **appendChild**
- **prepend**
- **before**
- **after**
- **replaceWith**
- **remove**
- **cloneNode**
- **classList**
- **attributes**
- **dataset**
- **styles**
- **DocumentFragment**
- **template elements**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **DOM Manipulation** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
