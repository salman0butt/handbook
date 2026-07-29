---
title: 17 — Classes
---

# 17 — Classes

JavaScript classes provide structured syntax and semantics for creating constructor/prototype relationships, inheritance, fields, private elements, and static initialization. They still use the language's prototype system.

```js
class User {
  #token;
  role = 'user';
  static count = 0;

  constructor(name, token) {
    this.name = name;
    this.#token = token;
    User.count++;
  }

  greet() {
    return `Hi ${this.name}`;
  }

  get authenticated() {
    return Boolean(this.#token);
  }

  static fromJSON(data) {
    return new User(data.name, data.token);
  }
}
```

`greet` and the getter are installed on `User.prototype`. Public instance fields are created per instance. Static fields/methods belong to the constructor object. Private elements use language-enforced private names and are not ordinary string properties.

## Declarations and expressions

```js
class A {}
const B = class NamedForDebugging {};
```

Class declarations are lexical declarations and have TDZ-like behavior: the class binding cannot be used before initialization. Class bodies run under strict semantics.

## Constructors and derived classes

Base class constructors receive a constructed receiver as `this`. A derived constructor must call `super()` before accessing `this` because `super()` performs the base construction step that initializes the derived receiver.

```js
class Admin extends User {
  constructor(name, token, permissions) {
    super(name, token);
    this.permissions = permissions;
  }
}
```

A derived constructor that returns an object has specialized rules; do not use that as ordinary style.

## `extends` and `super`

`extends` establishes both instance-side and constructor-side prototype relationships. `super.method()` performs a property lookup starting from the superclass side while preserving the current receiver.

```js
class Base {
  describe() { return this.name; }
}
class Child extends Base {
  describe() { return `Child:${super.describe()}`; }
}
```

`super` is syntax with special semantics, not an ordinary variable.

## Public fields

```js
class Counter {
  value = 0;
  increment = () => ++this.value;
}
```

Public fields are own instance properties. An arrow field is therefore created per instance and captures lexical `this`; a prototype method is shared. Choose based on behavior and identity needs, not habit.

## Private fields and methods

```js
class Vault {
  #secret;
  constructor(secret) { this.#secret = secret; }
  #normalize(x) { return String(x).trim(); }
  matches(x) { return this.#secret === this.#normalize(x); }
}
```

`#secret` is not equivalent to `_secret` or a Symbol. Access is syntax-checked against the declaring class's private names. Private elements are not discoverable through normal property enumeration/Reflect APIs.

## Static initialization blocks

```js
class Registry {
  static entries = new Map();
  static {
    Registry.entries.set('default', {enabled: true});
  }
}
```

Static blocks run during class evaluation and can coordinate initialization with access to class private state.

## Class evaluation mental model

Conceptually class evaluation creates a constructor function plus a prototype object, defines methods/accessors/private names/static elements, links inheritance where requested, then initializes static elements. Exact behavior is defined by ECMA-262 algorithms; avoid reducing classes to “just syntax sugar” because fields, private names, derived constructors, `super`, and class initialization add important semantics.

## Classes vs factory/composition design

Classes are useful when instances share behavior and nominal construction/inheritance relationships are meaningful. Factories/closures can be simpler when encapsulation, explicit dependencies, or composition dominate.

```js
function createCounter() {
  let value = 0;
  return {increment: () => ++value, read: () => value};
}
```

Neither style is universally superior. Prefer clear ownership and stable APIs over hierarchy depth.

## Performance and security

Prototype methods share function objects across instances. Instance fields/arrow functions allocate per instance. Private fields provide language-level access control, but they are not encryption and do not protect secrets from code that legitimately executes inside the class or from compromised process/page state.

## Interview checks

1. Do classes replace prototypes?
2. Why must a derived constructor call `super()` before using `this`?
3. Where are class methods stored?
4. How do `#private` fields differ from naming conventions and Symbols?
5. When would composition be preferable to `extends`?

Related: [Prototypes](./16-prototypes.md), [`this`](./11-this.md), [OOP JavaScript](./paradigms-patterns-browser.md#49--object-oriented-javascript).
