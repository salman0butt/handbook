---
title: JSX
description: Learn what JSX really is, how expressions work, and the rules that matter in production React.
sidebar_position: 1
---

# JSX

JSX is a syntax extension that lets us describe UI using markup-like syntax inside JavaScript.

```jsx
const element = <h1>Hello, React!</h1>;
```

It looks like HTML, but JSX is **not HTML**. It becomes JavaScript before the browser executes it.

## Why JSX exists

UI behaviour and UI markup are often closely related.

Consider a component that changes what it shows based on application data:

```jsx
function AccountStatus({user}) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.isPro ? 'Pro account' : 'Free account'}</p>
    </div>
  );
}
```

The rendering logic and the markup live together because they describe one component responsibility.

## JSX becomes JavaScript

Conceptually, this:

```jsx
<h1 className="title">Hello</h1>
```

is transformed into JavaScript that creates a React element description.

You do not normally write that transformed representation yourself. The useful mental model is simply:

```text
JSX
 ↓ compile/transform
JavaScript
 ↓ execute
React element descriptions
 ↓ render
UI
```

## JavaScript expressions inside JSX

Use curly braces when you need a JavaScript expression:

```jsx
function Profile({user}) {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>Posts: {user.posts.length}</p>
      <p>{user.isOnline ? 'Online' : 'Offline'}</p>
    </article>
  );
}
```

Inside `{}` you can use expressions such as:

```jsx
{name}
{price * quantity}
{items.length}
{isAdmin ? 'Admin' : 'Member'}
{formatDate(createdAt)}
```

Statements such as `if`, `for`, or `switch` cannot be inserted directly as JSX expressions.

Bad:

```jsx
return <p>{if (loggedIn) 'Welcome'}</p>;
```

Instead, calculate beforehand:

```jsx
const message = loggedIn ? 'Welcome' : 'Please sign in';

return <p>{message}</p>;
```

## Return one root value

A component needs to return one JSX root.

This is invalid:

```jsx
return (
  <h1>Profile</h1>
  <p>Account details</p>
);
```

Wrap the elements:

```jsx
return (
  <div>
    <h1>Profile</h1>
    <p>Account details</p>
  </div>
);
```

Or use a Fragment when you do not want an extra DOM element:

```jsx
return (
  <>
    <h1>Profile</h1>
    <p>Account details</p>
  </>
);
```

## JSX attributes

Many attributes look similar to HTML:

```jsx
<input type="email" placeholder="Email address" />
```

Some names differ because JSX is JavaScript syntax.

For example:

```jsx
<div className="card" />
<label htmlFor="email">Email</label>
```

Dynamic values use braces:

```jsx
<img src={user.avatarUrl} alt={user.name} />
```

Boolean props can be shortened:

```jsx
<button disabled>Save</button>
```

which is equivalent to:

```jsx
<button disabled={true}>Save</button>
```

## Inline styles are objects

In JSX, inline styles use a JavaScript object:

```jsx
<div style={{padding: '1rem', fontWeight: 700}}>
  Important message
</div>
```

For larger interfaces, CSS classes or another deliberate styling system are usually easier to maintain than large inline style objects.

## Conditional rendering

A common pattern is a ternary:

```jsx
return <p>{isLoading ? 'Loading…' : 'Ready'}</p>;
```

For optional UI, `&&` is convenient:

```jsx
return (
  <div>
    {error && <p role="alert">{error}</p>}
  </div>
);
```

For complicated conditions, keep the JSX readable by moving decisions into variables or separate components.

## Rendering arrays

Arrays of React elements can be rendered directly:

```jsx
function UserList({users}) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

The `key` helps React identify items between renders. We will study keys and reconciliation separately because the reasoning matters more than the syntax.

## A readability rule

JSX becomes difficult when too much application logic is embedded inside it.

Hard to scan:

```jsx
return (
  <p>
    {user && user.subscription && user.subscription.active
      ? user.subscription.plan === 'pro'
        ? 'Pro member'
        : 'Member'
      : 'Guest'}
  </p>
);
```

Better:

```jsx
const membershipLabel = getMembershipLabel(user);

return <p>{membershipLabel}</p>;
```

JSX should primarily communicate **UI structure**.

## Common mistakes

### Treating JSX as a string

JSX creates React element descriptions; it is not an HTML string.

### Adding unnecessary wrapper elements

Use semantic elements when they make sense, and Fragments when a wrapper has no meaning.

### Putting too much logic inside markup

Extract complex transformations and decisions so the component remains readable.

### Forgetting that lowercase and uppercase mean different things

Lowercase JSX names represent platform elements:

```jsx
<button>Save</button>
```

Capitalised names represent React components:

```jsx
<SaveButton />
```

## Exercise

Turn this data into a JSX product card:

```js
const product = {
  name: 'Mechanical Keyboard',
  price: 120,
  inStock: true,
};
```

Requirements:

- show the product name;
- show the price;
- display `In stock` or `Out of stock`;
- disable the Buy button when the product is unavailable.

## Summary

JSX gives React components an expressive way to describe UI while still having access to JavaScript expressions.

Keep this mental model:

```text
JSX describes UI structure.
JavaScript calculates the values used by that structure.
```

Next: **[Components and Props](../03-components/components-and-props.md)**.
