---
title: Q377–Q384 · Output Prediction
description: JavaScript output-prediction interview questions explained from language and host mechanisms.
id: 04-output-prediction-q377-q384
---

# Q377–Q384 · Output Prediction

## Q377 — What prints for Promise jobs and a timer?
```js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
```
- **Level:** Senior
- **Category:** event loop / Promise Jobs
- **Expected answer:** In a browser-like host: `A`, `D`, `C`, `B`.
- **Reasoning:** Synchronous code completes first; the Promise reaction is a microtask/Job processed before the later timer task.
- **Common incorrect answer:** `A B C D` because the timer was registered first.
- **Follow-up:** What part is guaranteed by ECMAScript and what part belongs to the browser host?
- **Related handbook chapter:** chapter 34

## Q378 — What happens when a method is detached?
```js
'use strict'
const obj = {x: 7, getX() { return this.x }}
const fn = obj.getX
console.log(obj.getX())
console.log(fn())
```
- **Level:** Advanced
- **Category:** `this` / Reference Records
- **Expected answer:** The first log is `7`; the detached strict-mode call throws a TypeError when reading `this.x` because `this` is `undefined`.
- **Reasoning:** Method-call syntax preserves the base as receiver; assigning the function loses that reference base.
- **Common incorrect answer:** Both calls print `7` because the function remembers its object.
- **Follow-up:** How would `fn.call(obj)` change the result?
- **Related handbook chapter:** chapters 11 and 65

## Q379 — What does loose equality do here?
```js
console.log([] == false)
```
- **Level:** Intermediate
- **Category:** coercion / equality
- **Expected answer:** `true`.
- **Reasoning:** Abstract Equality converts the array to a primitive empty string, then numeric conversion makes both sides `0`.
- **Common incorrect answer:** `false` because arrays are truthy.
- **Follow-up:** Why is truthiness alone insufficient to explain `==`?
- **Related handbook chapter:** chapters 04 and 05

## Q380 — What do signed zero comparisons print?
```js
console.log(0 === -0)
console.log(Object.is(0, -0))
```
- **Level:** Intermediate
- **Category:** equality algorithms
- **Expected answer:** `true` then `false`.
- **Reasoning:** Strict Equality treats signed zeros as equal; SameValue, used by `Object.is`, distinguishes them.
- **Common incorrect answer:** Both APIs implement the same equality algorithm.
- **Follow-up:** Which relation does `Array.prototype.includes` use?
- **Related handbook chapter:** chapter 05

## Q381 — What does this closure loop print?
```js
const fns = []
for (let i = 0; i < 3; i++) fns.push(() => i)
console.log(fns.map(fn => fn()))
```
- **Level:** Intermediate
- **Category:** lexical bindings / closures
- **Expected answer:** `[0, 1, 2]`.
- **Reasoning:** `for` with a lexical declaration creates per-iteration bindings captured by the closures.
- **Common incorrect answer:** `[3, 3, 3]` because closures always share one loop variable.
- **Follow-up:** How would a `var i` version differ and why?
- **Related handbook chapter:** chapters 02 and 10

## Q382 — What happens with a sparse array?
```js
const a = Array(2)
console.log(a.length)
console.log(a.map(() => 1))
console.log([...a])
```
- **Level:** Advanced
- **Category:** sparse arrays / iteration
- **Expected answer:** Length is `2`; `map` preserves two holes because its callback is not invoked for absent elements; spread produces `[undefined, undefined]` through array iteration.
- **Reasoning:** Holes are absent indexed properties, and different algorithms handle absence differently.
- **Common incorrect answer:** A hole is identical to an explicit `undefined` element for every array operation.
- **Follow-up:** Compare `map`, `for...of`, and `includes` on sparse arrays.
- **Related handbook chapter:** chapter 18

## Q383 — What does `finally` return?
```js
function f() {
  try { return 'try' }
  finally { return 'finally' }
}
console.log(f())
```
- **Level:** Advanced
- **Category:** completion records / `finally`
- **Expected answer:** `finally`.
- **Reasoning:** The abrupt return completion from `finally` replaces the earlier return completion from `try`.
- **Common incorrect answer:** `try` because the return value is fixed before `finally` executes.
- **Follow-up:** What happens if `finally` throws instead?
- **Related handbook chapter:** chapter 07

## Q384 — What happens in this cyclic-module scenario?
```js
// a.js
import {b} from './b.js'
export const a = b + 1
// b.js
import {a} from './a.js'
export const b = a + 1
```
- **Level:** Staff / architecture
- **Category:** ESM cycles / initialization
- **Expected answer:** The graph can link, but evaluation attempts to read a live lexical binding before it is initialized, producing a ReferenceError rather than a generic 'cycles are illegal' error.
- **Reasoning:** ESM separates linking/instantiation from evaluation and preserves live bindings with TDZ-like initialization semantics.
- **Common incorrect answer:** Circular imports are syntax errors, or imports are copied as `undefined` snapshots.
- **Follow-up:** How would you redesign the modules to keep the cycle legal and initialization-safe?
- **Related handbook chapter:** chapter 36
