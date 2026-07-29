---
title: Accessibility Foundations — Semantics, Accessible Names, and useId
description: Build React interfaces on semantic HTML, accessible names, relationships, landmarks, and React useId without misusing ARIA.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
} from '@site/src/components/handbook/VisualDiagram'

# Accessibility Foundations — Semantics, Accessible Names, and `useId`

Accessibility is part of component correctness. React produces DOM; the browser exposes that DOM through semantics, names, states, relationships, focus, and the accessibility tree.

<VisualDiagram title="React does not replace browser semantics">
  <DiagramRow>
    <DiagramNode title="JSX" tone="blue">Elements + props</DiagramNode>
    <DiagramArrow direction="right" label="React DOM" />
    <DiagramNode title="DOM" tone="purple">HTML semantics + attributes</DiagramNode>
    <DiagramArrow direction="right" label="browser maps" />
    <DiagramNode title="Accessibility tree" tone="green">Role · name · state · relationships</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Native HTML first

Prefer:

```tsx
<button onClick={save}>Save</button>
```

over:

```tsx
<div role="button" tabIndex={0} onClick={save}>
  Save
</div>
```

The native button already owns button semantics, focusability, keyboard activation, disabled behavior, and mature browser/assistive-technology support.

<DecisionTree
  question="How should this interaction be represented?"
  items={[
    { label: 'Native HTML element already matches the meaning', value: 'Use the native element first' },
    { label: 'Native HTML cannot express the required widget semantics', value: 'Add ARIA + implement the full expected behavior' },
    { label: 'Only appearance differs', value: 'Keep semantic HTML and style it with CSS' },
  ]}
/>

A role changes semantics. It does **not** automatically implement keyboard behavior.

## Choose elements by meaning

```tsx
<nav aria-label="Primary">...</nav>
<main>...</main>
<article>...</article>
<button>Delete</button>
<a href="/settings">Settings</a>
```

A control that navigates is usually a link. A control that performs an action is usually a button.

## Accessible names

Interactive elements need a useful name.

```tsx
<button>Save profile</button>
```

For an icon-only control:

```tsx
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

<VisualDiagram title="Accessible name sources">
  <DiagramGrid columns={3}>
    <DiagramNode title="Visible text" tone="green">Best default when available</DiagramNode>
    <DiagramNode title="aria-labelledby" tone="teal">Reuse meaningful visible text elsewhere</DiagramNode>
    <DiagramNode title="aria-label" tone="orange">Use when no visible naming content exists</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Visible text is often easiest for everyone to perceive and maintain.

## Forms need persistent labels

```tsx
<label htmlFor={emailId}>Email address</label>
<input id={emailId} type="email" />
```

A placeholder is not a durable replacement for a label because it disappears during input and provides weaker orientation.

## Names and descriptions are different

<VisualDiagram title="Name answers what; description adds context">
  <DiagramRow>
    <DiagramNode title="Accessible name" tone="blue">Password</DiagramNode>
    <DiagramArrow direction="right" label="plus" />
    <DiagramNode title="Description" tone="teal">Use at least 12 characters</DiagramNode>
  </DiagramRow>
</VisualDiagram>

```tsx
const inputId = useId();
const hintId = `${inputId}-hint`;

return (
  <>
    <label htmlFor={inputId}>Password</label>
    <input id={inputId} type="password" aria-describedby={hintId} />
    <p id={hintId}>Use at least 12 characters.</p>
  </>
);
```

## `useId` creates stable DOM relationships

```tsx
function EmailField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

One base ID can create several relationships:

```tsx
const baseId = useId();
const inputId = `${baseId}-input`;
const hintId = `${baseId}-hint`;
const errorId = `${baseId}-error`;
```

## `key`, DOM `id`, and domain identity are different

<VisualDiagram title="Three identity systems solve different problems">
  <DiagramGrid columns={3}>
    <DiagramNode title="React key" tone="purple">Tree identity across sibling renders</DiagramNode>
    <DiagramNode title="DOM id" tone="blue">Document relationships such as label/description</DiagramNode>
    <DiagramNode title="Domain ID" tone="green">Database/API/business identity</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not use `useId` for list keys, persisted record IDs, analytics entity IDs, API resource IDs, or cache keys.

Keys come from the data:

```tsx
items.map(item => <Row key={item.id} item={item} />)
```

React's current documentation also notes that `useId` cannot currently be called in async Server Components.

## Landmarks and headings communicate structure

```tsx
<header>...</header>
<nav aria-label="Primary">...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

When multiple landmarks share a type, give them distinguishable names where useful.

```tsx
<nav aria-label="Primary">...</nav>
<nav aria-label="Account">...</nav>
```

Headings describe document structure, not visual size:

```tsx
<h1>Account settings</h1>
<h2>Profile</h2>
<h2>Security</h2>
<h3>Two-factor authentication</h3>
```

## Images and icons

Informative image:

```tsx
<img src={chartUrl} alt="Revenue increased 18% from January to June" />
```

Decorative image:

```tsx
<img src={dividerUrl} alt="" />
```

A decorative icon inside an already-named button should usually stay out of the accessibility name:

```tsx
<button>
  <SaveIcon aria-hidden="true" />
  Save
</button>
```

## ARIA states must match real UI state

```tsx
<button
  aria-expanded={open}
  aria-controls={panelId}
  onClick={() => setOpen(value => !value)}
>
  Filters
</button>
```

<VisualDiagram title="ARIA is part of rendered truth">
  <DiagramRow>
    <DiagramNode title="React state" tone="purple">open = true</DiagramNode>
    <DiagramArrow direction="right" label="render" />
    <DiagramNode title="Visible UI" tone="blue">Panel is open</DiagramNode>
    <DiagramArrow direction="right" label="must agree" />
    <DiagramNode title="Accessibility state" tone="green">aria-expanded=true</DiagramNode>
  </DiagramRow>
</VisualDiagram>

If ARIA says one thing while the visible UI does another, the accessibility tree is lying.

## Validation relationships

```tsx
function EmailField({ error }: { error?: string }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```

`aria-invalid` communicates state; `aria-describedby` connects the explanation. Add live-region behavior only when the product genuinely needs an announcement.

## Native `disabled` vs `aria-disabled`

<DiagramGrid columns={2}>
  <DiagramNode title="disabled" tone="green">Native control state + browser behavior</DiagramNode>
  <DiagramNode title="aria-disabled" tone="orange">Communicates state only; behavior remains your responsibility</DiagramNode>
</DiagramGrid>

Prefer native disabled controls when they match the design.

## Hidden is not one concept

A subtree may be visually hidden, removed from layout, not focusable, absent from the accessibility tree, or React-hidden with state preserved. These are not equivalent.

Be especially careful with `aria-hidden="true"`: descendants disappear from assistive technology. Do not leave meaningful focusable controls inside such a subtree without a deliberate, tested pattern.

## Semantic testing reinforces accessibility

```tsx
screen.getByRole('button', { name: 'Save profile' });
screen.getByLabelText('Email address');
screen.getByRole('navigation', { name: 'Primary' });
```

These tests protect important parts of the accessibility surface, but they are not a complete accessibility audit.

## Review checklist

1. Is there a native element with the correct meaning?
2. Does every interactive control have a useful accessible name?
3. Are form controls visibly labeled?
4. Are hints/errors connected through correct relationships?
5. Do ARIA states match actual UI state?
6. Are generated IDs unique and used only for DOM relationships?
7. Are icons/images classified by purpose?
8. Do landmarks/headings make page structure understandable?
9. Can semantic tests find the important UI?
10. Have you avoided ARIA where native HTML already solves the problem?

## Interview questions

1. Why should semantic HTML come before ARIA?
2. What is an accessible name?
3. When would you use `aria-labelledby` instead of `aria-label`?
4. What problem does `useId` solve?
5. Why should `useId` not generate list keys?
6. What is the difference between `disabled` and `aria-disabled`?

## References

- https://react.dev/reference/react/useId
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/ARIA/apg/
