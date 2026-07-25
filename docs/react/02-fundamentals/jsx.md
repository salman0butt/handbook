---
title: JSX
description: Learn JSX mental models, expressions, attributes, escaping, conditional UI, lists, security, and production readability.
sidebar_position: 1
---

# JSX

JSX is a syntax extension that lets you describe React UI using markup-like syntax inside JavaScript.

```jsx
const element = <h1>Hello, React!</h1>;
```

It looks like HTML, but JSX is **not HTML** and the browser does not execute JSX directly. Tooling transforms it into JavaScript that creates React element descriptions.

## Why does JSX exist?

UI structure and UI behavior often change together.

```jsx
function AccountStatus({user}) {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.isPro ? 'Pro account' : 'Free account'}</p>
    </section>
  );
}
```

The markup-like structure and the JavaScript decision both belong to the same component responsibility.

Without JSX, the same UI could be expressed using lower-level element-creation APIs, but JSX is usually much easier to read for nested interfaces.

## Mental model

Think of JSX as syntax for creating **descriptions of UI**, not as strings of HTML.

```text
JSX source
   ↓ transform
JavaScript
   ↓ execute
React element descriptions
   ↓ React rendering
host UI / DOM work
```

This:

```jsx
<h1 className="title">Hello</h1>
```

conceptually becomes JavaScript that represents an element with a type, props, and children.

You normally do not write or depend on the exact transformed representation yourself. The useful public model is that JSX produces React elements for React to render.

## JSX is an expression

JSX can be assigned, returned, passed, or stored like other JavaScript expression values.

```jsx
const heading = <h1>Dashboard</h1>;
```

```jsx
function Header() {
  return <header>Account</header>;
}
```

```jsx
function Layout({sidebar}) {
  return <div>{sidebar}</div>;
}
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

Examples of valid expressions:

```jsx
{name}
{price * quantity}
{items.length}
{isAdmin ? 'Admin' : 'Member'}
{formatDate(createdAt)}
```

Statements such as `if`, `for`, or `switch` are not expressions that can be placed directly in braces.

Bad:

```jsx
return <p>{if (loggedIn) 'Welcome'}</p>;
```

Calculate first:

```jsx
const message = loggedIn ? 'Welcome' : 'Please sign in';
return <p>{message}</p>;
```

Or use normal control flow before the returned JSX:

```jsx
function AccountPage({user}) {
  if (!user) {
    return <SignInPrompt />;
  }

  return <Dashboard user={user} />;
}
```

## Return one root value

A component returns one value.

This is invalid JSX syntax:

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

Or use a Fragment when an extra DOM element has no semantic or styling purpose:

```jsx
return (
  <>
    <h1>Profile</h1>
    <p>Account details</p>
  </>
);
```

## Fragments

A Fragment groups children without adding a wrapper DOM node.

Shorthand:

```jsx
<>
  <dt>Name</dt>
  <dd>Aisha</dd>
</>
```

Explicit Fragment is useful when you need a `key`:

```jsx
import {Fragment} from 'react';

function Glossary({items}) {
  return items.map((item) => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
```

The shorthand `<>...</>` cannot receive a `key`.

## JSX attributes and props

Many JSX attributes resemble HTML:

```jsx
<input type="email" placeholder="Email address" />
```

Dynamic values use braces:

```jsx
<img src={user.avatarUrl} alt={user.name} />
```

Boolean props can be shortened:

```jsx
<button disabled>Save</button>
```

Equivalent to:

```jsx
<button disabled={true}>Save</button>
```

### `className`

Use `className` for CSS classes:

```jsx
<div className="product-card" />
```

### `htmlFor`

Labels use `htmlFor`:

```jsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

The association matters for accessibility as well as behavior.

## Props use JavaScript values

A quoted value is a string:

```jsx
<Avatar size="48" />
```

A braced value is a JavaScript expression:

```jsx
<Avatar size={48} />
```

These values have different JavaScript types.

Object and array props use braces too:

```jsx
<Chart options={{showLegend: true}} />
<ProductList products={products} />
```

Later, object identity will matter for memoization and dependencies, so do not treat `{}` as purely decorative syntax.

## The `children` relationship

Nested JSX becomes the component's `children` prop:

```jsx
<Card>
  <h2>Billing</h2>
  <p>Manage your subscription.</p>
</Card>
```

A component can render it:

```jsx
function Card({children}) {
  return <section className="card">{children}</section>;
}
```

This is one of React's most important composition mechanisms.

## Lowercase DOM tags vs capitalized components

Lowercase JSX names represent platform elements:

```jsx
<button>Save</button>
```

Capitalized names represent React components:

```jsx
<SaveButton />
```

Bad component naming:

```jsx
function saveButton() {
  return <button>Save</button>;
}

// React interprets this name differently in JSX
<saveButton />
```

Prefer:

```jsx
function SaveButton() {
  return <button>Save</button>;
}
```

## JSX comments

Inside JSX markup, comments use JavaScript braces:

```jsx
return (
  <section>
    {/* Account controls */}
    <AccountMenu />
  </section>
);
```

Avoid comments that merely repeat what clear component names already communicate.

## Inline styles are objects

Inline styles use a JavaScript object:

```jsx
<div style={{padding: '1rem', fontWeight: 700}}>
  Important message
</div>
```

The outer braces enter JavaScript expression mode; the inner braces create the object.

For larger interfaces, CSS classes, CSS Modules, a design system, or another deliberate styling architecture is usually easier to maintain than large inline style objects.

Inline styles remain useful for truly dynamic values:

```jsx
<div style={{width: `${progress}%`}} />
```

## Conditional rendering

React uses JavaScript control flow for UI decisions.

### Early return

```jsx
function Profile({user}) {
  if (!user) {
    return <SignInPrompt />;
  }

  return <ProfileDetails user={user} />;
}
```

### Ternary

```jsx
return <p>{isLoading ? 'Loading…' : 'Ready'}</p>;
```

### Logical `&&`

```jsx
return (
  <div>
    {error && <p role="alert">{error}</p>}
  </div>
);
```

Be careful with numeric values:

```jsx
{items.length && <ItemList items={items} />}
```

If length is `0`, the expression evaluates to `0`, which React can render.

Prefer:

```jsx
{items.length > 0 && <ItemList items={items} />}
```

For complicated conditions, calculate a variable or extract a component rather than nesting several ternaries.

## Rendering arrays

Arrays of React elements can be rendered:

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

The `key` is React-specific identity information. It is not passed to the child as a normal prop.

Later we will study why stable keys matter for reconciliation and state preservation.

## What values render?

Strings and numbers can appear as text:

```jsx
<p>{name}</p>
<p>{quantity}</p>
```

`null`, `undefined`, and booleans are commonly used to mean "render nothing" in a position:

```jsx
{isAdmin ? <AdminTools /> : null}
```

Plain objects cannot be rendered as children directly:

```jsx
// ❌ user is a plain object
<p>{user}</p>
```

Render a meaningful property instead:

```jsx
<p>{user.name}</p>
```

## JSX escaping and XSS safety

React escapes string values inserted through normal JSX interpolation.

```jsx
function Comment({text}) {
  return <p>{text}</p>;
}
```

If `text` contains markup-like user input, React treats it as text rather than automatically executing it as HTML.

This is an important default safety property, but it does **not** mean a React application is automatically secure. URLs, third-party scripts, authentication, authorization, APIs, dependencies, and server behavior still require security design.

## `dangerouslySetInnerHTML`

Sometimes an application must render trusted/sanitized HTML produced outside React.

React exposes an explicit escape hatch:

```jsx
function Article({html}) {
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
```

The dangerous part is not the unusual property name. The danger is bypassing React's normal text escaping and inserting raw HTML into the DOM.

### Never do this with untrusted input

```jsx
// ❌ dangerous if commentHtml is user-controlled and unsanitized
<div dangerouslySetInnerHTML={{__html: commentHtml}} />
```

If raw HTML must be rendered, sanitize it using a security-reviewed strategy appropriate to the trust boundary and threat model. Do not invent a regex-based HTML sanitizer.

Decision model:

```text
Can normal JSX express the UI?
      ↓ yes
Use normal JSX

Must render external HTML?
      ↓ yes
Understand source + sanitize at trust boundary
      ↓
Use raw HTML escape hatch deliberately
```

## JSX and accessibility

JSX does not remove HTML semantics.

Prefer the correct native element:

```jsx
<button onClick={save}>Save</button>
```

rather than making a non-interactive element imitate a button:

```jsx
<div onClick={save}>Save</div>
```

The native button already has keyboard, focus, form, and accessibility behavior that you would otherwise need to recreate correctly.

## Keep render logic pure

JSX is created while your component renders. Do not mutate external systems while calculating it.

Bad:

```jsx
function Product({product}) {
  localStorage.setItem('lastProduct', product.id);
  return <h1>{product.name}</h1>;
}
```

The component is performing an external side effect during render.

Render should calculate UI. User-driven work belongs in event handlers; synchronization with external systems may require an Effect.

## Readability: JSX should communicate structure

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

Clearer:

```jsx
const membershipLabel = getMembershipLabel(user);
return <p>{membershipLabel}</p>;
```

Or extract a meaningful component if the branch has its own responsibility.

The goal is not "zero logic in JSX." The goal is that the JSX primarily communicates UI structure and simple rendering decisions.

## Common mistakes

### Treating JSX as an HTML string

JSX produces React element descriptions; it is not string concatenation.

### Using the wrong attribute name

Use React's JSX prop names such as `className` and `htmlFor`.

### Adding unnecessary wrappers

Use semantic containers where they add meaning; use Fragments when a wrapper would be meaningless.

### Putting too much logic inside markup

Extract complex transformations and domain decisions so the component remains understandable.

### Calling components as normal functions

Bad:

```jsx
const content = Profile({user});
```

Prefer:

```jsx
const content = <Profile user={user} />;
```

Let React control component invocation so Hooks and component identity work correctly.

### Rendering raw HTML casually

`dangerouslySetInnerHTML` should be a deliberate trust-boundary decision, not a formatting shortcut.

## Debugging JSX

### "Adjacent JSX elements must be wrapped"

Return one root value, often a semantic element or Fragment.

### "Objects are not valid as a React child"

Inspect the expression in braces. You may be rendering an object instead of a string/number/element.

### Unexpected `0` on the page

Check numeric `&&` conditions such as `items.length && ...`.

### Component does not render as expected

Check capitalization and imports. `<profile />` is not the same as `<Profile />`.

### Markup displays as text

That is usually React's escaping doing its job. Do not switch to raw HTML unless the application genuinely owns trusted/sanitized HTML content.

## When should I use JSX?

Use JSX for React UI structure. It is the standard, readable way to combine component composition with JavaScript expressions.

## When should I not put something in JSX?

Do not force these into the markup itself when a clearer abstraction exists:

- long data transformations;
- complex domain calculations;
- network calls;
- mutations of external systems;
- large nested conditional trees;
- security-sensitive raw HTML processing.

Calculate values before the return, move domain logic to appropriate modules, or extract meaningful components.

## Production example

```jsx
function ProductCard({product, onAdd}) {
  const formattedPrice = formatPrice(product.price);
  const canBuy = product.inStock && !product.discontinued;

  return (
    <article className="product-card">
      <img src={product.imageUrl} alt="" />
      <h2>{product.name}</h2>
      <p>{formattedPrice}</p>

      {!product.inStock && (
        <p role="status">Currently out of stock</p>
      )}

      <button
        type="button"
        disabled={!canBuy}
        onClick={() => onAdd(product.id)}
      >
        Add to basket
      </button>
    </article>
  );
}
```

Notice the separation:

```text
data calculation
- formattedPrice
- canBuy

JSX
- semantic structure
- simple conditions
- props
- event callback wiring
```

## Exercise

Turn this data into an accessible JSX product card:

```js
const product = {
  id: 'keyboard-1',
  name: 'Mechanical Keyboard',
  price: 120,
  inStock: true,
  imageUrl: '/keyboard.jpg',
};
```

Requirements:

- show the product name;
- show the price;
- display `In stock` or `Out of stock`;
- disable the Buy button when unavailable;
- use meaningful HTML elements;
- add useful image alternative text or deliberately use an empty `alt` if the image is purely decorative;
- do not store any derived display value in state.

Then extend the component with a `featured` badge using conditional rendering.

## Interview questions

### Junior

What is JSX, and why is it not the same thing as HTML?

### Mid-level

Why can `{items.length && <List />}` accidentally render `0`?

### Senior

What security boundary does `dangerouslySetInnerHTML` cross, and what should be established before using it with externally sourced content?

## Summary

Keep this model:

```text
JSX describes UI structure.
JavaScript expressions provide values and decisions.
JSX becomes React element descriptions.
Normal interpolation escapes text.
Raw HTML is an explicit security-sensitive escape hatch.
Semantic HTML still matters.
Render logic should remain pure.
```

## References

- https://react.dev/learn/writing-markup-with-jsx
- https://react.dev/learn/javascript-in-jsx-with-curly-braces
- https://react.dev/learn/conditional-rendering
- https://react.dev/learn/rendering-lists
- https://react.dev/reference/react-dom/components/common
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

## Next

Continue with **[Components and Props](../03-components/components-and-props.md)**.