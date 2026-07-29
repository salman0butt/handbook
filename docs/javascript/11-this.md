---
title: 11 — this
---

# 11 — `this`

For ordinary functions, `this` is primarily determined by **how the function is called**, not where the function was defined. Arrow functions are the major exception: they do not create their own `this` binding and instead use the surrounding lexical `this`.

## Call-site mental model

```js
function show() {
  return this?.name;
}

const user = {name: 'Ava', show};
user.show(); // 'Ava' — method call reference provides receiver

const detached = user.show;
detached();  // undefined in strict mode because this is undefined
```

The same function object can receive different `this` values at different call sites.

## Four useful call patterns

### Plain call

```js
'use strict';
function f() { return this; }
f(); // undefined
```

In sloppy ordinary function calls, legacy rules can substitute/globalize `this`; do not depend on them. Modules and class bodies are strict.

### Property-reference / method call

```js
const obj = {
  value: 3,
  read() { return this.value; },
};
obj.read(); // 3
```

The important thing is the call expression still carries the property reference.

### Explicit call

```js
function read(prefix) {
  return `${prefix}${this.value}`;
}

read.call({value: 7}, '#');
read.apply({value: 7}, ['#']);
```

`bind` creates a new bound function with stored `this` and optional leading arguments.

### Constructor call

```js
function User(name) {
  this.name = name;
}
const u = new User('Ava');
```

`new` supplies a newly created receiver linked to the constructor's prototype (plus constructor-return rules).

## Arrow functions: lexical `this`

```js
const counter = {
  value: 0,
  later() {
    return () => ++this.value;
  },
};

const increment = counter.later();
increment(); // 1
```

The arrow captures the `this` of `later`; `.call()`/`.bind()` cannot replace an arrow's lexical `this`.

Do not use an arrow as an object method when the method is supposed to receive the object dynamically:

```js
const bad = {
  value: 1,
  read: () => this?.value,
};
```

## Classes

Class prototype methods are ordinary methods with strict semantics. They are not automatically bound to instances.

```js
class Counter {
  value = 0;
  increment() { return ++this.value; }
}

const c = new Counter();
const fn = c.increment;
// fn(); // TypeError: this is undefined in method body
```

A public field arrow such as `increment = () => ++this.value` creates a per-instance function that lexically captures that instance's `this`, trading allocation/identity behavior for convenient binding.

## Event handlers: host behavior

In browser `addEventListener`, a non-arrow listener called by the browser commonly receives `this === event.currentTarget`. This is **Web API behavior**, not an ECMA-262 rule. Prefer `event.currentTarget` for explicitness.

```js
button.addEventListener('click', function (event) {
  console.log(event.currentTarget === this);
});
```

## Detached methods and callbacks

```js
const {read} = obj;
read(); // receiver relationship was lost
```

Fix according to contract: call as `obj.read()`, pass a wrapper `() => obj.read()`, bind once, or design methods that do not depend on dynamic `this`.

## Senior model: Reference Records

Conceptually, evaluating `obj.method` can produce a property reference carrying both the base (`obj`) and referenced value (`method`). When that reference is immediately called, the base informs `this`. Assigning the function to `fn` evaluates and stores only the function value; later `fn()` no longer has `obj` as the call reference base.

```text
obj.method()         const fn = obj.method; fn()
    │                           │
reference base=obj              function value only
    ↓                           ↓
this=obj                       this=undefined (strict plain call)
```

## Interview checks

1. Explain `this` from the call site rather than “the owning object.”
2. Why does destructuring a method often break it?
3. Can `bind` change an arrow's `this`?
4. Are DOM listener `this` semantics part of JavaScript itself?

Related: [Functions](./09-functions.md), [Reference Records](./internals-and-specification.md#65--reference-records), [call/apply/bind/new](./12-15-objects-and-descriptors.md#12--call-apply-bind-and-new).
