---
title: State, Events, Lists, and Forms Questions
description: React interview questions covering state snapshots, batching, event handling, list identity, controlled inputs, forms, validation, and Actions.
sidebar_position: 3
---

# State, Events, Lists, and Forms Questions

## 1. What is state in React?

**Strong answer:** State is component-owned data that React preserves across renders. Updating state schedules a new render; the current render still sees its own snapshot.

## 2. What does “state is a snapshot” mean?

**Strong answer:** Each render receives fixed state values. Calling a setter does not mutate the variable in the currently running render; it queues work for a future render.

## 3. Why does this log the old value after `setState`?

**Strong answer:** Because the event handler belongs to the current render snapshot. The setter schedules another render; it does not rewrite the captured value in the current function execution.

## 4. Why use functional state updates?

**Strong answer:** When the next value depends on the previous queued value, pass an updater such as `setCount(c => c + 1)`. React applies queued updater functions in order.

## 5. What is batching?

**Strong answer:** React can group multiple state updates into fewer renders/commits. Batching improves efficiency and avoids exposing partially updated UI between related updates.

## 6. Does batching mean setters are asynchronous Promises?

**Strong answer:** No. Setters schedule React work; they do not return a Promise you await for the new state.

## 7. Why shouldn't state be mutated directly?

**Strong answer:** React relies on state updates through its APIs and immutable snapshots for predictable rendering, memoization, debugging, and concurrent rendering. Direct mutation can leave React unaware or make past snapshots appear to change.

## 8. How do you update an object in state?

**Strong answer:** Create a new object representing the next state, often with object spread when appropriate. For deep structures, consider normalizing state or using a reducer rather than repeated nested copying.

## 9. How do you update an array in state?

**Strong answer:** Produce a new array using operations such as `map`, `filter`, `concat`, or spread rather than mutating the existing array with in-place changes.

## 10. What is derived state?

**Strong answer:** A value calculable from current props/state. It usually should be computed during render instead of stored separately, unless there is a deliberate caching or historical-state requirement.

## 11. Why is duplicated state dangerous?

**Strong answer:** Multiple sources of truth can drift out of sync. Prefer storing the minimum canonical state and deriving the rest.

## 12. How do you choose where state should live?

**Strong answer:** Put state at the lowest owner that needs to coordinate all consumers. If siblings need the same state, lift ownership to their nearest meaningful common owner.

## 13. What is lifting state up?

**Strong answer:** Moving state ownership to a common ancestor so multiple descendants can receive the same source of truth and request changes through callbacks/actions.

## 14. When should state remain local?

**Strong answer:** When only a small subtree needs it and no external owner needs to coordinate it. Locality reduces coupling and update breadth.

## 15. What is the difference between local UI state and server state?

**Strong answer:** Local UI state represents client interaction state such as open/closed or draft values. Server state represents remote authoritative data with concerns such as caching, freshness, retries, invalidation, and synchronization.

## 16. What is URL state?

**Strong answer:** State encoded in navigation/search parameters so it can be shareable, bookmarkable, reload-safe, and integrated with browser history.

## 17. When would you reset state with a key?

**Strong answer:** When a logical identity changes and you intentionally want React to mount a fresh subtree—for example switching between records whose draft form state must not carry over.

## 18. How do React events work?

**Strong answer:** You pass event handler functions as props such as `onClick`. React integrates events with its rendering/update system while preserving familiar event concepts like propagation and default behavior.

## 19. Passing vs calling an event handler — what is the difference?

**Strong answer:** `onClick={handleClick}` passes a function for React to call later. `onClick={handleClick()}` calls it during render and passes its return value.

## 20. What is event propagation?

**Strong answer:** Events can travel through ancestors. In React's event system, handlers follow the React tree, which matters for portals because physical DOM placement may differ.

## 21. `stopPropagation()` vs `preventDefault()`?

**Strong answer:** `stopPropagation` stops propagation to ancestor handlers. `preventDefault` prevents the browser's default action such as form navigation. They solve different problems.

## 22. Why should business logic not always live directly inside JSX event props?

**Strong answer:** Tiny handlers are fine, but named functions can improve readability, reuse, testing, instrumentation, and separation when behavior becomes non-trivial.

## 23. Why do list items need keys?

**Strong answer:** Keys provide sibling identity so React can preserve the correct state/DOM across reorder, insertion, and removal.

## 24. Why is a database ID usually a good key?

**Strong answer:** It is usually stable across renders and tied to the logical item rather than its current position.

## 25. Why is `Math.random()` a terrible key?

**Strong answer:** It changes every render, forcing React to treat each item as a new identity, causing remounts, lost state, lost focus, and unnecessary work.

## 26. What is a controlled input?

**Strong answer:** Its displayed value is driven by React state through `value`/`checked`, with changes handled by React callbacks that update the owning state.

## 27. What is an uncontrolled input?

**Strong answer:** The DOM owns the live value. React may supply an initial `defaultValue`/`defaultChecked`, and code reads the value later via form submission or a ref when needed.

## 28. Controlled vs uncontrolled — which is better?

**Strong answer:** Neither universally. Controlled inputs are useful when UI must react to every change or enforce coordinated state. Uncontrolled inputs can reduce state plumbing and fit native form submission well.

## 29. Why does a controlled input become read-only?

**Strong answer:** If you provide `value` without updating it in `onChange`, React keeps rendering the same value. The control has no path to update its canonical source.

## 30. Why is switching between controlled and uncontrolled mode problematic?

**Strong answer:** Ownership becomes ambiguous. Keep a field consistently controlled or uncontrolled across its lifetime.

## 31. What is the difference between `value` and `defaultValue`?

**Strong answer:** `value` controls the current value from React. `defaultValue` provides the initial value for an uncontrolled input.

## 32. How do you handle multiple form fields?

**Strong answer:** Options include separate state variables, an object/reducer, native FormData, or a form library. Choose based on complexity rather than automatically putting all fields into one giant object.

## 33. What is FormData useful for?

**Strong answer:** It represents submitted form fields using native browser form semantics. It is especially useful with form Actions and server mutation boundaries, but values still require runtime validation.

## 34. Why does TypeScript not validate FormData at runtime?

**Strong answer:** TypeScript types are erased at runtime. User-submitted values are external input and must be parsed and validated before trusted use.

## 35. What are Actions in React 19?

**Strong answer:** Action patterns let async mutation logic integrate with transitions and forms, supporting pending state, optimistic UI, error handling, and progressive enhancement depending on the environment/framework.

## 36. What is `useActionState`?

**Strong answer:** It manages state resulting from an Action. It returns the latest state, a dispatching Action function, and pending status, helping connect mutation results to UI.

## 37. What is `useFormStatus`?

**Strong answer:** A React DOM Hook used inside a form subtree to read the status of the parent form submission, such as whether it is pending.

**Watch for:** Calling it in the same component that renders the `<form>` and expecting it to observe that form; it reads the parent form context.

## 38. What is optimistic UI?

**Strong answer:** The UI temporarily presents the expected successful result before server confirmation, then reconciles or rolls back when the authoritative result arrives.

## 39. What is `useOptimistic`?

**Strong answer:** It helps represent optimistic state during an Action/transition so UI can respond immediately while the mutation is pending.

## 40. What can go wrong with optimistic UI?

**Strong answer:** Failed mutations, duplicate submissions, out-of-order responses, stale authority assumptions, authorization failures, and confusing rollback behavior. The server remains authoritative.

## 41. Client-side validation vs server-side validation?

**Strong answer:** Client validation improves UX. Server validation is mandatory for authority/security because clients can be bypassed or manipulated.

## 42. How would you prevent duplicate submissions?

**Strong answer:** Disable or otherwise guard the UI while pending for UX, but also make server mutations safe through idempotency or duplicate detection where the operation requires it.

## 43. Should form errors be stored in one string?

**Strong answer:** Sometimes, but field-level structured errors often scale better. Preserve enough structure for accessible associations and precise recovery.

## 44. How do you make validation accessible?

**Strong answer:** Associate labels and descriptions correctly, connect field errors with `aria-describedby` when needed, expose invalid state appropriately, and provide focus/summary behavior for larger forms.

## 45. How would you design a complex multi-step form?

**Strong answer:** Define the canonical data model, separate persisted data from per-step UI state, decide URL/history requirements, validate at boundaries, avoid accidental duplicated state, and design recovery for navigation/reload/submission failures.

## 46. Why can storing the selected object itself be worse than storing its ID?

**Strong answer:** The object can become stale relative to the canonical collection and duplicates source-of-truth data. Storing the stable ID and deriving the object often avoids synchronization bugs.

## 47. How do you model mutually exclusive UI modes?

**Strong answer:** Prefer one explicit state such as `'view' | 'edit' | 'saving'` rather than several booleans that can enter impossible combinations.

## 48. When is a reducer better than several `useState` calls?

**Strong answer:** When transitions are related, complex, or benefit from explicit event/action modeling and centralized transition logic.

## 49. What is a stale event handler closure?

**Strong answer:** The handler closes over values from the render that created it. This is normally correct snapshot behavior; it becomes a bug when long-lived async work incorrectly assumes it will see future values.

## 50. Senior question: how do you review state architecture in an unfamiliar feature?

**Strong answer:** Identify canonical sources, classify each value as local/URL/server/external/derived/ref state, map writers/readers, inspect duplicated state and update breadth, then check persistence, concurrency, failure, testing, and ownership boundaries before changing libraries.