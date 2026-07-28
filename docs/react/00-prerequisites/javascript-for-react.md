---
title: JavaScript for React
description: The JavaScript concepts you need before React, with React-oriented examples and mental models.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# JavaScript for React

React is a JavaScript library. Most confusing "React problems" at the beginning are really JavaScript problems involving objects, arrays, closures, promises, or reference identity.

This chapter is a focused prerequisite. These are **JavaScript concepts, not React APIs**.

## What should you know first?

You should already be comfortable with basic HTML, CSS, variables, conditions, loops, and functions.

For React, pay special attention to:

- `const` and `let`;
- function declarations and arrow functions;
- objects and arrays;
- destructuring;
- spread and rest syntax;
- `map`, `filter`, `find`, `some`, `every`, and `reduce`;
- ternaries and logical operators;
- optional chaining and nullish coalescing;
- modules;
- callbacks;
- promises and `async` / `await`;
- immutability;
- values vs references;
- object identity;
- closures and scope;
- event-loop basics.

## `const` and `let`

Prefer `const` unless the variable binding itself must be reassigned.

```js
const user = {name: 'Aisha'};
let page = 1;

page = 2;
```

`const` does **not** make an object immutable:

```js
const user = {name: 'Aisha'};
user.name = 'Sara'; // valid JavaScript
```

That distinction matters later because React state should usually be treated as immutable even though JavaScript allows mutation.

## Functions

React function components are JavaScript functions.

```jsx
function Greeting({name}) {
  return <h1>Hello, {name}</h1>;
}
```

Arrow functions are common for callbacks:

```js
const doubled = numbers.map((number) => number * 2);
```

Do not learn arrow functions as "React syntax". They are ordinary JavaScript.

## Objects

React applications constantly move structured data around:

```js
const product = {
  id: 'p-101',
  name: 'Keyboard',
  price: 120,
  inStock: true,
};
```

Property access:

```js
product.name;
product['price'];
```

A React component might receive that object as a prop:

```jsx
function ProductCard({product}) {
  return <h2>{product.name}</h2>;
}
```

## Arrays

Lists in React are usually JavaScript arrays.

```js
const products = [
  {id: 1, name: 'Keyboard'},
  {id: 2, name: 'Mouse'},
];
```

Later, JSX can render a transformed array:

```jsx
<ul>
  {products.map((product) => (
    <li key={product.id}>{product.name}</li>
  ))}
</ul>
```

The important prerequisite is understanding `map`; `key` is the React-specific part.

## Destructuring

Object destructuring:

```js
const user = {name: 'Aisha', role: 'admin'};
const {name, role} = user;
```

This is why props often look like:

```jsx
function UserBadge({name, role}) {
  return <span>{name} — {role}</span>;
}
```

Array destructuring:

```js
const coordinates = [10, 20];
const [x, y] = coordinates;
```

This syntax is used by Hooks such as `useState`:

```jsx
const [count, setCount] = useState(0);
```

React did not invent the square-bracket syntax. `useState` returns an array and JavaScript destructuring names its two positions.

## Spread syntax

Copy an array while adding an item:

```js
const nextItems = [...items, newItem];
```

Copy an object while replacing one property:

```js
const nextUser = {
  ...user,
  name: 'Sara',
};
```

This becomes important when updating React state without mutating the previous value.

### Spread is shallow

```js
const user = {
  name: 'Aisha',
  address: {city: 'Lahore'},
};

const copy = {...user};
```

`copy !== user`, but:

```js
copy.address === user.address; // true
```

Nested objects still share the same reference until you copy them too.

## Rest parameters

Rest collects remaining arguments:

```js
function logAll(...values) {
  console.log(values);
}
```

Rest can also collect remaining object properties:

```js
const {id, ...editableFields} = user;
```

Spread and rest use the same `...` token but perform different jobs depending on the position.

## `map`

`map` transforms every element and returns a new array.

```js
const names = users.map((user) => user.name);
```

React uses it constantly for list rendering:

```jsx
{users.map((user) => (
  <UserRow key={user.id} user={user} />
))}
```

## `filter`

`filter` keeps elements that pass a test.

```js
const activeUsers = users.filter((user) => user.active);
```

It is also useful for immutable removal:

```js
const nextItems = items.filter((item) => item.id !== removedId);
```

## `find`

`find` returns the first matching element or `undefined`.

```js
const selectedProduct = products.find(
  (product) => product.id === selectedId,
);
```

## `some` and `every`

```js
const hasOutOfStock = products.some((product) => !product.inStock);
const allComplete = tasks.every((task) => task.completed);
```

These often let you **derive** UI values instead of storing extra state.

## `reduce`

`reduce` combines an array into another value.

```js
const total = basket.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);
```

Do not use `reduce` merely because it looks advanced. Prefer the clearest operation for the job.

## Ternary operator

A ternary is an expression:

```js
const label = isLoggedIn ? 'Account' : 'Sign in';
```

Because JSX braces accept expressions, ternaries are useful for rendering decisions:

```jsx
<p>{isLoggedIn ? 'Welcome back' : 'Please sign in'}</p>
```

## Logical operators

`&&` is often used for optional UI:

```jsx
{error && <p role="alert">{error}</p>}
```

Be careful with numbers:

```jsx
{items.length && <List items={items} />}
```

When `items.length` is `0`, this expression evaluates to `0`, which React can render.

Prefer an explicit boolean when needed:

```jsx
{items.length > 0 && <List items={items} />}
```

## Optional chaining

```js
const city = user?.address?.city;
```

It stops and returns `undefined` when a value before `?.` is nullish.

## Nullish coalescing

```js
const displayName = user.nickname ?? user.name;
```

`??` falls back only for `null` or `undefined`.

That differs from `||`:

```js
0 || 10;  // 10
0 ?? 10;  // 0
```

This matters when `0`, `false`, or an empty string is a valid UI value.

## Template literals

```js
const message = `Hello, ${user.name}`;
```

They are useful for strings, but JSX is usually clearer for actual UI structure.

## Modules

Named export:

```js
export function formatPrice(value) {
  return `£${value.toFixed(2)}`;
}
```

Named import:

```js
import {formatPrice} from './formatPrice.js';
```

Default export:

```js
export default function ProductCard() {
  // ...
}
```

Default import:

```js
import ProductCard from './ProductCard.jsx';
```

Named and default exports are JavaScript module features, not React features.

## Callbacks

A callback is a function passed for another piece of code to call later.

```js
function runTask(onComplete) {
  // do work
  onComplete();
}
```

React event handlers are callbacks:

```jsx
<button onClick={handleSave}>Save</button>
```

Notice that this passes the function.

```jsx
onClick={handleSave}
```

This calls it immediately during render:

```jsx
onClick={handleSave()}
```

Understanding that distinction prevents many beginner bugs.

## Promises

A Promise represents an eventual result.

```js
fetch('/api/products')
  .then((response) => response.json())
  .then((products) => console.log(products));
```

Promises can be pending, fulfilled, or rejected.

## `async` / `await`

`async` functions return Promises.

```js
async function loadProducts() {
  const response = await fetch('/api/products');
  return response.json();
}
```

`await` pauses that async function's continuation until the Promise settles. It does not block the entire JavaScript runtime.

Later, async behavior matters for data fetching, Actions, Suspense integrations, and server rendering.

## Values vs references

Primitive values compare by value:

```js
5 === 5; // true
```

Objects compare by reference identity:

```js
{} === {}; // false
```

Even if two objects contain the same data, they are different objects.

```js
const first = {theme: 'dark'};
const second = {theme: 'dark'};

first === second; // false
```

<VisualDiagram title="Value equality vs reference identity" subtitle="React APIs often care whether an object or function is the same reference, not merely whether its contents look equal.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" eyebrow="PRIMITIVES" title="Compare by value">
      `5 === 5` → true. Equal primitive values compare as equal.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="OBJECTS / FUNCTIONS" title="Compare by identity">
      Two separately created objects can contain the same data while still being different references.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This becomes crucial for:

- Effect dependencies;
- memoization;
- Context values;
- `memo`;
- `useMemo`;
- `useCallback`;
- external stores.

## Immutability

Mutation changes an existing value:

```js
user.name = 'Sara';
items.push(newItem);
```

An immutable update creates a new object or array:

```js
const nextUser = {...user, name: 'Sara'};
const nextItems = [...items, newItem];
```

<VisualDiagram title="Mutation vs immutable update" subtitle="React state is easiest to reason about when previous snapshots remain unchanged.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="MUTATION" title="Change the existing reference">
      Old code and new code can now observe the same object with changed contents.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="IMMUTABLE UPDATE" title="Create the next reference">
      The previous snapshot stays intact while the new object/array represents the next value.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React's programming model works best when props and state are treated as immutable snapshots.

## Closures

A function remembers variables from the scope where that function was created.

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}
```

React event handlers and Effects are closures too.

A useful future mental model is:

<VisualDiagram title="How a React render creates closures" subtitle="A handler does not read a magical live state variable; it closes over the values from the render that created it.">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Render happens" wide>React calls the component for one render.</DiagramNode>
    <DiagramArrow label="this render has" />
    <DiagramNode tone="purple" title="Local props and state values" wide>These values form the render's current snapshot.</DiagramNode>
    <DiagramArrow label="component creates" />
    <DiagramNode tone="cyan" title="Handlers, callbacks, and Effect functions" wide>Normal JavaScript functions are created during this render.</DiagramNode>
    <DiagramArrow label="closure captures" />
    <DiagramNode tone="green" title="That render's values" wide>When the function runs later, it can still remember the values from the scope where it was created.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

This is why "stale closure" problems are really a combination of JavaScript closures and React's render snapshots.

## Scope

`let` and `const` are block scoped:

```js
if (isAdmin) {
  const message = 'Admin tools';
}

// message is not available here
```

Keep render calculations close to where they are used, but do not hide important domain logic in deeply nested callbacks.

## Event-loop basics

JavaScript on the main browser thread runs one task at a time. Asynchronous operations can schedule future work.

A simplified model:

<VisualDiagram title="Simplified browser JavaScript event loop" subtitle="Async APIs can schedule future work, but current JavaScript runs to completion before the next queued work executes.">
  <LifecycleBar
    items={[
      { label: 'Run current JavaScript', tone: 'blue' },
      { label: 'Current call stack finishes', tone: 'purple' },
      { label: 'Queued microtasks/tasks become eligible', tone: 'orange' },
      { label: 'Future JavaScript runs', tone: 'green' },
    ]}
  />
</VisualDiagram>

React concurrency does **not** mean your component JavaScript suddenly runs on multiple CPU threads. React can schedule, prioritize, pause, restart, or discard rendering work within its rendering model.

## Common mistakes before learning React

### Mutating an array and expecting a new reference

```js
const next = items;
next.push(newItem);

next === items; // true
```

### Recreating objects without understanding identity

```js
const options = {roomId};
```

That creates a new object each time the line runs. Later, this matters for dependencies and memoization.

### Confusing passing a function with calling it

```jsx
// Pass callback
<button onClick={save}>Save</button>

// Calls now
<button onClick={save()}>Save</button>
```

### Using `||` when `0` is valid

```js
const quantity = inputQuantity || 1;
```

If `0` is meaningful, use a condition or `??` based on the real domain rule.

## Exercise

Given:

```js
const products = [
  {id: 1, name: 'Keyboard', price: 120, inStock: true},
  {id: 2, name: 'Mouse', price: 40, inStock: false},
  {id: 3, name: 'Monitor', price: 300, inStock: true},
];
```

Without React:

1. create an array containing only in-stock products;
2. create an array of their names;
3. calculate the total price of the in-stock products;
4. find the product with id `3`;
5. determine whether any product is out of stock;
6. create a new array where product `2` is in stock **without mutating the original array**.

If these operations feel natural, you are ready to apply them inside React components.

## Interview questions

### Junior

Why does `const` not mean an object is immutable?

### Mid-level

Why can `{a: 1} === {a: 1}` be false, and why can that matter in React?

### Senior

How do JavaScript closures and object identity influence React dependency management and memoization decisions?

## Summary

The JavaScript ideas to keep in your head are:

<VisualDiagram title="JavaScript mental models React relies on">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Functions">React components are JavaScript functions.</DiagramNode>
    <DiagramNode tone="purple" title="Values">Props and state contain ordinary JavaScript values.</DiagramNode>
    <DiagramNode tone="cyan" title="Collections">Lists are arrays transformed with normal JavaScript methods.</DiagramNode>
    <DiagramNode tone="orange" title="Callbacks">Event handlers and many APIs receive functions to call later.</DiagramNode>
    <DiagramNode tone="green" title="Async work">Promises and `async` / `await` model eventual results.</DiagramNode>
    <DiagramNode tone="purple" title="Closures">Functions remember values from the scope/render that created them.</DiagramNode>
    <DiagramNode tone="orange" title="Identity">Object and function reference identity matters to React APIs.</DiagramNode>
    <DiagramNode tone="green" title="Immutability">New references let previous snapshots remain unchanged.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Next

Continue with **[What is React?](../01-getting-started/what-is-react.md)**.
