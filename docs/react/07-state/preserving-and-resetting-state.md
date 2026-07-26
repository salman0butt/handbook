---
title: Preserving and Resetting State
description: Learn how React ties state to tree position, component type, and keys, and how to reset state intentionally.
sidebar_position: 3
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Preserving and resetting state

State is not stored “inside the component function.” React stores state and associates it with a component's **identity in the render tree**.

<VisualDiagram title="What determines component identity?" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="Component type" tone="blue" />
    <DiagramNode title="Tree position" tone="purple" />
    <DiagramNode title="Key (when relevant)" tone="orange" />
  </DiagramGrid>
  <DiagramArrow label="together define" />
  <DiagramNode title="Rendered identity" tone="green" wide>React preserves or resets state based on this identity.</DiagramNode>
</VisualDiagram>

## State belongs to a position in the tree

Suppose React renders:

<VisualDiagram title="State is attached to rendered position" compact>
  <DiagramStack align="center">
    <DiagramNode title="App" tone="blue" wide />
    <DiagramArrow />
    <DiagramNode title="Counter" tone="purple" eyebrow="this rendered position owns the Counter state" />
  </DiagramStack>
</VisualDiagram>

The `Counter` state is associated with that rendered position.

If the same component type remains in that position on the next render, React can preserve its state.

## Same component, same position

```jsx
function App({darkMode}) {
  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <Counter />
    </div>
  );
}
```

Changing the wrapper's class does not replace the `Counter` identity. It remains the same component type in the same tree position, so its state is preserved.

## Different component type resets state

```jsx
function App({isCompany}) {
  return isCompany ? <CompanyForm /> : <PersonForm />;
}
```

React sees different component types at the same position.

<VisualDiagram title="Changing type creates a new identity" compact>
  <LifecycleBar
    items={[
      { label: 'PersonForm', tone: 'blue' },
      { label: 'switch type', tone: 'orange' },
      { label: 'old state removed', tone: 'red' },
      { label: 'CompanyForm gets new state', tone: 'green' },
    ]}
  />
</VisualDiagram>

## JSX location is not the important location

What matters is the resulting render tree, not which `if` branch in the source code produced the JSX.

Two branches can still produce the same component type in the same tree position, causing state to be preserved.

## Keys participate in identity

Keys are not only for list performance. They help React identify sibling positions.

```jsx
<ProfileForm key={user.id} user={user} />
```

When `user.id` changes, React sees a different identity and resets that component subtree.

This can be useful for forms where switching from one entity to another should discard the previous draft.

## Resetting state with a key

Without a key:

```jsx
<Chat contact={selectedContact} />
```

React may preserve the same `Chat` state while props change.

If each contact should have a fresh draft:

```jsx
<Chat key={selectedContact.id} contact={selectedContact} />
```

Now changing contacts intentionally creates a new component identity.

<VisualDiagram title="Key as an identity reset switch" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="key = user-42" tone="blue">Chat draft belongs to user-42.</DiagramNode>
    <DiagramNode title="key = user-91" tone="green">React creates a different Chat identity with a fresh draft.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Keys do not need to be globally unique

A key only needs to distinguish siblings in its current collection or keyed position.

```jsx
<ul>
  {users.map(user => (
    <UserRow key={user.id} user={user} />
  ))}
</ul>
```

The same ID can appear as a key in a different unrelated list without conflict.

## Do not generate unstable keys during render

Bad:

```jsx
<Item key={Math.random()} />
```

Every render produces a new identity.

Result:

<VisualDiagram title="Unstable key → remount loop" compact>
  <LifecycleBar
    items={[
      { label: 'Old component removed', tone: 'red' },
      { label: 'New component mounted', tone: 'orange' },
      { label: 'Local state resets', tone: 'purple' },
      { label: 'DOM may be recreated', tone: 'slate' },
    ]}
  />
</VisualDiagram>

This is not a harmless way to “make React update.”

## Component definitions should not be nested casually

Bad:

```jsx
function App() {
  function Form() {
    const [name, setName] = useState('');
    return <input value={name} onChange={e => setName(e.target.value)} />;
  }

  return <Form />;
}
```

Each `App` render creates a new `Form` function identity. This can lead React to treat it as a different component type and reset state.

Prefer top-level component definitions:

```jsx
function Form() {
  // ...
}

function App() {
  return <Form />;
}
```

## Preserving state intentionally

Preserve state when the user conceptually remains in the same task.

Examples:

- changing a theme while editing a form;
- updating validation messages without discarding inputs;
- filtering a list while keeping selected-item state when identity remains valid.

## Resetting state intentionally

Reset when the user is conceptually starting a different instance of a task.

Examples:

- switching from editing customer A to customer B;
- starting a new checkout session;
- reopening a wizard for a different record;
- changing a game/player identity.

Use structure or keys to express that identity instead of manually clearing dozens of state variables.

## Conditional rendering and identity

Consider:

```jsx
{isLoggedIn ? <Dashboard /> : <LoginForm />}
```

Changing between different component types resets the subtree.

But:

```jsx
{compact ? <Profile compact /> : <Profile compact={false} />}
```

can still preserve `Profile` state because the same component type occupies the same tree position.

## Lists make identity visible

When items reorder, position alone is not enough.

Without stable keys:

<VisualDiagram title="Position-based identity can attach state to the wrong item" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="position 0" tone="orange">state A</DiagramNode>
    <DiagramNode title="position 1" tone="orange">state B</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

After reordering, React can associate the wrong state with the wrong conceptual item.

Stable keys change the model:

<VisualDiagram title="Stable keys attach state to conceptual identity" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="key user-42" tone="blue">state for user-42</DiagramNode>
    <DiagramNode title="key user-91" tone="green">state for user-91</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This is why list keys are fundamentally about identity.

## Common mistakes

### Expecting props changes to reset state

Changing props does not automatically create a new component identity.

### Using random keys to fix stale UI

Random keys hide the real identity problem and force remounts.

### Using array indexes for reorderable lists

Index keys encode position, not item identity. Insertions, deletions, or reordering can move local state to the wrong item.

### Manually clearing many state variables

Before writing ten reset setters, ask whether changing a `key` should represent a new conceptual component instance.

## Debugging “state disappeared”

Ask:

1. Did the component type change?
2. Did the component move to a different tree position?
3. Did its `key` change?
4. Is the component defined inside another component?
5. Was a parent subtree replaced?

## Debugging “state should have reset but did not”

Ask:

1. Is React still seeing the same component type?
2. Is it still in the same position?
3. Should this conceptual entity have a unique key?

## Production example: editing records

```jsx
function CustomerEditor({customer}) {
  return (
    <section>
      <h1>Edit {customer.name}</h1>
      <CustomerForm key={customer.id} customer={customer} />
    </section>
  );
}
```

The key communicates that each customer should have a distinct form state lifetime.

## Exercise

Build two chat contacts. The text input should:

- preserve its draft while unrelated UI changes;
- reset when switching to a different contact.

Implement the behavior using component identity rather than an Effect that clears the input.

## Interview questions

**Junior:** When does React preserve component state?

**Mid-level:** Why can changing a key reset a component's state?

**Senior:** How do type, position, and key work together as identity, and how can poor key design create state bugs?

## Summary

<VisualDiagram title="State identity summary" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Same identity" tone="green">same type + same position/key → preserve state</DiagramNode>
    <DiagramNode title="Different identity" tone="red">type / position / key changes → reset state</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Keys are part of your application's identity model, not a warning-suppression mechanism.

## References

- https://react.dev/learn/preserving-and-resetting-state
- https://react.dev/learn/rendering-lists

## Next

Continue with **[Conditional Rendering](../08-conditional-rendering/conditional-rendering.md)**.
