---
title: Keyboard, Focus, Forms, Dialogs, and Dynamic UI
description: Build accessible React interactions with predictable keyboard behavior, focus management, dialogs, forms, composite widgets, and dynamic announcements.
sidebar_position: 2
---

# Keyboard, Focus, Forms, Dialogs, and Dynamic UI

Accessibility becomes most challenging when React UI is highly interactive. Custom dialogs, tabs, menus, comboboxes, async validation, Suspense transitions, and client-side navigation all affect focus and user orientation.

> **Mental model:** keyboard behavior and focus are part of application state from the user's perspective, even when React does not store them in component state.

## 1. Keyboard access should follow platform conventions

Native controls already implement expected keyboard behavior.

Examples:

- buttons activate with keyboard conventions;
- links participate in tab order and navigate;
- checkboxes expose checked state;
- radio groups implement browser behavior;
- form controls provide focus and editing semantics.

Custom ARIA widgets require you to implement the expected keyboard model yourself.

## 2. Do not make every item a Tab stop

Composite widgets such as tabs, toolbars, listboxes, menus, and trees commonly have one entry point in the page Tab sequence, then use arrow keys internally.

A roving `tabIndex` pattern uses:

```text
active item      tabIndex={0}
other items      tabIndex={-1}
```

When arrow navigation changes the active item:

1. old active item gets `-1`;
2. new item gets `0`;
3. focus moves to the new item.

This keeps page Tab navigation manageable.

## 3. Roving tab index example

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
          ref={(node) => {
            refs.current[index] = node;
          }}
          role="tab"
          tabIndex={index === activeIndex ? 0 : -1}
          aria-selected={index === activeIndex}
          onKeyDown={(event) => {
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

A production tabs component also needs correct panel relationships, activation behavior, orientation handling, disabled-state behavior if supported, and tests matching the intended accessibility pattern.

## 4. `aria-activedescendant` is an alternative

Some composite widgets keep DOM focus on one container and identify the active child with `aria-activedescendant`.

Conceptually:

```tsx
<div
  role="listbox"
  tabIndex={0}
  aria-activedescendant={activeOptionId}
>
  ...
</div>
```

This is not universally interchangeable with roving focus. Use the accessibility pattern appropriate for the widget and understand its browser/assistive-technology behavior.

## 5. Visible focus is essential

Do not remove outlines globally:

```css
*:focus {
  outline: none;
}
```

Instead, design a clear focus indicator.

```css
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

Users navigating by keyboard need to know where interaction will occur.

## 6. Focus management should explain UI changes

Focus should usually remain stable unless the UI transition creates a reason to move it.

Good reasons include:

- opening a modal dialog;
- navigating to a new client-side page where focus must be re-oriented;
- revealing a validation summary after failed submission;
- adding an editor and intentionally placing focus into it.

Do not move focus simply because a component re-rendered.

## 7. Refs are the React escape hatch for focus

```tsx
const headingRef = useRef<HTMLHeadingElement>(null);

function focusHeading() {
  headingRef.current?.focus();
}
```

If a normally non-focusable element must receive programmatic focus:

```tsx
<h1 ref={headingRef} tabIndex={-1}>
  Checkout
</h1>
```

`tabIndex={-1}` allows programmatic focus without adding the heading to normal sequential Tab navigation.

## 8. Dialog focus lifecycle

A modal dialog typically needs a complete lifecycle:

```text
trigger activated
→ dialog opens
→ focus moves into dialog
→ focus remains within modal interaction context
→ Escape/close action closes it when supported
→ focus returns to meaningful trigger/next target
```

Do not implement this with ARIA attributes alone.

A mature dialog primitive should manage:

- role/semantics;
- accessible name;
- focus entry;
- focus containment while modal;
- Escape behavior when appropriate;
- background interaction prevention;
- focus restoration.

## 9. Prefer established dialog primitives when appropriate

Dialog behavior has many edge cases.

A well-tested accessible primitive/library can be safer than rebuilding focus trapping and modal semantics in every product.

Still understand the behavior so you can test and integrate it correctly.

## 10. Dialog naming

```tsx
const titleId = useId();

return (
  <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <h2 id={titleId}>Delete account?</h2>
    ...
  </div>
);
```

If the platform/library uses the native `<dialog>` element, follow its semantics and browser behavior rather than layering unnecessary roles mechanically.

## 11. Focus restoration

Store the trigger via a ref or let the dialog primitive handle restoration.

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);

function closeDialog() {
  setOpen(false);
  // restoration timing belongs after the close commit in a robust implementation
}
```

Timing matters because the element you focus must exist in the committed DOM.

This is a good example of why focus management is an imperative concern tied to commit timing.

## 12. Forms: group related controls

For related radio controls:

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

`fieldset` + `legend` provide group context that individual labels alone do not.

## 13. Validation should not rely on color alone

Weak:

```tsx
<input className={error ? 'red-border' : ''} />
```

Better:

```tsx
<input
  aria-invalid={Boolean(error)}
  aria-describedby={error ? errorId : undefined}
/>
{error && <p id={errorId}>{error}</p>}
```

Also provide visual feedback, but ensure the error remains understandable without color perception.

## 14. Error summaries

For long forms, an error summary can help users recover quickly.

```tsx
<div role="alert" aria-labelledby={summaryId}>
  <h2 id={summaryId}>Fix the following errors</h2>
  <ul>
    <li><a href={`#${emailId}`}>Email is required</a></li>
  </ul>
</div>
```

When submission fails, the design may intentionally focus the summary so keyboard/screen-reader users are informed of the failure and can navigate to fields.

Test the actual focus behavior.

## 15. Async validation

Do not announce every keystroke as an error.

For async validation, consider:

- when validation starts;
- whether pending state needs communication;
- when errors become relevant;
- whether a live region is appropriate;
- whether focus should remain in the field.

The correct behavior depends on the task. Avoid noisy announcements.

## 16. Live regions

Dynamic content may need announcement without moving focus.

```tsx
<p aria-live="polite">{statusMessage}</p>
```

Examples where a polite live region may be useful:

- background save completed;
- search result count changed;
- item added to cart without navigation.

Use assertive/alert behavior only for urgent interruptions.

Too many live regions can create an unusable experience.

## 17. Suspense and loading UI

A loading fallback should communicate meaningful context when users need it.

```tsx
<Suspense fallback={<p role="status">Loading order history…</p>}>
  <OrderHistory />
</Suspense>
```

But avoid turning every nested fallback into a competing live announcement.

The loading architecture should match the UX priority and reveal behavior.

## 18. Transitions and stale content

When stale content remains visible during a Transition, communicate state without destroying orientation.

Possible patterns:

- subtle visual stale state;
- `aria-busy` on the relevant region when appropriate;
- a nearby status message;
- preserve focus on the active control.

Do not automatically move focus to every loading indicator.

## 19. `aria-busy`

A region can indicate it is being updated:

```tsx
<section aria-busy={isPending} aria-labelledby={resultsHeadingId}>
  ...
</section>
```

Use it when it reflects a meaningful region-level update. Do not add it indiscriminately to the entire application for every network request.

## 20. Client-side navigation

A browser full-page navigation naturally changes document context. Client-side navigation may preserve focus in a way that leaves keyboard/screen-reader users on an old control while the page content changes around them.

A router/framework may provide conventions, but product teams should verify:

- document title changes;
- focus/orientation after navigation;
- landmarks/headings;
- pending navigation behavior;
- back/forward behavior.

Test important navigation flows in a real browser.

## 21. Menus are not generic navigation lists

Do not use `role="menu"` merely because a visual panel looks like a menu.

ARIA menu widgets have specific keyboard and interaction expectations.

For ordinary website navigation, semantic links in a list are often better:

```tsx
<nav aria-label="Account">
  <ul>
    <li><a href="/profile">Profile</a></li>
    <li><a href="/security">Security</a></li>
  </ul>
</nav>
```

Use a true menu pattern when the interaction model actually matches one.

## 22. Tabs require more than `role="tab"`

A correct tabs implementation needs coordinated semantics and keyboard behavior:

```text
tablist
  tab
  tab

tabpanel
```

Typical relationships include:

- `aria-selected`;
- `aria-controls`;
- `aria-labelledby`;
- roving focus;
- arrow-key movement;
- activation model.

Follow an established APG pattern or accessible primitive instead of improvising.

## 23. Comboboxes are complex widgets

A production combobox may need:

- editable input semantics;
- popup relationship;
- expanded state;
- active descendant/focus model;
- option selection;
- keyboard navigation;
- escape behavior;
- async result state;
- IME/text-input correctness.

Do not treat `role="combobox"` as a shortcut that supplies this behavior.

## 24. Keyboard tests

Example:

```tsx
const user = userEvent.setup();
render(<Tabs />);

await user.tab();
expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();

await user.keyboard('{ArrowRight}');
expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
```

Then assert selected state and panel visibility according to the activation model.

## 25. Dialog tests

A useful test sequence:

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

This protects a user journey, not just markup.

## 26. Mouse-only anti-patterns

### Clickable `<div>`

```tsx
<div onClick={open}>Open</div>
```

Use a button if it is an action.

### Hover-only content

If important content appears only on hover, keyboard and touch users may never reach it.

### Drag-only operation

Critical functionality should provide an alternative if drag is the only interaction mechanism.

## 27. Focus traps can become bugs

A modal dialog may intentionally contain focus while open.

Other UI should not unexpectedly trap users.

If Tab cannot leave a region, that must be part of a recognized interaction pattern and have a clear exit.

## 28. Portals do not remove accessibility responsibilities

A dialog rendered through `createPortal` still participates in the React tree, but its physical DOM location changes.

You still need to ensure:

- logical focus behavior;
- correct labeling;
- modal background behavior;
- escape/close semantics;
- restoration.

Portal placement alone does not make a modal accessible.

## 29. Automated checks vs manual checks

Automation can catch issues such as:

- missing names;
- invalid ARIA combinations;
- some contrast/structure problems;
- duplicate IDs in certain tooling;
- unlabeled fields.

Manual and browser-based testing is still needed for:

- keyboard flow quality;
- focus restoration;
- screen-reader announcements;
- complex composite widgets;
- cognitive clarity;
- dynamic timing/orientation.

## 30. Accessibility engineering checklist

For an interactive feature, verify:

1. Native semantics are used where possible.
2. Every action works without a mouse.
3. Focus is visible.
4. Focus moves only for a user-oriented reason.
5. Modal focus entry/containment/restoration works.
6. Form groups and validation are understandable.
7. Dynamic messages are announced only when useful.
8. Custom widgets follow an established keyboard pattern.
9. Suspense/Transition UI does not destroy user orientation.
10. Semantic tests and real keyboard checks both pass.

## Exercise

Build an accessible modal account-delete flow with:

- a semantic trigger button;
- portal rendering;
- accessible dialog name and description;
- initial focus on the least destructive sensible control;
- keyboard closure behavior;
- background interaction prevention;
- focus restoration;
- async pending state during deletion;
- server error announcement;
- Testing Library keyboard/focus tests.

Then identify which behaviors should also be covered in a real-browser test.

## Interview questions

1. Why can a custom `role="button"` still be inaccessible?
2. What is roving `tabIndex`, and where is it useful?
3. When would `aria-activedescendant` be used instead of moving DOM focus?
4. What focus lifecycle should a modal dialog implement?
5. Why should form errors not rely on color alone?
6. When is a live region preferable to moving focus?
7. What accessibility risks does client-side navigation introduce?
8. Why is automated accessibility testing insufficient for complex widgets?

## References

- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
- https://react.dev/reference/react/useId
- https://react.dev/reference/react-dom/createPortal
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition
