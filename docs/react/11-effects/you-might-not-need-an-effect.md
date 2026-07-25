---
title: You Might Not Need an Effect
description: Learn how to remove unnecessary Effects by deriving values during render, handling interactions in events, lifting state, and choosing better data flow.
sidebar_position: 2
---

# You might not need an Effect

Effects are escape hatches. They are not the default place for application logic.

A strong React engineer tries to keep logic in the simplest model that fits:

```text
Can I calculate it during render?
        ↓ yes
Do that.

Was it caused by a specific interaction?
        ↓ yes
Use the event handler.

Is React synchronizing with an external system?
        ↓ yes
Use an Effect.
```

This chapter is about recognizing when an Effect is solving the wrong problem.

## Derived data belongs in render

Bad:

```jsx
const [firstName, setFirstName] = useState('Aisha');
const [lastName, setLastName] = useState('Khan');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Better:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Why?

```text
firstName + lastName
        ↓
render
        ↓
fullName
```

The Effect version creates:

- extra state;
- an extra render;
- synchronization code;
- another place for bugs.

## Filtering and sorting usually belong in render

Bad:

```jsx
const [visibleProducts, setVisibleProducts] = useState([]);

useEffect(() => {
  setVisibleProducts(
    products.filter(product => product.name.includes(query)),
  );
}, [products, query]);
```

Better:

```jsx
const visibleProducts = products.filter(product =>
  product.name.includes(query),
);
```

If the computation later becomes measurably expensive, performance techniques can be considered. Do not introduce an Effect merely because a calculation is non-trivial.

## User actions belong in event handlers

Bad:

```jsx
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  if (submitted) {
    sendOrder(cart);
  }
}, [submitted, cart]);
```

Better:

```jsx
function handleSubmit() {
  sendOrder(cart);
}
```

The order is sent because the user submitted the form, not because the component happened to render with `submitted === true`.

## Avoid Effect chains for internal state transitions

Bad:

```jsx
useEffect(() => {
  if (card !== null) {
    setGoldCardCount(c => c + 1);
  }
}, [card]);

useEffect(() => {
  if (goldCardCount > 3) {
    setRound(r => r + 1);
    setGoldCardCount(0);
  }
}, [goldCardCount]);
```

This turns a simple event into a chain of renders and Effects.

Prefer calculating the complete transition in the event that caused it:

```jsx
function handlePlaceCard(nextCard) {
  setCard(nextCard);

  if (nextCard) {
    setGoldCardCount(current => {
      const next = current + 1;

      if (next > 3) {
        setRound(r => r + 1);
        return 0;
      }

      return next;
    });
  }
}
```

For complex transitions, a reducer may model the state machine more clearly.

## Resetting state when a key changes

Suppose a profile editor should reset when switching users.

A common Effect solution is:

```jsx
function ProfilePage({userId}) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [userId]);
}
```

But this is fundamentally an identity problem.

A clearer approach can be:

```jsx
<ProfileEditor key={userId} userId={userId} />
```

Now React treats each user editor as distinct stateful identity.

Use identity when the state conceptually belongs to a different entity.

## Adjusting state during render is usually a design smell

Sometimes code tries to keep state synchronized with props:

```jsx
const [selection, setSelection] = useState(null);

useEffect(() => {
  setSelection(null);
}, [items]);
```

First ask whether you can store a stable identifier instead:

```jsx
const [selectedId, setSelectedId] = useState(null);

const selection = items.find(item => item.id === selectedId) ?? null;
```

Now the current selection is derived from current data.

## Informing a parent about state changes

Bad:

```jsx
function Toggle({onChange}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    onChange(enabled);
  }, [enabled, onChange]);
}
```

This causes the notification after rendering.

If the change comes from user interaction, notify both places in the same event:

```jsx
function Toggle({onChange}) {
  const [enabled, setEnabled] = useState(false);

  function handleClick() {
    const next = !enabled;
    setEnabled(next);
    onChange(next);
  }
}
```

Or make the component controlled if the parent should own the source of truth.

## Parent and child state duplication

If both parent and child need the same changing value, do not synchronize copies with Effects.

Bad architecture:

```text
Parent state
   ↕ Effect synchronization
Child state
```

Prefer:

```text
Parent owns state
      ↓ props
Child renders value
      ↑ callback
Parent updates state
```

This is the controlled-component model.

## Initializing application state

Sometimes developers use an empty-array Effect to initialize state:

```jsx
useEffect(() => {
  setTheme(loadTheme());
}, []);
```

If the value can be determined during state initialization, prefer a lazy initializer:

```jsx
const [theme, setTheme] = useState(() => loadTheme());
```

This avoids a render with temporary state followed by an Effect-driven correction.

## Expensive calculations are not Effects

Wrong mental model:

> "This computation is expensive, so I should run it in an Effect."

Effects are about synchronization, not computation cost.

Start with:

```jsx
const result = expensiveCalculation(data);
```

Then measure. If memoization is justified later:

```jsx
const result = useMemo(() => expensiveCalculation(data), [data]);
```

Even then, the computation remains part of rendering logic.

## Network requests caused by events

Submitting a purchase:

```jsx
function handleBuy() {
  fetch('/api/order', {
    method: 'POST',
    body: JSON.stringify(cart),
  });
}
```

This belongs in the event because the user caused it.

Fetching data because a route/component needs to stay synchronized with a remote resource may use an Effect in a simple client-only app, but larger applications often benefit from framework loaders or server-state libraries.

## Analytics: event or Effect?

Question:

> Why is the analytics event happening?

If it means "user clicked checkout":

```jsx
function handleCheckout() {
  analytics.track('checkout_clicked');
}
```

If it means "this screen became active/visible": an Effect may be appropriate because the analytics is tied to rendered presence.

The important distinction is **cause**.

## Common anti-pattern: Effect as command bus

Bad:

```jsx
const [action, setAction] = useState(null);

useEffect(() => {
  if (action === 'SAVE') save();
  if (action === 'DELETE') remove();
}, [action]);
```

This converts direct imperative events into indirect state-driven commands.

Prefer calling the command from the event that caused it.

## Decision table

| Problem | Usually use |
| --- | --- |
| Calculate a value for JSX | render logic |
| Respond to click/submit/input | event handler |
| Share state between siblings | lift state |
| Reset state for a different entity | `key` / identity |
| Model complex state transitions | reducer |
| Store mutable non-render data | ref |
| Synchronize browser/network/widget/subscription | Effect |

## Debugging unnecessary Effects

When reviewing an Effect, ask:

1. What external system is this synchronizing with?
2. If there is none, can the value be derived during render?
3. Did a specific user interaction cause this work?
4. Is duplicated state being synchronized?
5. Is this really a component identity problem?
6. Would lifting state remove the need for synchronization?
7. Would a reducer better model a state transition?

## Production example

Imagine an ecommerce filter page.

Avoid:

```text
query state
   ↓ Effect
filteredProducts state
   ↓ Effect
resultCount state
```

Prefer:

```text
products + query
      ↓ render calculation
filteredProducts
      ↓
resultCount
```

One source of truth produces multiple derived values.

## Exercise

Refactor this component without Effects:

```jsx
function Checkout({items, onTotalChange}) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  return <strong>{total}</strong>;
}
```

Questions:

- Which value is derived?
- Who should own the total?
- Does the parent really need a callback, or can it calculate the same value?

## Interview questions

**Junior:** Give an example of logic that should be calculated during render instead of inside an Effect.

**Mid-level:** Why can Effect-driven derived state cause extra renders and synchronization bugs?

**Senior:** How do state ownership and component identity eliminate classes of Effects from an application architecture?

## Summary

Effects are valuable precisely because they are specialized.

```text
Use React's normal data flow first.
Use Effects when you need to step outside that data flow.
```

## References

- https://react.dev/learn/you-might-not-need-an-effect
- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/preserving-and-resetting-state

## Next

Continue with **[Effect Lifecycle and Dependencies](./effect-lifecycle-and-dependencies.md)**.
