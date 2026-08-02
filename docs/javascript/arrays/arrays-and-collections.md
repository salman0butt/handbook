---
title: Arrays and Collections
description: Arrays, Maps, Sets, weak collections, typed arrays and practical complexity.
slug: /javascript/arrays/arrays-and-collections
---

# Arrays and Collections

Choose a collection by access pattern and ownership, not habit.

| Structure | Best for | Typical cost |
|---|---|---|
| Array | ordered dense sequence | index O(1), search O(n), end push amortized O(1) |
| Map | dynamic key/value dictionary | average lookup/insert O(1) |
| Set | uniqueness and membership | average membership/insert O(1) |
| WeakMap/WeakSet | metadata tied to object reachability | non-enumerable, weak keys |
| TypedArray | fixed-format binary numeric data | O(1) indexed access over an ArrayBuffer |

## Arrays

Arrays are exotic objects whose integer-indexed properties interact with `length`. Holes are not the same as stored `undefined`; methods differ in whether they skip holes.

```javascript
const prices = [30, 10, 20]
const sorted = prices.toSorted((a, b) => a - b)
console.log(prices) // unchanged
```

Know whether a method mutates. `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `copyWithin` and `fill` mutate. Modern copying alternatives include `toSorted`, `toReversed`, `toSpliced` and `with`.

Use `find` for one element, `some`/`every` for predicates, `filter` for selection, `map` for one-to-one transformation and `reduce` when the accumulation is clearer than a loop. Do not force every workflow into `reduce`.

## Sorting

JavaScript array sort is stable. The default compares strings, so numeric data needs a comparator. A comparator must be consistent and should avoid side effects.

```javascript
records.toSorted((a, b) =>
  a.priority - b.priority || a.createdAt.localeCompare(b.createdAt)
)
```

Use `Intl.Collator` for repeated locale-aware text sorting.

## Map and Set

Map preserves insertion order and supports any key. Set provides SameValueZero uniqueness. Modern Set methods include `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf` and `isDisjointFrom`; verify older targets.

## Weak collections

WeakMap keys and WeakSet values must be objects (or supported non-registered Symbols where applicable). They cannot be enumerated because reachability is intentionally nondeterministic. Use them for private metadata or caches whose lifetime follows an object—not for observable business state.

## Binary data

ArrayBuffer owns bytes; typed arrays provide numeric views; DataView supports explicit widths and endianness. Resizable and transferable buffers require compatibility and ownership checks. Transferring detaches the original buffer.

## Production checklist

Avoid repeated front insertion into large arrays, bound collection growth, preserve stable keys, benchmark realistic data, and prefer streaming or pagination when materializing everything would exceed memory.

## Primary references

- [ECMA-262 indexed collections](https://tc39.es/ecma262/#sec-indexed-collections)
- [MDN keyed collections](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Keyed_collections)
