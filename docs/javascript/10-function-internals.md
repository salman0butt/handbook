---
title: 10 — Function Internals, Scope & Closures
---

# 10 — Function Internals, Scope & Closures

Functions make more sense when you stop imagining variables as copied text and instead reason about **execution contexts**, **lexical environments**, and **bindings**.

```text
global / module lexical environment
        ↓ outer
outer function environment
        ↓ outer
inner function environment
        ↓
closure retains reachable bindings
```

## Call stack and execution contexts

When a function is called, the engine evaluates it using a function execution context. The running execution context contains links to lexical state, private state where relevant, the Realm, script/module information, and other specification machinery. Engines may implement this differently internally; the model explains observable behavior, not a required memory layout.

```js
function outer(a) {
  const x = a * 2;
  return inner(x);
}

function inner(value) {
  return value + 1;
}

outer(5); // 11
```

Conceptually calls nest:

```text
[global]
   ↓ calls outer
[outer]
   ↓ calls inner
[inner]
   ↑ return
[outer]
   ↑ return
[global]
```

A sufficiently deep recursive call chain can exhaust implementation stack resources and throw `RangeError` in common engines.

## Lexical scope

Scope is determined by source nesting, not by who calls whom.

```js
const label = 'global';

function make() {
  const label = 'make';
  return function read() {
    return label;
  };
}

const read = make();
read(); // 'make'
```

`read` resolves `label` through the lexical environment chain captured when `read` was created. Calling it elsewhere does not change that outer lexical environment.

## Closures retain bindings

A closure is not a frozen copy of values. It keeps access to bindings.

```js
function counter() {
  let value = 0;
  return {
    read: () => value,
    increment: () => ++value,
  };
}

const c = counter();
c.increment();
c.read(); // 1
```

Both functions observe the same `value` binding.

## Closures in loops

Lexical declarations in a `for` loop can get fresh per-iteration bindings.

```js
const callbacks = [];
for (let i = 0; i < 3; i++) {
  callbacks.push(() => i);
}
callbacks.map(fn => fn()); // [0, 1, 2]
```

With `var`, all callbacks in this pattern share one function/global binding and commonly observe the final value.

## Parameter environments

Default parameters are evaluated during function-call setup and can expose edge cases different from ordinary function-body bindings.

```js
function f(a, b = a) {
  return b;
}
f(3); // 3
```

Do not build APIs that depend on obscure parameter-scope tricks; understand them for specification reasoning and debugging.

## Purity and side effects

A pure function's result depends only on inputs and it has no observable side effects. JavaScript does not enforce purity, but separating pure computation from I/O/DOM/network state improves testing and architecture.

```js
const subtotal = items => items.reduce((sum, item) => sum + item.price, 0);
```

## Memory implications

Closures keep **reachable state** alive, not necessarily an entire lexical world forever. A leak occurs when long-lived roots retain data that is no longer useful—for example a listener closure capturing a large DOM subtree or cache.

```js
function install(button, hugeModel) {
  const handler = () => render(hugeModel);
  button.addEventListener('click', handler);
  return () => button.removeEventListener('click', handler);
}
```

Cleanup lets the captured graph become unreachable when no longer needed.

## Senior reasoning

Use four questions:

1. Which lexical environment contains the binding?
2. When was the binding initialized?
3. Which function object has that environment as its outer environment?
4. What live references keep that function—and therefore captured state—reachable?

This model explains closures, TDZ, shadowing, callbacks, module bindings, memory retention, and much of `this` once reference/call semantics are added.

### Interview checks

- Does a closure capture values or bindings?
- Why do `let` loop closures differ from `var` loop closures?
- Is the JavaScript “call stack” specification wording identical to an engine's physical machine stack?
- How can a closure cause a memory leak without closures themselves being leaks?
