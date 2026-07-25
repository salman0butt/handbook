---
title: Responding to Events
description: Learn React event handlers, propagation, capture, preventDefault, handler props, and where side effects belong.
sidebar_position: 1
---

# Responding to events

Events connect user interactions to application behavior.

```text
user action
   ↓
browser event
   ↓
React event handler
   ↓
state update / side effect
   ↓
possible new render
```

## Event handlers are functions

```jsx
function SaveButton() {
  function handleClick() {
    console.log('Saving');
  }

  return <button onClick={handleClick}>Save</button>;
}
```

Pass the function:

```jsx
onClick={handleClick}
```

Do not call it during render:

```jsx
onClick={handleClick()} // ❌ runs while rendering
```

## Inline handlers

For short logic, an inline function is fine:

```jsx
<button onClick={() => setOpen(true)}>Open</button>
```

Use a named handler when the logic is substantial or when the name communicates intent.

## Passing arguments

```jsx
function ProductList({products, onDelete}) {
  return products.map(product => (
    <button key={product.id} onClick={() => onDelete(product.id)}>
      Delete {product.name}
    </button>
  ));
}
```

The arrow function delays the call until the event occurs.

## The event object

React passes an event object as the first argument.

```jsx
function SearchBox() {
  function handleChange(event) {
    console.log(event.target.value);
  }

  return <input onChange={handleChange} />;
}
```

Common uses include:

- reading `event.target.value`;
- reading checkbox state;
- preventing default browser behavior;
- stopping propagation;
- inspecting keyboard or pointer information.

## Event handlers can have side effects

Rendering must be pure, but event handlers are exactly where user-caused side effects usually belong.

```jsx
function CheckoutButton() {
  async function handleCheckout() {
    await submitOrder();
  }

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

Do not move this into an Effect merely because it is asynchronous.

A useful decision rule:

```text
Did a specific user interaction cause it?
        ↓ yes
Event handler is usually the right place
```

## Passing handler props

Reusable components should often expose domain-level callbacks.

```jsx
function DeleteButton({onDelete}) {
  return <button onClick={onDelete}>Delete</button>;
}
```

The child owns the interaction surface. The parent owns the business meaning.

```jsx
<DeleteButton onDelete={() => removeProduct(product.id)} />
```

Prefer meaningful names such as:

```text
onSave
onDelete
onClose
onSelectProduct
onCheckout
```

over vague names such as `onAction` when a clearer contract exists.

## Event propagation

Events normally bubble upward through the rendered DOM hierarchy.

```jsx
<div onClick={() => console.log('toolbar')}>
  <button onClick={() => console.log('button')}>Upload</button>
</div>
```

Clicking the button can trigger both handlers.

Conceptually:

```text
button handler
    ↓
parent handler
    ↓
ancestor handlers
```

## stopPropagation

Use `event.stopPropagation()` when the parent should not treat the child interaction as its own interaction.

```jsx
<button
  onClick={(event) => {
    event.stopPropagation();
    onDelete();
  }}
>
  Delete
</button>
```

Do not scatter `stopPropagation()` everywhere. Often explicit handler composition produces clearer application flow.

## Capture phase

React supports capture handlers such as:

```jsx
<div onClickCapture={handleCapture}>
  <button onClick={handleClick}>Save</button>
</div>
```

Conceptually:

```text
capture phase ↓
target handler
bubble phase ↑
```

Capture is useful for infrastructure such as analytics or routing, but most feature code uses normal bubbling handlers.

## preventDefault

Some browser events have default behavior.

A form submission normally navigates or submits according to HTML behavior. When handling submission manually:

```jsx
function SignupForm() {
  function handleSubmit(event) {
    event.preventDefault();
    // read data and submit manually
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

`preventDefault()` prevents the browser's default action. It does **not** stop event propagation.

## Propagation vs default behavior

These solve different problems:

```text
stopPropagation()
→ should ancestor handlers receive this event?

preventDefault()
→ should the browser perform its built-in action?
```

## Buttons inside forms

A `<button>` inside a form submits by default unless its type says otherwise.

For non-submit actions:

```jsx
<button type="button" onClick={openHelp}>
  Help
</button>
```

For submission:

```jsx
<button type="submit">Save</button>
```

Being explicit avoids surprising form bugs.

## Events and state snapshots

An event handler sees the state from the render that created that handler.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);
  }
}
```

The log still sees the current render's `count`. The setter requests a future render; it does not mutate the existing snapshot.

## Common mistakes

### Calling a handler during render

```jsx
<button onClick={save()}>Save</button> // ❌
```

### Using a clickable div instead of a button

```jsx
<div onClick={submit}>Submit</div> // ❌ poor semantics/accessibility
```

Prefer:

```jsx
<button onClick={submit}>Submit</button>
```

### Using propagation as hidden business logic

If a child action must always trigger parent logic, explicitly call a callback rather than relying on an ancestor's bubbling handler.

### Moving user-driven logic into Effects

```text
user clicked Buy
→ handler should perform or start the action
```

Do not add state only so an Effect can notice the state and then perform the action.

## Debugging event problems

If a handler appears not to run:

1. check whether you passed the function instead of calling it;
2. check whether the element is disabled;
3. check whether another element is covering it;
4. inspect propagation and `stopPropagation()`;
5. check form submission/default browser behavior;
6. verify that the handler changes state or external data as expected.

## Production example

```jsx
function ProductRow({product, onArchive}) {
  function handleArchive(event) {
    event.stopPropagation();
    onArchive(product.id);
  }

  return (
    <article onClick={() => openProduct(product.id)}>
      <h2>{product.name}</h2>
      <button type="button" onClick={handleArchive}>
        Archive
      </button>
    </article>
  );
}
```

Here the row opens the product, while the button performs a different action and intentionally prevents the row click.

## Exercise

Build a toolbar with:

- a parent click logger;
- two buttons;
- one button that bubbles;
- one button that stops propagation;
- a form that prevents default navigation.

Explain the execution order for each interaction.

## Interview questions

**Junior:** Why is `onClick={handleClick}` different from `onClick={handleClick()}`?

**Mid-level:** What is the difference between `stopPropagation()` and `preventDefault()`?

**Senior:** When is explicit callback composition preferable to relying on bubbling?

## Summary

```text
render logic = pure calculation
user interaction = event handler
external synchronization not tied to one interaction = maybe Effect
```

Events are not just syntax. They are a boundary where user intent enters your application.

## References

- https://react.dev/learn/responding-to-events
- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/reference/react-dom/components/common

## Next

Continue with **[State as a Snapshot and Update Queues](../07-state/state-snapshots-and-queues.md)**.