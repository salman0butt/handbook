---
title: 18 — Arrays
---

# 18 — Arrays

Arrays are exotic objects optimized for indexed collections. They have special semantics connecting **array-index properties** and the `length` property, but they are still objects with a prototype chain and arbitrary properties.

```js
const values = [10, 20, 30];
values[1];      // 20
values.length;  // 3
```

## Indexes and length

Canonical array indexes are string property keys in a specific numeric range. Setting an index at or beyond the current end can increase `length`; shrinking `length` attempts to delete indexed properties beyond the new length.

```js
const a = [];
a[3] = 'x';
a.length; // 4
```

This creates a **sparse array** with holes at 0–2. A hole is not the same thing as an own property whose value is `undefined`.

```js
0 in a; // false
const b = [undefined];
0 in b; // true
```

Different array algorithms treat holes differently, so avoid sparse arrays unless you deliberately need their semantics.

## Creation

```js
const a = [1, 2, 3];
const b = Array.of(3);       // [3]
const c = Array.from('abc'); // ['a','b','c']
Array.isArray(a);            // true
```

`new Array(3)` creates length 3 with holes; `Array.of(3)` creates one element with value 3.

`Array.from` creates an array from iterable or array-like input and can map during construction. `Array.fromAsync` does the corresponding asynchronous collection work for async iterables and supported sync inputs, returning a Promise.

## Mutating vs copying APIs

### Mutating

- `copyWithin`
- `fill`
- `pop`, `push`
- `reverse`
- `shift`, `unshift`
- `sort`
- `splice`

### Non-mutating / copying

- `at`
- `concat`
- `entries`, `keys`, `values`
- `every`, `some`
- `filter`
- `find`, `findIndex`, `findLast`, `findLastIndex`
- `flat`, `flatMap`
- `forEach`
- `includes`, `indexOf`, `lastIndexOf`
- `join`
- `map`
- `reduce`, `reduceRight`
- `slice`
- `toReversed`, `toSorted`, `toSpliced`
- `with`

The newer copying methods make immutable-style updates easier:

```js
const sorted = values.toSorted((a, b) => a - b);
const changed = values.with(1, 99);
const removed = values.toSpliced(1, 1);
const reversed = values.toReversed();
```

They return new arrays rather than mutating the receiver, but the copy is still **shallow**.

## Mapping, filtering, reducing

```js
const prices = [100, 250, 75];
const taxed = prices.map(x => x * 1.18);
const large = taxed.filter(x => x > 100);
const total = large.reduce((sum, x) => sum + x, 0);
```

Use `map` for one-to-one transforms, `filter` for selection, `reduce` when an accumulator truly expresses the operation. A complicated `reduce` can be less readable than a loop.

## Search methods and equality

```js
[NaN].includes(NaN); // true (SameValueZero)
[NaN].indexOf(NaN);  // -1 (strict equality)
```

`find`/`findLast` return values, while corresponding `Index` methods return an index or `-1`.

## Sorting

Default `sort()` converts elements to strings and compares their UTF-16 sequences, which surprises numeric code.

```js
[10, 2, 30].sort();               // [10, 2, 30] in string order pattern
[10, 2, 30].sort((a, b) => a-b); // [2, 10, 30]
```

Comparators should be consistent. Mutating `sort` changes the original; prefer `toSorted` when preserving source data matters.

## Iteration

Arrays are iterable, so `for...of`, spread, destructuring, `values`, `entries`, and many consumers use the iterator protocol.

```js
for (const [index, value] of values.entries()) {
  console.log(index, value);
}
```

Do not use `for...in` to iterate array values because it enumerates enumerable property keys, including non-index properties.

## Destructuring and spread

```js
const [first, ...rest] = values;
const copy = [...values];
```

Array spread consumes the iterator and creates a shallow new array. It can materialize holes as `undefined` because iteration yields values for indexes up to length; this is one example of sparse-array APIs differing.

## Mutation during iteration

Each method defines when length is read and whether later changes are visited. Do not generalize one method's mutation behavior to all arrays. If mutation during traversal is unavoidable, document it and test edge cases.

## Performance

Arrays are usually efficient for dense indexed data. Frequent front insertion/removal (`shift`/`unshift`), huge sparse indexes, mixed usage as both list and dictionary, or repeated full-array copying can become expensive. Measure; exact representation strategies are engine-specific.

## Security

Never assume an array received from JSON/API has trusted element shapes. Validate elements at boundaries. Be cautious with enormous attacker-controlled arrays and operations that allocate proportional copies (`flat`, spread, copying sorts) because they can amplify memory/CPU usage.

## Interview checks

1. What is a sparse-array hole vs `undefined`?
2. Which modern methods provide non-mutating alternatives to `sort`, `reverse`, `splice`, and indexed assignment?
3. Why does `includes(NaN)` differ from `indexOf(NaN)`?
4. What is wrong with numeric `.sort()` without a comparator?
5. Why is `[...array]` not a deep clone?

Related: [Equality](./05-equality-and-comparison.md), [Iterators](./builtins-iteration-binary.md#27--iterators-and-iterables), [Structured clone](./browser-javascript.md#61--structured-clone).
