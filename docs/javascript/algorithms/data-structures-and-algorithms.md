---
title: Data Structures and Algorithms in JavaScript
description: Practical implementations, complexity and JavaScript-specific algorithm decisions.
---

# Data Structures and Algorithms in JavaScript

Complexity describes growth, not exact speed. Include input shape, mutation, allocation and engine/host constraints in every analysis.

## Core structures

Arrays provide dynamic contiguous-like indexed sequences. Map/Set provide average constant-time keyed operations. Implement linked lists, stacks, queues, deques, heaps, tries, trees, graphs and union-find when their behavior is the learning goal or a missing platform capability.

```javascript
class MinHeap {
  #values = []
  push(value) {
    this.#values.push(value)
    let index = this.#values.length - 1
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.#values[parent] <= value) break
      this.#values[index] = this.#values[parent]
      index = parent
    }
    this.#values[index] = value
  }
}
```

A complete heap also needs peek/pop and tests for duplicate, empty and adversarial inputs.

## Complexity guide

- Array indexed access: O(1); linear search: O(n); front insertion/removal: O(n).
- Map/Set lookup: average O(1), with implementation-dependent constants.
- Binary heap insert/remove: O(log n), peek O(1).
- Balanced search tree operations: O(log n); an unbalanced BST can degrade to O(n).
- BFS/DFS: O(V + E) with adjacency lists.
- Comparison sorting: typically O(n log n); JavaScript built-in sort is stable.

Space complexity includes output, recursion depth, queues, maps and copied arrays.

## Traversal

Use an explicit queue with a head index for BFS rather than repeated `shift()` on large arrays.

```javascript
function breadthFirst(start, neighbors) {
  const queue = [start]
  const seen = new Set([start])
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head]
    for (const next of neighbors(node)) {
      if (seen.has(next)) continue
      seen.add(next)
      queue.push(next)
    }
  }
  return seen
}
```

## Problem-solving patterns

Two pointers reduce repeated scanning on ordered data. Sliding windows maintain an aggregate over contiguous ranges. Prefix sums answer range totals. Backtracking explores choices and undoes them. Dynamic programming stores overlapping subproblem results. Greedy algorithms need an exchange/optimal-substructure argument, not intuition alone.

## Graph algorithms

Topological sort applies to directed acyclic dependencies. Dijkstra requires non-negative edge weights. Bellman-Ford handles negative edges and detects negative cycles. Union-find efficiently maintains connectivity through path compression and union by rank/size.

## JavaScript-specific concerns

Numbers lose integer precision above `MAX_SAFE_INTEGER`; use BigInt when the problem requires exact larger integers. Recursion depth is limited. String indexing uses UTF-16 code units. Object keys are strings/Symbols; Map is safer for arbitrary graph nodes. Avoid bitwise tricks for values beyond signed 32-bit range.

## Study method

For each problem: write examples and constraints, choose an invariant, implement the simplest correct version, prove termination/correctness, analyze time/space, test edges, then optimize only where constraints require it.
