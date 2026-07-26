---
title: Responding to Events
description: Learn React event handlers, propagation, capture, preventDefault, handler props, and where side effects belong.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Responding to events

Events connect user interactions to application behavior.

<VisualDiagram title="From user action to possible render">
  <LifecycleBar
    items={[
      { label: 'User action', tone: 'orange' },
      { label: 'Browser event', tone: 'slate' },
      { label: 'React event handler', tone: 'purple' },
      { label: 'State update / side effect', tone: 'cyan' },
      { label: 'Possible new render', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<DecisionTree
  question="What caused this work?"
  items={[
    { label: 'A specific user interaction caused it', value: 'Event handler is usually the right place' },
    { label: 'It is pure UI calculation', value: 'Keep it in render' },
    { label: 'It synchronizes with an external system over time', value: 'An Effect may be appropriate' },
  ]}
/>

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

- `onSave`
- `onDelete`
- `onClose`
- `onSelectProduct`
- `onCheckout`

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

<VisualDiagram title="Bubble phase" subtitle="The target handles the event first, then ancestor handlers can receive it.">
  <DiagramStack align="center">
    <DiagramNode title="Button handler" tone="purple" wide eyebrow="target" />
    <DiagramArrow label="bubble" />
    <DiagramNode title="Parent handler" tone="cyan" wide />
    <DiagramArrow label="bubble" />
    <DiagramNode title="Ancestor handlers" tone="blue" wide />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Capture → target → bubble">
  <LifecycleBar
    items={[
      { label: 'Capture phase ↓', tone: 'blue' },
      { label: 'Target handler', tone: 'purple' },
      { label: 'Bubble phase ↑', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="Two different controls">
  <DiagramGrid columns={2}>
    <DiagramNode title="stopPropagation()" tone="orange" eyebrow="EVENT ROUTE">
      Should ancestor handlers receive this event?
    </DiagramNode>
    <DiagramNode title="preventDefault()" tone="blue" eyebrow="BROWSER ACTION">
      Should the browser perform its built-in default action?
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Event handler sees its render snapshot" compact>
  <DiagramStack align="center">
    <DiagramNode title="Render snapshot: count = 0" tone="blue" wide />
    <DiagramArrow label="click" />
    <DiagramNode title="Handler reads count = 0" tone="purple" wide>setCount(1) requests future work; it does not rewrite this snapshot.</DiagramNode>
    <DiagramArrow label="next render" />
    <DiagramNode title="New snapshot: count = 1" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="User-driven work belongs at the interaction boundary" compact>
  <DiagramStack align="center">
    <DiagramNode title="User clicked Buy" tone="orange" wide />
    <DiagramArrow />
    <DiagramNode title="Handler starts the action" tone="green" wide>Do not add state only so an Effect can notice it and act later.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Where different kinds of work belong">
  <DiagramGrid columns={3}>
    <DiagramNode title="Render logic" tone="blue">Pure calculation of UI.</DiagramNode>
    <DiagramNode title="Event handler" tone="orange">User-caused interaction and side effects.</DiagramNode>
    <DiagramNode title="Effect" tone="purple">External synchronization not tied to one specific interaction.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Events are not just syntax. They are a boundary where user intent enters your application.

## References

- https://react.dev/learn/responding-to-events
- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/reference/react-dom/components/common

## Next

Continue with **[State as a Snapshot and Update Queues](../07-state/state-snapshots-and-queues.md)**.
