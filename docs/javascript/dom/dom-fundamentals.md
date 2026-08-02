---
title: DOM Fundamentals
description: Safe framework-free document manipulation, events, forms, focus, accessibility and observers.
slug: /javascript/dom/dom-fundamentals
---

# DOM Fundamentals

The DOM is a browser-host object model for documents, not part of ECMAScript. Nodes form a tree; Elements are nodes with tag/attribute semantics.

```javascript
const list = document.querySelector('[data-task-list]')
const item = document.createElement('li')
item.textContent = task.title
item.dataset.taskId = task.id
list.append(item)
```

Use `textContent` for untrusted text. Treat `innerHTML`, `insertAdjacentHTML` and HTML template strings as injection sinks unless content is trusted or passed through an appropriate sanitizer and Trusted Types policy.

## Attributes and properties

An HTML attribute describes markup state; a DOM property is the live object state. For form controls, `input.value` can diverge from its initial `value` attribute. Boolean attributes are true by presence, not by a string value such as `"false"`.

## Events

Events travel through capture, target and bubble phases when configured to do so. Delegation attaches one ancestor listener and finds a matching descendant.

```javascript
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-action="complete"]')
  if (!button || !list.contains(button)) return
  completeTask(button.closest('[data-task-id]').dataset.taskId)
})
```

Use `event.currentTarget` for the registered receiver. Remove listeners or connect them to an AbortSignal when the UI lifecycle ends.

## Forms and validation

Associate labels, choose semantic input types, preserve native keyboard behavior, expose errors programmatically and validate again on the server. Constraint validation improves UX but is not a security boundary.

## Focus and keyboard

Do not add click-only behavior to non-interactive elements. Use buttons and links, maintain visible focus, move focus only when context changes require it, restore focus after dialogs, and avoid positive `tabindex` ordering.

## Observers

MutationObserver reports DOM mutations, ResizeObserver reports element sizing and IntersectionObserver reports visibility intersections. Batch observer work, disconnect observers, and avoid feedback loops that mutate the observed property continuously.

## Performance

Group reads before writes to avoid forced layout, use document fragments for large insertions, virtualize only when measurements justify it, and prefer CSS for presentation. Measure with browser performance tools rather than counting DOM calls abstractly.

## Shadow DOM and components

Shadow DOM provides encapsulated trees and event retargeting. Web components combine custom elements, templates and optional shadow roots. Design accessible names, focus behavior, form participation and styling hooks as public APIs.

## Primary references

- [WHATWG DOM](https://dom.spec.whatwg.org/)
- [WHATWG HTML](https://html.spec.whatwg.org/)
- [WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/)
