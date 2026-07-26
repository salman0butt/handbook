---
title: Accessibility Foundations — Semantics, Accessible Names, and useId
description: Build React interfaces on semantic HTML, accessible names, relationships, landmarks, and React useId without misusing ARIA.
sidebar_position: 1
---

# Accessibility Foundations — Semantics, Accessible Names, and useId

Accessibility is part of component correctness. A UI that only works with a mouse, loses meaning in a screen reader, or exposes unlabeled controls is functionally incomplete.

> **Mental model:** start with native HTML semantics, then add ARIA only where native HTML cannot express the required widget behavior.

React does not replace the browser accessibility tree. Your JSX becomes DOM, and the DOM's semantics, names, states, relationships, and focus behavior determine what assistive technologies can understand.

## 1. Native HTML first

Prefer:

```tsx
<button onClick={save}>Save</button>
```

Over:

```tsx
<div role="button" tabIndex={0} onClick={save}>
  Save
</div>
```

The native `<button>` already has:

- button semantics;
- keyboard activation behavior;
- focusability;
- disabled behavior;
- expected browser/assistive-technology support.

A role changes semantics; it does not automatically implement browser behavior.

## 2. Choose elements by meaning, not appearance

Examples:

```tsx
<nav aria-label="Primary">...</nav>
<main>...</main>
<article>...</article>
<button>Delete</button>
<a href="/settings">Settings</a>
<label htmlFor={emailId}>Email</label>
<input id={emailId} type="email" />
```

CSS can make a button look like a link or a link look like a button. The element should still represent what it does.

- navigates somewhere → link;
- performs an action → button.

## 3. Accessible names

Interactive elements need meaningful names so users can understand their purpose and distinguish them from similar controls.

Strong:

```tsx
<button>Save profile</button>
```

Icon-only control:

```tsx
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

Visible text is often the most robust name because everyone can perceive and maintain it.

## 4. Prefer visible labels for form controls

```tsx
<label htmlFor={emailId}>Email address</label>
<input id={emailId} type="email" />
```

or:

```tsx
<label>
  Email address
  <input type="email" />
</label>
```

A placeholder is not a good replacement for a persistent label:

```tsx
<input placeholder="Email address" />
```

Placeholder text disappears during input and is only a fallback naming mechanism in accessibility APIs.

## 5. `aria-label` and `aria-labelledby`

Use `aria-label` when no visible text can provide the name:

```tsx
<button aria-label="Delete invoice 42">
  <TrashIcon aria-hidden="true" />
</button>
```

Use `aria-labelledby` when visible content elsewhere already provides the name:

```tsx
<h2 id={titleId}>Delete invoice?</h2>
<div role="dialog" aria-labelledby={titleId}>
  ...
</div>
```

Prefer reusing visible text rather than maintaining duplicate hidden strings when possible.

## 6. Accessible descriptions

Names answer "what is this?" Descriptions can add supporting information.

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

The field keeps a concise name, while the hint supplies additional description.

## 7. `useId` for stable React-generated relationships

React's `useId` generates an ID associated with a Hook call in a component.

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

This is especially useful for reusable components that can appear multiple times on a page.

## 8. One base ID can create related IDs

```tsx
function PasswordField() {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;

  return (
    <div>
      <label htmlFor={inputId}>Password</label>
      <input
        id={inputId}
        type="password"
        aria-describedby={`${hintId} ${errorId}`}
      />
      <p id={hintId}>At least 12 characters.</p>
      <p id={errorId}>...</p>
    </div>
  );
}
```

Only include an error description ID when the error element is actually present if that produces a cleaner relationship for your implementation.

## 9. Do not use `useId` for list keys

Wrong:

```tsx
items.map((item) => <Row key={useId()} item={item} />)
```

`useId` is a Hook and cannot be called inside the loop, and React explicitly says it should not generate list keys.

Keys come from data identity:

```tsx
items.map((item) => <Row key={item.id} item={item} />)
```

Remember the distinction:

```text
key
→ React tree identity

id
→ DOM relationship/document identity
```

They solve different problems.

## 10. Do not use `useId` as a domain ID or cache key

A generated accessibility ID is not your database identifier.

Do not use it for:

- persisted record IDs;
- cache keys;
- analytics entity IDs;
- API resource IDs;
- business identity.

Generate those from the relevant domain/data system.

## 11. Async Server Component caveat

React's current `useId` documentation notes that `useId` cannot currently be used in async Server Components.

Place the ID-generating logic in a supported component boundary or use framework/server data where appropriate.

## 12. Landmarks

Semantic landmarks help users navigate page structure.

Typical elements:

```tsx
<header>...</header>
<nav aria-label="Primary">...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

If multiple landmarks of the same type exist, give them distinguishable names when needed:

```tsx
<nav aria-label="Primary">...</nav>
<nav aria-label="Account">...</nav>
```

Do not add landmark roles redundantly when the native element already provides the semantics.

## 13. Headings communicate structure

```tsx
<h1>Account settings</h1>
<h2>Profile</h2>
<h2>Security</h2>
<h3>Two-factor authentication</h3>
```

Choose heading levels for document structure, not font size.

Style them with CSS.

## 14. Images

Informative image:

```tsx
<img src={chartUrl} alt="Revenue increased 18% from January to June" />
```

Decorative image:

```tsx
<img src={dividerUrl} alt="" />
```

The correct alternative text depends on the image's purpose in context, not a mechanical description of pixels.

## 15. Icon components

A decorative icon inside a named button should usually not add a second name:

```tsx
<button>
  <SaveIcon aria-hidden="true" />
  Save
</button>
```

For icon-only controls, name the control:

```tsx
<button aria-label="Search">
  <SearchIcon aria-hidden="true" />
</button>
```

The button owns the interaction semantics.

## 16. ARIA states should match real state

```tsx
<button
  aria-expanded={open}
  aria-controls={panelId}
  onClick={() => setOpen((value) => !value)}
>
  Filters
</button>
```

If `aria-expanded` says `true` while the panel is closed, the accessibility tree lies.

Treat ARIA state as part of the rendered UI contract.

## 17. Validation relationships

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
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

`aria-invalid` communicates state. `aria-describedby` associates the explanation.

Use live-region/alert behavior deliberately; do not make every piece of text an alert.

## 18. Native disabled vs ARIA disabled

```tsx
<button disabled>Save</button>
```

Native `disabled` changes browser behavior as well as semantics.

```tsx
<div role="button" aria-disabled="true">...</div>
```

`aria-disabled` communicates state but does not automatically prevent clicks, keyboard activation, focus, or form behavior.

Prefer native disabled controls when they match the design.

## 19. Hidden content

Ask which kind of hidden you mean:

- not visually shown;
- not in layout;
- not focusable;
- not in the accessibility tree;
- state preserved but effects disconnected (`<Activity mode="hidden">` has React-specific behavior).

These are not equivalent.

Be careful with `aria-hidden="true"`: descendants are hidden from assistive technology even if visually present.

Never leave focusable interactive elements inside a subtree that assistive technology cannot perceive without a deliberate, tested pattern.

## 20. Semantic Testing Library queries reinforce accessibility

```tsx
screen.getByRole('button', { name: 'Save profile' });
screen.getByLabelText('Email address');
screen.getByRole('navigation', { name: 'Primary' });
```

These queries encourage the DOM to expose meaningful semantics and names.

A semantic test is not a full accessibility audit, but it protects important parts of the accessibility tree.

## 21. Common mistakes

### "ARIA makes any element accessible"

No. ARIA provides semantics and state. Authors still own behavior and keyboard support for custom widgets.

### Placeholder-only labels

Placeholders are not persistent labels.

### Icon-only buttons without a name

The visual icon alone does not guarantee an accessible name.

### `aria-label` everywhere

Visible text and native labeling are often easier to maintain.

### `useId` for data identity

It is intended for React-generated DOM relationships, not business identity.

### Heading levels chosen by visual size

Use CSS for appearance and headings for structure.

## 22. Accessibility review checklist

For a component, ask:

1. Is there a native element that already provides the right semantics?
2. Does every interactive control have a useful accessible name?
3. Are form controls visibly labeled?
4. Are hints/errors connected with appropriate relationships?
5. Are ARIA states synchronized with actual UI state?
6. Are repeated IDs unique?
7. Are icons decorative or meaningful, and treated accordingly?
8. Does the page have useful landmarks/headings?
9. Can semantic queries locate the important UI?
10. Have we avoided adding ARIA where native HTML already solves the problem?

## Exercise

Build an accessible reusable `Field` component supporting:

- visible label;
- optional hint;
- optional error;
- `useId`-generated relationships;
- `aria-invalid` only when invalid;
- standard input props;
- multiple instances on one page without ID collisions;
- Testing Library tests using role/name or label queries.

Explain why the field ID must not be reused as a React list key or domain identifier.

## Interview questions

1. Why should semantic HTML come before ARIA?
2. What is an accessible name?
3. When would you use `aria-labelledby` instead of `aria-label`?
4. What problem does `useId` solve in reusable React components?
5. Why should `useId` not generate list keys?
6. What is the difference between a React `key` and a DOM `id`?
7. Why does `aria-disabled` not behave like native `disabled`?
8. How can Testing Library semantic queries expose accessibility regressions?

## References

- https://react.dev/reference/react/useId
- https://react.dev/reference/react-dom/components/common
- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
