---
title: TypeScript, Testing, and Accessibility Questions
description: React interview questions covering TypeScript component contracts, refs/events/forms, Testing Library, act, async UI, semantics, keyboard support, focus, and accessible forms.
sidebar_position: 8
---

# TypeScript, Testing, and Accessibility Questions

## TypeScript

### 1. How do you type React component props?

**Strong answer:** Define a prop type/interface and annotate the component parameter, relying on inference inside the function where possible.

### 2. `interface` vs `type` for props?

**Strong answer:** Both work. `type` is convenient for unions/intersections; `interface` supports declaration merging and object extension. Team consistency and the shape being modeled matter more than ideology.

### 3. How do you type `children`?

**Strong answer:** Usually `ReactNode` when a component accepts normal renderable children. Narrow the type when the API intentionally accepts a more specific contract.

### 4. Why not use `any` for event handlers?

**Strong answer:** React exposes specific event types that provide safe target/currentTarget access and catch incorrect assumptions at compile time.

### 5. How do you type an input change event?

**Strong answer:** Use `React.ChangeEvent<HTMLInputElement>` or let TypeScript infer the inline handler type.

### 6. How do you type a form submit event?

**Strong answer:** `React.FormEvent<HTMLFormElement>` when handling React form events directly.

### 7. `target` vs `currentTarget` in typed events?

**Strong answer:** `currentTarget` is the element whose handler is running and is strongly typed from the event generic. `target` may be a nested event origin.

### 8. How do you type a DOM ref in React 19?

**Strong answer:** For a component receiving a ref prop, use a suitable `Ref<T>` or native prop composition. For local refs, `useRef<HTMLDivElement | null>(null)` is common.

### 9. How do you reuse native button props?

**Strong answer:** Extend `ComponentPropsWithoutRef<'button'>` or related React utility types so the wrapper keeps native attributes, events, accessibility props, and evolving platform support.

### 10. Why is native prop reuse better than manually listing every HTML prop?

**Strong answer:** Manual lists drift, omit accessibility/event attributes, and create maintenance burden. Reuse preserves platform compatibility.

### 11. How do you type a component with mutually exclusive props?

**Strong answer:** Use a discriminated union or union of object shapes so invalid combinations are rejected.

### 12. Why are discriminated unions useful in React APIs?

**Strong answer:** They make component modes explicit and let rendering narrow safely based on a tag field.

### 13. How do you type `useState` with async data?

**Strong answer:** Prefer a state union such as `{status:'idle'|'loading'|'success'|'error', ...}` or another explicit state machine instead of unrelated nullable values/booleans.

### 14. How do you type reducer actions?

**Strong answer:** Use a discriminated union of actions with payloads tied to action type, then enforce exhaustiveness.

### 15. How do you type Context safely when there is no meaningful default?

**Strong answer:** Create the Context with `undefined`/`null`, then expose a custom Hook that throws if consumed outside its provider, giving consumers a non-null type afterward.

### 16. Why doesn't TypeScript make API data safe?

**Strong answer:** Types disappear at runtime. Network, local storage, FormData, Server Function arguments, and user input remain untrusted until runtime validation/parsing.

### 17. How do generics help custom Hooks?

**Strong answer:** They let a Hook preserve relationships between caller-provided input and output types without forcing `any` or broad unions.

### 18. What is a polymorphic component?

**Strong answer:** A component that can render different underlying element/component types, often through an `as` prop. Typing it correctly is possible but complex; use only when API value justifies the type/runtime complexity.

### 19. What TypeScript issue exists at RSC boundaries?

**Strong answer:** Compile-time assignability does not guarantee a value is serializable by the RSC protocol. Runtime/environment boundary rules still apply.

### 20. Should TypeScript types mirror backend DTOs exactly?

**Strong answer:** Not necessarily. Separate transport validation/types from UI/domain models when the frontend needs different invariants, derived values, or safer states.

## Testing

### 21. What should React tests focus on?

**Strong answer:** Observable user behavior and public contracts rather than component internals or implementation details.

### 22. Why does React Testing Library prefer semantic queries?

**Strong answer:** Queries like role/label/text align with how users and accessibility APIs perceive the UI and make tests less coupled to markup implementation details.

### 23. Preferred query order?

**Strong answer:** Usually accessible role/name and label-based queries first, then text and more specific alternatives; test IDs are a fallback when semantics do not provide a reasonable query.

### 24. `getBy` vs `queryBy` vs `findBy`?

**Strong answer:** `getBy` expects an element synchronously. `queryBy` returns null when absent and is useful for absence assertions. `findBy` waits asynchronously for an element to appear.

### 25. What is `waitFor` for?

**Strong answer:** Repeatedly checking an assertion until asynchronous UI reaches the expected condition or times out.

### 26. Why avoid arbitrary `sleep` in tests?

**Strong answer:** It creates slow, flaky tests tied to timing guesses. Wait for observable state transitions instead.

### 27. What is `act`?

**Strong answer:** It groups React updates so tests flush and observe the resulting behavior consistently. Modern React recommends async `await act(async () => ...)` for direct use.

### 28. Do you need to wrap every Testing Library interaction manually in `act`?

**Strong answer:** Usually no. Testing Library and `user-event` helpers integrate with `act`. Manual `act` is more common for lower-level direct React updates or custom test utilities.

### 29. Why use `userEvent` instead of calling handler props directly?

**Strong answer:** It exercises behavior closer to a real user's interaction path and includes realistic event sequences/focus changes.

### 30. What should you mock in frontend tests?

**Strong answer:** Mock external boundaries deliberately—network, time, storage, platform APIs—while keeping the component behavior and meaningful integration intact.

### 31. Why can mocking child components be harmful?

**Strong answer:** Excessive mocking hides integration bugs and makes tests assert implementation structure instead of user behavior.

### 32. How do you test a loading state?

**Strong answer:** Control the Promise/network boundary, assert the loading UI while unresolved, resolve/reject deterministically, then assert success/error behavior.

### 33. How do you test Suspense?

**Strong answer:** Use a deterministic suspending resource/Promise, assert fallback/reveal behavior, resolve the resource, and await the resulting UI.

### 34. How do you test Transitions?

**Strong answer:** Trigger the user action, assert urgent UI responds immediately, then verify pending/deferred content and eventual committed result without relying on internal scheduling details.

### 35. How do you test optimistic UI?

**Strong answer:** Test both success and failure/rollback paths, control the mutation Promise, and verify pending interaction states and authoritative reconciliation.

### 36. Unit vs integration vs E2E in React?

**Strong answer:** Unit tests cover isolated pure logic/contracts, integration/component tests cover feature behavior across collaborating components/boundaries, and E2E tests cover critical workflows in a real browser/system.

### 37. What should E2E tests cover?

**Strong answer:** High-value business-critical paths, cross-system integration, routing/auth/payment-like workflows, accessibility/focus behavior that requires a browser, and regression-prone production journeys—not every component variation.

### 38. Why are snapshot tests often overused?

**Strong answer:** Large snapshots are easy to approve without understanding, brittle to harmless markup changes, and weak at expressing user intent. Targeted snapshots can still be useful for stable serialization contracts.

### 39. How do you test Context/reducer state?

**Strong answer:** Prefer testing the behavior exposed by the feature/provider. Reducers that encode non-trivial domain transitions can also have direct pure-function tests.

### 40. How do you test an Error Boundary?

**Strong answer:** Render a child that throws, assert fallback behavior and reporting callback integration, then test recovery/reset behavior if supported.

## Accessibility

### 41. What does accessibility mean in a React application?

**Strong answer:** Building UI usable through keyboard, assistive technology, different vision/motor/cognitive needs, and robust semantic platform APIs. React does not replace HTML accessibility fundamentals.

### 42. Why prefer native HTML over custom ARIA widgets?

**Strong answer:** Native elements already provide semantics, keyboard behavior, focus behavior, form integration, and accessibility APIs. Rebuilding them correctly is expensive and error-prone.

### 43. What is an accessible name?

**Strong answer:** The name exposed to accessibility APIs that identifies a control/element, commonly derived from visible text, `<label>`, `aria-label`, or `aria-labelledby` according to platform naming rules.

### 44. Why is placeholder text not a replacement for a label?

**Strong answer:** It can disappear while typing, often has poor discoverability/contrast, and does not provide the same persistent form relationship and instructions as a real label.

### 45. What is `useId` useful for?

**Strong answer:** Generating hydration-safe IDs to connect labels, descriptions, error messages, headings, and ARIA relationships across reusable component instances.

### 46. What is keyboard accessibility?

**Strong answer:** All interactive functionality should be operable with appropriate keyboard interactions and predictable focus behavior, not only mouse/touch.

### 47. Why is `div onClick` usually worse than `button`?

**Strong answer:** A button already has role, keyboard activation, focusability, disabled behavior, and semantics. A div requires manually recreating those contracts.

### 48. What is focus management?

**Strong answer:** Deliberately moving/restoring focus when UI structure changes in ways the user's current context cannot naturally follow—dialogs, route transitions, validation summaries, removed controls, etc.

### 49. What should happen to focus when a modal closes?

**Strong answer:** Usually restore focus to the control that opened it or another logical destination if that control no longer exists.

### 50. What is focus trapping in a dialog?

**Strong answer:** Keeping keyboard focus within an active modal dialog while it is open, together with correct initial focus, Escape behavior where appropriate, semantics, and restoration.

### 51. What is roving `tabIndex`?

**Strong answer:** A composite widget pattern where one child is in the tab order and arrow keys move the active focus among items, used in tabs, menus, toolbars, etc. according to widget-specific guidance.

### 52. `aria-activedescendant` vs moving DOM focus?

**Strong answer:** `aria-activedescendant` keeps DOM focus on a container/input while announcing a logically active descendant. Roving focus moves actual DOM focus. Choose based on the widget pattern and assistive-technology behavior.

### 53. What are live regions?

**Strong answer:** ARIA mechanisms for announcing dynamic content changes without moving focus, useful for status/error updates when the change would otherwise be invisible to screen-reader users.

### 54. When should you move focus instead of using a live region?

**Strong answer:** Move focus when the user needs to interact with or orient to a new context; use live announcements for status information that should not disrupt current interaction.

### 55. How do you make form errors accessible?

**Strong answer:** Associate field errors with controls, expose invalid state when appropriate, keep visible error text, provide a summary for large forms, and manage focus so users can find/recover efficiently.

### 56. Why can loading spinners be inaccessible?

**Strong answer:** Visual-only spinners may convey no status to assistive tech. Provide meaningful status text/roles and avoid excessive announcements for every minor render.

### 57. How should Suspense loading states handle accessibility?

**Strong answer:** Preserve orientation, avoid unnecessary focus jumps, provide meaningful status where needed, and prevent repeated fallback/reveal cycles from becoming noisy announcements.

### 58. How do you test accessibility?

**Strong answer:** Combine semantic queries, automated checks, keyboard testing, focus assertions, screen-reader/manual review for critical patterns, and native semantic design—not just one automated scanner.

### 59. Why can't automated accessibility tests catch everything?

**Strong answer:** They can detect rule violations but cannot fully judge interaction logic, meaningful labels, reading order, cognitive clarity, or real assistive-technology behavior.

### 60. Senior question: what accessibility standards would you enforce in a design system?

**Strong answer:** Native semantics first, accessible naming contracts, keyboard models, focus rules, ref support, ARIA state mapping, error/status patterns, high-contrast/zoom resilience, automated tests, manual examples, and documented exceptions.