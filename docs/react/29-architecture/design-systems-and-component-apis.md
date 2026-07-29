---
title: Design Systems and Component APIs
description: Designing reusable React primitives, variants, slots, composition, accessibility contracts, and scalable design-system architecture.
sidebar_position: 2
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Design Systems and Component APIs

A design system is not just a folder of styled components. It is a set of **stable product-independent contracts** for semantics, interaction, accessibility, visual language, and composition.

## Start with semantics

```jsx
function Button(props) {
  return <button {...props} />;
}
```

<VisualDiagram title="Native semantics provide behavior before styling begins">
  <DiagramStack>
    <DiagramNode title="Semantic element" tone="blue">button · input · label · nav · dialog</DiagramNode>
    <DiagramArrow label="browser platform supplies" />
    <DiagramGrid columns={4}>
      <DiagramNode title="Keyboard" tone="cyan">expected activation</DiagramNode>
      <DiagramNode title="Focus" tone="purple">native focus behavior</DiagramNode>
      <DiagramNode title="Accessibility" tone="green">role/name/state foundation</DiagramNode>
      <DiagramNode title="Forms" tone="orange">submission + disabled semantics</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

A `role` can change semantics; it does not recreate all native behavior for you.

## Keep variant contracts intentional

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};
```

<DecisionTree
  question="Should this become a component prop?"
  items={[
    { label: 'It represents a stable supported product/design variant', value: 'Expose an intentional prop' },
    { label: 'It is normal native element behavior', value: 'Reuse native prop types' },
    { label: 'It is arbitrary visual configuration', value: 'Prefer composition/tokens instead of prop explosion' },
    { label: 'It creates contradictory combinations', value: 'Model mutually exclusive variants explicitly' },
  ]}
/>

Avoid boolean matrices such as `primary`, `danger`, `outlined`, `blue`, and `large` when those combinations do not form a coherent public contract.

## Reuse native DOM contracts

```tsx
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};
```

This preserves native `disabled`, `type`, `aria-*`, event, form, and data-attribute behavior.

React 19 also supports receiving `ref` as a normal prop in function components:

```tsx
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  ref?: React.Ref<HTMLInputElement>;
};

function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />;
}
```

## Composition beats configuration when structure varies

<VisualDiagram title="Choose who owns structure">
  <DiagramRow>
    <DiagramNode title="Configured component" tone="orange">Library owns structure; caller fills predefined fields</DiagramNode>
    <DiagramArrow direction="right" label="vs" />
    <DiagramNode title="Composable primitive" tone="green">Library owns contracts; product owns composition</DiagramNode>
  </DiagramRow>
</VisualDiagram>

```jsx
<Card>
  <Card.Header>
    <Card.Title>Revenue</Card.Title>
    <Card.Description>Last 30 days</Card.Description>
  </Card.Header>
  <Card.Content><RevenueChart /></Card.Content>
  <Card.Footer>Updated now</Card.Footer>
</Card>
```

Use configuration for genuinely fixed structure. Use composition when callers need meaningful structural freedom.

## Compound components coordinate one interaction model

<VisualDiagram title="Compound component ownership">
  <DiagramStack>
    <DiagramNode title="Tabs" tone="blue">public root API + internal coordination</DiagramNode>
    <DiagramArrow label="internal Context" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Tabs.List" tone="cyan">group semantics</DiagramNode>
      <DiagramNode title="Tabs.Trigger" tone="purple">focus + selected state</DiagramNode>
      <DiagramNode title="Tabs.Panel" tone="green">content relationship</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

The design system owns keyboard behavior, focus management, selected state, and ARIA relationships. Product code owns the content.

Keep internal provider values private when possible; consumers should depend on the documented component API.

## Controlled and uncontrolled ownership

<DecisionTree
  question="Who owns the value for this instance?"
  items={[
    { label: 'Parent passes value + change callback', value: 'Controlled: parent is source of truth' },
    { label: 'Caller passes default value only', value: 'Uncontrolled: component owns state' },
  ]}
/>

```jsx
<Dialog open={open} onOpenChange={setOpen} />
<Dialog defaultOpen />
```

Do not switch ownership modes accidentally during the same component lifetime.

## Events should match the abstraction level

<DiagramGrid columns={2}>
  <DiagramNode title="DOM wrapper" tone="cyan">Preserve native event contracts when callers need them</DiagramNode>
  <DiagramNode title="Higher-level primitive" tone="green">Prefer domain events such as onOpenChange or onValueChange</DiagramNode>
</DiagramGrid>

A `Select` consumer often cares that the selected value changed, not which DOM event produced it.

## Prop merging is part of correctness

Do not swallow consumer handlers:

```jsx
function Button({ onClick, ...props }) {
  function handleClick(event) {
    trackClick();
    onClick?.(event);
  }

  return <button {...props} onClick={handleClick} />;
}
```

Also decide deliberately how `className`, `style`, IDs, ARIA props, and event cancellation are merged. The order of prop spreading can change the public contract.

## Accessibility belongs in the primitive contract

<VisualDiagram title="A reusable interaction primitive owns more than appearance">
  <DiagramGrid columns={3}>
    <DiagramNode title="Semantics" tone="blue">role · name · state · relationships</DiagramNode>
    <DiagramNode title="Interaction" tone="purple">keyboard · pointer · focus · dismissal</DiagramNode>
    <DiagramNode title="Composition" tone="green">slots · children · controlled state</DiagramNode>
    <DiagramNode title="DOM contract" tone="cyan">native props · refs · data attributes</DiagramNode>
    <DiagramNode title="Visual contract" tone="orange">tokens · variants · responsive behavior</DiagramNode>
    <DiagramNode title="Quality" tone="slate">tests · docs · migration notes</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Types can enforce props; they cannot by themselves guarantee keyboard semantics or focus behavior.

## Keep product state out of the design system

<VisualDiagram title="Design system vs product ownership">
  <DiagramRow>
    <DiagramNode title="Design system" tone="blue">Dialog behavior · Button semantics · tokens · form primitives</DiagramNode>
    <DiagramArrow direction="right" label="composed by" />
    <DiagramNode title="Product feature" tone="green">Billing cancellation · checkout workflow · permissions</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A generic `Dialog` is infrastructure. `EnterpriseBillingCancellationDialog` is usually product behavior and should remain in the feature layer.

## Headless vs styled APIs

Headless primitives can expose robust behavior while leaving visual composition to a product or design layer. Styled primitives can encode visual policy directly.

<DecisionTree
  question="How much should the primitive own?"
  items={[
    { label: 'Many brands/presentations reuse one complex interaction model', value: 'Headless behavior can be valuable' },
    { label: 'One product needs a stable visual system', value: 'Styled semantic primitives reduce repetition' },
    { label: 'Business rules differ between usages', value: 'Keep those rules outside the primitive' },
  ]}
/>

## Design-system change lifecycle

<LifecycleBar items={[
  { label: 'Identify stable need', tone: 'blue' },
  { label: 'Design semantic API', tone: 'cyan' },
  { label: 'Implement interaction + a11y', tone: 'purple' },
  { label: 'Test contracts', tone: 'orange' },
  { label: 'Document usage', tone: 'green' },
  { label: 'Version + migrate safely', tone: 'slate' },
]} />

A good design-system API is hard to misuse, easy to compose, accessible by default, and stable enough that many teams can depend on it without freezing its internals forever.
