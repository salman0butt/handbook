---
title: React DOM Components, Custom Elements, and SVG
description: Cover common DOM props/events, custom attributes, dangerouslySetInnerHTML, contentEditable, custom elements, SVG, and browser integration boundaries.
sidebar_position: 2
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

# React DOM components, custom elements, and SVG

React DOM translates React element descriptions into browser HTML/SVG nodes. The browser still owns semantics, layout, accessibility, native controls, network behavior, and low-level DOM rules.

## The platform mental model

<VisualDiagram title="React renders into the browser platform">
  <DiagramStack align="center">
    <DiagramNode title="JSX" tone="blue">Declarative UI source</DiagramNode>
    <DiagramArrow label="becomes" />
    <DiagramNode title="React element descriptions" tone="purple" />
    <DiagramArrow label="React DOM renderer" />
    <DiagramNode title="HTML / SVG DOM nodes" tone="teal" />
    <DiagramArrow label="browser owns semantics + behavior" />
    <DiagramNode title="Layout, events, forms, accessibility, rendering" tone="green" />
  </DiagramStack>
</VisualDiagram>

React does not replace HTML semantics. Prefer native browser behavior whenever it already solves the interaction correctly.

## Built-in elements and component names

```jsx
<div />
<button />
<svg />
```

Lowercase JSX names are browser elements. Capitalized names are React components:

```jsx
<Button />
```

## DOM prop conventions

```jsx
<label htmlFor="email">Email</label>
<input id="email" className="field" tabIndex={0} />
```

<VisualDiagram title="JSX prop names usually follow DOM property conventions">
  <DiagramGrid columns={3}>
    <DiagramNode title="HTML class" tone="slate">→ <code>className</code></DiagramNode>
    <DiagramNode title="HTML for" tone="slate">→ <code>htmlFor</code></DiagramNode>
    <DiagramNode title="HTML tabindex" tone="slate">→ <code>tabIndex</code></DiagramNode>
  </DiagramGrid>
</VisualDiagram>

ARIA and data attributes keep their normal names:

```jsx
<button aria-expanded={open}>Menu</button>
<div data-user-id={user.id} />
```

Use JavaScript values directly rather than stringifying everything:

```jsx
<button disabled={isSaving}>Save</button>
<input maxLength={120} />
```

## Events

```jsx
<button onClick={handleClick}>Save</button>
<input onChange={handleChange} />
<div onPointerMove={handlePointerMove} />
```

Event props use camelCase, with capture variants such as `onClickCapture`.

React's documented event behavior is the contract to program against. Do not assume every browser event maps one-to-one to browser bubbling details.

## Styling

```jsx
<div
  style={{
    width: 320,
    opacity: isDisabled ? 0.5 : 1,
  }}
/>
```

Use inline styles for genuinely dynamic values. Static styling is usually easier to maintain through classes.

## Raw HTML is a trust boundary

```jsx
<div dangerouslySetInnerHTML={{ __html: html }} />
```

<VisualDiagram title="Normal JSX and raw HTML have different security contracts">
  <DiagramGrid columns={2}>
    <DiagramNode title="Normal JSX text" tone="green" eyebrow="SAFE DEFAULT">
      Value → React escaping → DOM text/content
    </DiagramNode>
    <DiagramNode title="dangerouslySetInnerHTML" tone="red" eyebrow="TRUST BOUNDARY">
      HTML string → bypass normal escaping → browser parses markup
      <br />Sanitization and content policy become your responsibility.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Never feed unsanitized user or CMS HTML into this API.

```jsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

When raw HTML is required, sanitize at a trusted boundary with a maintained sanitizer and explicit content policy.

Children and `dangerouslySetInnerHTML` are mutually exclusive: React needs one clear owner for an element's contents.

## `contentEditable` creates competing ownership

```jsx
<div contentEditable />
```

A browser-editable subtree changes the DOM directly while React normally expects to derive child DOM from JSX.

<VisualDiagram title="Rich-text editors need one clear DOM owner">
  <DiagramGrid columns={2}>
    <DiagramNode title="React-controlled children" tone="purple">React computes and owns child DOM.</DiagramNode>
    <DiagramNode title="Editable/browser/library-owned DOM" tone="orange">Browser/editor mutates child DOM directly.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not casually combine both ownership models. `suppressContentEditableWarning` exists for libraries that intentionally take responsibility; it does not repair an unclear architecture.

## Hydration warning escape hatch

```jsx
<time suppressHydrationWarning>
  {clientSpecificTime}
</time>
```

Use `suppressHydrationWarning` only for narrow intentional differences. It suppresses a warning; it does not make a nondeterministic server/client render correct.

## DOM refs

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
```

After commit, the ref points to the DOM node. React 19 also supports callback-ref cleanup:

```jsx
<div
  ref={node => {
    observe(node);
    return () => unobserve(node);
  }}
/>
```

---

# Custom elements

Web Components expose browser-native custom tags such as:

```jsx
<user-avatar user-id="42" />
```

## Attributes and properties are different channels

<VisualDiagram title="A custom element may expose both markup attributes and JavaScript properties">
  <DiagramGrid columns={2}>
    <DiagramNode title="Attribute" tone="blue" eyebrow="MARKUP CHANNEL">
      Serialized in markup · string-oriented · inspectable as an HTML attribute
    </DiagramNode>
    <DiagramNode title="Property" tone="purple" eyebrow="OBJECT CHANNEL">
      Set on the element instance · can hold arbitrary JavaScript values · follows the custom element contract
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

String-oriented example:

```jsx
<status-badge state="online" />
```

Rich JavaScript value:

```jsx
<chart-view data={points} />
```

Read the Web Component's API instead of assuming every value should be serialized as an attribute.

A custom element that expects rich property values should establish a stable property surface on its instance.

```js
class ChartView extends HTMLElement {
  constructor() {
    super();
    this.data = undefined;
  }
}
```

## Custom events

```jsx
<voice-player
  onspeak={event => {
    console.log(event.detail.message);
  }}
/>
```

When integrating a third-party custom element, verify event naming, case sensitivity, `detail` shape, bubbling/composed behavior, and cleanup requirements.

## Wrapper components normalize boundaries

```jsx
function VoicePlayer({ onSpeak, ...props }) {
  return <voice-player onspeak={onSpeak} {...props} />;
}
```

<VisualDiagram title="A React wrapper is useful when it improves the application-facing contract">
  <DiagramStack align="center">
    <DiagramNode title="Application props/events" tone="blue" />
    <DiagramArrow label="normalize" />
    <DiagramNode title="React wrapper" tone="purple">Prop naming · event mapping · refs · accessibility defaults · property assignment</DiagramNode>
    <DiagramArrow label="adapt" />
    <DiagramNode title="Custom element API" tone="teal" />
  </DiagramStack>
</VisualDiagram>

Do not wrap automatically; wrap when the adapter creates a clearer or safer contract.

---

# SVG in React

```jsx
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l4 4L19 6" />
    </svg>
  );
}
```

SVG is still browser SVG, expressed through JSX.

Decorative graphic:

```jsx
<svg aria-hidden="true" focusable="false">...</svg>
```

Meaningful graphic:

```jsx
<svg role="img" aria-labelledby="chart-title">
  <title id="chart-title">Monthly revenue</title>
  ...
</svg>
```

The accessibility pattern depends on whether the graphic communicates information.

## Prefer native semantics

Prefer:

```jsx
<button>Save</button>
```

over rebuilding a button from a generic element:

```jsx
<div role="button" tabIndex={0}>Save</div>
```

Native controls already provide keyboard, semantic, form, focus, and accessibility behavior.

## DOM ownership boundaries

React assumes it owns the DOM subtree it renders. Bugs appear when another system mutates the same nodes independently.

<VisualDiagram title="Two safe integration shapes">
  <DiagramGrid columns={2}>
    <DiagramNode title="React owns outer surface" tone="purple">
      React container
      <br />→ dedicated ref node
      <br />→ third-party library exclusively owns inside that node
    </DiagramNode>
    <DiagramNode title="External system owns outer surface" tone="orange">
      External container
      <br />→ designated child mount point
      <br />→ React root/portal exclusively owns that child surface
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Avoid both systems mutating the same child nodes.

## Integration decision

<DecisionTree
  question="Who should own this DOM region?"
  items={[
    { label: 'Plain UI React can model declaratively', value: 'Let React own it' },
    { label: 'Imperative library needs a canvas/map/editor surface', value: 'Give it one dedicated ref-owned island' },
    { label: 'Legacy/CMS system owns the page region', value: 'Mount a React root/portal into a designated child surface' },
    { label: 'Both need to mutate the same nodes', value: 'Redesign the boundary — shared mutation is unstable' },
  ]}
/>

## Security checklist

- keep untrusted content as normal JSX text when possible;
- sanitize raw HTML;
- validate URLs used in navigation/resource contexts;
- treat custom-element event payloads as untrusted input;
- preserve semantic HTML;
- fix hydration errors rather than hiding them broadly;
- avoid direct DOM mutation of React-owned children.

## Exercise

Build a page containing a semantic form, decorative and meaningful SVGs, a custom `<rating-stars>` element behind a React wrapper, a sanitized CMS renderer, and a third-party chart that owns only one dedicated DOM island.

For each piece, document **who owns the DOM** and **where the trust boundary lives**.

## Interview questions

**Junior:** Why does JSX use names such as `className` and `htmlFor`?

**Mid-level:** Why is `dangerouslySetInnerHTML` a security boundary?

**Senior:** How would you integrate React, a Web Component, and an imperative DOM library without creating overlapping DOM ownership?

## Summary

<VisualDiagram title="React DOM is an adapter to the browser, not a replacement for it">
  <LifecycleBar
    items={[
      { label: 'Use semantic JSX', tone: 'blue' },
      { label: 'React DOM maps it to platform nodes', tone: 'purple' },
      { label: 'Respect trust + ownership boundaries', tone: 'orange' },
      { label: 'Let the browser provide native behavior', tone: 'green' },
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react-dom/components/common
- https://react.dev/reference/react-dom/components
- https://react.dev/reference/react-dom/components/form
- https://react.dev/reference/react-dom/components/input
- https://react.dev/reference/react-dom/components/select
- https://react.dev/reference/react-dom/components/textarea
