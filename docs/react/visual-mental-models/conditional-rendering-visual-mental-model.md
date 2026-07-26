---
title: Conditional Rendering — Visual Mental Model
description: Visualize React rendering branches with early returns, ternaries, logical AND, null, and derived conditions without turning JSX into nested control-flow puzzles.
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
} from '@site/src/components/handbook/VisualDiagram'

# Conditional Rendering — visual mental model

Conditional rendering means choosing **which UI description to return for the current inputs**.

<VisualDiagram title="Condition → chosen UI branch">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Current props + state" wide>`isLoggedIn`, `error`, `items.length`, `role`</DiagramNode>
    <DiagramArrow label="evaluate condition" />
    <DiagramGrid columns={3}>
      <DiagramNode tone="green" title="Branch A">render one UI shape</DiagramNode>
      <DiagramNode tone="purple" title="Branch B">render an alternative</DiagramNode>
      <DiagramNode tone="slate" title="No UI">return `null` when nothing should render</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Early return vs inline choice

<VisualDiagram title="Choose control flow by readability">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="Whole screen/section" title="Early return">Use normal `if` when a condition selects a substantially different render path.</DiagramNode>
    <DiagramNode tone="purple" eyebrow="Two inline alternatives" title="Ternary">Use `condition ? A : B` when both branches are compact and related.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Optional UI" title="Logical AND">Use `condition && <Thing />` when the false case means “render nothing.”</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## The `&&` number trap

<VisualDiagram title="Why `items.length && ...` can render 0">
  <DiagramStack align="center">
    <DiagramNode tone="orange" title="items.length = 0" wide />
    <DiagramArrow label="0 && <List /> evaluates to" />
    <DiagramNode tone="red" title="0" wide>React can render the number zero.</DiagramNode>
    <DiagramArrow label="make the condition explicitly boolean" />
    <DiagramNode tone="green" title="items.length > 0 && <List />" wide />
  </DiagramStack>
</VisualDiagram>

## Derive conditions before JSX gets noisy

<VisualDiagram title="Calculate meaning first, render second">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Raw data" wide>`user`, `permissions`, `subscription`, `items`</DiagramNode>
    <DiagramArrow label="derive meaningful booleans" />
    <DiagramGrid columns={3}>
      <DiagramNode tone="cyan" title="canCheckout" />
      <DiagramNode tone="purple" title="showAdminTools" />
      <DiagramNode tone="orange" title="isEmpty" />
    </DiagramGrid>
    <DiagramArrow label="use clear conditions in JSX" />
    <DiagramNode tone="green" title="Readable render branches" wide />
  </DiagramStack>
</VisualDiagram>

<DecisionTree
  question="Which conditional pattern fits?"
  items={[
    { label: 'Entire component/page has an exceptional branch?', value: 'Early return with if' },
    { label: 'Exactly two small alternatives?', value: 'Ternary' },
    { label: 'Render something only when true?', value: 'Boolean && JSX' },
    { label: 'Render nothing for one branch?', value: 'return null' },
    { label: 'Expression is becoming deeply nested?', value: 'Extract variables, helpers, or components' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="Conditional rendering is still rendering" compact>
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="inputs" wide />
    <DiagramArrow label="choose branch" />
    <DiagramNode tone="green" title="return the UI for this render" wide />
  </DiagramStack>
</VisualDiagram>

Continue with the detailed Conditional Rendering chapter for code examples, nested conditions, `null`, and readability trade-offs.
