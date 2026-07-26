---
title: Design Systems and Component APIs
description: Designing reusable React primitives, variants, slots, composition, accessibility contracts, and scalable design-system architecture.
sidebar_position: 2
---

# Design Systems and Component APIs

A design system is more than a folder of buttons.

It combines:

- visual tokens;
- reusable primitives;
- behavior contracts;
- accessibility;
- state conventions;
- API consistency;
- documentation;
- testing.

The hardest part is often not CSS. It is **API design**.

## Start with semantic primitives

A button primitive should still be a real button when the interaction is a button.

```jsx
function Button(props) {
  return <button {...props} />;
}
```

Semantics are the foundation for:

- keyboard behavior;
- accessible names;
- focus;
- form behavior;
- browser defaults.

Do not rebuild native behavior unless requirements demand it.

## Variant APIs

Prefer small, intentional variant contracts.

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};
```

Avoid a giant bag of unrelated booleans:

```jsx
<Button
  primary
  danger
  compact
  outlined
  blue
  rounded
  large
/>
```

This creates invalid combinations and unclear precedence.

## Reuse native props

With TypeScript:

```tsx
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};
```

This preserves standard button props:

- `disabled`;
- `type`;
- `aria-*`;
- `onClick`;
- form behavior;
- data attributes.

## React 19 refs

Function components can accept `ref` as a prop in React 19.

```tsx
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  ref?: React.Ref<HTMLInputElement>;
};

function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />;
}
```

For modern code, this can remove the need for `forwardRef` in many component APIs.

## Composition over configuration

A highly configured component can become rigid.

Instead of:

```jsx
<Card
  title="Revenue"
  subtitle="Last 30 days"
  icon="chart"
  footerText="Updated now"
  showDivider
/>
```

consider compositional structure:

```jsx
<Card>
  <Card.Header>
    <Card.Title>Revenue</Card.Title>
    <Card.Description>Last 30 days</Card.Description>
  </Card.Header>
  <Card.Content>
    <RevenueChart />
  </Card.Content>
  <Card.Footer>Updated now</Card.Footer>
</Card>
```

Composition lets product code control structure while the design system controls contracts and styling.

## Compound components

Compound components group related primitives under one conceptual API.

Example:

```jsx
<Tabs value={tab} onValueChange={setTab}>
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="overview">
    <Overview />
  </Tabs.Panel>
</Tabs>
```

The design system owns:

- tab semantics;
- keyboard behavior;
- focus management;
- selected state;
- ARIA relationships.

The product owns content.

## Context inside compound components

Context can connect compound children:

```text
Tabs provider
 ├── Tabs.List
 ├── Tabs.Trigger
 └── Tabs.Panel
```

Keep the Context internal to the primitive when possible.

Consumers should use the public component API rather than internal provider values.

## Controlled and uncontrolled APIs

Reusable primitives often need both modes.

Controlled:

```jsx
<Dialog open={open} onOpenChange={setOpen} />
```

Uncontrolled:

```jsx
<Dialog defaultOpen />
```

The component should have one clear ownership model per instance.

Do not switch between controlled and uncontrolled behavior accidentally.

## Event naming

Name events by domain state changes.

Examples:

```text
onOpenChange
onValueChange
onSelectionChange
onCheckedChange
```

These are often more reusable than DOM-specific names when the component represents a higher-level primitive.

At the lowest DOM wrapper level, preserve native event behavior where possible.

## Do not swallow consumer handlers

Bad:

```jsx
function Button(props) {
  return (
    <button
      {...props}
      onClick={() => trackClick()}
    />
  );
}
```

The consumer's `onClick` gets overwritten.

Better:

```jsx
function Button({ onClick, ...props }) {
  function handleClick(event) {
    trackClick();
    onClick?.(event);
  }

  return <button {...props} onClick={handleClick} />;
}
```

Even here, ask whether analytics belongs inside the primitive at all.

## Prop spreading order matters

```jsx
<button {...props} className="button" />
```

means consumer `className` is overwritten.

```jsx
<button className="button" {...props} />
```

means consumer `className` can replace system styling.

Usually you need deliberate merging:

```jsx
<button
  {...props}
  className={mergeClasses('button', props.className)}
/>
```

Treat prop merging as an API decision.

## Slots and `asChild` patterns

Some design systems allow a primitive to delegate its rendered element to a child.

Conceptually:

```jsx
<Button asChild>
  <a href="/pricing">Pricing</a>
</Button>
```

This can preserve product semantics while reusing styling/behavior.

But slot APIs require careful handling of:

- refs;
- event merging;
- accessibility;
- prop precedence;
- disabled behavior;
- TypeScript inference.

Do not implement a slot system casually.

## Polymorphic `as` APIs

Another pattern:

```jsx
<Text as="label">Email</Text>
```

Polymorphism can be useful for low-level layout/typography primitives.

But broad `as` APIs increase typing and semantic complexity.

A component named `Button` rendering arbitrary elements can create misuse.

Prefer polymorphism where the conceptual primitive remains valid.

## Accessibility is part of the component contract

A Dialog primitive should own:

- `role="dialog"` behavior;
- accessible name;
- focus movement;
- focus restoration;
- Escape handling;
- modal interaction rules where applicable.

Do not make every product team reimplement these details.

The design system should centralize hard accessibility behavior.

## `useId` for internal relationships

Reusable primitives can use `useId` for generated relationships.

```jsx
function Field({ label, error }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```

Do not use `useId` for list keys.

## Separate tokens from component logic

Design tokens describe the visual system:

```text
spacing
colors
typography
radii
shadows
motion
```

Components consume tokens.

Avoid embedding one-off product values throughout primitive code.

## Variant implementation

A variant system can map semantic props to classes/tokens.

```ts
const variants = {
  primary: 'bg-brand text-on-brand',
  secondary: 'bg-muted text-default',
};
```

Keep product semantics in mind.

`danger` is usually more meaningful than `red`.

## Headless vs styled primitives

### Headless

Provides behavior/accessibility, minimal styling.

Useful when multiple brands need different visual systems.

### Styled

Provides behavior + standard visual design.

Useful when product consistency is the goal.

Some systems layer them:

```text
headless behavior primitive
   ↓
styled system component
   ↓
product composition
```

## Avoid business logic in shared primitives

Bad shared Button:

```jsx
function Button({ productId }) {
  const cart = useCart();
  // ...
}
```

Now the button is coupled to ecommerce.

Better:

```jsx
<Button onClick={() => addToCart(productId)}>
  Add to cart
</Button>
```

Shared primitives should stay product-agnostic unless intentionally domain-specific.

## Design system state ownership

A primitive may own interaction state that is intrinsic to the primitive.

Examples:

- tooltip open state;
- menu active item;
- tabs keyboard focus;
- accordion expanded item.

But product/domain state should remain outside.

Example:

```text
Menu owns highlighted item
Product owns selected account
```

## Styling performance

Avoid runtime styling architecture that adds expensive style recalculation without a strong reason.

Static CSS extraction, CSS modules, utility CSS, or compiled styling systems can reduce runtime work.

`useInsertionEffect` exists for library authors who must inject styles dynamically, but React explicitly treats this as a specialized case.

## Component API stability

A design system is infrastructure.

Breaking prop changes can affect hundreds of call sites.

Prefer:

- small explicit APIs;
- deprecation paths;
- codemods for large migrations;
- documentation examples;
- versioned release notes.

## Testing design-system primitives

Test contracts, not internal implementation.

For a Dialog:

- trigger opens dialog;
- accessible name exists;
- focus enters appropriately;
- Escape closes if designed to;
- focus restores;
- controlled mode works;
- uncontrolled mode works.

For a Button:

- native button semantics remain;
- disabled behavior works;
- ref points to actual element;
- consumer event runs.

## Performance and API design

Stable APIs can reduce unnecessary prop churn.

Prefer passing domain primitives over newly created configuration objects when practical.

But do not distort usability solely for memoization.

React Compiler reduces the need for consumers to micromanage value/function identity.

## Common mistakes

### Rebuilding native controls with `div`

Creates keyboard/accessibility debt.

### Giant boolean prop matrices

Creates invalid combinations and unclear styling precedence.

### Making every component polymorphic

Increases complexity without clear value.

### Leaking internal Context

Consumers become coupled to implementation details.

### Hiding domain state inside shared primitives

Makes reuse fake.

### Inconsistent controlled/uncontrolled contracts

Creates hard-to-debug ownership changes.

## Exercise

Design a reusable `Select` primitive.

Define:

1. semantic structure;
2. controlled API;
3. uncontrolled API;
4. keyboard behavior;
5. accessible name strategy;
6. ref behavior;
7. option identity;
8. disabled option behavior;
9. styling variants;
10. what belongs in the design system vs product code.

## Interview questions

### Why prefer composition over large configuration objects?

Composition gives consumers structural flexibility while keeping reusable behavior and styling in primitives, avoiding huge prop matrices.

### What should a design system own about accessibility?

The difficult reusable behavior intrinsic to each primitive—semantics, keyboard interaction, focus, naming relationships, and state ARIA—not product-specific content.

### What is the difference between controlled and uncontrolled components?

Controlled components receive current state and change callbacks from the owner. Uncontrolled components own their state internally, usually initialized with a default value.

### Why are semantic variant names useful?

They encode product intent (`danger`, `primary`) rather than implementation details (`red`, `blue`), making tokens/theme changes easier.
