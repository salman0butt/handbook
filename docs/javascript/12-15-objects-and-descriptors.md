---
title: 12–15 — Call/Bind/New, Objects, Descriptors & Integrity
---

# 12–15 — Call/Bind/New, Objects, Descriptors & Integrity

## 12 — `call`, `apply`, `bind`, and `new`

Ordinary functions can be invoked with explicit receivers:

```js
function format(prefix, suffix) {
  return `${prefix}${this.value}${suffix}`;
}

const data = {value: 42};
format.call(data, '[', ']');
format.apply(data, ['[', ']']);
const bracketed = format.bind(data, '[', ']');
bracketed();
```

`call(thisArg, ...args)` invokes immediately. `apply(thisArg, argsArrayLike)` invokes immediately from an array-like argument list. `bind(thisArg, ...leadingArgs)` returns a new **bound function**.

Bound functions can still be constructible when their target is constructible. Under `new`, the bound `thisArg` is ignored because constructor invocation supplies the new receiver; bound leading arguments still participate.

### Constructor invocation mental model

For an ordinary constructible function `C`, `new C(args)` is conceptually like:

```text
1. create a fresh ordinary object
2. choose its [[Prototype]] from C.prototype (or fallback rules)
3. call C with the fresh object as this
4. if C explicitly returns an object, use that object
5. otherwise return the fresh object
```

This is a teaching model; the specification defines `[[Construct]]` and abstract operations precisely.

```js
function User(name) {
  this.name = name;
}
User.prototype.greet = function () {
  return `Hi ${this.name}`;
};

const user = new User('Ava');
```

`new.target` lets a function observe whether/how constructor invocation occurred and identifies the constructor supplied by the construct operation.

```js
function Base() {
  if (!new.target) throw new TypeError('Use new');
}
```

---

## 13 — Objects

Objects are collections of properties plus internal slots/behaviors defined by their object kind. Property keys are **strings or symbols**. Numeric-looking keys are converted to strings.

```js
const key = 'status';
const task = {
  id: 1,
  [key]: 'open',
  method() { return this.status; },
  get label() { return `#${this.id}`; },
  set label(value) { this.id = Number(value); },
};
```

### Own vs inherited

```js
Object.hasOwn(task, 'id'); // true
'id' in task;              // true, own OR inherited
```

Property access conceptually starts on the object and can follow `[[Prototype]]` for inherited lookup. Assignment has more nuanced `[[Set]]` semantics, especially with inherited setters or non-writable properties.

### Enumeration

Do not treat all key APIs as interchangeable:

- `Object.keys` → own enumerable string keys.
- `Object.getOwnPropertyNames` → own string keys, enumerable or not.
- `Object.getOwnPropertySymbols` → own symbols.
- `Reflect.ownKeys` → all own string + symbol keys.
- `for...in` → enumerable string keys including inherited keys.

Modern ordinary-object key ordering is specified for key-producing algorithms: array-index-like keys first in numeric order, then other strings in creation order, then symbols in creation order. Avoid designing external protocols that depend on object-property order when an explicit array/Map is clearer.

### Copying is shallow

```js
const original = {prefs: {theme: 'dark'}};
const copy = {...original};
copy.prefs.theme = 'light';
console.log(original.prefs.theme); // light
```

Object spread copies enumerable own properties into a new ordinary object; it does not preserve the source prototype/descriptors or deep-clone nested values.

### Destructuring

```js
const {id, status: state = 'unknown'} = task;
```

Destructuring is pattern-driven binding/assignment, not object cloning.

---

## 14 — Property Descriptors

Every ordinary property has a descriptor. **Data descriptors** have `value`/`writable`; **accessor descriptors** have `get`/`set`. Both can have `enumerable` and `configurable`.

```js
const account = {};
Object.defineProperty(account, 'id', {
  value: 7,
  writable: false,
  enumerable: true,
  configurable: false,
});
```

A common trap: properties created with `Object.defineProperty` default unspecified boolean attributes to `false`, unlike ordinary assignment/literal creation where writable/enumerable/configurable are normally true.

```js
Object.getOwnPropertyDescriptor(account, 'id');
Object.getOwnPropertyDescriptors(account);
```

`Object.keys`, `values`, and `entries` operate on own enumerable string-keyed properties. `Object.fromEntries` constructs an object from key/value pairs and can create symbol-keyed properties if supplied symbol keys. `Object.hasOwn` is the robust modern own-property check, including objects without `Object.prototype` in their chain.

`Reflect.ownKeys` sees all own keys, including symbols and non-enumerables.

Descriptors explain why an assignment can fail, why a property is missing from enumeration, why a getter executes during reads, and why some built-in properties cannot be reconfigured.

---

## 15 — Object Integrity

Integrity controls are **shallow**.

```js
const config = {nested: {enabled: true}};
Object.freeze(config);
config.nested.enabled = false; // nested object remains mutable
```

- `Object.preventExtensions(obj)` prevents new own properties / prototype-changing operations that require extensibility.
- `Object.seal(obj)` prevents extensions and makes existing properties non-configurable.
- `Object.freeze(obj)` seals and additionally makes own data properties non-writable.

None recursively freezes referenced objects. Private elements are not ordinary properties and have their own semantics.

### Defensive patterns

At trust boundaries, prefer making ownership clear rather than freezing everything indiscriminately:

```js
function createOptions(input) {
  return Object.freeze({...input});
}
```

For nested immutable data, use disciplined copy-on-write updates, domain constructors, or a deliberate deep-freeze utility with cycle handling and clear costs. Large recursive freezing can add startup/update overhead and does not turn mutable external resources into immutable values.

### Security

Prototype pollution often begins when untrusted key/value data is copied into ordinary objects without validating dangerous paths/properties. Use allowlists, `Object.hasOwn`, maps/null-prototype dictionaries where appropriate, and patched parsers/merge utilities. Freezing `Object.prototype` is not a universal fix and can break code.

### Interview checks

1. What does `new` do conceptually?
2. What keys can an object property have?
3. Why does `Object.keys` omit symbols and non-enumerables?
4. What is the difference between `seal` and `freeze`?
5. Why is spread not a deep copy?

Related: [Prototypes](./16-prototypes.md), [Classes](./17-classes.md), [Destructuring/spread](./modern-language-features.md).
