---
title: JavaScript Version Baseline
---

# JavaScript Version Baseline

**Checked:** 30 July 2026.

The published language baseline for this handbook is **ECMAScript 2026, ECMA-262 17th edition (June 2026)**. The living specification at `tc39.es/ecma262/` is the source for finished Stage-4 additions after an annual snapshot. Internationalization is standardized separately by **ECMA-402**.

## Reading feature status

A proposal reaching Stage 4 means its design is finished and eligible for inclusion in the language standard; it does **not** mean every browser/runtime has shipped it. Every newer API should therefore be checked along two axes: **specification status** and **implementation availability**.

| Area | Baseline | Availability guidance |
|---|---|---|
| Core ECMAScript | ECMA-262 17th edition | Standard baseline |
| Living ECMAScript | Annual snapshot + finished Stage-4 work | Re-check before relying on very new syntax/APIs |
| Temporal | Stage 4 | Standardized; rollout differs by engine/runtime |
| Explicit resource management | Standardized | Check target engines for `using`, `await using`, stacks, symbols |
| Iterator helpers | Standardized | Check target runtime/browser matrix |
| Set methods | Standardized | Modern runtimes; feature-detect for older targets |
| `Promise.withResolvers` | Standardized | Modern runtimes; compatibility check for older targets |
| `Promise.try` | In ECMAScript 2026 | Check target runtime/browser matrix |
| Import attributes | Standardized syntax | Host/module-loader support matters too |
| `Intl` APIs | ECMA-402 | Data and API support can vary by runtime build |

## Host boundary

`Array`, `Promise`, `Map`, `Proxy`, modules, syntax, and abstract operations belong to ECMAScript. DOM, `fetch`, timers, storage, workers, and browser events are Web APIs defined by other standards and supplied by the browser host. Node.js supplies its own host APIs. Some host APIs appear in multiple runtimes, but that does not move them into ECMA-262.

## Compatibility workflow

1. Determine whether the feature is standardized or still a proposal.
2. Find the relevant ECMA-262/ECMA-402 section or TC39 proposal status.
3. Check the target engines/runtimes, not just one browser.
4. Distinguish unsupported **syntax** from a missing **runtime API**.
5. Use feature detection/polyfills where semantically possible; transpilation can transform syntax but cannot magically reproduce every host/runtime capability.
