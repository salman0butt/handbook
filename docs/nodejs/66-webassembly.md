---
title: WebAssembly
---

# WebAssembly

WebAssembly (Wasm) is a portable low-level execution format that Node can instantiate and call from JavaScript. It can reuse Rust/C/C++/other compiled logic and provide predictable compute representation, but it is not automatically faster or a complete security sandbox.

```js
const bytes = await readFile('module.wasm');
const {instance} = await WebAssembly.instantiate(bytes, imports);
const result = instance.exports.calculate(42);
```

## Boundary costs

Data crossing between JS and Wasm may require copying, memory views, encoding, and marshaling. Tiny calls in a tight loop can lose to boundary overhead; batch compute where practical.

## Memory

Wasm linear memory is separate from normal JS object graphs. `WebAssembly.Memory` exposes an ArrayBuffer-like region that can grow according to module/platform constraints. Account for this memory when diagnosing process RSS.

## Sandbox misconception

The core Wasm execution model limits direct arbitrary host access, but imported functions/WASI/runtime integrations define capabilities. A module given powerful host imports can perform powerful actions. Combine with OS/container/runtime controls and threat modeling.

## Use cases

- portable compute libraries;
- reuse of existing compiled algorithms;
- deterministic CPU-heavy transforms;
- plugin-like execution with carefully constrained interfaces.

## Native addon comparison

Native addons have deeper host/platform access and potentially lower integration overhead but weaker portability/memory safety. Wasm offers portability and a more constrained execution model but may have boundary/runtime limitations. Measure and threat-model.
