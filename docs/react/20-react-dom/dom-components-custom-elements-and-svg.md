---
title: React DOM Components, Custom Elements, and SVG
description: Cover common DOM props/events, custom attributes, dangerouslySetInnerHTML, contentEditable, custom elements, SVG, and browser integration boundaries.
sidebar_position: 2
---

# React DOM components, custom elements, and SVG

React's DOM renderer supports browser built-in HTML and SVG elements.

The important skill is not memorizing every tag. It is understanding where React's programming model differs from plain HTML and where browser behavior still matters.

## Mental model

```text
JSX
   ↓
React element description
   ↓
React DOM renderer
   ↓
browser DOM nodes
   ↓
browser behavior, accessibility, layout, events
```

React is not a replacement for HTML semantics.

It is a renderer and state-management model that works with the browser platform.

## Built-in elements are lowercase

```jsx
<div />
<button />
<svg />
```

Lowercase JSX names are treated as browser elements.

Capitalized JSX names are treated as React components:

```jsx
<Button />
```

This distinction is fundamental to JSX.

## DOM prop naming

React generally follows DOM property naming rather than raw HTML attribute spelling.

Examples:

```jsx
<label htmlFor="email">Email</label>
<input id="email" className="field" tabIndex={0} />
```

Common differences include:

```text
HTML          React JSX
class         className
for           htmlFor
tabindex      tabIndex
```

ARIA attributes keep their standard names:

```jsx
<button aria-expanded={open}>Menu</button>
```

Data attributes also keep lowercase dash syntax:

```jsx
<div data-user-id={user.id} />
```

## Boolean and numeric values

JSX values are JavaScript expressions.

```jsx
<button disabled={isSaving}>Save</button>
<input maxLength={120} />
```

Do not stringify values unnecessarily.

## Events

React DOM provides event props such as:

```jsx
<button onClick={handleClick}>Save</button>
<input onChange={handleChange} />
<div onPointerMove={handlePointerMove} />
```

Event names use camelCase.

Capture variants add `Capture`:

```jsx
<div onClickCapture={handleCapture} />
```

The earlier Events chapter covers propagation in depth.

One React DOM detail worth remembering is that some events React exposes may bubble in React even if the corresponding browser event does not normally bubble the same way.

Program against React's documented event behavior rather than assuming every browser event detail transfers unchanged.

## `style`

Inline styles use a JavaScript object:

```jsx
<div
  style={{
    width: 320,
    opacity: isDisabled ? 0.5 : 1,
  }}
/>
```

Use inline styles when values are genuinely dynamic.

For most static styling, classes are easier to cache, inspect, and maintain.

```jsx
<div className={isActive ? 'tab tab--active' : 'tab'} />
```

## Unknown/custom attributes

React can pass custom attributes to built-in DOM elements.

```jsx
<div mycustomprop="value" />
```

For ordinary custom attributes, prefer lowercase names and avoid names beginning with `on`, since event-like names have different semantics.

For application metadata, standard `data-*` attributes are usually clearer:

```jsx
<div data-feature="checkout" />
```

## `dangerouslySetInnerHTML`

Sometimes an application already has an HTML string:

```jsx
<div dangerouslySetInnerHTML={{ __html: html }} />
```

The name is intentionally alarming.

Raw HTML bypasses React's normal escaping.

If `html` contains untrusted content, it can create an XSS vulnerability.

### Safe mental model

```text
normal JSX text
React escapes content

raw inner HTML
React trusts the provided HTML string
security becomes your responsibility
```

Never do this with unsanitized user input:

```jsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

If raw HTML is required, sanitize at a trusted boundary with a well-maintained sanitizer and define an explicit content policy.

## Children and raw HTML are mutually exclusive

Do not pass both children and `dangerouslySetInnerHTML` to the same element.

React needs one clear source of DOM content ownership.

## `contentEditable`

```jsx
<div contentEditable />
```

When users directly edit DOM content, React's declarative children model and browser-owned editable DOM can conflict.

This is why rich-text editors usually have specialized architecture.

React warns when an editable element also has normal React children unless the library takes explicit responsibility for managing that content.

Do not build a rich-text editor by casually adding `contentEditable` to a controlled React subtree.

## `suppressContentEditableWarning`

This escape hatch exists for libraries that intentionally manage editable DOM themselves.

It is not a fix for a poorly designed editable component.

## `suppressHydrationWarning`

Server-rendered content is expected to match the initial client render.

For a narrow intentionally different value, React can suppress a hydration warning:

```jsx
<time suppressHydrationWarning>
  {clientSpecificTime}
</time>
```

Use this sparingly.

It does not make the server/client mismatch conceptually correct; it only suppresses the warning for that element.

Fix deterministic rendering when possible.

## Refs

Built-in DOM elements accept refs:

```jsx
const inputRef = useRef(null);

<input ref={inputRef} />
```

After commit, the ref points to the DOM node.

React 19 also supports cleanup-returning ref callbacks:

```jsx
<div
  ref={node => {
    observe(node);

    return () => {
      unobserve(node);
    };
  }}
/>
```

The Refs chapter covers this escape hatch in depth.

---

# Custom elements

Web Components/custom elements let browser-native component classes expose custom tags.

A tag containing a dash is treated as a custom element:

```jsx
<user-avatar user-id="42" />
```

A built-in element using `is` can also represent a custom element in browser-supported patterns.

## Attributes vs properties

Custom elements can receive data through two different channels:

```text
attribute
serialized into markup
string-oriented

property
set on JavaScript element instance
can hold arbitrary JS values
```

This difference matters when integrating React with Web Components.

Example string attribute:

```jsx
<status-badge state="online" />
```

Example non-string value:

```jsx
<chart-view data={points} />
```

React's custom-element behavior determines whether a value becomes an attribute or an element property based on the element/property contract.

Do not assume every custom element consumes values the same way.

Read the component's Web Component API.

## Define properties early

A custom element that expects rich property values should define those properties on its instance during construction.

Conceptually:

```js
class ChartView extends HTMLElement {
  constructor() {
    super();
    this.data = undefined;
  }
}
```

That gives the integration a clear property surface for arbitrary JavaScript values.

## Custom events

Web Components commonly dispatch `CustomEvent` instances.

React can listen using an `on`-prefixed event prop matching the custom event name.

```jsx
<voice-player
  onspeak={event => {
    console.log(event.detail.message);
  }}
/>
```

When integrating with a third-party custom element, verify:

- event name;
- case sensitivity;
- event detail shape;
- bubbling/composed behavior;
- cleanup requirements.

## React wrapper components

A wrapper can make a Web Component feel more React-native:

```jsx
function VoicePlayer({ onSpeak, ...props }) {
  return (
    <voice-player
      onspeak={onSpeak}
      {...props}
    />
  );
}
```

A wrapper is useful when you need to normalize:

- prop names;
- custom events;
- refs;
- accessibility defaults;
- property assignment;
- imperative methods.

Do not wrap every custom element automatically. Add a wrapper when it creates a better application-facing API.

---

# SVG in React

React supports browser SVG elements:

```jsx
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l4 4L19 6" />
    </svg>
  );
}
```

SVG elements live in the SVG namespace even though they are written in JSX.

## Accessibility

Decorative icon:

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

The correct accessible pattern depends on whether the SVG conveys information.

## Dynamic SVG values

```jsx
<circle
  cx={50}
  cy={50}
  r={radius}
  opacity={disabled ? 0.4 : 1}
/>
```

React updates SVG attributes/properties from normal JSX expressions.

## Do not reimplement browser semantics

React supports browser elements, but it does not replace native semantics.

Prefer:

```jsx
<button>Save</button>
```

over:

```jsx
<div role="button" tabIndex={0}>Save</div>
```

unless the custom behavior genuinely requires a non-button element.

Native elements provide keyboard behavior, semantics, form integration, and accessibility behavior you otherwise need to recreate.

## DOM ownership boundaries

React assumes it owns the DOM subtree it renders.

Problems arise when another system mutates the same nodes React expects to manage.

Examples:

- jQuery plugin rewriting children;
- map library moving React-owned nodes;
- WYSIWYG editor changing DOM under React;
- browser extension injecting into the root;
- imperative library replacing child nodes.

Safer integration patterns include:

```text
React owns container
third-party library owns inside of dedicated ref node
```

or:

```text
third-party system owns container
React portal/root owns a designated child surface
```

Avoid two systems independently mutating the same DOM nodes.

## Security checklist

When rendering browser DOM:

- keep user content as normal JSX text when possible;
- sanitize any raw HTML;
- validate URLs used in navigation/resource contexts;
- do not trust custom-element event payloads blindly;
- preserve semantic HTML;
- avoid hiding hydration errors;
- avoid direct DOM mutation of React-owned children.

## Common mistakes

### Mistake: treating React prop names as raw HTML strings

Use React's documented DOM prop conventions.

### Mistake: using `dangerouslySetInnerHTML` for formatted text that could be JSX

Prefer structured React nodes.

### Mistake: trusting CMS HTML without sanitization

Raw HTML is a security boundary.

### Mistake: controlling rich text with ordinary React children and browser edits simultaneously

Choose a specialized editor architecture.

### Mistake: assume custom element values are always HTML attributes

Web Components can expose JavaScript properties.

### Mistake: replace semantic HTML with `div` + ARIA everywhere

Use native browser semantics first.

## Exercise

Build a page containing:

1. a semantic accessible form;
2. an inline SVG icon and a meaningful SVG chart;
3. a custom `<rating-stars>` element wrapped by a React component;
4. a sanitized CMS-content renderer;
5. a dedicated DOM node owned by a third-party chart library without letting it rewrite React siblings.

Explain the ownership boundary for each part.

## Interview questions

**Junior:** Why does JSX use `className` and `htmlFor`?

**Mid-level:** What is dangerous about `dangerouslySetInnerHTML`, and when is it justified?

**Senior:** Explain how you would integrate React with a Web Component and a third-party imperative DOM library without creating competing DOM ownership.

## Summary

```text
React DOM supports HTML + SVG
browser semantics still matter
raw HTML is a security boundary
custom elements have attribute/property/event contracts
React should have clear ownership of the DOM it renders
```

## References

- https://react.dev/reference/react-dom/components
- https://react.dev/reference/react-dom/components/common
