---
title: 16 — Prototypes
---

# 16 — Prototypes

JavaScript's inheritance model is **prototype delegation**. Classes are syntax and semantics built on top of that object model; they do not replace it.

```text
instance
   ↓ [[Prototype]]
Constructor.prototype
   ↓ [[Prototype]]
Object.prototype
   ↓
null
```

## `[[Prototype]]` vs `.prototype`

Every ordinary object has an internal `[[Prototype]]` that is another object or `null`. You can inspect it with `Object.getPrototypeOf(obj)` and create a chosen chain with `Object.create(proto)`.

A constructible function normally has a public property named `.prototype`. That object is commonly used as the `[[Prototype]]` of instances created with `new FunctionName()`.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hi ${this.name}`;
};

const u = new User('Ava');
Object.getPrototypeOf(u) === User.prototype; // true
```

`User.prototype` is not “the prototype of User.” The function object `User` itself has its own internal prototype (usually `Function.prototype`).

## Property lookup

```js
const base = {role: 'reader'};
const user = Object.create(base);
user.name = 'Ava';

user.role; // inherited from base
```

Conceptually, an ordinary property read checks the receiver's own property and, if not found, walks the prototype chain until the property is found or the chain reaches `null`.

```text
user own keys: name
   ↓ no role
base own keys: role
   ↓ found
```

Getters complicate the mental model usefully: an inherited getter is found on a prototype, but its `this` receiver can still be the original object.

## Shadowing

```js
user.role = 'admin';
user.role; // own property shadows inherited role
base.role; // still 'reader'
```

Creating an own property can shadow inherited data. Assignment can behave differently if an inherited non-writable data property or setter intercepts the operation; use `Reflect.set` and descriptor reasoning for difficult cases.

## `Object.create(null)`

A null-prototype object has no inherited `Object.prototype` methods or conventional pollution-sensitive keys.

```js
const dictionary = Object.create(null);
dictionary.safe = true;
Object.hasOwn(dictionary, 'safe'); // true
```

It can be useful as a dictionary, though `Map` is often clearer when key/value collection semantics are desired.

## Prototype mutation

```js
Object.setPrototypeOf(obj, proto);
```

Changing an existing object's prototype is legal in many cases but generally discouraged in performance-sensitive production code. Engine optimizations rely on stable structural assumptions; prototype mutation can invalidate those assumptions. Prefer establishing the prototype at creation time.

The legacy `__proto__` accessor is standardized only for web compatibility/Annex B contexts and should not be the primary API for modern code.

## Prototype pollution

Prototype pollution occurs when attacker-controlled keys modify a shared prototype or otherwise inject inherited properties into objects that code later trusts.

```js
// dangerous conceptual merge pattern
for (const key in userInput) {
  target[key] = userInput[key];
}
```

Risk increases with recursive merge/path-setting code handling names such as `__proto__`, `constructor`, and `prototype`. Defensive design includes allowlisting schema fields, using safe maintained parsers/mergers, avoiding inheritance-sensitive membership checks, preferring `Object.hasOwn`, and using `Map` or null-prototype objects where appropriate.

## Method sharing

Prototype methods avoid creating the same method function per instance:

```js
function Counter() {
  this.value = 0;
}
Counter.prototype.increment = function () {
  return ++this.value;
};
```

Class methods have similar sharing behavior because they are installed on `ClassName.prototype`.

## Performance mental model

Do not micro-optimize by cargo cult. Stable prototypes and predictable object structures are generally optimizer-friendly, but exact hidden-class/shape strategies are engine implementation details rather than ECMAScript guarantees. Measure real workloads.

## Senior reasoning

When a property access surprises you, inspect:

1. the receiver object,
2. its own descriptor for the key,
3. each prototype descriptor in order,
4. getter/setter behavior,
5. whether a Proxy changes internal-method behavior.

That model explains inheritance, classes, method lookup, `instanceof`, object capability patterns, and pollution risks.

### Interview checks

- Distinguish `obj.[[Prototype]]` from `Ctor.prototype`.
- How can an inherited method use instance state?
- What does property shadowing mean?
- Why is `Object.setPrototypeOf` usually avoided in hot application code?
- What makes prototype pollution a security issue?
