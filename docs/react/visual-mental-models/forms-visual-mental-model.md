---
title: Forms — Visual Mental Model
description: Visualize controlled and uncontrolled form ownership, validation, FormData, submission, server errors, and React form Actions.
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

# Forms — visual mental model

A form is easiest to understand when you first decide **who owns the current field value**.

<VisualDiagram title="Controlled vs uncontrolled ownership">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="Controlled" title="React state owns the current value">
      input event → state update → render → `value` prop reflects the state snapshot
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Uncontrolled" title="The DOM input owns the current value">
      React can read the value later through form submission, `FormData`, or a ref when necessary.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Controlled input loop

<VisualDiagram title="Controlled input data flow">
  <LifecycleBar
    items={[
      { label: 'state snapshot', tone: 'blue' },
      { label: 'value prop', tone: 'purple' },
      { label: 'user types', tone: 'orange' },
      { label: 'onChange', tone: 'cyan' },
      { label: 'setState', tone: 'green' },
      { label: 'next render', tone: 'blue' },
    ]}
  />
</VisualDiagram>

## Uncontrolled submission flow

<VisualDiagram title="DOM-owned values → FormData">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="Native form controls hold current values" wide>`name` attributes identify submitted fields.</DiagramNode>
    <DiagramArrow label="submit" />
    <DiagramNode tone="blue" title="FormData captures the form payload" wide>Read the values at the submission boundary.</DiagramNode>
    <DiagramArrow label="validate / transform" />
    <DiagramNode tone="purple" title="Application or server action" wide>Perform the real domain mutation.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Validation belongs at multiple boundaries

<VisualDiagram title="Validation is layered, not one-time">
  <DiagramStack align="center">
    <DiagramNode tone="cyan" title="Browser/native constraints" wide>Useful immediate feedback for simple rules.</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="blue" title="Client validation" wide>Improves UX and can explain domain-friendly errors early.</DiagramNode>
    <DiagramArrow label="network trust boundary" />
    <DiagramNode tone="red" title="Server validation" wide>Required because client input is untrusted.</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="green" title="Persisted domain change" wide>Only validated and authorized data should reach the mutation.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Submission states

<VisualDiagram title="Form submission lifecycle">
  <LifecycleBar
    items={[
      { label: 'editing', tone: 'blue' },
      { label: 'validate', tone: 'cyan' },
      { label: 'pending', tone: 'orange' },
      { label: 'success or error', tone: 'purple' },
      { label: 'reset / keep draft / show errors', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Server errors are different from field typing errors

<VisualDiagram title="Client form state + server mutation state">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Form state">values · touched/dirty concepts · local validation · draft lifecycle</DiagramNode>
    <DiagramNode tone="purple" title="Server mutation state">authorization · domain validation · persistence · remote failure · returned result</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="map useful server errors back into the form UI" />
  <DiagramNode tone="green" title="Accessible feedback" wide>Associate errors with the right fields or form-level status and keep the user informed.</DiagramNode>
</VisualDiagram>

## Native forms, React state, Actions, or a form library?

<DecisionTree
  question="How complex is this form workflow?"
  items={[
    { label: 'Simple submission with native fields?', value: 'HTML form + FormData may be enough' },
    { label: 'UI must react immediately to every value?', value: 'Controlled React state can fit' },
    { label: 'Many fields, dirty/touched metadata, dynamic arrays, isolated subscriptions?', value: 'A form library such as React Hook Form may fit' },
    { label: 'Mutation can be expressed as a React form Action?', value: 'Use the modern Action workflow where appropriate' },
    { label: 'Validation affects authorization or persisted data?', value: 'Validate again on the server' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="Form architecture" compact>
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="user edits a draft" wide />
    <DiagramArrow label="submit" />
    <DiagramNode tone="cyan" title="validate" wide />
    <DiagramArrow label="mutation boundary" />
    <DiagramNode tone="purple" title="server/domain work" wide />
    <DiagramArrow />
    <DiagramNode tone="green" title="success or actionable errors" wide />
  </DiagramStack>
</VisualDiagram>

Continue with the detailed Forms chapter for controlled/uncontrolled inputs, `FormData`, validation, React 19 form Actions, accessibility, and production patterns.
