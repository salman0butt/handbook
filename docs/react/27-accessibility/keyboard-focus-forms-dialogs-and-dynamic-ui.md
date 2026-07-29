---
title: Keyboard, Focus, Forms, Dialogs, and Dynamic UI
description: Build accessible React interactions with predictable keyboard behavior, focus management, dialogs, forms, composite widgets, and dynamic announcements.
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

# Keyboard, Focus, Forms, Dialogs, and Dynamic UI

Accessibility becomes hardest when UI is interactive. Focus, keyboard behavior, announcements, loading, and client navigation are part of the user's application state even when they are not stored in React state.

<VisualDiagram title="Interactive accessibility has several coordinated layers">
  <DiagramGrid columns={3}>
    <DiagramNode title="Semantics" tone="blue">role · name · state · relationships</DiagramNode>
    <DiagramNode title="Keyboard + focus" tone="purple">Tab · arrows · Escape · programmatic focus</DiagramNode>
    <DiagramNode title="Dynamic feedback" tone="teal">errors · pending · announcements · navigation orientation</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Follow platform conventions

Native buttons, links, inputs, checkboxes, radios, and form controls already implement mature keyboard/focus behavior.

Custom ARIA widgets such as tabs, menus, listboxes, trees, and comboboxes require you to implement the expected interaction model yourself.

## Roving `tabIndex`

Composite widgets usually should not make every item a page-level Tab stop.

<VisualDiagram title="Roving tab index">
  <DiagramRow>
    <DiagramNode title="Active item" tone="green">tabIndex=0</DiagramNode>
    <DiagramNode title="Other items" tone="gray">tabIndex=-1</DiagramNode>
    <DiagramArrow direction="right" label="arrow key" />
    <DiagramNode title="Next active item" tone="blue">old → -1 · new → 0 · focus moves</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Example:

```tsx
function TabList({ tabs }: { tabs: Tab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function move(nextIndex: number) {
    setActiveIndex(nextIndex);
    refs.current[nextIndex]?.focus();
  }

  return (
    <div role="tablist" aria-label="Account sections">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={node => { refs.current[index] = node; }}
          role="tab"
          tabIndex={index === activeIndex ? 0 : -1}
          aria-selected={index === activeIndex}
          onKeyDown={event => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              move((index + 1) % tabs.length);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              move((index - 1 + tabs.length) % tabs.length);
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

Production tabs also need tabpanel relationships, activation rules, orientation, disabled-state behavior when supported, and tests matching the chosen APG pattern.

## `aria-activedescendant` is a different focus model

Some widgets keep DOM focus on one container and expose the active child through `aria-activedescendant`.

```tsx
<div
  role="listbox"
  tabIndex={0}
  aria-activedescendant={activeOptionId}
>
  ...
</div>
```

<DiagramGrid columns={2}>
  <DiagramNode title="Roving focus" tone="purple">DOM focus moves among child options</DiagramNode>
  <DiagramNode title="aria-activedescendant" tone="teal">DOM focus stays on container; active child is referenced</DiagramNode>
</DiagramGrid>

These approaches are not interchangeable. Follow the accessibility pattern for the widget you are building.

## Focus must be visible

Do not globally remove outlines.

```css
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

WCAG 2.2 continues to require visible keyboard focus at Level AA and includes additional criteria around focus not being obscured.

## Move focus only when the UI transition needs orientation

Good reasons include opening a modal, orienting users after client-side navigation, focusing a validation summary, or entering a newly created editor.

Do not move focus merely because a component re-rendered.

<DecisionTree
  question="Should this update move focus?"
  items={[
    { label: 'The user entered a new interaction context', value: 'Often yes; move focus deliberately' },
    { label: 'The same context merely re-rendered or refreshed data', value: 'Usually preserve focus' },
    { label: 'A critical error summary must orient the user', value: 'Move focus if that is the product accessibility contract' },
  ]}
/>

## Refs are the React escape hatch for focus

```tsx
const headingRef = useRef<HTMLHeadingElement>(null);

function focusHeading() {
  headingRef.current?.focus();
}
```

For a normally non-focusable heading:

```tsx
<h1 ref={headingRef} tabIndex={-1}>
  Checkout
</h1>
```

`tabIndex={-1}` allows programmatic focus without placing the heading in normal sequential Tab navigation.

## Dialog focus lifecycle

<VisualDiagram title="A modal is a complete focus lifecycle">
  <LifecycleBar items={[
    { label: 'Trigger activated', tone: 'blue' },
    { label: 'Dialog opens', tone: 'purple' },
    { label: 'Focus enters dialog', tone: 'green' },
    { label: 'Modal interaction stays contained', tone: 'orange' },
    { label: 'Escape/close finishes interaction', tone: 'purple' },
    { label: 'Focus returns to meaningful target', tone: 'green' },
  ]} />
</VisualDiagram>

ARIA alone does not implement this behavior.

A mature modal primitive owns:

- dialog semantics and accessible name;
- initial focus placement;
- focus containment while modal;
- Escape/close behavior when appropriate;
- background interaction prevention;
- focus restoration.

Well-tested dialog primitives are often safer than repeatedly implementing focus trapping yourself.

## Dialog naming

```tsx
const titleId = useId();

return (
  <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <h2 id={titleId}>Delete account?</h2>
    ...
  </div>
);
```

If using the native `<dialog>` element or an accessibility library, follow its supported semantics rather than layering redundant roles automatically.

## Focus restoration depends on commit timing

The element you focus must exist in the committed DOM.

<VisualDiagram title="Focus is imperative work tied to the committed tree">
  <DiagramRow>
    <DiagramNode title="React state changes" tone="blue">close dialog</DiagramNode>
    <DiagramArrow direction="right" label="commit" />
    <DiagramNode title="DOM reflects new UI" tone="purple">trigger/next target exists</DiagramNode>
    <DiagramArrow direction="right" label="imperative focus" />
    <DiagramNode title="User orientation restored" tone="green">focus meaningful target</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Forms: group controls by meaning

```tsx
<fieldset>
  <legend>Shipping method</legend>
  <label>
    <input type="radio" name="shipping" value="standard" />
    Standard
  </label>
  <label>
    <input type="radio" name="shipping" value="express" />
    Express
  </label>
</fieldset>
```

`fieldset` + `legend` provide group context beyond individual labels.

## Validation must communicate more than color

```tsx
<input
  aria-invalid={Boolean(error)}
  aria-describedby={error ? errorId : undefined}
/>
{error && <p id={errorId}>{error}</p>}
```

Visual styling can reinforce the error, but color alone should not carry its meaning.

## Error summaries

For long forms, an error summary can orient users and provide direct links to invalid fields.

```tsx
<div role="alert" aria-labelledby={summaryId}>
  <h2 id={summaryId}>Fix the following errors</h2>
  <ul>
    <li><a href={`#${emailId}`}>Email is required</a></li>
  </ul>
</div>
```

If the product focuses the summary after submission failure, test that focus behavior explicitly.

## Dynamic updates: announcement and focus are different tools

<DiagramGrid columns={2}>
  <DiagramNode title="Move focus" tone="purple">Use when the user must enter/orient to a new interaction context</DiagramNode>
  <DiagramNode title="Live region" tone="teal">Use when status should be announced without stealing focus</DiagramNode>
</DiagramGrid>

```tsx
<p aria-live="polite">{statusMessage}</p>
```

Possible uses include background save completion, search-result counts, or an item added to cart without navigation.

Do not turn every status change into an assertive alert. Too many announcements create noise.

## Suspense and pending UI

```tsx
<Suspense fallback={<p role="status">Loading order history…</p>}>
  <OrderHistory />
</Suspense>
```

A loading fallback should communicate enough context when users need it, but nested boundaries should not create competing live announcements.

## Transitions and stale content

When already-visible content remains during non-urgent work, preserve orientation.

<VisualDiagram title="Pending work does not automatically require moving focus">
  <DiagramRow>
    <DiagramNode title="Active control" tone="blue">Focus remains stable</DiagramNode>
    <DiagramNode title="Existing content" tone="gray">Can remain visible</DiagramNode>
    <DiagramNode title="Pending status" tone="orange">aria-busy / nearby status when useful</DiagramNode>
    <DiagramNode title="New content" tone="green">Reveal without unnecessary focus jump</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A region may expose `aria-busy={isPending}` when that accurately represents a meaningful update.

## Client-side navigation needs orientation review

A full-page browser navigation naturally changes document context. A client-side navigation may leave focus sitting on an old control while the page changes around it.

Verify:

- document title updates;
- focus/orientation strategy;
- landmarks and headings;
- pending navigation behavior;
- back/forward behavior.

Critical navigation flows deserve real-browser tests.

## Menus, tabs, and comboboxes have specific interaction contracts

Do not use `role="menu"` just because a visual panel looks menu-like. Ordinary site navigation is often better represented by links in a semantic list.

Tabs require coordinated `tablist`, `tab`, `tabpanel`, selection state, relationships, arrow-key focus, and an activation model.

<VisualDiagram title="Tabs combine semantics and behavior">
  <DiagramRow>
    <DiagramNode title="tablist" tone="blue">One entry into page Tab sequence</DiagramNode>
    <DiagramArrow direction="right" label="arrow keys" />
    <DiagramNode title="active tab" tone="purple">focus + selected state</DiagramNode>
    <DiagramArrow direction="right" label="controls" />
    <DiagramNode title="tabpanel" tone="green">labelled by selected tab</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Comboboxes are even more complex: input semantics, popup relationship, expanded state, active option model, selection, Escape behavior, async results, and text-input/IME correctness all matter.

Use established APG patterns or accessible primitives rather than improvising from roles alone.

## Keyboard tests

```tsx
const user = userEvent.setup();
render(<Tabs />);

await user.tab();
expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();

await user.keyboard('{ArrowRight}');
expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
```

Then assert selected state and panel visibility according to your activation model.

## Dialog tests

```tsx
const trigger = screen.getByRole('button', { name: 'Delete account' });
await user.click(trigger);

const dialog = screen.getByRole('dialog', { name: 'Delete account?' });
expect(dialog).toBeVisible();

// Assert intended initial focus.
await user.keyboard('{Escape}');

expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
expect(trigger).toHaveFocus();
```

This protects the complete user journey rather than only the dialog markup.

## Review checklist

1. Do native controls provide the behavior already?
2. Is the page Tab sequence manageable?
3. Is focus always visible and not intentionally obscured?
4. Does a modal move focus in, contain the interaction, and restore focus?
5. Do errors communicate through text/relationships rather than color alone?
6. Are live regions used sparingly?
7. Does pending UI preserve orientation?
8. Do custom widgets follow an established keyboard model?
9. Are important flows tested with keyboard and focus assertions?
10. Are critical navigation/widget flows verified in a real browser?

## Interview questions

1. What is roving `tabIndex`?
2. When is `aria-activedescendant` useful?
3. Why is focus management tied to commit timing?
4. What is the expected modal focus lifecycle?
5. When should a live region be used instead of moving focus?
6. Why does `role="tab"` alone not make accessible tabs?

## References

- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
